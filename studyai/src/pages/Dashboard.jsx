
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { Card, StatCard, ProgressBar, Badge, Button, SectionHeader } from '../components/UI'


export default function Dashboard() {
  const { subjects, schedule, examDays, streak } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  const progress = useProgress(subjects)

  const todayTasks = schedule.slice(0, 5)
  const doneTasks = schedule.filter(s => s.done).length
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student'

  const greetings = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const barColors = {
    accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)',
    coral: 'var(--coral)', green: 'var(--green)',
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }} className="animate-slide-in">

      
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(0,212,170,0.08))',
        border: '1px solid rgba(124,92,252,0.2)', borderRadius: '20px',
        padding: '28px 32px', marginBottom: '28px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60%', right: '-5%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(124,92,252,0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '14px', color: 'var(--accent3)', fontWeight: 600, marginBottom: '6px' }}>
          {greetings}, {displayName.split(' ')[0]} 👋
        </div>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
          {streak >= 7 ? `You're on fire! 🔥 ${streak}-day streak.` : `Let's make today count! 💪`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '14px', color: 'var(--amber2)', fontWeight: 600 }}>
          🔥 {streak} days strong — keep it going!
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600 }}>
              Overall Progress: {progress.overall}%
            </span>
            <Badge variant="accent">{progress.doneTopics}/{progress.totalTopics} topics</Badge>
          </div>
          <ProgressBar value={progress.overall} height={8} />
        </div>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon="📅" value={examDays} label="Days to Exam" color="amber"
          change={examDays < 30 ? '⚠️ Crunch time!' : '✓ On track'} changeType={examDays < 30 ? 'down' : 'up'} />
        <StatCard icon="✅" value={progress.doneTopics} label="Topics Mastered" color="green" change={progress.doneTopics > 0 ? "+3 this week" : null} changeType="up" />
        <StatCard icon="📈" value={`${progress.overall}%`} label="Progress" color="accent" change={progress.overall > 0 ? "↑ 8% this week" : null} changeType="up" />
        <StatCard icon="🎯" value={`${doneTasks}/${schedule.length}`} label="Today's Tasks" color="teal"
          change={`${schedule.length - doneTasks} remaining`} changeType="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        
        <Card>
          <SectionHeader
            title="📋 Today's Plan"
            subtitle="Your study sessions for today"
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/planner')}>View All →</Button>}
          />
          {todayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '14px' }}>
              No sessions planned. Go to Planner to generate one! 🗓️
            </div>
          ) : todayTasks.map(s => (
            <div key={s.id} style={{
              display: 'flex', gap: '14px', padding: '12px', borderRadius: '10px',
              border: '1px solid var(--border)', background: 'var(--bg3)',
              marginBottom: '8px', opacity: s.done ? 0.55 : 1, transition: 'all 0.15s',
            }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text3)', minWidth: '48px', paddingTop: '2px' }}>{s.time}</div>
              <div style={{ width: '3px', background: barColors[s.color] || 'var(--accent)', borderRadius: '99px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {s.subject}
                  {s.done && <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 700 }}>✓ done</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{s.topic} · {s.duration}min</div>
              </div>
            </div>
          ))}
        </Card>

        
        <Card>
          <SectionHeader
            title="📚 Subject Progress"
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/subjects')}>Manage →</Button>}
          />
          {progress.bySubject.map(sub => (
            <div key={sub.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{sub.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{sub.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{sub.done}/{sub.total}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: `var(--${sub.color})` }}>{sub.pct}%</span>
                </div>
              </div>
              <ProgressBar value={sub.pct} color={sub.color} />
            </div>
          ))}
          {progress.weakest && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text3)' }}>Needs attention: </span>
              <span style={{ color: 'var(--coral)', fontWeight: 600 }}>
                {progress.weakest.icon} {progress.weakest.name} ({progress.weakest.pct}%)
              </span>
            </div>
          )}
        </Card>
      </div>


    </div>
  )
}
