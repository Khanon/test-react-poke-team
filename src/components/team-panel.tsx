import { useState } from 'react'
import { PokeAPI } from '../api/poke-api'
import { useTeam } from '../hooks/use-team'
import { useTeamDispatch } from '../hooks/use-team-dispatch'
import { MAX_TEAM_SIZE } from '../state/team-reducer'
import { Modal } from './modal'

export function TeamPanel() {
  const { members } = useTeam()
  const dispatch = useTeamDispatch()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const emptySlots = MAX_TEAM_SIZE - members.length

  return (
    // Also logs clicks inside the modal: it lives in <body> in the DOM, but it's a child
    // of TeamPanel in the React tree, and React events bubble through the React tree.
    <aside className="panel p-5 lg:sticky lg:top-20" onClick={() => console.log('TeamPanel: click')}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">My team</h2>
        <span className="text-sm font-semibold text-slate-400">
          {members.length}/{MAX_TEAM_SIZE}
        </span>
      </div>

      {members.length > 0 && (
        <ol className="mt-4 space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700"
            >
              <img
                src={PokeAPI.imageUrl(member.id)}
                alt=""
                width={48}
                height={48}
                className="sprite size-12 rounded-lg bg-white dark:bg-slate-900"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold capitalize">{member.name}</p>
                <p className="font-mono text-xs text-slate-400">#{String(member.id).padStart(3, '0')}</p>
              </div>
              <button
                type="button"
                className="btn btn-ghost px-2.5 py-1 text-xs"
                onClick={() => dispatch({ type: 'remove', id: member.id })}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className={`space-y-2 ${members.length > 0 ? 'mt-2' : 'mt-4'}`} aria-hidden="true">
        {Array.from({ length: emptySlots }, (_, i) => (
          <div
            key={i}
            className="grid h-16 place-items-center rounded-xl border-2 border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-700"
          >
            {members.length === 0 && i === 0 ? 'No members yet' : 'Empty slot'}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-danger mt-5 w-full"
        disabled={members.length === 0}
        onClick={() => setConfirmOpen(true)}
      >
        Clear team
      </button>

      <Modal
        open={confirmOpen}
        title="Clear team"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          dispatch({ type: 'clear' })
          setConfirmOpen(false)
        }}
      >
        <p>Remove all {members.length} members from the team?</p>
      </Modal>
    </aside>
  )
}
