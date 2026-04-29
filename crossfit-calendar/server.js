import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

app.get('/api/workouts', async (req, res) => {
  const { data, error } = await supabase.from('workouts').select('date, data');
  if (error) return res.status(500).json({ error: error.message });
  const result = {};
  data.forEach(row => { result[row.date] = row.data; });
  res.json(result);
});

app.post('/api/workouts/:date', async (req, res) => {
  const { error } = await supabase
    .from('workouts')
    .upsert({ date: req.params.date, data: req.body });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/workouts/:date', async (req, res) => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('date', req.params.date);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
