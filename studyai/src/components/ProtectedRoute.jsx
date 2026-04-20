
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', flexDirection: 'column', gap: '20px',
      }}>
        <div style={{
          width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          animation: 'float 2s ease infinite',
        }}>🎓</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)',
              animation: 'pulse-dot 1.4s ease infinite', animationDelay: `${delay}s`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" replace />
}
