import { useEffect, useRef } from 'react'

export function useKeyDown(key: string, handler: (event: KeyboardEvent) => void, enabled: boolean) {
  // The latest handler is kept in a ref, so an inline arrow doesn't re-add the listener
  // on every render. The ref is written in an effect, never during render.
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === key) handlerRef.current(event)
    }

    window.addEventListener('keydown', onKeyDown)
    // Without this, one more listener piles up every time it's enabled.
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, enabled])
}
