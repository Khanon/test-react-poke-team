import { useContext } from 'react'
import { TeamStateContext } from '../context/team-contexts'

export function useTeam() {
  const team = useContext(TeamStateContext)
  if (team === null) {
    throw new Error('useTeam must be used inside <TeamProvider>')
  }
  return team
}
