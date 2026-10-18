export interface FetchState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}
