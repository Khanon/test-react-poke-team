import type { ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onConfirm: () => void
  onClose: () => void
}
