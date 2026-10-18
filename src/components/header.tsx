import { useTeam } from '../hooks/use-team'
import { MAX_TEAM_SIZE } from '../state/team-reducer'

export function Header() {
  const { members } = useTeam()

  return (
    <header className="sticky top-0 z-20 bg-linear-to-r from-red-600 via-red-500 to-rose-500 text-white shadow-lg shadow-red-900/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img src="/pokeball.svg" alt="" className="size-9 drop-shadow" />
          <h1 className="text-2xl font-extrabold tracking-tight">PokéTeam</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
            {Array.from({ length: MAX_TEAM_SIZE }, (_, i) => (
              <span
                key={i}
                className={`size-3 rounded-full ring-2 ring-white/40 transition ${
                  i < members.length ? 'bg-yellow-300' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <p className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/30">
            Team {members.length}/{MAX_TEAM_SIZE}
          </p>
        </div>
      </div>
    </header>
  )
}
