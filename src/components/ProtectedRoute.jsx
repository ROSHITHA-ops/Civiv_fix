import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ children, role }) {
  const { user } = useApp()
  const location = useLocation()
  if (!user) return <Navigate to={role === 'admin' ? '/admin-login' : '/login'} state={{ from: location }} replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/app/dashboard'} replace />
  return children
}
