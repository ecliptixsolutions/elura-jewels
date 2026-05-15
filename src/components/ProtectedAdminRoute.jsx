import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../lib/firebase'

import { ADMIN_EMAILS } from '../config/adminEmails'

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] =
    useState(true)

  const [user, setUser] =
    useState(null)

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser)
          setLoading(false)
        },
      )

    return () => unsubscribe()
  }, [])

  // WAIT FOR FIREBASE
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  // NOT LOGGED IN
  if (!user) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    )
  }

  // NOT ADMIN
  if (
    !ADMIN_EMAILS.includes(
      user.email,
    )
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  // ACCESS GRANTED
  return children
}

export default ProtectedAdminRoute