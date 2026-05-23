import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

import { auth } from '../lib/firebase'
import { ADMIN_EMAILS } from '../config/adminEmails'
import SEO from '../components/SEO.jsx'

function AdminLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // NEW STATES
  const [showPassword, setShowPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  // LOGIN FUNCTION
  const handleLogin = async (event) => {
    event.preventDefault()

    setError('')
    setResetMessage('')

    try {
      setLoading(true)

      // ONLY ALLOWED ADMIN EMAILS
      if (!ADMIN_EMAILS.includes(email)) {
        setError('Unauthorized admin account')
        setLoading(false)
        return
      }

      const response = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )

      // EMAIL VERIFICATION CHECK
      if (!response.user.emailVerified) {
        setError('Please verify your email first')
        setLoading(false)
        return
      }

      // SUCCESS LOGIN
      navigate('/admin')

    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    setError('')
    setResetMessage('')

    if (!email) {
      setError('Please enter your admin email first')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)

      setResetMessage(
        'Password reset email sent successfully. Please check your inbox.',
      )
    } catch {
      setError('Unable to send password reset email')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-5">
      <SEO
        title="Admin Login"
        description="ELURA Jewels admin login."
        canonicalPath="/admin-login"
        robots="noindex,nofollow"
      />
      <div className="w-full max-w-md rounded-[24px] bg-white p-10 shadow-[0_20px_60px_rgba(27,24,19,0.08)]">

        <p className="section-eyebrow">
          ADMIN PANEL
        </p>

        <h1 className="mt-3 text-4xl">
          ELURA Admin Login
        </h1>

        <p className="mt-3 text-sm text-muted">
          Authorized personnel only.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-shell w-full"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-shell w-full pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-gold"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-gold transition hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* SUCCESS MESSAGE */}
          {resetMessage && (
            <p className="text-sm text-green-600">
              {resetMessage}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
