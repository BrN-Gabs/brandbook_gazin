import { useEffect, useState } from 'react'

export type MotionPreference = 'system' | 'full' | 'reduced'
const storageKey = 'gazin-motion-preference'

function readPreference(): MotionPreference {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored === 'full' || stored === 'reduced' ? stored : 'system'
  } catch { return 'system' }
}

export function useMotionPreference() {
  const [preference, setPreference] = useState<MotionPreference>(readPreference)
  const [systemReduced, setSystemReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemReduced(query.matches)
    query.addEventListener('change', onChange)
    const onStorage = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) setPreference(readPreference()) }
    window.addEventListener('storage', onStorage)
    return () => { query.removeEventListener('change', onChange); window.removeEventListener('storage', onStorage) }
  }, [])

  const choose = (next: MotionPreference) => {
    setPreference(next)
    try {
      if (next === 'system') localStorage.removeItem(storageKey)
      else localStorage.setItem(storageKey, next)
    } catch { /* The control also works when browser storage is unavailable. */ }
  }

  return { preference, choose, systemReduced, enabled: preference === 'full' || (preference === 'system' && !systemReduced) }
}
