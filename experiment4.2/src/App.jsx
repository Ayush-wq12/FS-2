import { memo, useCallback, useMemo, useState } from 'react'
import './App.css'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const CalendarDay = memo(function CalendarDay({ day, isToday, isSelected, hasEvent, onSelect }) {
  return (
    <button
      type="button"
      className={`day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(day)}
      aria-label={`Select ${monthNames[day.getMonth()]} ${day.getDate()}`}
    >
      <span>{day.getDate()}</span>
      {hasEvent && <i aria-label="Has event" />}
    </button>
  )
})

function App() {
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDay, setSelectedDay] = useState(today)
  const [events, setEvents] = useState(() => ({
    [today.toDateString()]: 'Performance review',
  }))

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + index)
      return day
    })
  }, [visibleMonth])

  const changeMonth = useCallback((amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }, [])

  const selectDay = useCallback((day) => {
    setSelectedDay(day)
  }, [])

  const toggleEvent = useCallback(() => {
    setEvents((current) => {
      const key = selectedDay.toDateString()
      if (current[key]) {
        const next = { ...current }
        delete next[key]
        return next
      }
      return { ...current, [key]: 'Focus session' }
    })
  }, [selectedDay])

  const selectedEvent = events[selectedDay.toDateString()]

  return (
    <main className="calendar-app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Experiment 4.2</p>
          <h1>Focus calendar</h1>
        </div>
        <span className="status">Memoized UI</span>
      </header>

      <section className="calendar-panel" aria-label="Interactive calendar">
        <div className="calendar-toolbar">
          <div>
            <p className="eyebrow">Your schedule</p>
            <h2>{monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</h2>
          </div>
          <div className="month-actions">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">&#8592;</button>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">&#8594;</button>
          </div>
        </div>

        <div className="weekdays">
          {weekDays.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day) => (
            <CalendarDay
              key={day.toDateString()}
              day={day}
              isToday={day.toDateString() === today.toDateString()}
              isSelected={day.toDateString() === selectedDay.toDateString()}
              hasEvent={Boolean(events[day.toDateString()])}
              onSelect={selectDay}
            />
          ))}
        </div>
      </section>

      <aside className="details-panel">
        <p className="eyebrow">Selected day</p>
        <h2>{selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        <p className="event-copy">{selectedEvent || 'No event planned yet.'}</p>
        <button type="button" className="event-button" onClick={toggleEvent}>
          {selectedEvent ? 'Remove event' : 'Add focus event'}
        </button>
      </aside>
    </main>
  )
}

export default App
