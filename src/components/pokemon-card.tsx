import { memo } from 'react'
import { useTeamDispatch } from '../hooks/use-team-dispatch'
import type { PokemonCardProps } from '../models/pokemon-card-props'
import { Card } from './card'

// memo: re-renders only when its props change, which only works because the parent
// passes a stable `onToggleFavorite` (useCallback).
export const PokemonCard = memo(function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
}: PokemonCardProps) {
  // Only dispatch is consumed, so changes to the team don't re-render the cards.
  const dispatch = useTeamDispatch()

  return (
    <Card>
      {/* An arrow, not onClick={onToggleFavorite(pokemon.id)}, which would run during render. */}
      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Unmark favorite' : 'Mark favorite'}
        onClick={() => onToggleFavorite(pokemon.id)}
        className={`absolute top-4 right-4 z-10 grid size-8 cursor-pointer place-items-center rounded-full text-xl leading-none transition hover:scale-125 ${
          isFavorite ? 'text-amber-400 drop-shadow' : 'text-slate-300 hover:text-amber-300 dark:text-slate-600'
        }`}
      >
        {isFavorite ? '★' : '☆'}
      </button>
      <div className="grid aspect-square place-items-center rounded-xl bg-linear-to-b from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          width={96}
          height={96}
          loading="lazy"
          className="sprite size-3/4 transition duration-200 group-hover:scale-110"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="truncate font-semibold capitalize">{pokemon.name}</span>
        <span className="font-mono text-xs text-slate-400">#{String(pokemon.id).padStart(3, '0')}</span>
      </div>
      <button
        type="button"
        onClick={() => dispatch({ type: 'add', id: pokemon.id, name: pokemon.name })}
        className="btn btn-primary mt-3 w-full"
      >
        Add to team
      </button>
    </Card>
  )
})
