export interface FetchResult<T> {
  url: string
  data: T | null
  error: Error | null
}
