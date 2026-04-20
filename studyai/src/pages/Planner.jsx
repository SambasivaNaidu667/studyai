
import { useState, useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useProgress } from '../hooks/useProgress'
import { Card, Button, Badge, Input, Select, SectionHeader, AIChip, LoadingDots, StatCard } from '../components/UI'
import { generateStudyPlan } from '../services/ai'
import { WEEK_DAYS } from '../utils/demoData'

const COLOR_SOLIDS = {
  accent: 'rgba(124,92,252,0.85)', teal: 'rgba(0,212,170,0.85)',
  amber: 'rgba(255,170,68,0.85)', coral: 'rgba(255,107,107,0.85)', green: 'rgba(68,217,136,0.85)',
}

export default function Planner() {
  const { subjects, schedule, addSession, toggleSession, deleteSession, clearSchedule, examDate, setExamDate, dailyHours, setDailyHours, examDays } = useApp()
  const progress = useProgress(subjects)
  const [plan, setPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyAI_plan')) || null }
    catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('today')

  const pendingTopics = useMemo(() =>
    subjects.flatMap(s => (s.topics || []).filter(t => !t.done).map(t => ({ ...t, subject: s.name, subColor: s.color, subIcon: s.icon }))),
    [subjects])
  const highPriority = pendingTopics.filter(t => t.priority === 'high')

  const generate = useCallback(async () => {
    setLoading(true); setError('')
    
    const applyToSchedule = async (generatedPlan) => {
      clearSchedule()
      const day1Sessions = generatedPlan.weeks?.[0]?.days?.[0]?.sessions || []
      for (let i = 0; i < day1Sessions.length; i++) {
        const s = day1Sessions[i]
        await addSession({ 
          subject: s.subject || 'Study', 
          topic: s.topic || 'Revision', 
          duration: (s.hours || 1) * 60, 
          time: `0${9 + i * 2}:00`.slice(-5), 
          color: s.color || 'accent', 
          done: false 
        })
      }
    }

    try {
      const result = await generateStudyPlan(subjects, examDays, dailyHours)
      setPlan(result)
      localStorage.setItem('studyAI_plan', JSON.stringify(result))
      applyToSchedule(result)
    } catch (e) {
      
      const fallbackPlan = {
        weeks: [
          { week: 1, theme: 'Fundamentals', days: WEEK_DAYS.map((d, i) => ({ day: d, sessions: i < 5 ? subjects.slice(0, 2).map((s, j) => ({ subject: s.name, topic: (s.topics?.filter(t => !t.done)[j] || s.topics?.[0])?.name || 'Review', hours: 2, color: s.color })) : [] })) },
          { week: 2, theme: 'Deep Dive', days: WEEK_DAYS.map((d, i) => ({ day: d, sessions: i < 5 ? subjects.slice(1, 3).map((s, j) => ({ subject: s.name, topic: (s.topics?.filter(t => !t.done)[j] || s.topics?.[0])?.name || 'Practice', hours: 2, color: s.color })) : [] })) },
          { week: 3, theme: 'Revision', days: WEEK_DAYS.map((d, i) => ({ day: d, sessions: i < 6 ? [{ subject: 'Revision', topic: 'All Subjects', hours: 3, color: 'teal' }] : [] })) },
        ],
        insights: ['Focus on high-priority topics first', 'Use active recall for better retention', 'Take 10-min breaks every 50 minutes'],
        priorityOrder: highPriority.slice(0, 5).map(t => t.name),
      }
      setPlan(fallbackPlan)
      localStorage.setItem('studyAI_plan', JSON.stringify(fallbackPlan))
      applyToSchedule(fallbackPlan)
    }
    setLoading(false)
  }, [subjects, examDays, dailyHours, highPriority, clearSchedule, addSession])

  const barColors = { accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)', coral: 'var(--coral)', green: 'var(--green)' }

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }} className="animate-slide-in">

      
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg3)', padding: '4px', borderRadius: '10px', marginBottom: '24px', maxWidth: '400px' }}>
        {['today', 'roadmap'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            flex: 1, padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif',
            background: activeTab === t ? 'var(--surface)' : 'transparent',
            color: activeTab === t ? 'var(--text)' : 'var(--text2)',
            boxShadow: activeTab === t ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            transition: 'all 0.15s',
          }}>
            {t === 'today' ? "📋 Today's Schedule" : '🗺️ AI Roadmap'}
          </button>
        ))}
      </div>

      {activeTab === 'today' && (
        <div>
          <SectionHeader title="📋 Today's Sessions" subtitle="Your study plan for today" />
          <div style={{ marginBottom: '20px' }}>
            {schedule.map(s => (
              <div key={s.id} style={{
                display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px',
                border: `1px solid ${s.done ? 'rgba(68,217,136,0.25)' : 'var(--border)'}`,
                background: s.done ? 'rgba(68,217,136,0.05)' : 'var(--surface)',
                marginBottom: '10px', transition: 'all 0.2s', alignItems: 'center',
              }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--text3)', minWidth: '52px' }}>{s.time}</div>
                <div style={{ width: '4px', background: barColors[s.color] || 'var(--accent)', borderRadius: '99px', alignSelf: 'stretch', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '3px', textDecoration: s.done ? 'line-through' : 'none', color: s.done ? 'var(--text3)' : 'var(--text)' }}>
                    {s.subject}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{s.topic} Â· {s.duration} min</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge variant={s.color || 'gray'}>{s.duration}m</Badge>
                  <Button variant={s.done ? 'secondary' : 'success'} size="sm" onClick={() => toggleSession(s.id)}>
                    {s.done ? 'Undo' : '✓ Done'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteSession(s.id)} style={{ padding: '5px 10px' }}>✕</Button>
                </div>
              </div>
            ))}
            {schedule.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)', fontSize: '14px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                No sessions today. Generate an AI roadmap to get started!
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div>
          
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700 }}>⚙️ Plan Configuration</div>
                <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '2px' }}>Set your exam date and study availability</div>
              </div>
              <AIChip>AI-Powered</AIChip>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>📅 Exam Date</div>
                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px 14px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>⏱ Daily Hours: {dailyHours}h</div>
                <input type="range" min="1" max="12" step="0.5" value={dailyHours}
                  onChange={e => setDailyHours(parseFloat(e.target.value))}
                  style={{ width: '100%', marginTop: '14px' }} />
              </div>
            </div>

            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { icon: '📅', val: examDays, label: 'Days Remaining', color: 'var(--amber)' },
                { icon: '⏳', val: `${progress.totalPendingHours}h`, label: 'Pending Hours', color: 'var(--coral)' },
                { icon: '🔴', val: highPriority.length, label: 'High Priority', color: 'var(--accent)' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <Button onClick={generate} disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
              {loading ? <><LoadingDots /><span style={{ marginLeft: '10px' }}>Generating your roadmap...</span></> : `✨ Generate AI Roadmap (${examDays} days)`}
            </Button>
          </Card>

          
          {plan && (
            <div className="animate-slide-in">
              
              {plan.insights?.length > 0 && (
                <Card style={{ marginBottom: '20px', borderColor: 'rgba(0,212,170,0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <AIChip>AI Insights</AIChip>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700 }}>Study Strategy</div>
                  </div>
                  {plan.insights.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'var(--bg3)', borderRadius: '8px', marginBottom: '6px', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--teal)', fontWeight: 700 }}>✦</span> {ins}
                    </div>
                  ))}
                </Card>
              )}

              
              {plan.weeks?.map(week => (
                <Card key={week.week} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700 }}>Week {week.week}</div>
                    <Badge variant="accent">{week.theme}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px' }}>
                    {week.days?.map((d, i) => (
                      <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 6px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '6px' }}>{d.day}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {d.sessions?.length > 0 ? d.sessions.map((s, j) => (
                            <div key={j} style={{
                              fontSize: '9px', padding: '3px 4px', borderRadius: '3px', fontWeight: 700,
                              background: COLOR_SOLIDS[s.color] || COLOR_SOLIDS.accent, color: '#fff',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }} title={`${s.subject}: ${s.topic}`}>
                              {s.subject.substring(0, 5)}
                            </div>
                          )) : (
                            <div style={{ fontSize: '9px', color: 'var(--text3)', textAlign: 'center', padding: '4px' }}>Rest</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              
              {highPriority.length > 0 && (
                <Card>
                  <SectionHeader title="🎯 Priority Topic Queue" subtitle="Focus on these first" />
                  {highPriority.slice(0, 6).map((t, i) => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '8px' }}>
                      <div style={{ width: '26px', height: '26px', background: `var(--${t.subColor})`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#000', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{t.subject} Â· {t.hours}h estimated</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--coral)', letterSpacing: '0.5px' }}>HIGH</span>
                      <Badge variant="accent">{t.hours}h</Badge>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
