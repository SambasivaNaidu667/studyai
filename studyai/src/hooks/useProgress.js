
import { useMemo } from 'react'

export function useProgress(subjects) {
  return useMemo(() => {
    const bySubject = subjects.map(sub => {
      const total = sub.topics?.length || 0
      const done = sub.topics?.filter(t => t.done).length || 0
      return {
        id: sub.id,
        name: sub.name,
        color: sub.color,
        icon: sub.icon,
        total,
        done,
        pct: total ? Math.round((done / total) * 100) : 0,
        pendingHours: sub.topics?.filter(t => !t.done).reduce((a, t) => a + (t.hours || 0), 0) || 0,
      }
    })

    const totalTopics = bySubject.reduce((a, s) => a + s.total, 0)
    const doneTopics = bySubject.reduce((a, s) => a + s.done, 0)
    const overall = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0
    const weakest = [...bySubject].sort((a, b) => a.pct - b.pct)[0] || null
    const strongest = [...bySubject].sort((a, b) => b.pct - a.pct)[0] || null
    const totalPendingHours = bySubject.reduce((a, s) => a + s.pendingHours, 0)

    return { bySubject, overall, totalTopics, doneTopics, weakest, strongest, totalPendingHours }
  }, [subjects])
}
