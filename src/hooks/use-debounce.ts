import { useEffect, useState } from 'react'

// Returns `value` once it has stopped changing for `delay` ms (like RxJS debounceTime).
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delay)
    // A new value before the delay is up cancels the pending update.
    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debounced
}
