
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { setUserProfile, getUserProfile } from '../services/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const prof = await getUserProfile(firebaseUser.uid)
          setProfile(prof)
        } catch {
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = useCallback(async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    const prof = { displayName, email, examDate: '', dailyHours: 6, plan: 'free', createdAt: new Date().toISOString() }
    await setUserProfile(cred.user.uid, prof)
    setProfile(prof)
    return cred.user
  }, [])

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const prof = await getUserProfile(cred.user.uid)
    setProfile(prof)
    return cred.user
  }, [])

  const logout = useCallback(() => signOut(auth), [])

  const updateUserProfile = useCallback(async data => {
    if (!user) return
    await setUserProfile(user.uid, data)
    setProfile(p => ({ ...p, ...data }))
  }, [user])

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
