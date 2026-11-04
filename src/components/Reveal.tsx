import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string; delay?: number }

export function Reveal({ children, className, delay = 0 }: Props) {
  return <div className={className} data-reveal data-reveal-delay={delay}>{children}</div>
}
