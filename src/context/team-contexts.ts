import { createContext, type Dispatch } from 'react'
import type { TeamAction } from '../models/team-action'
import type { TeamState } from '../models/team-state'

// Two contexts: components that only dispatch (like PokemonCard) don't re-render when
// the team changes, because `dispatch` is stable.
export const TeamStateContext = createContext<TeamState | null>(null)
export const TeamDispatchContext = createContext<Dispatch<TeamAction> | null>(null)
