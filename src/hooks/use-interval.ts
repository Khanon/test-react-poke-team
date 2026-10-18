import { useEffect, useRef } from 'react'

// `delay = null` pauses the interval.
export function useInterval(callback: () => void, delay: number | null) {
  // Keeping the latest callback in a ref avoids a stale closure without restarting
  // the interval every time the callback changes.
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (delay === null) return
    const intervalId = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(intervalId)
  }, [delay])
}
