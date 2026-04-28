import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import WorkoutModal from './components/WorkoutModal'
import './App.css'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [workouts, setWorkouts] = useState({})

  useEffect(() => {
    fetch('/api/workouts')
      .then(r => r.json())
      .then(setWorkouts)
      .catch(() => {})
  }, [])

  const handleSave = async (date, data) => {
    await fetch(`/api/workouts/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setWorkouts(prev => ({ ...prev, [date]: data }))
  }

  const handleDelete = async (date) => {
    await fetch(`/api/workouts/${date}`, { method: 'DELETE' })
    setWorkouts(prev => {
      const next = { ...prev }
      delete next[date]
      return next
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CrossFit WOD 캘린더</h1>
      </header>
      <Calendar
        currentDate={currentDate}
        onMonthChange={setCurrentDate}
        workouts={workouts}
        onDayClick={setSelectedDate}
      />
      {selectedDate && (
        <WorkoutModal
          date={selectedDate}
          workout={workouts[selectedDate] || null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}

export default App
