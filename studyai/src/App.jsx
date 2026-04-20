
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Auth from './pages/Auth'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthWrapper />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppProvider>
                <AppLayout />
              </AppProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}


function AuthWrapper() {
  const { user, loading } = useAuth()
  
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  
  return <Auth />
}
