import type { NamedApiResource } from './named-api-resource'

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}
