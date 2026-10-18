import { useContext } from 'react'
import { TeamDispatchContext } from '../context/team-contexts'

export function useTeamDispatch() {
  const dispatch = useContext(TeamDispatchContext)
  if (dispatch === null) {
    throw new Error('useTeamDispatch must be used inside <TeamProvider>')
  }
  return dispatch
}
