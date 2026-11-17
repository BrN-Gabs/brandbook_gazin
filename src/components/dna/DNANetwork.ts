import * as THREE from 'three'
import type { DNAFrame, DNAPalette } from './DNAParticles'

const random = (i: number) => { const value = Math.sin(i * 91.7 + 47.3) * 43758.5453; return value - Math.floor(value) }

const nodeVertex = /* glsl */ `
  attribute float aSize, aAlpha;
  attribute vec3 color;
  uniform float uPixelRatio, uPresence;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    gl_PointSize = aSize * uPixelRatio;
    vColor = color;
    vAlpha = aAlpha * uPresence;
  }
`
const lineVertex = /* glsl */ `
  attribute float aAlpha;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vColor = color;
    vAlpha = aAlpha;
  }
`
const lineFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(vColor, vAlpha); }
`
const nodeFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float radius = length(gl_PointCoord - .5) * 2.;
    if (radius > 1.) discard;
    float glow = exp(-radius * radius * 5.) * .7 + exp(-radius * radius * 40.);
    gl_FragColor = vec4(vColor, min(1., glow) * vAlpha);
  }
`

// Nucleobase-like skeletons: a hexagon (pyrimidine) or a hexagon fused with a pentagon (purine),
// with a couple of side groups. Bonds as segment pairs, atoms as points, in local units.
function moleculeShape(purine: boolean, salt: number) {
  const atoms: THREE.Vector2[] = []
  const bonds: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + i * Math.PI / 3
    atoms.push(new THREE.Vector2(Math.cos(a), Math.sin(a)))
    bonds.push([i, (i + 1) % 6])
  }
  if (purine) {
    // Pentagon fused on the edge between atoms 0 and 5.
    const p0 = atoms[0], p5 = atoms[5]
    const mid = p0.clone().add(p5).multiplyScalar(.5)
    const out = mid.clone().normalize()
    const a = p0.clone().addScaledVector(out, .95).addScaledVector(p5.clone().sub(p0), -.12)
    const b = mid.clone().addScaledVector(out, 1.45)
    const c = p5.clone().addScaledVector(out, .95).addScaledVector(p5.clone().sub(p0), .12)
    atoms.push(a, b, c)
    bonds.push([0, 6], [6, 7], [7, 8], [8, 5])
  }
  const sides = 1 + Math.floor(random(salt) * 2)
  for (let s = 0; s < sides; s++) {
    const from = [1, 2, 3][Math.floor(random(salt + s + 1) * 3)]
    const direction = atoms[from].clone().normalize()
    atoms.push(atoms[from].clone().addScaledVector(direction, .85))
    bonds.push([from, atoms.length - 1])
  }
  return { atoms, bonds }
}

export function createDNANetwork(scene: THREE.Scene, gentle: boolean, palette: DNAPalette) {
  const color = new THREE.Color(palette.bright).lerp(new THREE.Color(palette.light), .2)
  const white = new THREE.Color(palette.white)
  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []
  const nodeUniforms = { uPixelRatio: { value: 1 }, uPresence: { value: 1 } }
  const nodeMaterial = new THREE.ShaderMaterial({ uniforms: nodeUniforms, vertexShader: nodeVertex, fragmentShader: nodeFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const lineMaterial = new THREE.ShaderMaterial({ vertexShader: lineVertex, fragmentShader: lineFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  materials.push(nodeMaterial, lineMaterial)

  // --- Plexus: drifting nodes that link to neighbours and reach out to the cursor.
  const nodeCount = gentle ? 34 : 72
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    x: random(i * 5) * 2.2 - 1.1, y: random(i * 5 + 1) * 2.2 - 1.1, z: -2.5 - random(i * 5 + 2) * 4,
    speed: .015 + random(i * 5 + 3) * .03, phase: random(i * 5 + 4) * Math.PI * 2, ox: 0, oy: 0, sx: 0, sy: 0,
  }))
  const maxSegments = nodeCount * 6
  const linePositions = new Float32Array(maxSegments * 6)
  const lineColors = new Float32Array(maxSegments * 6)
  const lineAlphas = new Float32Array(maxSegments * 2)
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage))
  lineGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(lineAlphas, 1).setUsage(THREE.DynamicDrawUsage))
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  const nodePositions = new Float32Array(nodeCount * 3)
  const nodeColors = new Float32Array(nodeCount * 3)
  const nodeSizes = new Float32Array(nodeCount)
  const nodeAlphas = new Float32Array(nodeCount)
  const nodeGeometry = new THREE.BufferGeometry()
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3).setUsage(THREE.DynamicDrawUsage))
  nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3).setUsage(THREE.DynamicDrawUsage))
  nodeGeometry.setAttribute('aSize', new THREE.BufferAttribute(nodeSizes, 1).setUsage(THREE.DynamicDrawUsage))
  nodeGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(nodeAlphas, 1).setUsage(THREE.DynamicDrawUsage))
  const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial)
  geometries.push(lineGeometry, nodeGeometry)

  // --- Floating nucleobase molecules, tumbling slowly and nudged by the cursor.
  const moleculeCount = gentle ? 5 : 10
  const molecules = Array.from({ length: moleculeCount }, (_, i) => {
    const { atoms, bonds } = moleculeShape(i % 2 === 0, i * 17)
    const bondPositions = new Float32Array(bonds.length * 6)
    bonds.forEach(([a, b], j) => bondPositions.set([atoms[a].x, atoms[a].y, 0, atoms[b].x, atoms[b].y, 0], j * 6))
    const bondGeometry = new THREE.BufferGeometry()
    bondGeometry.setAttribute('position', new THREE.BufferAttribute(bondPositions, 3))
    const bondMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .3, depthWrite: false, blending: THREE.AdditiveBlending })
    const atomGeometry = new THREE.BufferGeometry()
    atomGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(atoms.flatMap(atom => [atom.x, atom.y, 0])), 3))
    atomGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(atoms.flatMap(() => color.clone().lerp(white, .5).toArray())), 3))
    atomGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(atoms.map(() => .55)), 1))
    atomGeometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(atoms.map((_, k) => k < 6 ? 7 : 5)), 1))
    const group = new THREE.Group()
    group.add(new THREE.LineSegments(bondGeometry, bondMaterial), new THREE.Points(atomGeometry, nodeMaterial))
    // Keep them around the edges, away from the helix column and the main copy.
    const side = i % 2 ? 1 : -1
    const home = new THREE.Vector2(side * (.55 + random(i * 3 + 70) * .45), random(i * 3 + 71) * 1.8 - .9)
    const z = -1.5 - random(i * 3 + 72) * 4.5
    group.scale.setScalar(.22 + random(i * 3 + 73) * .2)
    geometries.push(bondGeometry, atomGeometry); materials.push(bondMaterial)
    scene.add(group)
    return { group, bondMaterial, home, z, phase: random(i * 7) * 6.28, ox: 0, oy: 0, spin: 0, spinVelocity: 0 }
  })

  scene.add(lines, nodePoints)
  const objects: THREE.Object3D[] = [lines, nodePoints, ...molecules.map(m => m.group)]
  let lastTime = 0

  return {
    update({ time, mouse, parallax, pixelRatio, aspect, reduced, state }: DNAFrame) {
      const delta = Math.min(.05, Math.max(0, time - lastTime))
      lastTime = time
      nodeUniforms.uPixelRatio.value = pixelRatio
      const halfHeight = (z: number) => Math.tan(THREE.MathUtils.degToRad(17.5)) * (14 - z)
      const strength = reduced ? 0 : mouse.strength
      const presence = state.ambient
      const ease = 1 - Math.exp(-delta * 5)
      nodeUniforms.uPresence.value = presence
      lines.visible = nodePoints.visible = presence > .005
      molecules.forEach(molecule => { molecule.group.visible = presence > .005 })

      // Nodes in normalized screen space (-1..1), mapped to world at their own depth.
      nodes.forEach((node, i) => {
        node.x += Math.cos(node.phase + time * .1) * node.speed * delta
        node.y += Math.sin(node.phase * 1.3 + time * .08) * node.speed * delta
        if (node.x > 1.15) node.x = -1.15; else if (node.x < -1.15) node.x = 1.15
        if (node.y > 1.15) node.y = -1.15; else if (node.y < -1.15) node.y = 1.15
        const dx = (node.x - mouse.x) * aspect, dy = node.y - mouse.y
        const distance = Math.hypot(dx, dy)
        const push = Math.max(0, 1 - distance / .38) ** 2 * .14 * strength
        node.ox += ((dx / (distance || 1)) * push / aspect - node.ox) * ease
        node.oy += ((dy / (distance || 1)) * push - node.oy) * ease
        node.sx = node.x + node.ox - parallax.x * .02
        node.sy = node.y + node.oy + parallax.y * .02
        const h = halfHeight(node.z)
        nodePositions.set([node.sx * h * aspect, node.sy * h, node.z], i * 3)
        const near = Math.max(0, 1 - distance / .3) * strength
        nodeSizes[i] = (2.5 + near * 5 + (i % 7 === 0 ? 2 : 0))
        nodeColors.set(color.clone().lerp(white, .3 + near * .7).toArray(), i * 3)
        nodeAlphas[i] = .4 + near * .6
      })

      let segments = 0
      const segment = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, intensity: number, tint: number) => {
        if (segments >= maxSegments) return
        linePositions.set([ax, ay, az, bx, by, bz], segments * 6)
        const c = color.clone().lerp(white, tint)
        lineColors.set([c.r, c.g, c.b, c.r, c.g, c.b], segments * 6)
        lineAlphas.set([intensity * presence, intensity * presence], segments * 2)
        segments++
      }
      const linkDistance = .3
      for (let a = 0; a < nodeCount; a++) {
        const na = nodes[a]
        for (let b = a + 1; b < nodeCount; b++) {
          const nb = nodes[b]
          const d = Math.hypot((na.sx - nb.sx) * aspect, na.sy - nb.sy)
          if (d < linkDistance) segment(nodePositions[a * 3], nodePositions[a * 3 + 1], nodePositions[a * 3 + 2], nodePositions[b * 3], nodePositions[b * 3 + 1], nodePositions[b * 3 + 2], (1 - d / linkDistance) * .22, 0)
        }
        // Threads from the cursor to nearby nodes.
        const dm = Math.hypot((na.sx - mouse.x) * aspect, na.sy - mouse.y)
        if (strength > .01 && dm < .42) {
          const h = halfHeight(na.z)
          segment(mouse.x * h * aspect, mouse.y * h, na.z, nodePositions[a * 3], nodePositions[a * 3 + 1], nodePositions[a * 3 + 2], (1 - dm / .42) * .65 * strength, .6)
        }
      }
      lineGeometry.setDrawRange(0, segments * 2)
      lineGeometry.attributes.position.needsUpdate = true
      lineGeometry.attributes.color.needsUpdate = true
      lineGeometry.attributes.aAlpha.needsUpdate = true
      nodeGeometry.attributes.position.needsUpdate = true
      nodeGeometry.attributes.color.needsUpdate = true
      nodeGeometry.attributes.aSize.needsUpdate = true
      nodeGeometry.attributes.aAlpha.needsUpdate = true

      molecules.forEach(molecule => {
        const h = halfHeight(molecule.z)
        const bob = reduced ? 0 : Math.sin(time * .3 + molecule.phase) * .03
        const sx = molecule.home.x + molecule.ox - parallax.x * .03
        const sy = molecule.home.y + molecule.oy + bob + parallax.y * .03
        const dx = (sx - mouse.x) * aspect, dy = sy - mouse.y
        const distance = Math.hypot(dx, dy)
        const push = Math.max(0, 1 - distance / .32) ** 2 * strength
        molecule.ox += ((dx / (distance || 1)) * push * .12 / aspect - molecule.ox) * ease * .6
        molecule.oy += ((dy / (distance || 1)) * push * .12 - molecule.oy) * ease * .6
        molecule.spinVelocity += (mouse.vx * dy - mouse.vy * dx) * push * delta * 2
        molecule.spinVelocity *= Math.exp(-delta * 1.5)
        molecule.spin += molecule.spinVelocity * delta
        molecule.group.position.set(sx * h * aspect, sy * h, molecule.z)
        molecule.group.rotation.set(time * .07 + molecule.phase, time * .11 + molecule.phase * 2, time * .05 + molecule.spin)
        molecule.bondMaterial.opacity = (.22 + push * .5) * presence
      })
    },
    dispose() {
      objects.forEach(object => object.removeFromParent())
      geometries.forEach(item => item.dispose())
      materials.forEach(item => item.dispose())
    },
  }
}
