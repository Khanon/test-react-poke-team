export type TeamAction =
  | { type: 'add'; id: number; name: string }
  | { type: 'remove'; id: number }
  | { type: 'clear' }
