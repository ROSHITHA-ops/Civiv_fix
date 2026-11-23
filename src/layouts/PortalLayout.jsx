import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Bell, ChevronDown, ClipboardList, FilePlus2, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users, X, BarChart3, UserRound, Globe2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Brand } from '../components/UI'

const citizenLinks = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/report', label: 'Report an issue', icon: FilePlus2 },
  { to: '/app/my-complaints', label: 'My complaints', icon: ClipboardList },
  { to: '/app/issues', label: 'All public issues', icon: Globe2 },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'My profile', icon: UserRound },
]
const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/issues', label: 'Manage issues', icon: ClipboardList },
  { to: '/admin/officers', label: 'Assign officers', icon: ShieldCheck },
  { to: '/admin/citizens', label: 'Citizens', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function PortalLayout({ admin = false }) {
  const { user, setUser } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const links = admin ? adminLinks : citizenLinks
  function logout() { setUser(null); navigate('/') }
  return <div className="portal-shell">
    {open && <button className="mobile-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand /></div>
      <div className="workspace-label">{admin ? 'ADMIN CONSOLE' : 'CITIZEN PORTAL'}</div>
      <nav className="sidebar-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Notifications' && <span className="nav-indicator" />}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-symbol"><Activity size={17} /></div><strong>Here to help</strong><p>Have a question about your city? Our support team is ready.</p><a href="mailto:hello@civicconnect.in">Contact support <span>↗</span></a></div>
        <button className="nav-item logout-link" onClick={logout}><LogOut size={18} /><span>Sign out</span></button>
      </div>
    </aside>
    <main className="portal-main">
      <header className="portal-header"><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={21} /> : <Menu size={21} />}</button><div className="breadcrumb">{admin ? 'Administration' : 'Citizen portal'} <span>/</span> <b>{links.find((item) => item.to === location.pathname)?.label || (admin ? 'Overview' : 'Dashboard')}</b></div>
        <div className="header-right"><NavLink to={admin ? '/admin/notifications' : '/app/notifications'} className="header-bell" aria-label="Notifications"><Bell size={18} /><i /></NavLink><div className="user-pill"><div className="avatar">{(user?.name || 'C').split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><div className="user-pill-name"><strong>{user?.name || 'Citizen'}</strong><small>{admin ? 'Administrator' : 'Citizen account'}</small></div><ChevronDown size={15} /></div></div>
      </header>
      <div className="page-content"><Outlet /></div>
      <footer className="portal-footer">CivicConnect <span>•</span> Building better neighborhoods together</footer>
    </main>
  </div>
}
