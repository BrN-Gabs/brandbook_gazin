type Props = { children: React.ReactNode; className?: string; id?: string }

export function SectionHeading({ children, className = '', id }: Props) {
  return <h2 id={id} className={`section-heading ${className}`}>{children}</h2>
}
