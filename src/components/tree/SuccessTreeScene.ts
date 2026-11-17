import * as THREE from 'three'
import { overviewView, treeItems, treeRegion, treeRegions, type TreeRegionId, type TreeView } from '../../data/successTree'
import { FLIGHT, HELIX, ready, treeState, treeTimeline } from './treeState'
import { buildDust, buildLimbs, buildNodes, buildParticles, fruits, groupCount, groupOf, hitPoints, taperedTube, TRUNK_BOTTOM, TRUNK_GROUP, TRUNK_TOP, trunkRadius } from './treeStructure'
import * as glsl from './treeShaders'

export type TreeSceneView = { region: TreeRegionId | null; selected: string | null; panelOpen: boolean }
export type TreeScene = {
  setView(view: TreeSceneView): void
  /** Hover coming from an HTML label (null = none). */
  hover(id: string | null): void
  /** Back to the neutral camera (pointer parallax and lean cleared). */
  resetCamera(): void
  dispose(): void
}
type Options = {
  canvas: HTMLCanvasElement
  root: HTMLElement
  stage: HTMLElement
  reduced: boolean
  onSelect(id: string): void
  onFailure(): void
}

const FOV = 35
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const segment = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a))
const smooth = (t: number) => t * t * (3 - 2 * t)
/** Opening frame: the DNA helix, then the camera pulls back to the whole tree. */
const introView: TreeView = { center: [0, HELIX.y], size: [7.5, 10.4] }

/**
 * Árvore da Jornada de Sucesso — 3D scene (Three.js, one WebGL2 context, rendered only
 * while visible). Same language as the DNA: additive light on navy, custom shaders,
 * HTML labels re-projected every frame so text never deforms in perspective.
 */
export function createTreeScene({ canvas, root, stage, reduced, onSelect, onFailure }: Options): TreeScene {
  const hardware = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  let gentle = innerWidth < 768 || (hardware.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4 || !!hardware.connection?.saveData
  const context = canvas.getContext('webgl2', { alpha: true, antialias: !gentle, powerPreference: 'low-power' })
  if (!context) throw new Error('WebGL2 indisponível')
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: !gentle, powerPreference: 'low-power' })
  renderer.setClearColor(0, 0)
  renderer.setPixelRatio(Math.min(devicePixelRatio, gentle ? 1 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, .1, 200)
  const tree = new THREE.Group()
  scene.add(tree)

  // One colour source for 2D and 3D: the Gazin tokens (fallbacks = official HEX).
  const tokens = getComputedStyle(document.documentElement)
  const color = (name: string, fallback: string) => new THREE.Color(tokens.getPropertyValue(name).trim() || fallback)
  const palette = {
    blue: color('--gazin-blue', '#080EA0'), mid: color('--gazin-blue-mid', '#2444D5'), bright: color('--gazin-blue-bright', '#4169FE'),
    tint: color('--gazin-blue-tint', '#B9C8FF'), white: color('--gazin-white', '#FFFFFF'), green: color('--gazin-green', '#5DAF02'), orange: color('--gazin-orange', '#FD9C0F'),
  }

  const shared = { uTime: { value: 0 }, uMotion: { value: reduced ? 0 : 1 }, uPixel: { value: renderer.getPixelRatio() }, uScale: { value: 1 } }
  const disposables: { dispose(): void }[] = []
  const additive = (material: THREE.ShaderMaterial) => { material.transparent = true; material.depthWrite = false; material.blending = THREE.AdditiveBlending; disposables.push(material); return material }

  // ── Limbs: roots, trunk strands, branches (+ thinner sub-limbs) ──────────────────────────
  const groups = Array.from({ length: groupCount }, () => ({ uGlow: { value: 0 }, uDim: { value: 0 } }))
  const band = { uBand: { value: 0 }, uBandOn: { value: 0 } }
  const limbs = buildLimbs(gentle ? 0 : 1)
  const limbLayers = limbs.map(limb => {
    const main = !limb.parent
    const geometry = limb.kind === 'trunk' ? taperedTube(limb.curve, limb.radius, 56, 6, .85) : taperedTube(limb.curve, limb.radius, main ? 72 : 28, main ? 8 : 5, .2)
    const trunk = limb.kind === 'trunk'
    const material = additive(new THREE.ShaderMaterial({
      vertexShader: glsl.limbVertex, fragmentShader: glsl.limbFragment,
      uniforms: {
        uTime: shared.uTime, uMotion: shared.uMotion, uDraw: { value: 1 }, ...groups[limb.group],
        uOpacity: { value: main ? (trunk ? .8 : 1) : .62 }, uFlow: { value: limb.kind === 'root' ? 1 : -1 },
        uBand: trunk ? band.uBand : { value: 0 }, uBandOn: trunk ? band.uBandOn : { value: 0 }, uAlongY: { value: 0 },
        uColor: { value: trunk ? palette.mid : palette.bright }, uHot: { value: palette.white },
      },
    }))
    disposables.push(geometry)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    tree.add(mesh)
    return { limb, mesh, material, draw: 1 }
  })
  // Translucent trunk core: gives the bundle of strands its volume.
  const profile = Array.from({ length: 22 }, (_, i) => { const y = THREE.MathUtils.lerp(TRUNK_BOTTOM, TRUNK_TOP, i / 21); return new THREE.Vector2(trunkRadius(y) * .8, y) })
  const coreGeometry = new THREE.LatheGeometry(profile, gentle ? 20 : 32)
  disposables.push(coreGeometry)
  const coreMaterial = additive(new THREE.ShaderMaterial({
    vertexShader: glsl.limbVertex, fragmentShader: glsl.limbFragment,
    uniforms: { uTime: shared.uTime, uMotion: shared.uMotion, uDraw: { value: 1 }, ...groups[TRUNK_GROUP], uOpacity: { value: .34 }, uFlow: { value: -1 }, ...band, uAlongY: { value: 1 }, uColor: { value: palette.blue }, uHot: { value: palette.bright } },
    side: THREE.DoubleSide,
  }))
  tree.add(new THREE.Mesh(coreGeometry, coreMaterial))

  // ── DNA → tree particles, energy nodes, dust and ground ────────────────────────────────
  const groupDraw = new Array(groupCount).fill(1), groupGlow = new Array(groupCount).fill(0), groupDim = new Array(groupCount).fill(0)
  const particleGeometry = buildParticles(limbs, gentle ? 1400 : 3200, gentle ? 2600 : 6500)
  const particleMaterial = additive(new THREE.ShaderMaterial({
    vertexShader: glsl.particleVertex, fragmentShader: glsl.pointFragment, defines: { GROUPS: groupCount },
    uniforms: {
      ...shared, uProgress: { value: 1 }, uDim: { value: 0 }, uSize: { value: 9 }, uSpin: { value: 0 }, uHelixY: { value: HELIX.y },
      uFlight: { value: new THREE.Vector3(FLIGHT.start, FLIGHT.spread, FLIGHT.length) }, uGroupGlow: { value: groupGlow }, uGroupDim: { value: groupDim },
      uWind: { value: new THREE.Vector2() }, uBlue: { value: palette.mid }, uBright: { value: palette.bright }, uWhite: { value: palette.tint }, uGreen: { value: palette.green }, uIce: { value: palette.white },
    },
  }))
  const particles = new THREE.Points(particleGeometry, particleMaterial)
  particles.frustumCulled = false
  tree.add(particles)
  disposables.push(particleGeometry)

  const nodeGeometry = buildNodes(limbs, gentle ? 12 : 22)
  const nodeMaterial = additive(new THREE.ShaderMaterial({
    vertexShader: glsl.nodeVertex, fragmentShader: glsl.pointFragment, defines: { GROUPS: groupCount },
    uniforms: { ...shared, uGroupDraw: { value: groupDraw }, uGroupGlow: { value: groupGlow }, uGroupDim: { value: groupDim }, uBright: { value: palette.bright }, uWhite: { value: palette.white } },
  }))
  const nodes = new THREE.Points(nodeGeometry, nodeMaterial)
  nodes.frustumCulled = false
  tree.add(nodes)
  disposables.push(nodeGeometry)

  const dustGeometry = buildDust(gentle ? 320 : 700, gentle ? 500 : 1100)
  const dustMaterial = additive(new THREE.ShaderMaterial({
    vertexShader: glsl.dustVertex, fragmentShader: glsl.pointFragment,
    uniforms: { ...shared, uReveal: { value: 1 }, uRoots: { value: 1 }, uBright: { value: palette.bright }, uWhite: { value: palette.tint } },
  }))
  const dust = new THREE.Points(dustGeometry, dustMaterial)
  dust.frustumCulled = false
  tree.add(dust)
  disposables.push(dustGeometry)

  // ── Fruits: instanced spheres + halos ───────────────────────────────────────────────────
  const fruitGeometry = new THREE.IcosahedronGeometry(.27, gentle ? 2 : 3)
  const fruitColors = new Float32Array(fruits.length * 3), fruitStates = new Float32Array(fruits.length * 3)
  const fruitPositions = new Float32Array(fruits.length * 3)
  fruits.forEach((item, i) => {
    const tone = item.accent === 'orange' ? palette.orange : item.accent === 'green' ? palette.green : palette.bright.clone().lerp(palette.white, i % 3 === 0 ? .3 : .08)
    fruitColors.set([tone.r, tone.g, tone.b], i * 3)
    fruitPositions.set(item.position, i * 3)
  })
  fruitGeometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(fruitColors, 3))
  const fruitStateAttribute = new THREE.InstancedBufferAttribute(fruitStates, 3).setUsage(THREE.DynamicDrawUsage)
  fruitGeometry.setAttribute('aState', fruitStateAttribute)
  const fruitMaterial = additive(new THREE.ShaderMaterial({ vertexShader: glsl.fruitVertex, fragmentShader: glsl.fruitFragment, uniforms: { uTime: shared.uTime, uMotion: shared.uMotion, uWhite: { value: palette.white } } }))
  const fruitMesh = new THREE.InstancedMesh(fruitGeometry, fruitMaterial, fruits.length)
  const matrix = new THREE.Matrix4()
  fruits.forEach((item, i) => fruitMesh.setMatrixAt(i, matrix.makeTranslation(...item.position)))
  fruitMesh.frustumCulled = false
  tree.add(fruitMesh)
  disposables.push(fruitGeometry)
  const haloGeometry = new THREE.BufferGeometry()
  haloGeometry.setAttribute('position', new THREE.BufferAttribute(fruitPositions, 3))
  haloGeometry.setAttribute('aColor', new THREE.BufferAttribute(fruitColors, 3))
  const haloStateAttribute = new THREE.BufferAttribute(fruitStates, 3).setUsage(THREE.DynamicDrawUsage)
  haloGeometry.setAttribute('aState', haloStateAttribute)
  haloGeometry.setAttribute('aIndex', new THREE.BufferAttribute(new Float32Array(fruits.map((_, i) => i)), 1))
  const haloMaterial = additive(new THREE.ShaderMaterial({ vertexShader: glsl.haloVertex, fragmentShader: glsl.haloFragment, uniforms: { ...shared } }))
  const halos = new THREE.Points(haloGeometry, haloMaterial)
  halos.frustumCulled = false
  tree.add(halos)
  disposables.push(haloGeometry)

  // ── Interactive elements: labels (HTML) + screen-space hit points ──────────────────────
  const labelOf = new Map(Array.from(root.querySelectorAll<HTMLElement>('.tree-label[data-id]'), element => [element.dataset.id!, element]))
  const regionLabels = Array.from(root.querySelectorAll<HTMLElement>('.tree-region-label[data-region]'))
  const entries = treeItems.map(item => ({
    item, element: labelOf.get(item.id), anchor: new THREE.Vector3(...item.position), hits: hitPoints(item, limbs),
    group: groupOf(item), fruit: fruits.indexOf(item), trunk: item.region === 'tronco' ? treeItems.filter(other => other.region === 'tronco').indexOf(item) : -1,
    glow: 0, dim: 0, x: -999, y: -999, visible: false, cache: '',
  }))
  const hitScreen = entries.map(entry => new Float32Array(entry.hits.length * 2))

  let view: TreeSceneView = { region: null, selected: null, panelOpen: false }
  let labelHover: string | null = null, canvasHover: string | null = null
  const insets = { top: 0, right: 0, bottom: 0, left: 0 }
  let width = 1, height = 1
  const cam = { x: 0, y: 0, dist: 20, offX: 0, offY: 0, ready: false }
  const pointer = new THREE.Vector2(), smoothPointer = new THREE.Vector2()
  const mousePx = { x: -1, y: -1, inside: false }
  let frame = 0, visible = true, lost = false, disposed = false, lastTime = 0, time = 0, slowFrames = 0, measureFrame = 0

  /** Layout box relative to the page origin of the stage, ignoring CSS translations in progress. */
  const overlayRect = (selector: string) => {
    const element = root.querySelector<HTMLElement>(selector)
    if (!element || getComputedStyle(element).position !== 'absolute' || element.dataset.overlay === 'off') return null
    if (!element.offsetWidth || !element.offsetHeight || element.offsetParent !== stage.offsetParent) return null
    const left = element.offsetLeft - stage.offsetLeft, top = element.offsetTop - stage.offsetTop
    return { left, top, right: left + element.offsetWidth, bottom: top + element.offsetHeight, width: element.offsetWidth }
  }
  /** Areas of the stage covered by the heading, the region bar and the info panel. */
  const measure = () => {
    measureFrame = 0
    const box = { left: 0, top: 0, right: stage.offsetWidth, bottom: stage.offsetHeight, width: stage.offsetWidth }
    insets.top = insets.right = insets.bottom = insets.left = 0
    const overview = !view.region && !view.selected
    const head = overview ? overlayRect('.tree-head') : null
    if (head) {
      if (head.width < box.width * .5) insets.left = Math.max(0, head.right - box.left + 16)
      else insets.top = Math.max(0, head.bottom - box.top + 12)
    }
    const nav = overlayRect('.tree-nav')
    if (nav) insets.bottom = Math.max(0, box.bottom - nav.top + 10)
    const panel = view.panelOpen ? overlayRect('.tree-panel') : null
    if (panel) insets.right = Math.max(0, box.right - panel.left + 20)
    requestRender()
  }
  const scheduleMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure) }

  const resize = () => {
    width = canvas.clientWidth || 1
    height = canvas.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    shared.uScale.value = height / (2 * TAN) / 100
    widths.clear()
    measure()
  }

  const target = new THREE.Vector2(), size = new THREE.Vector2()
  /** Distance and offset that fit `box` (scene units) inside the uncovered part of the stage. */
  const frameView = (center: THREE.Vector2, box: THREE.Vector2) => {
    const w = Math.max(120, width - insets.left - insets.right), h = Math.max(120, height - insets.top - insets.bottom)
    const byHeight = box.y / (2 * TAN) * (height / h)
    // Region boxes include room for side labels; narrow screens show no side texts there.
    const boxWidth = box.x * (width < 768 && (view.region || view.selected) ? .8 : 1)
    const byWidth = boxWidth / (2 * TAN * camera.aspect) * (width / w)
    return { x: center.x, y: center.y, dist: Math.max(byHeight, byWidth) * 1.06, offX: -(insets.left - insets.right) / 2, offY: -(insets.top - insets.bottom) / 2 }
  }

  const projected = new THREE.Vector3()
  const project = (point: THREE.Vector3) => {
    projected.copy(point).applyMatrix4(tree.matrixWorld).project(camera)
    return [(projected.x + 1) / 2 * width, (1 - projected.y) / 2 * height, projected.z] as const
  }
  const nearest = (x: number, y: number) => {
    let best: string | null = null, bestDistance = Infinity
    entries.forEach((entry, i) => {
      if (!entry.visible) return
      const reach = entry.fruit >= 0 ? 30 : entry.trunk >= 0 ? 18 : 16
      const points = hitScreen[i]
      for (let k = 0; k < points.length; k += 2) {
        const distance = Math.hypot(points[k] - x, points[k + 1] - y)
        if (distance < reach && distance < bestDistance) { bestDistance = distance; best = entry.item.id }
      }
    })
    return best
  }

  const render = (now: number) => {
    frame = 0
    if (disposed || lost || document.hidden || !visible) return
    const rawDelta = lastTime ? (now - lastTime) / 1000 : 1 / 60
    const delta = Math.min(rawDelta, .05)
    lastTime = now
    if (!reduced) time += delta
    if (rawDelta > .034 && rawDelta < .15) slowFrames++
    if (!gentle && slowFrames > 90) { gentle = true; renderer.setPixelRatio(1); shared.uPixel.value = 1; root.dataset.quality = 'adaptive' }
    shared.uTime.value = time
    const ease = (rate: number) => reduced ? 1 : 1 - Math.exp(-delta * rate)
    const p = treeState.progress

    // Formation, driven by the scroll progress.
    limbLayers.forEach(layer => {
      const { limb } = layer
      layer.draw = limb.parent
        ? clamp01((limbLayers[limb.parent.index].draw - limb.parent.at) / (1 - limb.parent.at) * 1.3)
        : smooth(segment(p, limb.window))
      layer.material.uniforms.uDraw.value = layer.draw
      layer.mesh.visible = layer.draw > .001
      if (!limb.parent && limb.kind !== 'trunk') groupDraw[limb.group] = layer.draw
    })
    const trunkDraw = smooth(segment(p, treeTimeline.trunk))
    groupDraw[TRUNK_GROUP] = trunkDraw
    coreMaterial.uniforms.uDraw.value = trunkDraw
    particleMaterial.uniforms.uProgress.value = p
    // The helix turns like the opening DNA (and with the scroll), then lets go of its particles.
    particleMaterial.uniforms.uSpin.value = (reduced ? 0 : time * .35) + p * 5
    dustMaterial.uniforms.uReveal.value = segment(p, treeTimeline.dust)
    dustMaterial.uniforms.uRoots.value = segment(p, treeTimeline.roots)

    // Highlight: focused element glows, the rest of its context dims slightly.
    const focus = view.selected ?? labelHover ?? canvasHover
    const focusRegion = focus ? treeItems.find(item => item.id === focus)?.region ?? null : null
    entries.forEach(entry => {
      const own = entry.item.id === view.selected || entry.item.id === labelHover || entry.item.id === canvasHover
      const inRegion = view.region === entry.item.region
      const glow = own ? 1 : inRegion && !focus ? .32 : 0
      const dim = own ? 0 : view.region ? (inRegion ? (focus ? .35 : 0) : .78) : (focus ? (focusRegion === entry.item.region ? .45 : .3) : 0)
      entry.glow += (glow - entry.glow) * ease(9)
      entry.dim += (dim - entry.dim) * ease(7)
      if (entry.group >= 0 && entry.trunk < 0) { groupGlow[entry.group] = entry.glow; groupDim[entry.group] = entry.dim; groups[entry.group].uGlow.value = entry.glow; groups[entry.group].uDim.value = entry.dim }
      if (entry.fruit >= 0) fruitStates.set([smooth(segment(p, [treeTimeline.fruits[0] + entry.fruit * .01, treeTimeline.fruits[0] + .05 + entry.fruit * .01])), entry.glow, entry.dim], entry.fruit * 3)
    })
    const trunkEntries = entries.filter(entry => entry.trunk >= 0)
    const trunkFocus = trunkEntries.find(entry => entry.item.id === focus)
    const trunkGlow = view.region === 'tronco' && !focus ? .32 : trunkFocus ? .15 : 0
    const trunkDim = Math.min(...trunkEntries.map(entry => entry.dim))
    groups[TRUNK_GROUP].uGlow.value += (trunkGlow - groups[TRUNK_GROUP].uGlow.value) * ease(8)
    groups[TRUNK_GROUP].uDim.value = trunkDim
    groupGlow[TRUNK_GROUP] = groups[TRUNK_GROUP].uGlow.value + (trunkFocus ? .6 : 0)
    groupDim[TRUNK_GROUP] = trunkDim
    if (trunkFocus) band.uBand.value += (trunkFocus.anchor.y - band.uBand.value) * ease(10)
    band.uBandOn.value += ((trunkFocus ? 1 : 0) - band.uBandOn.value) * ease(8)
    const canopyDim = view.region ? (view.region === 'galhos' || view.region === 'frutos' ? .25 : .72) : focus && focusRegion !== 'galhos' ? .4 : 0
    particleMaterial.uniforms.uDim.value += (canopyDim - particleMaterial.uniforms.uDim.value) * ease(6)
    fruitStateAttribute.needsUpdate = true
    haloStateAttribute.needsUpdate = true

    // Camera: formation pull-back, region close-ups, a slight lean towards the hovered element.
    const selectedItem = view.selected ? treeItems.find(item => item.id === view.selected) : undefined
    const regionView = view.region ? treeRegion(view.region).view : selectedItem ? treeRegion(selectedItem.region).view : null
    if (regionView) {
      target.set(...regionView.center); size.set(...regionView.size)
      if (selectedItem) { target.lerp(new THREE.Vector2(selectedItem.position[0], selectedItem.position[1]), .3); size.multiplyScalar(.88) }
    } else {
      const k = smooth(segment(p, treeTimeline.camera))
      target.set(...introView.center).lerp(new THREE.Vector2(...overviewView.center), k)
      size.set(...introView.size).lerp(new THREE.Vector2(...overviewView.size), k)
    }
    const hovered = !selectedItem && (labelHover ?? canvasHover)
    const lean = hovered ? treeItems.find(item => item.id === hovered) : undefined
    if (lean && !reduced) target.lerp(new THREE.Vector2(lean.position[0], lean.position[1]), .025)
    const goal = frameView(target, size)
    const follow = cam.ready ? ease(2.8) : 1
    cam.x += (goal.x - cam.x) * follow; cam.y += (goal.y - cam.y) * follow; cam.dist += (goal.dist - cam.dist) * follow
    cam.offX += (goal.offX - cam.offX) * follow; cam.offY += (goal.offY - cam.offY) * follow
    cam.ready = true
    camera.position.set(cam.x, cam.y, cam.dist)
    camera.lookAt(cam.x, cam.y, 0)
    camera.setViewOffset(width, height, cam.offX, cam.offY, width, height)

    // The tree breathes and follows the cursor, never enough to hurt reading.
    smoothPointer.lerp(pointer, ease(3))
    tree.rotation.y = reduced ? 0 : smoothPointer.x * .16 + Math.sin(time * .11) * .06
    tree.rotation.x = reduced ? 0 : smoothPointer.y * .035
    particleMaterial.uniforms.uWind.value.set(smoothPointer.x, smoothPointer.y)

    renderer.render(scene, camera)
    tree.updateMatrixWorld()
    placeLabels(p, focus)
    if (mousePx.inside) {
      const found = nearest(mousePx.x, mousePx.y)
      if (found !== canvasHover) { canvasHover = found; stage.style.cursor = found ? 'pointer' : ''; root.dataset.hovered = found ?? '' }
    }
    if (import.meta.env.DEV) {
      canvas.dataset.progress = p.toFixed(3)
      canvas.dataset.frame = String(renderer.info.render.frame)
      canvas.dataset.distance = cam.dist.toFixed(2)
    }
    const settling = Math.abs(goal.dist - cam.dist) > .01 || Math.abs(goal.x - cam.x) > .005 || Math.abs(goal.y - cam.y) > .005
    if (!reduced || settling) frame = requestAnimationFrame(render)
  }

  const trunkCentre = new THREE.Vector3()
  // Text widths are measured once (and again after a resize), never every frame.
  const widths = new Map<string, number>()
  const textWidth = (key: string, element: HTMLElement) => {
    let value = widths.get(key)
    if (!value) {
      value = (element.querySelector<HTMLElement>('.tree-label-text') ?? element).offsetWidth
      if (value) widths.set(key, value)
    }
    return value ?? 0
  }
  function placeLabels(p: number, focus: string | null) {
    const [centreX] = project(trunkCentre.set(0, 1, 0))
    entries.forEach((entry, i) => {
      const { item, element } = entry
      const formed = p >= ready[item.region]
      const own = item.id === focus
      const [x, y, z] = project(entry.anchor)
      entry.hits.forEach((point, k) => { const [hx, hy] = project(point); hitScreen[i][k * 2] = hx; hitScreen[i][k * 2 + 1] = hy })
      const inside = x > 4 && x < width - 4 && y > 4 && y < height - 4 && z < 1
      // Narrow overview: no points (the small tree would be buried under them); regions open them.
      const listed = view.region ? view.region === item.region : width >= 768
      entry.visible = formed && inside && (listed || own)
      if (!element) return
      // Names only on hover/selection, or for the chosen region on wide screens (on phones they would cover other points).
      const show = entry.visible && (own || (view.region === item.region && width >= 768))
      // Selected (clicked) element: its name is enlarged in the tree; hover only highlights.
      const state = item.id === view.selected ? 'selected' : own ? 'focus' : entry.dim > .3 ? 'dim' : ''
      let side = entry.trunk >= 0 ? (entry.trunk % 2 ? 'left' : 'right') : x < centreX ? 'left' : 'right'
      // Text never leaves the stage: flip to the other side when the preferred one is too narrow.
      const text = textWidth(entry.item.id, element) + 28
      if (side === 'left' && x - text < 4 && x + text < width - 4) side = 'right'
      else if (side === 'right' && x + text > width - 4 && x - text > 4) side = 'left'
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      const cache = `${entry.visible}|${show}|${state}|${side}`
      if (cache === entry.cache) return
      entry.cache = cache
      element.dataset.visible = String(entry.visible)
      element.dataset.show = String(show)
      element.dataset.state = state
      element.dataset.side = side
    })
    regionLabels.forEach(element => {
      const region = treeRegions.find(entry => entry.id === element.dataset.region)!
      const [px, y] = project(trunkCentre.set(...region.labelPosition))
      const half = textWidth(`region-${region.id}`, element) / 2 + 6
      const x = Math.min(width - half, Math.max(half, px))
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      const show = String(!view.region && !view.selected && !focus && p >= ready[region.id])
      if (element.dataset.visible !== show) element.dataset.visible = show
    })
  }

  function requestRender() { if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(render) }

  const move = (event: PointerEvent) => {
    const box = stage.getBoundingClientRect()
    if (event.pointerType === 'mouse') {
      mousePx.x = event.clientX - box.left; mousePx.y = event.clientY - box.top; mousePx.inside = true
      // While an element is hovered the parallax holds still, so it stays under the cursor.
      if (!reduced && !labelHover && !canvasHover) pointer.set((event.clientX - box.left) / box.width * 2 - 1, (event.clientY - box.top) / box.height * 2 - 1)
    }
    requestRender()
  }
  const leave = () => {
    mousePx.inside = false; pointer.set(0, 0)
    if (canvasHover) { canvasHover = null; stage.style.cursor = ''; root.dataset.hovered = '' }
    requestRender()
  }
  const click = (event: MouseEvent) => {
    const box = stage.getBoundingClientRect()
    const found = nearest(event.clientX - box.left, event.clientY - box.top)
    if (found) onSelect(found)
  }
  const onProgress = () => requestRender()
  const observer = new IntersectionObserver(observed => {
    visible = observed[0].isIntersecting
    if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0 }
    else requestRender()
  })
  observer.observe(stage)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const onVisibility = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; requestRender() }
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); onFailure() }
  stage.addEventListener('pointermove', move, { passive: true })
  stage.addEventListener('pointerleave', leave)
  canvas.addEventListener('click', click)
  canvas.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', onVisibility)
  addEventListener('tree:progress', onProgress)
  resize()
  render(performance.now())

  return {
    setView(next) {
      view = next
      if (view.selected) canvasHover = null
      cancelAnimationFrame(measureFrame); measureFrame = 0
      scheduleMeasure()
      requestRender()
    },
    hover(id) { labelHover = id; requestRender() },
    resetCamera() { pointer.set(0, 0); labelHover = null; canvasHover = null; requestRender() },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measureFrame)
      observer.disconnect()
      resizeObserver.disconnect()
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('click', click)
      canvas.removeEventListener('webglcontextlost', contextLost)
      document.removeEventListener('visibilitychange', onVisibility)
      removeEventListener('tree:progress', onProgress)
      stage.style.cursor = ''
      entries.forEach(({ element }) => { if (element) { element.style.removeProperty('transform'); ['visible', 'show', 'state', 'side'].forEach(key => delete element.dataset[key]) } })
      regionLabels.forEach(element => { element.style.removeProperty('transform'); delete element.dataset.visible })
      disposables.forEach(item => item.dispose())
      renderer.dispose()
    },
  }
}
