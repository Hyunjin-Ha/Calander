import { useState } from 'react'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const DAY_CLASSES = ['sunday', '', '', '', '', '', 'saturday']

const SECTIONS = [
  { key: 'warmup', label: '웜업', color: '#f59e0b' },
  { key: 'strength', label: '스트렝스', color: '#60a5fa' },
  { key: 'wod', label: 'WOD', color: '#f87171' },
]

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'crossfit', label: '크로스핏' },
  { key: 'cardio', label: '카디오' },
]

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function WodCard({ data, typeLabel, typeColor }) {
  const sections = SECTIONS.filter(s => data[s.key]?.trim())
  if (!sections.length) return null
  return (
    <div className="wod-card">
      <div className="wod-card-header" style={{ borderLeftColor: typeColor }}>
        {typeLabel}
      </div>
      {sections.map(s => (
        <div key={s.key} className="wod-section-row">
          <span className="wod-section-label" style={{ color: s.color }}>{s.label}</span>
          <span className="wod-section-text">{data[s.key]}</span>
        </div>
      ))}
    </div>
  )
}

export default function Calendar({ currentDate, onMonthChange, workouts, onDayClick }) {
  const [filter, setFilter] = useState('all')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const today = new Date()
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  const prevMonth = () => onMonthChange(new Date(year, month - 1, 1))
  const nextMonth = () => onMonthChange(new Date(year, month + 1, 1))

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const showCrossfit = filter === 'all' || filter === 'crossfit'
  const showCardio = filter === 'all' || filter === 'cardio'

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <h2>{year}년 {month + 1}월</h2>
        <button className="nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${f.key} ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="calendar-grid">
        {DAYS.map((d, i) => (
          <div key={d} className={`day-label ${DAY_CLASSES[i]}`}>{d}</div>
        ))}
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="day-cell empty" />
          const dateStr = formatDate(year, month, day)
          const w = workouts[dateStr]
          const hasCardio = w?.cardio && Object.values(w.cardio).some(v => v?.trim())
          const hasCrossfit = w?.crossfit && Object.values(w.crossfit).some(v => v?.trim())
          const isToday = dateStr === todayStr
          const dow = (firstDay + day - 1) % 7
          const hasVisible = (showCrossfit && hasCrossfit) || (showCardio && hasCardio)
          return (
            <div
              key={dateStr}
              className={[
                'day-cell',
                DAY_CLASSES[dow],
                isToday ? 'today' : '',
                hasVisible ? 'has-workout' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDayClick(dateStr)}
            >
              <span className={`day-number${isToday ? ' today-badge' : ''}`}>{day}</span>
              <div className="day-content">
                {showCrossfit && hasCrossfit && (
                  <WodCard data={w.crossfit} typeLabel="크로스핏" typeColor="#4ade80" />
                )}
                {showCardio && hasCardio && (
                  <WodCard data={w.cardio} typeLabel="카디오" typeColor="#fb923c" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
