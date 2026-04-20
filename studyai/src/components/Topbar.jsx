
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Topbar.css'

const META = {
  '/dashboard': { title: 'Dashboard', sub: () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
  '/planner': { title: 'Study Planner', sub: () => 'Your personalized weekly roadmap' },
  '/subjects': { title: 'My Subjects', sub: () => 'Manage topics and track progress' },
  '/analytics': { title: 'Analytics', sub: () => 'Visualize your learning journey' },
  '/ai': { title: 'AI Assistant', sub: () => 'Powered by Gemini' },
  '/settings': { title: 'Settings', sub: () => 'Preferences & account' },
}

export default function Topbar() {
  const location = useLocation()
  const meta = META[location.pathname] || META['/dashboard']
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)

  const notifs = [
    { icon: '🎯', text: 'Machine Learning session in 30 min', time: 'Now' },
    { icon: '🔥', text: 'You\'re on a 12-day streak!', time: '1h ago' },
    { icon: '⚠️', text: 'React Router is your weakest topic', time: '2h ago' },
  ]

  return (
    <header className="topbar-header">
      <div>
        <div className="topbar-title">
          {meta.title}
        </div>
        <div className="topbar-subtitle">{meta.sub()}</div>
      </div>

      <div className="topbar-actions">
        
        <div className="topbar-notif-wrapper">
          <button
            className="topbar-notif-btn"
            onClick={() => { setNotifOpen(!notifOpen); setNotifRead(true) }}
          >
            🔔
            {!notifRead && (
              <span className="topbar-notif-dot" />
            )}
          </button>

          {notifOpen && (
            <div className="topbar-notif-dropdown">
              <div className="topbar-notif-header">
                NOTIFICATIONS
              </div>
              {notifs.map((n, i) => (
                <div key={i} className="topbar-notif-item">
                  <span className="topbar-notif-icon">{n.icon}</span>
                  <div>
                    <div className="topbar-notif-text">{n.text}</div>
                    <div className="topbar-notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
