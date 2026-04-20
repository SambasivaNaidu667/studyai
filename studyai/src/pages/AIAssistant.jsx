
import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { chatWithAI, summarizeNotes } from '../services/ai'
import { Button, Badge, Card, LoadingDots, AIChip } from '../components/UI'

const SUGGESTIONS = [
  { icon: '🧠', text: 'What topics should I focus on this week?' },
  { icon: '⚡', text: 'Explain dynamic programming in simple terms' },
  { icon: '📋', text: 'Create a revision strategy for my exam' },
  { icon: '🎯', text: 'Which subject needs the most attention?' },
  { icon: '📚', text: 'Give me a study technique for memorization' },
  { icon: '🔥', text: 'How do I stay consistent with studying?' },
]

function Message({ msg }) {
  const isAI = msg.role === 'ai'
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexDirection: isAI ? 'row' : 'row-reverse' }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
        background: isAI ? 'linear-gradient(135deg,var(--accent),var(--teal))' : 'linear-gradient(135deg,var(--surface2),var(--surface3))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        border: isAI ? 'none' : '1px solid var(--border)',
      }}>
        {isAI ? '✨' : '👤'}
      </div>
      <div style={{
        maxWidth: '82%',
        background: isAI ? 'var(--surface)' : 'rgba(124,92,252,0.15)',
        border: `1px solid ${isAI ? 'var(--border)' : 'rgba(124,92,252,0.25)'}`,
        borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '12px 16px', fontSize: '14px', lineHeight: 1.65,
        color: isAI ? 'var(--text2)' : 'var(--text)',
      }}
        className="ai-prose"
      >
        {msg.text.split('\n').map((line, i) => (
          <p key={i} style={{ marginBottom: i < msg.text.split('\n').length - 1 ? '8px' : 0 }}>
            {line.startsWith('•') ? (
              <span style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--accent3)', flexShrink: 0 }}>•</span>
                <span>{line.slice(1).trim()}</span>
              </span>
            ) : line}
          </p>
        ))}
        {msg.timestamp && (
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '6px' }}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIAssistant() {
  const { subjects } = useApp()
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Hi! I'm your AI study assistant powered by Gemini. I can help you understand tough concepts, suggest what to focus on, summarize your notes, and build personalized study strategies.\n\nWhat would you like to work on today? 🎓",
    timestamp: Date.now(),
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  const subjectContext = subjects.map(s =>
    `${s.name}: pending: ${(s.topics || []).filter(t => !t.done).map(t => t.name).join(', ') || 'none'}`
  ).join('\n')

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  const sendMsg = useCallback(async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    const userMsg = { role: 'user', text: msg, timestamp: Date.now() }
    setMessages(m => [...m, userMsg])
    setInput(''); setLoading(true)

    try {
      const allMsgs = [...messages, userMsg]
      const reply = await chatWithAI(allMsgs, subjectContext)
      setMessages(m => [...m, { role: 'ai', text: reply, timestamp: Date.now() }])
    } catch {
      setMessages(m => [...m, {
        role: 'ai',
        text: "I'm having a moment! 🤔 But here's a quick tip: use the 80/20 rule — 20% of topics typically give 80% of marks. Focus on your high-priority items first. You've got this! 💪",
        timestamp: Date.now(),
      }])
    }
    setLoading(false)
    inputRef.current?.focus()
  }, [input, messages, subjectContext])

  const clearChat = () => setMessages([messages[0]])

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }} className="animate-slide-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '20px', height: 'calc(100vh - 160px)' }}>

        
        <Card style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,var(--accent),var(--teal))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✨</div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', fontWeight: 700 }}>AI Study Assistant</div>
                <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--teal)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)', animation: 'pulse-dot 2s ease infinite' }} />
                  Online Â· Powered by Gemini
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearChat}>Clear chat</Button>
          </div>

          
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {loading && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✨</div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '14px 18px' }}>
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>

          
          {messages.length === 1 && (
            <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMsg(s.text)} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '20px',
                  padding: '7px 14px', cursor: 'pointer', fontSize: '13px', color: 'var(--text2)',
                  fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
                >
                  {s.icon} {s.text}
                </button>
              ))}
            </div>
          )}

          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
              placeholder="Ask anything about your studies..."
              style={{
                flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '11px 14px', color: 'var(--text)',
                fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <Button onClick={() => sendMsg()} disabled={loading || !input.trim()}>Send →</Button>
          </div>
        </Card>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card style={{ padding: '16px' }}>
            <div style={{ marginBottom: '12px' }}><AIChip>Capabilities</AIChip></div>
            {[
              { icon: '🎯', label: 'Personalized study plans' },
              { icon: '⚡', label: 'Concept explanations' },
              { icon: '📋', label: 'Revision strategies' },
              { icon: '🔍', label: 'Weak area detection' },
              { icon: '📝', label: 'Notes summarization' }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none', fontSize: '13px', color: 'var(--text2)' }}>
                <span style={{ fontSize: '16px' }}>{c.icon}</span> {c.label}
              </div>
            ))}
          </Card>

          <Card style={{ padding: '16px' }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Your Context</div>
            {subjects.map(sub => {
              const pending = (sub.topics || []).filter(t => !t.done).length
              return (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text2)' }}>{sub.icon} {sub.name}</span>
                  <Badge variant={pending > 0 ? 'amber' : 'green'}>{pending > 0 ? `${pending} left` : '✓'}</Badge>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  )
}
