import { useEffect, useState } from 'react'
import { brandContent } from '../data/brandContent'

export type LoadingState = 'loading' | 'ready' | 'fallback'

/** Weighted readiness milestones, not a simulated network-byte percentage. */
export function usePreloader() {
  const [loading, setLoading] = useState<{ progress: number; state: LoadingState }>({ progress: 0, state: 'loading' })

  useEffect(() => {
    let disposed = false
    let completed = 0
    const logo = new Image()
    logo.src = `${import.meta.env.BASE_URL}${brandContent.meta.logoSrc}`
    const essential = [
      { weight: 40, promise: logo.decode() },
      { weight: 20, promise: document.fonts.load('200 48px "Inter Variable"', '0123456789%') },
      { weight: 20, promise: document.fonts.load('900 120px "Inter Variable"', 'brandbook') },
      { weight: 10, promise: document.fonts.load('700 20px "Plus Jakarta Sans Variable"', 'Consulta Apoio Coerência') },
      { weight: 10, promise: document.fonts.load('400 16px "Plus Jakarta Sans Variable"', 'Consulta Apoio Coerência') },
    ]
    // A stalled font/image must never strand the reader. Failure exits without claiming 100%.
    const deadline = window.setTimeout(() => {
      disposed = true
      setLoading(current => ({ ...current, state: 'fallback' }))
    }, 6500)
    void Promise.all(essential.map(async resource => {
      await resource.promise
      if (disposed) return
      completed += resource.weight
      setLoading({ progress: Math.min(95, completed), state: 'loading' })
    })).then(() => {
      if (!disposed) {
        disposed = true
        setLoading({ progress: 100, state: 'ready' })
      }
    }).catch(() => {
      if (!disposed) {
        disposed = true
        setLoading(current => ({ ...current, state: 'fallback' }))
      }
    }).finally(() => clearTimeout(deadline))
    return () => { disposed = true; clearTimeout(deadline) }
  }, [])

  return loading
}
