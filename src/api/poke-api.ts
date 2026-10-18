import type { NamedApiResource } from '../models/named-api-resource'
import type { PokemonListResponse } from '../models/pokemon-list-response'
import type { PokemonSummary } from '../models/pokemon-summary'

export class PokeAPI {
  static readonly BASE_URL = 'https://pokeapi.co/api/v2'
  static readonly SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

  static listUrl(limit: number): string {
    return `${PokeAPI.BASE_URL}/pokemon?limit=${limit}`
  }

  static imageUrl(id: number): string {
    return `${PokeAPI.SPRITE_URL}/${id}.png`
  }

  // ".../pokemon/25/" -> 25
  static idFromUrl(url: string): number {
    const id = Number(url.split('/').filter(Boolean).at(-1))
    if (!Number.isInteger(id)) {
      throw new Error(`Cannot extract a Pokémon id from "${url}"`)
    }
    return id
  }

  static toSummary(resource: NamedApiResource): PokemonSummary {
    const id = PokeAPI.idFromUrl(resource.url)
    return { id, name: resource.name, imageUrl: PokeAPI.imageUrl(id) }
  }

  // Ready to pass as the `transform` argument of useFetch.
  static toSummaries(response: PokemonListResponse): PokemonSummary[] {
    return response.results.map(PokeAPI.toSummary)
  }
}
