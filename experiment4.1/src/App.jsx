import { useState } from 'react'
import './App.css'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const weekdayNames = ['Sun ', 'Mon ', 'Tue ', 'Wed ', 'Thu ', 'Fri ', 'Sat ']

const initialPosts = [
  { id: 1, title: 'Product launch', date: '2026-09-14', time: '09:30', platform: 'Instagram', color: 'coral' },
  { id: 2, title: 'Behind the scenes', date: '2026-09-16', time: '12:00', platform: 'LinkedIn', color: 'blue' },
  { id: 3, title: 'Weekly tips', date: '2026-09-18', time: '10:00', platform: 'Twitter', color: 'gold' },
  { id: 4, title: 'Customer story', date: '2026-09-22', time: '15:30', platform: 'Facebook', color: 'green' },
  { id: 5, title: 'New feature teaser', date: '2026-09-25', time: '11:00', platform: 'Instagram', color: 'coral' },
]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function createCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const start = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function App() {
  const [monthDate, setMonthDate] = useState(new Date(2026, 8, 1))
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPost, setSelectedPost] = useState(null)
  const calendarDays = createCalendarDays(monthDate)

  const moveMonth = (amount) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  const handleDrop = (event, date) => {
    event.preventDefault()
    const postId = Number(event.dataTransfer.getData('postId'))
    if (!postId) return

    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? { ...post, date: formatDate(date) } : post)),
    )
  }

  const postsForDay = (date) => posts.filter((post) => post.date === formatDate(date))

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">CONTENT PLANNER</p>
          <h1>Plan your next post</h1>
          <p className="subtitle">Keep every channel in rhythm.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setSelectedPost({ newPost: true })}>
          <span aria-hidden="true">+</span> New post
        </button>
      </header>

      <section className="workspace" aria-label="Post calendar">
        <div className="calendar-panel">
          <div className="calendar-toolbar">
            <div className="month-controls">
              <button className="icon-button" type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>&larr;</button>
              <h2>{monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}</h2>
              <button className="icon-button" type="button" aria-label="Next month" onClick={() => moveMonth(1)}>&rarr;</button>
            </div>
            <button className="today-button" type="button" onClick={() => setMonthDate(new Date(2026, 8, 1))}>Today</button>
          </div>

          <div className="weekday-row">
            {weekdayNames.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((date) => {
              const dateKey = formatDate(date)
              const isCurrentMonth = date.getMonth() === monthDate.getMonth()
              const dayPosts = postsForDay(date)
              return (
                <div
                  className={`calendar-day ${isCurrentMonth ? '' : 'outside-month'}`}
                  key={dateKey}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, date)}
                >
                  <span className={`day-number ${dateKey === '2026-09-14' ? 'today' : ''}`}>{date.getDate()}</span>
                  <div className="day-posts">
                    {dayPosts.map((post) => (
                      <button
                        className={`post-chip ${post.color}`}
                        draggable
                        key={post.id}
                        type="button"
                        onClick={() => setSelectedPost(post)}
                        onDragStart={(event) => event.dataTransfer.setData('postId', post.id)}
                      >
                        <strong>{post.time}</strong> {post.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="side-panel">
          <div className="side-heading">
            <div>
              <p className="eyebrow">UP NEXT</p>
              <h2>Scheduled posts</h2>
            </div>
            <span className="post-count">{posts.length}</span>
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <button className="post-card" key={post.id} type="button" onClick={() => setSelectedPost(post)}>
                <span className={`platform-dot ${post.color}`}></span>
                <span className="post-card-copy"><strong>{post.title}</strong><small>{post.platform} &middot; {post.date} at {post.time}</small></span>
                <span className="arrow" aria-hidden="true">&rarr;</span>
              </button>
            ))}
          </div>
          <p className="drag-note">Drag a post to another day to reschedule it.</p>
        </aside>
      </section>

      {selectedPost && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedPost(null)}>
          <section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="post-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" aria-label="Close" onClick={() => setSelectedPost(null)}>&times;</button>
            {selectedPost.newPost ? <><p className="eyebrow">QUICK ACTION</p><h2 id="post-dialog-title">New post</h2><p className="modal-copy">Choose a day on the calendar to start planning your next post.</p></> : <><p className="eyebrow">{selectedPost.platform}</p><h2 id="post-dialog-title">{selectedPost.title}</h2><p className="modal-copy">Scheduled for {selectedPost.date} at {selectedPost.time}.</p></>}
            <button className="primary-button modal-action" type="button" onClick={() => setSelectedPost(null)}>Done</button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
