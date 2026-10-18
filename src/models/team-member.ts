import type { PokemonSummary } from './pokemon-summary'

export type TeamMember = Pick<PokemonSummary, 'id' | 'name'>
