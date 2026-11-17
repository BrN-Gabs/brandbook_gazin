import * as THREE from 'three'
import { itemsOf, type TreeItem } from '../../data/successTree'

/**
 * Builds the tree skeleton from the positions in src/data/successTree.ts: each root ends at
 * its value, each branch at its business area, and the trunk is a bundle of twisted strands
 * around a translucent core. Seeds are stable, so the shape never changes between visits.
 */
import { GROUND, HELIX, treeTimeline, TRUNK_BOTTOM, TRUNK_TOP } from './treeState'
import { helix } from '../dna/DNAParticles'
export { GROUND, TRUNK_BOTTOM, TRUNK_TOP }
const random = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value) }
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

export type Limb = {
  kind: 'root' | 'trunk' | 'branch'
  /** Highlight group: 0–7 roots, 8 trunk, 9–22 branches (see `groupOf`). */
  group: number
  curve: THREE.CatmullRomCurve3
  radius: number
  /** Main limb (null) or the parent limb index + fork position (0–1) for sub-limbs. */
  parent: { index: number; at: number } | null
  /** Formation window inside the global 0–1 progress (main limbs only). */
  window: [number, number]
}

export const roots = itemsOf('raizes')
export const branches = itemsOf('galhos')
export const fruits = itemsOf('frutos')
export const trunkItems = itemsOf('tronco')
export const TRUNK_GROUP = roots.length
export const groupCount = roots.length + 1 + branches.length
export const groupOf = (item: TreeItem) => item.region === 'raizes' ? roots.indexOf(item)
  : item.region === 'galhos' ? TRUNK_GROUP + 1 + branches.indexOf(item)
  : item.region === 'tronco' ? TRUNK_GROUP : -1

const trunkProfile: [number, number][] = [[-1.3, 1.1], [-1, .78], [-.55, .56], [0, .47], [.6, .44], [1.2, .46], [1.8, .52], [2.4, .66]]
export const trunkRadius = (y: number) => {
  for (let i = 1; i < trunkProfile.length; i++) {
    const [y1, r1] = trunkProfile[i], [y0, r0] = trunkProfile[i - 1]
    if (y <= y1) return THREE.MathUtils.lerp(r0, r1, (y - y0) / (y1 - y0))
  }
  return trunkProfile[trunkProfile.length - 1][1]
}

export function buildLimbs(detail: number) {
  const limbs: Limb[] = []
  const subLimbs = (index: number, count: number, salt: number, down: boolean) => {
    const parent = limbs[index]
    for (let k = 0; k < count; k++) {
      const r = (n: number) => random(salt * 31 + k * 7 + n)
      const at = .28 + r(0) * .5
      const start = parent.curve.getPointAt(at)
      const tangent = parent.curve.getTangentAt(at)
      const side = v(r(1) - .5, 0, r(2) - .5).multiplyScalar(1.6)
      const direction = tangent.clone().multiplyScalar(.7).add(side).add(v(0, down ? -.55 - r(3) * .6 : .45 + r(3) * .5, 0)).normalize()
      const length = (down ? .7 : .55) + r(4) * (down ? 1.1 : .8)
      const end = start.clone().addScaledVector(direction, length)
      if (down) end.y = Math.min(end.y, GROUND - .25)
      const middle = start.clone().lerp(end, .5).add(v((r(5) - .5) * .3, (r(6) - .5) * .25, (r(7) - .5) * .3))
      limbs.push({ kind: parent.kind, group: parent.group, curve: new THREE.CatmullRomCurve3([start, middle, end]), radius: parent.radius * .38, parent: { index, at }, window: parent.window })
    }
  }

  // Roots: from the crown under the trunk, outward and down to each value.
  const order = [...roots].sort((a, b) => Math.abs(a.position[0]) - Math.abs(b.position[0]))
  roots.forEach((item, i) => {
    const [x, y, z] = item.position
    const r = (n: number) => random(i * 13 + n)
    const crown = v(THREE.MathUtils.clamp(x * .09, -.55, .55), GROUND + .12, z * .14)
    const points = [crown, v(x * .3, GROUND - .35 - r(0) * .2, z * .4), v(x * .66 + (r(1) - .5) * .4, THREE.MathUtils.lerp(GROUND - .5, y, .62), z * .78), v(x, y, z)]
    const start = treeTimeline.roots[0] + order.indexOf(item) * .008
    limbs.push({ kind: 'root', group: i, curve: new THREE.CatmullRomCurve3(points), radius: .075, parent: null, window: [start, start + .18] })
    subLimbs(limbs.length - 1, detail + 1, i + 3, true)
  })

  // Trunk: twisted strands that flare into the roots and open towards the branches.
  const strands = 9 + detail * 2
  for (let k = 0; k < strands; k++) {
    const angle = k / strands * Math.PI * 2
    const points = trunkProfile.map(([y]) => {
      const twist = angle + (y - TRUNK_BOTTOM) * .42
      const radius = trunkRadius(y) * (.86 + random(k * 5 + y) * .14)
      return v(Math.cos(twist) * radius, y, Math.sin(twist) * radius * .9)
    })
    limbs.push({ kind: 'trunk', group: TRUNK_GROUP, curve: new THREE.CatmullRomCurve3(points), radius: .045, parent: null, window: [...treeTimeline.trunk] })
  }

  // Branches: from the top of the trunk, arching up to each business area.
  branches.forEach((item, i) => {
    const [x, y, z] = item.position
    const r = (n: number) => random(i * 17 + 101 + n)
    const baseY = THREE.MathUtils.clamp(1.35 + (y - 1.7) * .26 + r(0) * .2, 1.35, 2.35)
    const base = v(Math.sign(x || 1) * Math.min(.42, Math.abs(x) * .08), baseY, z * .12)
    const tip = v(x, y, z)
    const arch = Math.min(.9, .25 + Math.abs(x) * .1)
    const points = [base, base.clone().lerp(tip, .34).add(v(0, arch, 0)), base.clone().lerp(tip, .7).add(v((r(1) - .5) * .4, arch * .55, (r(2) - .5) * .4)), tip]
    const start = treeTimeline.branches[0] + (baseY - 1.35) * .06 + r(3) * .04
    limbs.push({ kind: 'branch', group: TRUNK_GROUP + 1 + i, curve: new THREE.CatmullRomCurve3(points), radius: .06, parent: null, window: [start, start + .2] })
    subLimbs(limbs.length - 1, detail + 1, i + 50, false)
  })
  return limbs
}

/** Tube with a radius that tapers from the base (1) to the tip (`end`). */
export function taperedTube(curve: THREE.Curve<THREE.Vector3>, radius: number, segments: number, radial: number, end = .25) {
  const geometry = new THREE.TubeGeometry(curve, segments, radius, radial, false)
  const position = geometry.attributes.position as THREE.BufferAttribute
  const centre = new THREE.Vector3(), point = new THREE.Vector3()
  for (let i = 0; i <= segments; i++) {
    curve.getPointAt(i / segments, centre)
    const scale = THREE.MathUtils.lerp(1, end, Math.pow(i / segments, .8))
    for (let j = 0; j <= radial; j++) {
      const index = i * (radial + 1) + j
      point.fromBufferAttribute(position, index).sub(centre).multiplyScalar(scale).add(centre)
      position.setXYZ(index, point.x, point.y, point.z)
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

/**
 * The particles that are first the DNA and then the tree. Each one has two homes:
 * - `aHelix`: a place in the double helix of the opening (strands and base-pair rungs,
 *   same helix as the intro DNA), lower particles at the bottom of the helix;
 * - `position`: its place in the tree (along a root, the trunk, a branch, or the crown).
 * `aSeed.w` is the flight order (bottom of the tree first), so the helix comes apart from
 * the base and builds the tree from the roots up.
 */
export function buildParticles(limbs: Limb[], structureCount: number, canopyCount: number) {
  const count = structureCount + canopyCount
  const branchLimbs = limbs.filter(limb => limb.kind === 'branch')
  const mainBranches = branchLimbs.filter(limb => !limb.parent)
  // Structure particles favour main limbs (weight 3) over the thin sub-limbs (weight 1).
  const weighted = limbs.flatMap((limb, index) => Array(limb.parent ? 1 : 3).fill(index) as number[])
  const position = new Float32Array(count * 3), helixPosition = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 4), info = new Float32Array(count * 2)
  const point = new THREE.Vector3(), from = new THREE.Vector3(), strand = new THREE.Vector3()
  const gauss = (i: number) => (random(i) + random(i + 1) + random(i + 2) - 1.5) / 1.5
  for (let i = 0; i < count; i++) {
    const r = (n: number) => random(i * 11 + n + 7000)
    let group: number
    if (i < structureCount) {
      const limb = limbs[weighted[Math.floor(r(0) * weighted.length)]]
      limb.curve.getPointAt(r(1), point)
      const spread = limb.radius * 1.4
      point.add(v((r(2) - .5) * spread, (r(3) - .5) * spread, (r(4) - .5) * spread))
      group = limb.group
    } else {
      const limb = branchLimbs[Math.floor(r(0) * branchLimbs.length)]
      const owner = limb.parent ? limbs[limb.parent.index] : limb
      limb.curve.getPointAt(.5 + r(1) * .5, from)
      if (r(2) < .78) point.copy(from).add(v(gauss(i * 3) * 1.05, gauss(i * 3 + 9) * .75 + .2, gauss(i * 3 + 17) * 1.05))
      else {
        // Volume of the crown, so it reads as one mass rather than separate tufts.
        const a = r(3) * Math.PI * 2, h = r(4) * 2 - 1, s = Math.cbrt(r(5))
        const ring = Math.sqrt(1 - h * h) * s
        point.set(Math.cos(a) * ring * 6.3, 4.2 + h * s * 2.3, Math.sin(a) * ring * 2.6)
      }
      point.y = Math.max(point.y, 1.9 + r(6) * .5)
      group = TRUNK_GROUP + 1 + mainBranches.indexOf(owner)
    }
    const order = THREE.MathUtils.clamp((point.y + 3.3) / 10.1 + (r(10) - .5) * .06, 0, 1)
    position.set(point.toArray(), i * 3)
    seeds.set([r(7), r(8), r(9), order], i * 4)
    info.set([group, i < structureCount ? 0 : 1], i * 2)
  }
  // Helix home: lower in the tree → lower in the helix. Placed by rank, so the DNA is evenly
  // dense like the opening one (the crown has far more particles than the roots).
  const ranked = Array.from({ length: count }, (_, i) => i).sort((a, b) => seeds[a * 4 + 3] - seeds[b * 4 + 3])
  ranked.forEach((i, rank) => {
    const r = (n: number) => random(i * 11 + n + 7000)
    const t = THREE.MathUtils.clamp(.02 + rank / count * .96 + (r(11) - .5) * .02, 0, 1)
    // 70% on the strands, the rest on the base-pair rungs.
    if (r(12) < .7) {
      strand.copy(helix(t, r(13) < .5 ? 0 : 1))
      const outward = v(strand.x, 0, strand.z).normalize(), angle = r(14) * Math.PI * 2, radius = Math.pow(r(15), .62) * .22
      strand.addScaledVector(outward, Math.cos(angle) * radius)
      strand.y += Math.sin(angle) * radius * .9
    } else {
      const beads = 15
      const u = (Math.floor(r(13) * beads) + .5) / beads
      strand.copy(helix(t, 0)).lerp(helix(t, 1), .1 + u * .8).add(v((r(14) - .5) * .05, (r(15) - .5) * .05, (r(16) - .5) * .05))
    }
    strand.multiplyScalar(HELIX.scale)
    strand.y += HELIX.y
    helixPosition.set(strand.toArray(), i * 3)
  })
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('aHelix', new THREE.BufferAttribute(helixPosition, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  geometry.setAttribute('aInfo', new THREE.BufferAttribute(info, 2))
  return geometry
}

/** Energy nodes along the main limbs (they light up with their group). */
export function buildNodes(limbs: Limb[], perLimb: number) {
  const mains = limbs.filter(limb => !limb.parent)
  const count = mains.length * perLimb
  const position = new Float32Array(count * 3), data = new Float32Array(count * 3)
  const point = new THREE.Vector3()
  mains.forEach((limb, l) => {
    for (let k = 0; k < perLimb; k++) {
      const i = l * perLimb + k, t = (k + random(i + 900) * .8) / perLimb
      limb.curve.getPointAt(Math.min(1, t), point)
      position.set(point.toArray(), i * 3)
      data.set([t, limb.group, random(i + 1300)], i * 3)
    }
  })
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('aData', new THREE.BufferAttribute(data, 3))
  return geometry
}

/** Background specks and the luminous ground disc where the roots meet the trunk. */
export function buildDust(count: number, ground: number) {
  const total = count + ground
  const position = new Float32Array(total * 3), seeds = new Float32Array(total * 4)
  for (let i = 0; i < total; i++) {
    const r = (n: number) => random(i * 7 + n + 20000)
    if (i < count) position.set([(r(0) - .5) * 30, -5 + r(1) * 15, -9 + r(2) * 12], i * 3)
    else {
      const a = r(0) * Math.PI * 2, d = Math.sqrt(r(1)) * 8
      position.set([Math.cos(a) * d, GROUND + (r(2) - .5) * .05, Math.sin(a) * d * .5], i * 3)
    }
    seeds.set([r(3), r(4), i < count ? 0 : 1, i < count ? r(5) * .5 : Math.min(1, Math.sqrt(r(1)) + .05)], i * 4)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  return geometry
}

/** Points used to hit-test a hovered element on screen (the whole limb, not just its tip). */
export function hitPoints(item: TreeItem, limbs: Limb[]) {
  const group = groupOf(item)
  if (item.region === 'raizes' || item.region === 'galhos') {
    const limb = limbs.find(entry => !entry.parent && entry.group === group)!
    return Array.from({ length: 9 }, (_, k) => limb.curve.getPointAt(.25 + k / 8 * .75))
  }
  return [v(...item.position)]
}
