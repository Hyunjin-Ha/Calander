import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import WorkoutModal from './components/WorkoutModal'
import './App.css'

const STORAGE_KEY = 'crossfit-workouts'

function loadWorkouts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [workouts, setWorkouts] = useState(loadWorkouts)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
    if (ios && !standalone) {
      setIsIOS(true)
      setShowInstall(true)
    }

    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setShowInstall(false)
    }
  }

  const handleSave = (date, data) => {
    setWorkouts(prev => {
      const next = { ...prev, [date]: data }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleDelete = (date) => {
    setWorkouts(prev => {
      const next = { ...prev }
      delete next[date]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="app">
      {showInstall && (
        <div className="install-banner">
          <div className="install-banner-text">
            {isIOS
              ? <>Safari 공유 버튼 → <strong>홈 화면에 추가</strong></>
              : '홈 화면에 앱으로 설치하세요!'}
          </div>
          {!isIOS && (
            <button className="install-btn" onClick={handleInstall}>설치</button>
          )}
          <button className="install-dismiss" onClick={() => setShowInstall(false)}>✕</button>
        </div>
      )}
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
