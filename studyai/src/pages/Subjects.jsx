
import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useProgress } from '../hooks/useProgress'
import { Card, Button, Badge, ProgressBar, Modal, Input, Select, SectionHeader, EmptyState, AIChip } from '../components/UI'
import { COLOR_OPTIONS, SUBJECT_ICONS, PRIORITY_CONFIG } from '../utils/demoData'

function TopicItem({ topic, subId, onToggle, onDelete, onEditNote }) {
  const p = PRIORITY_CONFIG[topic.priority] || PRIORITY_CONFIG.med
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: '10px', marginBottom: '6px', transition: 'all 0.15s',
      opacity: topic.done ? 0.65 : 1,
    }}>
      <div
        onClick={() => onToggle(subId, topic.id)}
        style={{
          width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, cursor: 'pointer',
          border: topic.done ? 'none' : '2px solid var(--border2)',
          background: topic.done ? 'var(--green)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
      >
        {topic.done && <span style={{ color: '#000', fontSize: '11px', fontWeight: 800 }}>✓</span>}
      </div>

      <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onToggle(subId, topic.id)}>
        <div style={{
          fontSize: '14px', fontWeight: 500,
          textDecoration: topic.done ? 'line-through' : 'none',
          color: topic.done ? 'var(--text3)' : 'var(--text)',
        }}>{topic.name}</div>
        {topic.notes && <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{topic.notes}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: p.color, letterSpacing: '0.5px' }}>{p.label}</span>
        <Badge variant="gray">{topic.hours}h</Badge>
        <button onClick={() => onEditNote(topic)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text3)', padding: '4px' }}>
          {topic.notes ? '✏️' : '+ note'}
        </button>
        <button onClick={() => onDelete(subId, topic.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--coral)', padding: '4px' }}>✕</button>
      </div>
    </div>
  )
}

export default function Subjects() {
  const { subjects, toggleTopic, addSubject, addTopic, deleteTopic, deleteSubject, updateTopicNotes } = useApp()
  const progress = useProgress(subjects)
  const [expanded, setExpanded] = useState(null)
  const [showAddSub, setShowAddSub] = useState(false)
  const [addTopicFor, setAddTopicFor] = useState(null)
  const [noteModal, setNoteModal] = useState(null)
  const [noteVal, setNoteVal] = useState('')
  const [newSub, setNewSub] = useState({ name: '', icon: '📖', color: 'accent' })
  const [newTopic, setNewTopic] = useState({ name: '', priority: 'med', hours: 3 })

  const handleAddSub = useCallback(() => {
    if (!newSub.name.trim()) return
    addSubject(newSub.name.trim(), newSub.icon, newSub.color)
    setNewSub({ name: '', icon: '📖', color: 'accent' })
    setShowAddSub(false)
  }, [newSub, addSubject])

  const handleAddTopic = useCallback((subId) => {
    if (!newTopic.name.trim()) return
    addTopic(subId, { name: newTopic.name.trim(), priority: newTopic.priority, hours: parseInt(newTopic.hours) || 3 })
    setNewTopic({ name: '', priority: 'med', hours: 3 })
    setAddTopicFor(null)
  }, [newTopic, addTopic])

  const handleSaveNote = useCallback(() => {
    if (!noteModal) return
    updateTopicNotes(noteModal.subId, noteModal.topic.id, noteVal)
    setNoteModal(null)
  }, [noteModal, noteVal, updateTopicNotes])

  const colorSolids = { accent: 'var(--accent)', teal: 'var(--teal)', amber: 'var(--amber)', coral: 'var(--coral)', green: 'var(--green)', blue: 'var(--blue)' }

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }} className="animate-slide-in">
      <SectionHeader
        title={`📚 ${subjects.length} Subjects`}
        subtitle="Click a subject to manage topics"
        action={
          <Button onClick={() => setShowAddSub(!showAddSub)}>+ Add Subject</Button>
        }
      />

      
      {showAddSub && (
        <Card style={{ marginBottom: '20px', borderColor: 'rgba(124,92,252,0.3)' }} className="animate-slide-in">
          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>New Subject</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Subject Name" placeholder="e.g., Chemistry" value={newSub.name} onChange={e => setNewSub(s => ({ ...s, name: e.target.value }))} style={{ marginBottom: 0 }} />
            <Select label="Color Theme" value={newSub.color} onChange={e => setNewSub(s => ({ ...s, color: e.target.value }))}>
              {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </Select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>Icon</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SUBJECT_ICONS.map(icon => (
                <button key={icon} onClick={() => setNewSub(s => ({ ...s, icon }))} style={{
                  background: newSub.icon === icon ? 'rgba(124,92,252,0.2)' : 'var(--bg3)',
                  border: `1px solid ${newSub.icon === icon ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '18px',
                  transition: 'all 0.15s',
                }}>{icon}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleAddSub}>Add Subject</Button>
            <Button variant="secondary" onClick={() => setShowAddSub(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      
      {subjects.length === 0 ? (
        <EmptyState icon="📚" title="No subjects yet" subtitle="Add your first subject to get started!"
          action={<Button onClick={() => setShowAddSub(true)}>+ Add Subject</Button>} />
      ) : subjects.map(sub => {
        const prog = progress.bySubject.find(s => s.id === sub.id)
        const isOpen = expanded === sub.id
        return (
          <Card key={sub.id} style={{ marginBottom: '16px', borderColor: isOpen ? 'rgba(124,92,252,0.3)' : 'var(--border)', transition: 'all 0.2s' }}>
            
            <div onClick={() => setExpanded(isOpen ? null : sub.id)} style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
              <div style={{
                width: '48px', height: '48px', flexShrink: 0,
                background: colorSolids[sub.color] || colorSolids.accent,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{sub.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700 }}>{sub.name}</span>
                  <Badge variant="gray">{prog?.done || 0}/{prog?.total || 0}</Badge>
                  {prog?.pct === 100 && <Badge variant="green">✓ Complete</Badge>}
                </div>
                <ProgressBar value={prog?.pct || 0} color={sub.color} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 700, color: colorSolids[sub.color] }}>
                  {prog?.pct || 0}%
                </span>
                <span style={{ color: 'var(--text3)', fontSize: '18px' }}>{isOpen ? '▲' : '▼'}</span>
                <Button variant="danger" size="sm" onClick={e => { e.stopPropagation(); deleteSubject(sub.id) }} style={{ padding: '4px 10px' }}>✕</Button>
              </div>
            </div>

            
            {isOpen && (
              <div className="animate-fade-in" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                {sub.topics?.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: '14px' }}>
                    No topics yet. Add your first topic below!
                  </div>
                )}
                {sub.topics?.map(topic => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    subId={sub.id}
                    onToggle={toggleTopic}
                    onDelete={deleteTopic}
                    onEditNote={t => { setNoteModal({ subId: sub.id, topic: t }); setNoteVal(t.notes || '') }}
                  />
                ))}

                
                {addTopicFor === sub.id ? (
                  <div className="animate-fade-in" style={{ background: 'var(--bg3)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '10px', marginBottom: '10px' }}>
                      <input
                        className="form-input"
                        placeholder="Topic name"
                        value={newTopic.name}
                        onChange={e => setNewTopic(t => ({ ...t, name: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddTopic(sub.id)}
                        autoFocus
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none' }}
                      />
                      <select
                        value={newTopic.priority}
                        onChange={e => setNewTopic(t => ({ ...t, priority: e.target.value }))}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="high">High Priority</option>
                        <option value="med">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                      <input
                        type="number" min="1" max="100"
                        placeholder="Hours"
                        value={newTopic.hours}
                        onChange={e => setNewTopic(t => ({ ...t, hours: e.target.value }))}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button size="sm" onClick={() => handleAddTopic(sub.id)}>Add Topic</Button>
                      <Button variant="secondary" size="sm" onClick={() => setAddTopicFor(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddTopicFor(sub.id)}
                    style={{
                      marginTop: '8px', width: '100%', padding: '10px',
                      background: 'transparent', border: '1px dashed var(--border)',
                      borderRadius: '10px', color: 'var(--text3)', cursor: 'pointer',
                      fontSize: '14px', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    + Add topic to {sub.name}
                  </button>
                )}
              </div>
            )}
          </Card>
        )
      })}

      
      <Modal
        open={!!noteModal}
        onClose={() => setNoteModal(null)}
        title={`✏️ Notes: ${noteModal?.topic?.name}`}
        subtitle="Add study notes, formulas, or reminders"
      >
        <textarea
          value={noteVal}
          onChange={e => setNoteVal(e.target.value)}
          rows={5}
          placeholder="Write your notes, key formulas, or study reminders..."
          style={{
            width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '12px 14px', color: 'var(--text)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', outline: 'none',
            resize: 'vertical', lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <Button onClick={handleSaveNote}>Save Notes</Button>
          <Button variant="secondary" onClick={() => setNoteModal(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}
