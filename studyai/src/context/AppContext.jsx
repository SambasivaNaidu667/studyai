
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getSubjects, addSubject as fsAddSubject, updateSubject as fsUpdateSubject, deleteSubject as fsDeleteSubject,
  getSchedule, addScheduleItem, updateScheduleItem, deleteScheduleItem,
} from '../services/firestore'
import { DEMO_SUBJECTS, DEMO_SCHEDULE } from '../utils/demoData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user, profile, updateUserProfile } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [schedule, setSchedule] = useState([])
  const [examDate, setExamDateState] = useState(() => localStorage.getItem('examDate') || '2025-06-15')
  const [dailyHours, setDailyHoursState] = useState(() => parseFloat(localStorage.getItem('dailyHours') || '6'))
  const [loadingData, setLoadingData] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [streak, setStreakState] = useState(() => parseInt(localStorage.getItem('streak') || '0'))

  
  useEffect(() => {
    if (profile) {
      if (profile.examDate) setExamDateState(profile.examDate)
      if (profile.dailyHours) setDailyHoursState(profile.dailyHours)
      if (profile.streak !== undefined) setStreakState(profile.streak)
    }
  }, [profile])

  
  const setExamDate = useCallback(v => { setExamDateState(v); localStorage.setItem('examDate', v) }, [])
  const setDailyHours = useCallback(v => { setDailyHoursState(v); localStorage.setItem('dailyHours', v) }, [])
  const setStreak = useCallback(v => {
    setStreakState(prev => {
      const val = typeof v === 'function' ? v(prev) : v;
      localStorage.setItem('streak', val);
      if (user) updateUserProfile({ streak: val }).catch(()=>{});
      return val;
    })
  }, [user, updateUserProfile])

  
  useEffect(() => {
    if (!user) { setSubjects([]); setSchedule([]); setLoadingData(false); return }
    setLoadingData(true)
    const isDemo = user.email === 'demo@studyai.app'
    
    
    if (!localStorage.getItem('streak')) {
      setStreak(isDemo ? 12 : 0)
    }

    Promise.all([getSubjects(user.uid), getSchedule(user.uid)])
      .then(([subs, sched]) => {
        setSubjects(subs.length ? subs : (isDemo ? DEMO_SUBJECTS : []))
        setSchedule(sched.length ? sched : (isDemo ? DEMO_SCHEDULE : []))
      })
      .catch(() => { 
        setSubjects(isDemo ? DEMO_SUBJECTS : [])
        setSchedule(isDemo ? DEMO_SCHEDULE : []) 
      })
      .finally(() => setLoadingData(false))
  }, [user])

  
  const totalTopics = useMemo(() => subjects.reduce((a, s) => a + (s.topics?.length || 0), 0), [subjects])
  const doneTopics = useMemo(() => subjects.reduce((a, s) => a + (s.topics?.filter(t => t.done).length || 0), 0), [subjects])
  const overallProgress = useMemo(() => totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0, [doneTopics, totalTopics])
  const examDays = useMemo(() => {
    const d = new Date(examDate) - new Date()
    return Math.max(0, Math.ceil(d / 86400000))
  }, [examDate])
  const pendingTopics = useMemo(() =>
    subjects.flatMap(s => (s.topics || []).filter(t => !t.done).map(t => ({ ...t, subject: s.name, subColor: s.color, subIcon: s.icon }))),
    [subjects])

  
  const addSubject = useCallback(async (name, icon, color) => {
    const data = { name, icon, color, topics: [] }
    if (user) {
      const ref = await fsAddSubject(user.uid, data)
      setSubjects(s => [...s, { id: ref.id, ...data }])
    } else {
      setSubjects(s => [...s, { id: Date.now().toString(), ...data }])
    }
  }, [user])

  const updateSubject = useCallback(async (id, data) => {
    setSubjects(s => s.map(sub => sub.id === id ? { ...sub, ...data } : sub))
    if (user) await fsUpdateSubject(id, data).catch(() => {})
  }, [user])

  const deleteSubject = useCallback(async (id) => {
    setSubjects(s => s.filter(sub => sub.id !== id))
    if (user) await fsDeleteSubject(id).catch(() => {})
  }, [user])

  const toggleTopic = useCallback(async (subId, topId) => {
    setSubjects(s => {
      const updated = s.map(sub => {
        if (sub.id !== subId) return sub
        const topics = sub.topics.map(t => t.id === topId ? { ...t, done: !t.done } : t)
        if (user) fsUpdateSubject(subId, { topics }).catch(() => {})
        return { ...sub, topics }
      })
      return updated
    })
  }, [user])

  const addTopic = useCallback(async (subId, topicData) => {
    const topic = { id: Date.now().toString(), done: false, notes: '', ...topicData }
    setSubjects(s => {
      const updated = s.map(sub => {
        if (sub.id !== subId) return sub
        const topics = [...(sub.topics || []), topic]
        if (user) fsUpdateSubject(subId, { topics }).catch(() => {})
        return { ...sub, topics }
      })
      return updated
    })
  }, [user])

  const deleteTopic = useCallback(async (subId, topId) => {
    setSubjects(s => {
      const updated = s.map(sub => {
        if (sub.id !== subId) return sub
        const topics = sub.topics.filter(t => t.id !== topId)
        if (user) fsUpdateSubject(subId, { topics }).catch(() => {})
        return { ...sub, topics }
      })
      return updated
    })
  }, [user])

  const updateTopicNotes = useCallback(async (subId, topId, notes) => {
    setSubjects(s => {
      const updated = s.map(sub => {
        if (sub.id !== subId) return sub
        const topics = sub.topics.map(t => t.id === topId ? { ...t, notes } : t)
        if (user) fsUpdateSubject(subId, { topics }).catch(() => {})
        return { ...sub, topics }
      })
      return updated
    })
  }, [user])

  
  const addSession = useCallback(async (data) => {
    if (user) {
      const ref = await addScheduleItem(user.uid, data)
      setSchedule(s => [...s, { id: ref.id, ...data }])
    } else {
      setSchedule(s => [...s, { id: Date.now().toString(), ...data }])
    }
  }, [user])

  const toggleSession = useCallback(async (id) => {
    setSchedule(s => s.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, done: !item.done }
      if (user) updateScheduleItem(id, { done: updated.done }).catch(() => {})
      return updated
    }))
  }, [user])

  const deleteSession = useCallback(async (id) => {
    setSchedule(s => s.filter(item => item.id !== id))
    if (user) await deleteScheduleItem(id).catch(() => {})
  }, [user])

  const clearSchedule = useCallback(async () => {
    setSchedule(s => {
      if (user) s.forEach(item => deleteScheduleItem(item.id).catch(() => {}))
      return []
    })
  }, [user])

  return (
    <AppContext.Provider value={{
      subjects, schedule, examDate, setExamDate, dailyHours, setDailyHours,
      loadingData, streak, setStreak, isDirty, setIsDirty,
      totalTopics, doneTopics, overallProgress, examDays, pendingTopics,
      addSubject, updateSubject, deleteSubject, toggleTopic, addTopic, deleteTopic, updateTopicNotes,
      addSession, toggleSession, deleteSession, clearSchedule,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
