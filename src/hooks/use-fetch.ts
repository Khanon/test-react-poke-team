import { useEffect, useState } from 'react'
import type { FetchResult } from '../models/fetch-result'
import type { FetchState } from '../models/fetch-state'

// `transform` is an effect dependency: pass a function defined outside the component
// (e.g. PokeAPI.toSummaries), never an inline arrow, or every render starts a new request.
export function useFetch<T, R = T>(
  url: string | null,
  transform?: (raw: R) => T,
): FetchState<T> {
  // Only finished requests are stored, tagged with their URL. `loading` is derived below
  // instead of being set from the effect.
  const [result, setResult] = useState<FetchResult<T> | null>(null)

  useEffect(() => {
    if (url === null) return

    console.log('useFetch: effect', url)
    const controller = new AbortController()

    // The effect itself can't be async: it must return the cleanup, not a promise.
    async function load(url: string) {
      try {
        const response = await fetch(url, { signal: controller.signal })
        // fetch only rejects on network errors, so HTTP errors have to be checked by hand.
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`)
        }
        const raw: R = await response.json()
        const data = transform ? transform(raw) : (raw as unknown as T)
        setResult({ url, data, error: null })
      } catch (error) {
        // Aborted by the cleanup: a newer request (or an unmount) took over, so ignore it.
        if (error instanceof DOMException && error.name === 'AbortError') return
        setResult({
          url,
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        })
      }
    }

    load(url)

    return () => {
      console.log('useFetch: cleanup', url)
      controller.abort()
    }
  }, [url, transform])

  if (url === null) return { data: null, error: null, loading: false }
  // No result for the current URL yet: the request is still in flight.
  if (result?.url !== url) return { data: null, error: null, loading: true }
  return { data: result.data, error: result.error, loading: false }
}
