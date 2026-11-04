import { Pause, Play, RotateCcw } from 'lucide-react'
import type { MotionPreference } from '../motion/useMotionPreference'

type Props = {
  preference: MotionPreference
  enabled: boolean
  systemReduced: boolean
  onChange: (preference: MotionPreference) => void
}

export function MotionControl({ preference, enabled, systemReduced, onChange }: Props) {
  const label = enabled ? 'Reduzir animações' : 'Ativar animações'
  return <div className="motion-control" role="group" aria-label="Preferência de movimento">
    <button type="button" onClick={() => onChange(enabled ? 'reduced' : 'full')}
      title={!enabled && systemReduced ? 'Seu sistema prefere movimento reduzido. Ativar somente neste site.' : label}>
      {enabled ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      <span>{label}</span>
    </button>
    {preference !== 'system' && <button className="motion-reset" type="button" onClick={() => onChange('system')}
      aria-label="Usar preferência de movimento do sistema" title="Usar preferência de movimento do sistema">
      <RotateCcw size={14} aria-hidden="true" />
    </button>}
  </div>
}
