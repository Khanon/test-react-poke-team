import { useCallback, useMemo, useRef, useState, type FormEvent } from 'react'
import { PokeAPI } from '../api/poke-api'
import { useDebounce } from '../hooks/use-debounce'
import { useFetch } from '../hooks/use-fetch'
import { useTeamDispatch } from '../hooks/use-team-dispatch'
import type { SortBy } from '../models/sort-by'
import { PokemonCard } from './pokemon-card'

const GENERATIONS = [151, 386, 1025]
const GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'

export function PokemonList() {
  const [limit, setLimit] = useState(GENERATIONS[0])
  // PokeAPI.toSummaries lives outside the component, so it's stable as an effect dependency.
  const { data, error, loading } = useFetch(PokeAPI.listUrl(limit), PokeAPI.toSummaries)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [sortBy, setSortBy] = useState<SortBy>('number')
  const [favorites, setFavorites] = useState<number[]>([])
  const [broken, setBroken] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const addByNumberRef = useRef<HTMLInputElement>(null)
  const dispatch = useTeamDispatch()

  // Derived data: computed during render, never copied into state.
  const visible = useMemo(() => {
    if (!data) return []
    const search = debouncedQuery.trim().toLowerCase()
    // filter returns a new array; without a search, copy it, since sort works in place
    // and sorting `data` directly would mutate state.
    const matches = search ? data.filter((p) => p.name.includes(search)) : [...data]
    return sortBy === 'name'
      ? matches.sort((a, b) => a.name.localeCompare(b.name))
      : matches.sort((a, b) => a.id - b.id)
  }, [data, debouncedQuery, sortBy])

  // Functional update, so the dependency array stays empty and the function is stable.
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  // Uncontrolled input: the DOM holds the value, read through the ref on submit.
  function handleAddByNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = addByNumberRef.current
    if (!input) return
    const id = Number(input.value)
    const pokemon = data?.find((p) => p.id === id)
    if (!pokemon) {
      setAddError(`No Pokémon #${input.value} in the loaded list`)
      return
    }
    dispatch({ type: 'add', id: pokemon.id, name: pokemon.name })
    setAddError(null)
    input.value = ''
  }

  // After all the hooks, so the hook order never changes.
  if (broken) {
    throw new Error('Render broken on purpose')
  }

  return (
    <section className="space-y-5">
      <div className="panel p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Generation</span>
            <select className="field" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {GENERATIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-48 flex-1 flex-col gap-1.5">
            <span className="field-label">Search</span>
            <input
              type="search"
              className="field"
              placeholder="Pikachu, eevee…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Sort by</span>
            <select className="field" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
              <option value="number">Number</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <form onSubmit={handleAddByNumber} className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="field-label">Add by number</span>
              <input
                ref={addByNumberRef}
                type="number"
                min={1}
                required
                placeholder="25"
                className="field w-28"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
            {addError && <span className="self-center text-sm text-red-600 dark:text-red-400">{addError}</span>}
          </form>

          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:bg-amber-950 dark:text-amber-400">
              Dev
            </span>
            <button type="button" className="btn btn-secondary" onClick={() => setBroken(true)}>
              Break render
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                // Error Boundaries don't catch this: it happens outside rendering.
                throw new Error('Error thrown in an event handler')
              }}
            >
              Error in handler
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className={GRID} aria-busy="true">
          <span className="sr-only">Loading…</span>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="panel aspect-[3/4] animate-pulse bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          Could not load the Pokémon: {error.message}
        </p>
      )}
      {data && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{visible.length}</span> Pokémon
          </p>
          {visible.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
              No results
            </p>
          ) : (
            <div className={GRID}>
              {visible.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isFavorite={favorites.includes(pokemon.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
