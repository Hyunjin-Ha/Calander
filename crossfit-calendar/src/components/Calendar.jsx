const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const DAY_CLASSES = ['sunday', '', '', '', '', '', 'saturday']

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Calendar({ currentDate, onMonthChange, workouts, onDayClick }) {
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

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <h2>{year}년 {month + 1}월</h2>
        <button className="nav-btn" onClick={nextMonth}>›</button>
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
          const dow = (firstDay + day - 1) % 7
          return (
            <div
              key={dateStr}
              className={[
                'day-cell',
                DAY_CLASSES[dow],
                dateStr === todayStr ? 'today' : '',
                (hasCardio || hasCrossfit) ? 'has-workout' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDayClick(dateStr)}
            >
              <span className="day-number">{day}</span>
              {(hasCardio || hasCrossfit) && (
                <div className="workout-dots">
                  {hasCardio && <span className="dot cardio" />}
                  {hasCrossfit && <span className="dot crossfit" />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
