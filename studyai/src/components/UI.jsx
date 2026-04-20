


import { useState, useEffect } from 'react'
import './UI.css'


export function Card({ children, className = '', onClick, style = {} }) {
  return (
    <div
      className={`ui-card ${onClick ? 'ui-card-clickable' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}


export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, style = {}, type = 'button', className = '' }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ui-btn ui-btn-${size} ui-btn-${variant} ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        ...(hover && !disabled ? { transform: 'translateY(-1px)' } : {})
      }}
    >
      {children}
    </button>
  )
}


export function Badge({ children, variant = 'gray', style = {} }) {
  return (
    <span className={`ui-badge ui-badge-${variant}`} style={style}>
      {children}
    </span>
  )
}


export function ProgressBar({ value, color = 'accent', height = 6 }) {
  return (
    <div className="ui-progress" style={{ height }}>
      <div 
        className={`ui-progress-fill ui-progress-${color}`} 
        style={{ width: `${Math.min(100, value)}%` }} 
      />
    </div>
  )
}


export function StatCard({ icon, value, label, change, color = 'accent', changeType = 'up' }) {
  const cornerColors = { accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)', green: 'var(--green)', coral: 'var(--coral)' }
  return (
    <div className="ui-stat">
      <div className="ui-stat-corner" style={{ background: cornerColors[color] || cornerColors.accent }} />
      <div className="ui-stat-icon">{icon}</div>
      <div className="ui-stat-val">{value}</div>
      <div className="ui-stat-label">{label}</div>
      {change && (
        <div className={`ui-stat-change ${changeType}`}>
          {change}
        </div>
      )}
    </div>
  )
}


export function Input({ label, ...props }) {
  return (
    <div className="ui-form-group">
      {label && <label className="ui-label">{label}</label>}
      <input className="ui-input" {...props} />
    </div>
  )
}


export function Select({ label, children, value, onChange, style = {} }) {
  return (
    <div className="ui-form-group">
      {label && <label className="ui-label">{label}</label>}
      <select className="ui-select" value={value} onChange={onChange} style={style}>
        {children}
      </select>
    </div>
  )
}


export function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div className="ui-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="ui-modal animate-slide-in">
        <button className="ui-modal-close" onClick={onClose}>×</button>
        {title && <div className="ui-modal-title">{title}</div>}
        {subtitle && <div className="ui-modal-subtitle">{subtitle}</div>}
        {children}
      </div>
    </div>
  )
}


export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="ui-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`ui-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}


export function LoadingDots() {
  return (
    <div className="ui-dots">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div key={i} className="ui-dot" style={{ animationDelay: `${delay}s` }} />
      ))}
    </div>
  )
}


export function AIChip({ children = 'AI-Powered' }) {
  return (
    <span className="ui-ai-chip">
      ✦ {children}
    </span>
  )
}


export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon">{icon}</div>
      <div className="ui-empty-title">{title}</div>
      {subtitle && <div className="ui-empty-subtitle">{subtitle}</div>}
      {action}
    </div>
  )
}


export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="ui-section-header">
      <div>
        <div className="ui-section-title">{title}</div>
        {subtitle && <div className="ui-section-subtitle">{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}


export function ColorDot({ color, size = 10 }) {
  const map = { accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)', coral: 'var(--coral)', green: 'var(--green)', blue: 'var(--blue)' }
  return <span className="ui-color-dot" style={{ width: size, height: size, background: map[color] || map.accent }} />
}
