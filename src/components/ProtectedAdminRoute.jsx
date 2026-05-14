import { Navigate } from 'react-router-dom'

import { ADMIN_EMAILS } from '../config/adminEmails'
import { useStore } from '../context/StoreContext'

function ProtectedAdminRoute({ children }) {
  const { user } = useStore()

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/admin-login" replace />
  }

  // NOT AUTHORIZED
  if (!ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />
  }

  // ACCESS GRANTED
  return children
}

export default ProtectedAdminRoute