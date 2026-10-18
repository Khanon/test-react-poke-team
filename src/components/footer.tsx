import { useState } from 'react'
import { SessionTimer } from './session-timer'

export function Footer() {
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [minutes, setMinutes] = useState(0)

  return (
    <footer className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/80 shadow-[0_-4px_12px_-6px_rgb(0_0_0/0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Hiding unmounts the timer: its interval stops and its state is lost. */}
          {visible && <SessionTimer paused={paused} onMinute={setMinutes} />}
          <button type="button" className="btn btn-secondary" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setVisible((v) => !v)}>
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
        {/* setMinutes is stable, so passing it keeps PureComponent effective; an inline
            arrow would be a new prop on every render. */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{minutes}</span>{' '}
          {minutes === 1 ? 'minute' : 'minutes'} so far
        </p>
      </div>
    </footer>
  )
}
