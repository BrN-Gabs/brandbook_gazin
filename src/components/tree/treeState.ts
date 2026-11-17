/**
 * Formation of the Árvore da Jornada de Sucesso, 0 → 1, written by the scroll
 * (src/motion/TreeAnimations.ts) and read by the 3D scene. 1 = complete tree, which is
 * also the state without motion, without the scroll module, or with reduced motion.
 *
 * The tree is born from the DNA of the opening: one particle layer is both.
 *   0 – .12   the double helix forms and turns
 *   .1 – .24  it loosens
 *   .16 – .86 its particles come apart from the bottom up and fly to their place in the tree
 *             (roots → trunk → branches → canopy); each luminous line draws as they arrive
 *   .82 – .97 fruits light up · the camera pulls back from the helix to the whole tree.
 */
export const treeState = { progress: 1 }

export function setTreeProgress(value: number) {
  const progress = Math.min(1, Math.max(0, value))
  if (progress === treeState.progress) return
  treeState.progress = progress
  window.dispatchEvent(new Event('tree:progress'))
}

/** Thresholds shared by the scene (geometry) and the labels (when each region is ready). */
export const treeTimeline = {
  dust: [0, .12], roots: [.24, .46], trunk: [.34, .6], branches: [.46, .78], fruits: [.82, .97], camera: [.12, .9],
} as const
/** Particle flight (passed to the shader): leaves the helix at start + order × spread, lands `length` later. */
export const FLIGHT = { start: .16, spread: .52, length: .18 } as const
export const ready = { raizes: .48, tronco: .6, galhos: .78, frutos: .96 } as const
/** The helix of the opening (same proportions as the intro DNA), centred in the tree's frame. */
export const HELIX = { y: 1.5, scale: .98 } as const

/** Shared geometry constants (kept here, free of Three.js, for the vector fallback too). */
export const GROUND = -1
export const TRUNK_BOTTOM = -1.3, TRUNK_TOP = 2.4
