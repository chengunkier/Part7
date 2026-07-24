import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error)
    console.error(errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Something went wrong :(</h1>
          <p>Please make a bug report to mluukkai in Discord</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary