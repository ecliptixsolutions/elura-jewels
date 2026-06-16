import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { pageSeo } from '../seo/seoConfig.js'

const getAuthErrorMessage = (error) => {
  const message = String(error?.message || '')

  if (message.includes('auth/network-request-failed')) {
    return 'We could not connect to authentication. Please check your connection and try again.'
  }

  if (message.includes('auth/unauthorized-domain')) {
    return 'Firebase is blocking this domain. Use http://localhost:5173 locally, and make sure localhost is added in Firebase Authentication authorized domains.'
  }

  if (message.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in was closed before it finished. Please keep the Google window open until the account is selected.'
  }

  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
    return 'The email or password is incorrect.'
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'An account already exists for this email. Please log in instead.'
  }

  if (message.includes('auth/weak-password')) {
    return 'Please choose a stronger password.'
  }

  if (message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  return error?.message || 'Unable to complete authentication right now.'
}

function AuthPage({ mode = 'login' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { forgotPassword, googleLogin, login, signup } = useStore()
  const isLogin = mode === 'login'
  const searchParams = new URLSearchParams(location.search)
  const redirectTo = location.state?.redirectTo || searchParams.get('redirectTo')
  const isCheckoutRedirect = searchParams.get('checkout') === '1'
  const notice =
    location.state?.notice ||
    (isCheckoutRedirect ? 'Please sign in or create an account before secure checkout.' : '')
  const alternateAuthPath = `${isLogin ? '/signup' : '/login'}${location.search || ''}`
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [feedback, setFeedback] = useState({
    error: '',
    success: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ error: '', success: '' })
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      }

      navigate(redirectTo || '/profile', { replace: Boolean(redirectTo) })
    } catch (error) {
      setFeedback({
        error: getAuthErrorMessage(error),
        success: '',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setFeedback({ error: '', success: '' })
    setIsSubmitting(true)

    try {
      await googleLogin()
      navigate(redirectTo || '/profile', { replace: Boolean(redirectTo) })
    } catch (error) {
      setFeedback({
        error: getAuthErrorMessage(error),
        success: '',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    setFeedback({ error: '', success: '' })

    if (!formData.email.trim()) {
      setFeedback({
        error: 'Enter your email address first.',
        success: '',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await forgotPassword(formData.email.trim())
      setFeedback({
        error: '',
        success: 'Reset link sent to email',
      })
    } catch (error) {
      setFeedback({
        error: getAuthErrorMessage(error),
        success: '',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="section-spacing">
      <SEO
        {...(isLogin ? pageSeo.login : pageSeo.signup)}
        canonicalPath={isLogin ? '/login' : '/signup'}
      />
      <div className="section-shell max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="flex flex-col justify-between rounded-[18px] bg-white/45 p-8 sm:p-12">
            <div>
              <img
                src="/elura-logo-mark.webp"
                alt="ELURA Jewels"
                width="128"
                height="128"
                className="h-24 w-24 object-contain sm:h-28 sm:w-28"
              />
              <p className="section-eyebrow mt-10">Account</p>
              <h1 className="mt-5 text-4xl sm:text-5xl">
                {isLogin ? 'Welcome back to ELURA' : 'Create your ELURA account'}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-muted sm:text-lg">
                Save favourites, review orders, and keep your jewellery edit in one place.
              </p>
            </div>

            <div className="mt-10 space-y-4 border-t border-black/8 pt-8 text-sm text-muted">
              <p>Elegant account tools for saved pieces, order history, and delivery updates.</p>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">
                United Kingdom
              </p>
            </div>
          </div>

          <div className="max-w-xl lg:pt-8">
            <p className="section-eyebrow">{isLogin ? 'Sign In' : 'Create Account'}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              {isLogin ? 'Welcome back to ELURA' : 'Create your ELURA account'}
            </h2>

            {notice ? (
              <p className="mt-6 rounded-[16px] bg-white/65 px-5 py-4 text-sm text-muted shadow-[0_12px_30px_rgba(27,24,19,0.05)]">
                {notice}
              </p>
            ) : null}

            {feedback.error ? (
              <p className="mt-6 rounded-[16px] bg-white/65 px-5 py-4 text-sm text-muted shadow-[0_12px_30px_rgba(27,24,19,0.05)]">
                {feedback.error}
              </p>
            ) : null}

            {feedback.success ? (
              <p className="mt-6 rounded-[16px] bg-white/65 px-5 py-4 text-sm text-muted shadow-[0_12px_30px_rgba(27,24,19,0.05)]">
                {feedback.success}
              </p>
            ) : null}

            <form
              className="mt-10 space-y-7"
              onSubmit={handleAuthSubmit}
            >
              {!isLogin && (
                <div>
                  <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                    Full name
                  </label>
                  <input
                    value={formData.name}
                    onChange={updateField('name')}
                    className="input-shell"
                    placeholder="Your full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={updateField('email')}
                  className="input-shell"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-3 block text-xs font-medium uppercase tracking-[0.24em] text-muted">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={updateField('password')}
                  className="input-shell"
                  placeholder="Enter your password"
                  required
                />
                {isLogin ? (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="mt-4 text-sm font-medium text-gold"
                    disabled={isSubmitting}
                  >
                    Forgot Password
                  </button>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 pt-3 sm:flex-row">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isLogin ? 'Login' : 'Create Account'}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn-secondary w-full justify-center sm:w-auto"
                  disabled={isSubmitting}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.5c-.2 1.3-.8 2.3-1.7 3.1l2.8 2.2c1.6-1.5 2.6-3.8 2.6-6.5 0-.6-.1-1.2-.2-1.7H12Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21c2.4 0 4.4-.8 5.9-2.1l-2.8-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8l-2.9 2.3C5.5 19 8.5 21 12 21Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M6.9 13.8c-.2-.5-.3-1.1-.3-1.8s.1-1.2.3-1.8L4 7.9C3.4 9 3 10.4 3 12s.4 3 1 4.1l2.9-2.3Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12 6.4c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 3.8 14.4 3 12 3 8.5 3 5.5 5 4 7.9l2.9 2.3c.7-2.2 2.7-3.8 5.1-3.8Z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </form>

            <p className="mt-8 border-t border-black/8 pt-7 text-sm text-muted">
              {isLogin ? 'New to ELURA?' : 'Already have an account?'}{' '}
              <Link to={alternateAuthPath} className="font-semibold text-gold">
                {isLogin ? 'Sign up' : 'Log in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
