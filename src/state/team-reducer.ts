import type { TeamAction } from '../models/team-action'
import type { TeamState } from '../models/team-state'

export const MAX_TEAM_SIZE = 6

export const initialTeamState: TeamState = { members: [] }

// Pure: no localStorage, no fetch, no mutation. Always return a new object (or the same
// one when nothing changes, so React can skip the re-render).
export function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case 'add': {
      if (state.members.length >= MAX_TEAM_SIZE) return state
      if (state.members.some((member) => member.id === action.id)) return state
      return { ...state, members: [...state.members, { id: action.id, name: action.name }] }
    }
    case 'remove':
      return { ...state, members: state.members.filter((member) => member.id !== action.id) }
    case 'clear':
      return { ...state, members: [] }
  }
}
