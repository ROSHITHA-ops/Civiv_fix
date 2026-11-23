import { lazy, Suspense } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProtectedRoute from './components/ProtectedRoute'
import PortalLayout from './layouts/PortalLayout'
import { Brand } from './components/UI'
import { useApp } from './context/AppContext'

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })))
const AuthPage = lazy(() => import('./pages/Home').then((module) => ({ default: module.AuthPage })))
const AllIssues = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.AllIssues })))
const CitizenDashboard = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.CitizenDashboard })))
const IssueDetails = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.IssueDetails })))
const MyComplaints = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.MyComplaints })))
const Notifications = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.Notifications })))
const Profile = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.Profile })))
const ReportIssue = lazy(() => import('./pages/CitizenPages').then((module) => ({ default: module.ReportIssue })))
const AdminDashboard = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.AdminDashboard })))
const AdminNotifications = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.AdminNotifications })))
const AdminSettings = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.AdminSettings })))
const Analytics = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.Analytics })))
const AssignOfficers = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.AssignOfficers })))
const Citizens = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.Citizens })))
const ManageIssues = lazy(() => import('./pages/AdminPages').then((module) => ({ default: module.ManageIssues })))

function PublicShell({ children }) {
  const { user } = useApp()
  return <div className="public-shell"><header className="public-shell-header"><Brand /><Link to={user ? user.role === 'admin' ? '/admin' : '/app/dashboard' : '/login'}>{user ? 'Go to dashboard' : 'Sign in'} <ArrowRight size={14} /></Link></header><main>{children}</main><footer>© 2026 CivicConnect · Making local change feel a little closer.</footer></div>
}

function CitizenRoutes() {
  return <ProtectedRoute role="citizen"><PortalLayout /></ProtectedRoute>
}

function AdminRoutes() {
  return <ProtectedRoute role="admin"><PortalLayout admin /></ProtectedRoute>
}

export default function App() {
  return <Suspense fallback={<div className="route-loading">Loading CivicConnect…</div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/admin-login" element={<AuthPage mode="admin" />} />
    <Route path="/issues" element={<PublicShell><AllIssues /></PublicShell>} />
    <Route path="/issues/:id" element={<PublicShell><IssueDetails /></PublicShell>} />
    <Route path="/app" element={<CitizenRoutes />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<CitizenDashboard />} />
      <Route path="report" element={<ReportIssue />} />
      <Route path="my-complaints" element={<MyComplaints />} />
      <Route path="issues" element={<AllIssues compact />} />
      <Route path="issues/:id" element={<IssueDetails />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="/admin" element={<AdminRoutes />}>
      <Route index element={<AdminDashboard />} />
      <Route path="issues" element={<ManageIssues />} />
      <Route path="officers" element={<AssignOfficers />} />
      <Route path="citizens" element={<Citizens />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="notifications" element={<AdminNotifications />} />
    </Route>
    <Route path="*" element={<PublicShell><div className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>That page seems to have taken a wrong turn.</h1><p>Let’s get you back to somewhere useful.</p><Link className="button button-primary" to="/">Return home <ArrowRight size={15} /></Link></div></PublicShell>} />
  </Routes></Suspense>
}
