
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'


const Dashboard = lazy(() => import('../pages/Dashboard'))
const Planner = lazy(() => import('../pages/Planner'))
const Subjects = lazy(() => import('../pages/Subjects'))
const Analytics = lazy(() => import('../pages/Analytics'))
const AIAssistant = lazy(() => import('../pages/AIAssistant'))
const Settings = lazy(() => import('../pages/Settings'))

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-dots">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} className="page-loader-dot" style={{ animationDelay: `${delay}s` }} />
        ))}
      </div>
    </div>
  )
}

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Topbar />
        <div className="app-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  )
}
