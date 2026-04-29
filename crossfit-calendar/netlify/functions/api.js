import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  const path = event.path
    .replace(/^\/.netlify\/functions\/api/, '')
    .replace(/^\/api/, '')
  const method = event.httpMethod

  if (method === 'GET' && path === '/workouts') {
    const { data, error } = await supabase.from('workouts').select('date, data')
    if (error) return json(500, { error: error.message })
    const result = {}
    data.forEach(row => { result[row.date] = row.data })
    return json(200, result)
  }

  if (method === 'POST' && path.startsWith('/workouts/')) {
    const date = path.slice('/workouts/'.length)
    const body = JSON.parse(event.body)
    const { error } = await supabase.from('workouts').upsert({ date, data: body })
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  if (method === 'DELETE' && path.startsWith('/workouts/')) {
    const date = path.slice('/workouts/'.length)
    const { error } = await supabase.from('workouts').delete().eq('date', date)
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  return json(404, { error: 'Not Found' })
}
