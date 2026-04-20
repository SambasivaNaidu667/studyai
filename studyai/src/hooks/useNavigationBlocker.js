

import { useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useNavigationBlocker(isDirty) {
  const location = useLocation()
  const navigate = useNavigate()
  const lastLocationRef = useRef(location)

  
  useEffect(() => {
    if (!isDirty) return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  
  const safeNavigate = useCallback((to) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved progress. Are you sure you want to navigate away?')) return
    }
    navigate(to)
  }, [isDirty, navigate])

  return { safeNavigate }
}
