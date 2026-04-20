
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useNavigationBlocker } from '../hooks/useNavigationBlocker'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: '🏠', section: 'study' },
  { id: 'planner', path: '/planner', label: 'Study Planner', icon: '🗓️', section: 'study' },
  { id: 'subjects', path: '/subjects', label: 'Subjects', icon: '📚', section: 'study' },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: '📊', section: 'study' },
  { id: 'ai', path: '/ai', label: 'AI Assistant', icon: '✨', section: 'ai', badge: 'AI' },
  { id: 'settings', path: '/settings', label: 'Settings', icon: '⚙️', section: 'account' },
]
const SECTIONS = { study: 'Study', ai: 'AI Features', account: 'Account' }

export default function Sidebar() {
  const { examDays, streak, isDirty } = useApp()
  const { user, logout } = useAuth()
  const location = useLocation()
  const { safeNavigate } = useNavigationBlocker(isDirty)
  const [hoveredItem, setHoveredItem] = useState(null)

  const grouped = NAV.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <aside className="sidebar-container">
      
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-wrapper">
          <div className="sidebar-logo-icon">🎓</div>
          <div>
            <div className="sidebar-logo-title">StudyAI</div>
            <div className="sidebar-logo-subtitle">Companion</div>
          </div>
        </div>

        
        {examDays > 0 && (
          <div 
            className="sidebar-status-box" 
            style={{ 
              background: examDays < 14 ? 'rgba(255,107,107,0.1)' : 'rgba(255,170,68,0.1)',
              border: `1px solid ${examDays < 14 ? 'rgba(255,107,107,0.2)' : 'rgba(255,170,68,0.2)'}`
            }}
          >
            <span className="sidebar-status-icon">📅</span>
            <div>
              <div 
                className="sidebar-status-title" 
                style={{ color: examDays < 14 ? 'var(--coral)' : 'var(--amber)' }}
              >
                {examDays} DAYS LEFT
              </div>
              <div className="sidebar-status-desc">Until exam</div>
            </div>
          </div>
        )}

        
        <div 
          className="sidebar-status-box"
          style={{ background: 'rgba(255,170,68,0.08)', border: '1px solid rgba(255,170,68,0.15)' }}
        >
          <span className="sidebar-status-icon">🔥</span>
          <div>
            <div className="sidebar-status-title" style={{ color: 'var(--amber)' }}>{streak} DAY STREAK</div>
            <div className="sidebar-status-desc">Keep it going!</div>
          </div>
        </div>
      </div>

      
      <nav className="sidebar-nav">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="sidebar-section">
            <div className="sidebar-section-title">
              {SECTIONS[section]}
            </div>
            {items.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.id}
                  onClick={() => safeNavigate(item.path)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`sidebar-nav-badge ${item.badge === 'AI' ? 'sidebar-nav-badge-ai' : 'sidebar-nav-badge-new'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      
      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={logout} title="Click to sign out">
          <div className="sidebar-user-icon">
            {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.displayName || user?.email?.split('@')[0] || 'Student'}
            </div>
            <div className="sidebar-user-plan">✦ Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
