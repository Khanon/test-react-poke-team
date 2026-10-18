import { Component, type ErrorInfo } from 'react'
import type { ErrorBoundaryProps } from '../models/error-boundary-props'
import type { ErrorBoundaryState } from '../models/error-boundary-state'

// Has to be a class: there's no hook equivalent of getDerivedStateFromError / componentDidCatch.
// It catches errors thrown while rendering its children, not in event handlers or async code.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  // Render phase: switch to the fallback on the next render.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  // Commit phase: the place for side effects such as logging.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  // Clearing the error mounts the children again, with fresh state.
  retry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/40"
        >
          <img src="/pokeball.svg" alt="" className="mx-auto size-14 rotate-45 opacity-80" />
          <p className="mt-4 text-lg font-bold text-red-700 dark:text-red-300">Something went wrong</p>
          <p className="mt-1 font-mono text-sm text-red-600/80 dark:text-red-400/80">
            {this.state.error.message}
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={this.retry}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
