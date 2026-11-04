import { useEffect, useRef } from 'react'
import type { MotionPreference } from './useMotionPreference'

export function useBrandMotion(preference: MotionPreference) {
  const initialized = useRef(false)
  useEffect(() => {
    let disposed = false
    let cleanup: (() => void) | undefined
    // A failed motion chunk cannot prevent React from rendering the brandbook.
    void Promise.all([import('./createBrandMotion'), document.fonts.ready]).then(([module]) => {
      if (!disposed) {
        cleanup = module.createBrandMotion(preference, !initialized.current)
        initialized.current = true
      }
    }).catch(error => {
      console.warn('Motion indisponível; mantendo a leitura estática.', error)
      if (!disposed && location.hash) {
        try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView() } catch { /* Invalid hash: retain the current position. */ }
      }
    })
    return () => { disposed = true; cleanup?.() }
  }, [preference])
}
