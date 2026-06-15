import { Component } from 'react'
import PageLoader from './PageLoader.jsx'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application render error', error, errorInfo)
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({
        hasError: false,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ivory px-5 text-center">
          <div className="max-w-md">
            <PageLoader />
            <h1 className="mt-8 text-3xl">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted">
              The page could not be loaded. Refresh the page or return to the homepage.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="btn-primary mt-6"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
