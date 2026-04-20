
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Input, SectionHeader, Badge } from '../components/UI'

export default function Settings() {
  const { examDate, setExamDate, dailyHours, setDailyHours } = useApp()
  const { user, logout, updateUserProfile } = useAuth()
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [notifications, setNotifications] = useState({ sessions: true, streak: true, weakArea: false })

  async function save() {
    try {
      await updateUserProfile({ displayName, examDate, dailyHours })
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }} className="animate-slide-in">

      
      <Card style={{ marginBottom: '20px' }}>
        <SectionHeader title="👤 Profile" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'Outfit, sans-serif',
            fontSize: '26px', fontWeight: 800, color: '#fff',
          }}>
            {(user?.displayName || user?.email || 'S')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 700 }}>{user?.displayName || 'Student'}</div>
            <div style={{ color: 'var(--text3)', fontSize: '14px' }}>{user?.email}</div>
            <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
              <Badge variant="accent">✦ Pro Plan</Badge>
              <Badge variant="green">Active</Badge>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>Display Name</div>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>Email</div>
            <input
              value={user?.email || ''}
              disabled
              style={{ width: '100%', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', color: 'var(--text3)', fontFamily: 'Inter, sans-serif', fontSize: '14px', cursor: 'not-allowed', opacity: 0.7 }}
            />
          </div>
        </div>
      </Card>

      
      <Card style={{ marginBottom: '20px' }}>
        <SectionHeader title="📚 Study Preferences" />

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>📅 Exam Date</div>
          <input
            type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>
            ⏱ Daily Study Hours: <span style={{ color: 'var(--accent2)', fontFamily: 'JetBrains Mono, monospace' }}>{dailyHours}h</span>
          </div>
          <input
            type="range" min="1" max="14" step="0.5" value={dailyHours}
            onChange={e => setDailyHours(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
            <span>1h (light)</span><span>7h (intense)</span><span>14h (max)</span>
          </div>
        </div>
      </Card>

      
      <Card style={{ marginBottom: '20px' }}>
        <SectionHeader title="🔔 Notifications" />
        {[
          { key: 'sessions', label: 'Study session reminders', desc: 'Get notified before each session' },
          { key: 'streak', label: 'Streak alerts', desc: "Don't break your streak!" },
          { key: 'weakArea', label: 'Weak area suggestions', desc: 'AI recommends what to focus on' },
        ].map(n => (
          <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{n.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{n.desc}</div>
            </div>
            <div
              onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
              style={{
                width: '44px', height: '24px', borderRadius: '99px', cursor: 'pointer',
                background: notifications[n.key] ? 'var(--accent)' : 'var(--bg4)',
                position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
              }}
            >
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '3px', left: notifications[n.key] ? '23px' : '3px',
                transition: 'left 0.2s ease',
              }} />
            </div>
          </div>
        ))}
      </Card>

      
      <Card style={{ marginBottom: '20px', borderColor: 'rgba(255,107,107,0.2)' }}>
        <SectionHeader title="⚠️ Data & Account" />
        <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '16px', lineHeight: 1.6 }}>
          Export your data before deleting your account. This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm">📥 Export Data (JSON)</Button>
          <Button variant="danger" size="sm">🗑️ Clear All Progress</Button>
          <Button variant="danger" size="sm" onClick={logout}>🚪 Sign Out</Button>
        </div>
      </Card>

      
      <Button onClick={save} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
        {saved ? '✓ Changes Saved!' : 'Save All Changes'}
      </Button>

      
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--text3)' }}>
        StudyAI v1.0.0 Â· Built with React + Firebase + Gemini AI
      </div>
    </div>
  )
}
