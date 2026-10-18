import type { PokemonSummary } from './pokemon-summary'

export interface PokemonCardProps {
  pokemon: PokemonSummary
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}
