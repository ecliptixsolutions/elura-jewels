import { useEffect, useState } from 'react'

import { Navigate } from 'react-router-dom'

import { onAuthStateChanged } from 'firebase/auth'

import { auth, hasFirebaseConfig } from '../lib/firebase'

import { ADMIN_EMAILS } from '../config/adminEmails'
import SEO from './SEO.jsx'

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] =
    useState(Boolean(auth && hasFirebaseConfig))

  const [user, setUser] =
    useState(null)

  useEffect(() => {
    if (!auth || !hasFirebaseConfig) {
      return undefined
    }

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
        <SEO
          title="Admin"
          description="ELURA Jewels admin area."
          canonicalPath="/admin"
          robots="noindex,nofollow"
        />
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
  return (
    <>
      <SEO
        title="Admin"
        description="ELURA Jewels admin area."
        canonicalPath="/admin"
        robots="noindex,nofollow"
      />
      {children}
    </>
  )
}

export default ProtectedAdminRoute
