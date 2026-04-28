import { useState, useEffect } from 'react'

const EMPTY_SECTION = { warmup: '', strength: '', wod: '', intention: '' }

const FIELDS = [
  { key: 'warmup', label: '웜업' },
  { key: 'strength', label: '스트렝스' },
  { key: 'wod', label: '와드 (WOD)' },
  { key: 'intention', label: '의도 / 메모' },
]

function formatDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`
}

export default function WorkoutModal({ date, workout, onSave, onDelete, onClose }) {
  const [tab, setTab] = useState('cardio')
  const [data, setData] = useState({
    cardio: { ...EMPTY_SECTION },
    crossfit: { ...EMPTY_SECTION },
  })

  useEffect(() => {
    setData({
      cardio: { ...EMPTY_SECTION, ...(workout?.cardio || {}) },
      crossfit: { ...EMPTY_SECTION, ...(workout?.crossfit || {}) },
    })
  }, [workout, date])

  const update = (field, value) => {
    setData(prev => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }))
  }

  const handleSave = () => {
    onSave(date, data)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('이 날의 운동 기록을 삭제할까요?')) {
      onDelete(date)
      onClose()
    }
  }

  const hasData = workout !== null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{formatDisplay(date)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-tabs">
          <button
            className={`tab-btn cardio ${tab === 'cardio' ? 'active' : ''}`}
            onClick={() => setTab('cardio')}
          >
            카디오
          </button>
          <button
            className={`tab-btn crossfit ${tab === 'crossfit' ? 'active' : ''}`}
            onClick={() => setTab('crossfit')}
          >
            크로스핏
          </button>
        </div>
        <div className="modal-body">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="workout-section">
              <label>{label}</label>
              <textarea
                value={data[tab][key]}
                onChange={e => update(key, e.target.value)}
                placeholder={`${label} 내용을 입력하세요`}
                rows={key === 'intention' ? 2 : 3}
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          {hasData ? (
            <button className="btn-delete" onClick={handleDelete}>삭제</button>
          ) : (
            <div />
          )}
          <button className="btn-save" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}
