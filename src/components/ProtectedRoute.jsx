import { Navigate, useLocation } from "react-router-dom"

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('auth_token')
  const user = JSON.parse(localStorage.getItem('user'))
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (location.pathname === "/") {
    if (user.role === "trainer") {
      return <Navigate to="/dashboard/trainer" replace />
    } else if (user.role === "client") {
      return <Navigate to="/dashboard/client" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}
