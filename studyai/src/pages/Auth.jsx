
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Tabs, LoadingDots } from '../components/UI'

export default function Auth() {
  const { login, signup } = useAuth()
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      if (tab === 'login') await login(email, password)
      else await signup(email, password, name)
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'No account with that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'Email already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      }
      setError(msgs[err.code] || err.message || 'Something went wrong.')
    } finally { setLoading(false) }
  }

  async function demoLogin() {
    setLoading(true); setError('')
    try { await login('demo@studyai.app', 'demo123456') }
    catch {
      try { await signup('demo@studyai.app', 'demo123456', 'Demo Student') }
      catch (err) { setError('Could not start demo. Check Firebase config.') }
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      position: 'relative', overflow: 'hidden', padding: '20px',
    }}>
      
      {[
        { top: '-200px', right: '-100px', bg: 'var(--accent)' },
        { bottom: '-200px', left: '-100px', bg: 'var(--teal)' },
        { top: '40%', left: '30%', bg: 'var(--amber)', opacity: 0.05 },
      ].map((g, i) => (
        <div key={i} style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', filter: 'blur(120px)', opacity: g.opacity || 0.12,
          background: g.bg, ...g, pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '48px', width: '100%',
        maxWidth: '460px', position: 'relative', zIndex: 1,
      }}
        className="animate-slide-in"
      >
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '32px', margin: '0 auto 14px',
          }}>🎓</div>
          <div style={{
            fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 800,
            background: 'linear-gradient(90deg, var(--accent2), var(--teal))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>StudyAI</div>
          <div style={{ fontSize: '15px', color: 'var(--text2)', marginTop: '6px' }}>
            {tab === 'login' ? 'Welcome back! Ready to crush it? 💪' : 'Build your personalized study companion'}
          </div>
        </div>

        <Tabs
          tabs={[{ id: 'login', label: 'Sign In' }, { id: 'signup', label: 'Sign Up' }]}
          active={tab}
          onChange={t => { setTab(t); setError('') }}
        />

        <form onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <Input label="Full Name" type="text" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <Input label="Email Address" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && (
            <div style={{
              color: 'var(--coral)', fontSize: '13px', marginBottom: '16px',
              padding: '10px 14px', background: 'rgba(255,107,107,0.1)',
              borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)',
            }}>⚠️ {error}</div>
          )}

          <Button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
            {loading ? <LoadingDots /> : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </Button>
        </form>

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: 'var(--text3)', fontSize: '13px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          or continue with
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <Button variant="secondary" onClick={demoLogin} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          🚀 Try Demo Account
        </Button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text3)', marginTop: '20px' }}>
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>

        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
          {['✦ AI Study Plans', '🔥 Streak Tracking', '📊 Analytics'].map(f => (
            <span key={f} style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '99px',
              background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)',
            }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
