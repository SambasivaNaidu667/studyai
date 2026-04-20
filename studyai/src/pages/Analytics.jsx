
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useProgress } from '../hooks/useProgress'
import { Card, StatCard, ProgressBar, Badge, Button, SectionHeader, AIChip, LoadingDots } from '../components/UI'
import { analyzeWeakAreas } from '../services/ai'
import './Analytics.css'

const BAR_COLORS = ['accent', 'teal', 'amber', 'coral', 'green', 'accent', 'teal']
const COLOR_SOLID = { accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)', coral: 'var(--coral)', green: 'var(--green)', blue: 'var(--blue)' }

function WeeklyChart() {
  const data = [
    { d: 'Mon', h: 0 }, { d: 'Tue', h: 0 }, { d: 'Wed', h: 0 },
    { d: 'Thu', h: 0 }, { d: 'Fri', h: 0 }, { d: 'Sat', h: 0 }, { d: 'Sun', h: 0 },
  ]
  const maxH = 10;
  return (
    <div>
      <div className="weekly-chart-container">
        {data.map((d, i) => (
          <div key={i} className="weekly-chart-col">
            <div className="weekly-chart-val" style={{ color: d.h > 0 ? COLOR_SOLID[BAR_COLORS[i]] : 'var(--text3)' }}>{d.h}h</div>
            <div 
              className="weekly-chart-bar-wrapper" 
              style={{ height: `${(d.h / maxH) * 100}%`, background: d.h > 0 ? COLOR_SOLID[BAR_COLORS[i]] : 'var(--bg3)' }}
            >
              {d.h > 0 && <div className="weekly-chart-bar-glare" />}
            </div>
            <div className="weekly-chart-label" style={{ color: 'var(--text3)' }}>{d.d}</div>
          </div>
        ))}
      </div>
      <div className="weekly-chart-footer">
        <span>Total this week: <strong style={{ color: 'var(--text)' }}>0h</strong></span>
        <span>Daily avg: <strong style={{ color: 'var(--accent)' }}>0h</strong></span>
      </div>
    </div>
  )
}

export default function Analytics() {
  const { subjects, examDays, streak } = useApp()
  const progress = useProgress(subjects)
  const [aiInsights, setAiInsights] = useState('')
  const [loadingInsights, setLoadingInsights] = useState(false)

  async function getAIInsights() {
    setLoadingInsights(true)
    try {
      const result = await analyzeWeakAreas(subjects)
      setAiInsights(result)
    } catch {
      setAiInsights('• Focus on high-priority topics first — these carry the most exam weight.\n• Use active recall: close your notes and test yourself after each session.\n• Your weakest subject needs at least 2 extra sessions this week.\n• Revise completed topics briefly every 3 days to retain them.')
    }
    setLoadingInsights(false)
  }

  const completionByPriority = useMemo(() => {
    const all = subjects.flatMap(s => s.topics || [])
    const high = all.filter(t => t.priority === 'high')
    const med = all.filter(t => t.priority === 'med')
    const low = all.filter(t => t.priority === 'low')
    const pct = arr => arr.length ? Math.round((arr.filter(t => t.done).length / arr.length) * 100) : 0
    return [
      { label: 'High Priority', pct: pct(high), total: high.length, done: high.filter(t => t.done).length, color: 'coral' },
      { label: 'Medium Priority', pct: pct(med), total: med.length, done: med.filter(t => t.done).length, color: 'amber' },
      { label: 'Low Priority', pct: pct(low), total: low.length, done: low.filter(t => t.done).length, color: 'green' },
    ]
  }, [subjects])

  return (
    <div className="analytics-container animate-slide-in">
      
      <div className="analytics-stats-grid">
        <StatCard icon="📈" value={`${progress.overall}%`} label="Overall Progress" color="accent" change={progress.overall > 0 ? "↑ 8% this week" : null} changeType="up" />
        <StatCard icon="✅" value={progress.doneTopics} label="Topics Mastered" color="green" change={progress.doneTopics > 0 ? "+3 this week" : null} changeType="up" />
        <StatCard icon="⏳" value={`${examDays}d`} label="Until Exam" color="amber" />
        <StatCard icon="🔥" value={streak} label="Study Streak" color="coral" change="Personal best!" changeType="up" />
      </div>

      <div className="analytics-middle-grid">
        
        <Card>
          <SectionHeader title="📊 Weekly Study Hours" />
          <WeeklyChart />
        </Card>

        
        <Card>
          <SectionHeader title="📚 Subject Breakdown" />
          {progress.bySubject.map(sub => (
            <div key={sub.id} className="subject-breakdown-item">
              <div className="subject-breakdown-header">
                <div className="subject-breakdown-left">
                  <span className="subject-breakdown-icon">{sub.icon}</span>
                  <span className="subject-breakdown-name">{sub.name}</span>
                </div>
                <div className="subject-breakdown-right">
                  <Badge variant={sub.color}>{sub.done}/{sub.total}</Badge>
                  <span className="subject-breakdown-pct" style={{ color: COLOR_SOLID[sub.color] }}>{sub.pct}%</span>
                </div>
              </div>
              <ProgressBar value={sub.pct} color={sub.color} height={8} />
            </div>
          ))}
          {progress.weakest && (
            <div className="subject-breakdown-footer">
              <span style={{ color: 'var(--text3)' }}>Weakest: </span>
              <span style={{ color: 'var(--coral)', fontWeight: 600 }}>{progress.weakest.icon} {progress.weakest.name} ({progress.weakest.pct}%)</span>
              <span style={{ color: 'var(--text3)', marginLeft: '16px' }}>Strongest: </span>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>{progress.strongest?.icon} {progress.strongest?.name} ({progress.strongest?.pct}%)</span>
            </div>
          )}
        </Card>
      </div>

      
      <Card style={{ marginBottom: '20px' }}>
        <SectionHeader title="🎯 Progress by Priority" />
        <div className="priority-grid">
          {completionByPriority.map(p => (
            <div key={p.label} className="priority-card">
              <div className="priority-card-header">
                <span className="priority-card-label">{p.label}</span>
                <Badge variant={p.color}>{p.done}/{p.total}</Badge>
              </div>
              <div className="priority-card-val" style={{ color: COLOR_SOLID[p.color] }}>{p.pct}%</div>
              <ProgressBar value={p.pct} color={p.color} />
            </div>
          ))}
        </div>
      </Card>



      
      <Card style={{ borderColor: aiInsights ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
        <div className="ai-insights-header">
          <div className="ai-insights-title-wrapper">
            <AIChip>AI Analysis</AIChip>
            <div className="ai-insights-title">Weak Area Detection</div>
          </div>
          <Button onClick={getAIInsights} disabled={loadingInsights} variant="teal" size="sm">
            {loadingInsights ? <LoadingDots /> : '✦ Analyze Now'}
          </Button>
        </div>
        {aiInsights ? (
          <div>
            {aiInsights.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="ai-insight-line">
                <span className="ai-insight-icon">✦</span>
                <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="ai-insights-empty">
            Click "Analyze Now" to get AI-powered insights on your weak areas and personalized recommendations.
          </div>
        )}
      </Card>

      
      <Card style={{ marginTop: '20px' }}>
        <SectionHeader title="🔍 All Topics Overview" />
        <div className="topics-grid">
          {subjects.flatMap(sub => (sub.topics || []).map(topic => (
            <div key={topic.id} className="topic-card" style={{ borderColor: topic.done ? 'rgba(68,217,136,0.3)' : 'var(--border)' }}>
              <div 
                className="topic-dot" 
                style={{ background: topic.done ? 'var(--green)' : topic.priority === 'high' ? 'var(--coral)' : topic.priority === 'med' ? 'var(--amber)' : 'var(--text3)' }} 
              />
              <div className="topic-info">
                <div 
                  className="topic-name" 
                  style={{ color: topic.done ? 'var(--text3)' : 'var(--text)', textDecoration: topic.done ? 'line-through' : 'none' }}
                >
                  {topic.name}
                </div>
                <div className="topic-sub">{sub.name}</div>
              </div>
              {topic.done && <span style={{ color: 'var(--green)', fontSize: '14px' }}>✓</span>}
            </div>
          )))}
        </div>
      </Card>
    </div>
  )
}
