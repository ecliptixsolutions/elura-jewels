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

  componentDidCatch() {}

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
      return <PageLoader />
    }

    return this.props.children
  }
}

export default AppErrorBoundary
