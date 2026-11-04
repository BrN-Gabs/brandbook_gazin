type Props = { variant: 'people' | 'connections' | 'excellence' | 'evolution'; className?: string }

// Grafismos geométricos originais, independentes do desenho da marca.
export function BrandSymbol({ variant, className = '' }: Props) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={`brand-symbol ${className}`}>
      {variant === 'people' && <>
        <path d="M12 62a30 30 0 0 1 60 0v38H12V62Z" fill="currentColor" />
        <path d="M48 62a30 30 0 0 1 60 0v38H48V62Z" stroke="currentColor" strokeWidth="5" />
      </>}
      {variant === 'connections' && <>
        <rect x="12" y="34" width="64" height="52" rx="26" stroke="currentColor" strokeWidth="9" />
        <rect x="44" y="34" width="64" height="52" rx="26" stroke="currentColor" strokeWidth="9" />
      </>}
      {variant === 'excellence' && <>
        <path d="M60 10v100M10 60h100M25 25l70 70M25 95l70-70" stroke="currentColor" strokeWidth="15" />
        <circle cx="60" cy="60" r="13" fill="currentColor" />
      </>}
      {variant === 'evolution' && <>
        <path d="M15 103V77h26v26H15Zm0-39V38h26v26H15Zm39 39V77h26v26H54Z" fill="currentColor" opacity=".35" />
        <path d="M53 12h55v55H86V49L57 78 42 63l29-29H53V12Z" fill="currentColor" />
      </>}
    </svg>
  )
}
