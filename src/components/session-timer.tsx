import { PureComponent } from 'react'
import type { SessionTimerProps } from '../models/session-timer-props'
import type { SessionTimerState } from '../models/session-timer-state'

// Set it to 10 while testing, so you don't have to wait a full minute for onMinute.
const SECONDS_PER_MINUTE = 60

// PureComponent replaces this shouldComponentUpdate with a shallow comparison of
// every prop and state key:
//   shouldComponentUpdate(nextProps, nextState) {
//     return nextState.seconds !== this.state.seconds || nextProps.paused !== this.props.paused
//   }
export class SessionTimer extends PureComponent<SessionTimerProps, SessionTimerState> {
  // Not rendered, so it's an instance field and not state (the class version of useRef).
  intervalId: number | null = null

  constructor(props: SessionTimerProps) {
    super(props)
    this.state = { seconds: 0 }
    // Regular methods aren't bound: without this, `this` is undefined when Reset is clicked.
    this.reset = this.reset.bind(this)
  }

  componentDidMount() {
    if (!this.props.paused) this.start()
  }

  componentDidUpdate(prevProps: SessionTimerProps) {
    // Only when `paused` changed: acting on every update would loop or restart the interval.
    if (prevProps.paused === this.props.paused) return
    if (this.props.paused) {
      this.stop()
    } else {
      this.start()
    }
  }

  componentWillUnmount() {
    // Without this, StrictMode's mount → unmount → mount leaves two intervals counting.
    this.stop()
  }

  // A class arrow function: `this` stays bound when setInterval calls it.
  tick = () => {
    console.log('SessionTimer: tick')
    this.setState(
      (prev) => ({ seconds: prev.seconds + 1 }),
      // Runs once the new state has been applied, so this.state.seconds is up to date here.
      () => {
        if (this.state.seconds % SECONDS_PER_MINUTE === 0) {
          this.props.onMinute(this.state.seconds / SECONDS_PER_MINUTE)
        }
      },
    )
  }

  reset() {
    this.setState({ seconds: 0 })
  }

  start() {
    if (this.intervalId !== null) return
    this.intervalId = window.setInterval(this.tick, 1000)
  }

  stop() {
    if (this.intervalId === null) return
    window.clearInterval(this.intervalId)
    this.intervalId = null
  }

  render() {
    const minutes = Math.floor(this.state.seconds / 60)
    const seconds = String(this.state.seconds % 60).padStart(2, '0')

    return (
      <span className="inline-flex items-center gap-3">
        <span className="field-label hidden sm:inline">Session</span>{' '}
        <span className="font-mono text-xl font-semibold tabular-nums">
          {minutes}:{seconds}
        </span>
        {this.props.paused && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            paused
          </span>
        )}
        <button type="button" className="btn btn-ghost" onClick={this.reset}>
          Reset
        </button>
      </span>
    )
  }
}
