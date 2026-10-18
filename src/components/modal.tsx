import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useKeyDown } from '../hooks/use-keydown'
import type { ModalProps } from '../models/modal-props'

export function Modal({ open, title, children, onConfirm, onClose }: ModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  // Refs are touched in effects and handlers, never during render.
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  // The listener only exists while the modal is open.
  useKeyDown('Escape', onClose, open)

  if (!open) return null

  // Rendered into <body>, but events still bubble through the React tree to TeamPanel.
  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        // Only a click on the backdrop itself, not one that bubbled up from the dialog.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
      >
        <h2 id={titleId} className="text-lg font-bold">
          {title}
        </h2>
        <div className="mt-2 text-slate-600 dark:text-slate-300">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
