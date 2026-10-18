import type { CardProps } from '../models/card-props'

// Generic container: draws a frame and whatever it receives as `children`.
export function Card({ children }: CardProps) {
  return (
    <div className="panel group relative p-3 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-red-300 dark:hover:ring-red-800">
      {children}
    </div>
  )
}
