import { useEffect, useReducer } from 'react'
import type { TeamProviderProps } from '../models/team-provider-props'
import type { TeamState } from '../models/team-state'
import { initialTeamState, teamReducer } from '../state/team-reducer'
import { TeamDispatchContext, TeamStateContext } from './team-contexts'

const STORAGE_KEY = 'poketeam.team'

// Lazy initialization: runs only on the first render, not on every one.
function init(): TeamState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as TeamState
      if (Array.isArray(parsed.members)) return parsed
    }
  } catch {
    // Corrupt or blocked storage: start with an empty team.
  }
  return initialTeamState
}

export function TeamProvider({ children }: TeamProviderProps) {
  const [state, dispatch] = useReducer(teamReducer, undefined, init)

  // The side effect lives here, not in the reducer.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full or blocked: the team still works, it just isn't saved.
    }
  }, [state])

  // React 19: a context can be rendered directly as its provider, without `.Provider`.
  return (
    <TeamStateContext value={state}>
      <TeamDispatchContext value={dispatch}>{children}</TeamDispatchContext>
    </TeamStateContext>
  )
}
