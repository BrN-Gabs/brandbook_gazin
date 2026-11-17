import * as THREE from 'three'
import { createDNAParticles, helix, type DNAFrame, type DNAMouse, type DNAPalette } from './DNAParticles'
import { createDNANetwork } from './DNANetwork'
import { createDNAEnergy } from './DNAEnergy'
import type { DNAState } from './DNAScrollController'

export type DNAScene = {
  /** Hands the opening light over from the DOM (viewport px) to the 3D scene. */
  ignite(clientX: number, clientY: number): void
  dispose(): void
}

export function createDNACanvas(canvas: HTMLCanvasElement, root: HTMLElement, state: DNAState, reduced: boolean, onFailure: () => void): DNAScene {
  const hardware = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  let gentle = innerWidth < 768 || (hardware.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4 || !!hardware.connection?.saveData
  const context = canvas.getContext('webgl2', { alpha: true, antialias: !gentle, powerPreference: 'low-power' })
  if (!context) throw new Error('WebGL2 indisponível')
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: !gentle, powerPreference: 'low-power' })
  renderer.setClearColor(0, 0)
  renderer.setPixelRatio(Math.min(devicePixelRatio, gentle ? 1 : 1.65))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 60)
  camera.position.z = 14
  const base = new THREE.Group()
  const organic = new THREE.Group()
  base.add(organic)
  scene.add(base)
  // One colour source for 2D and 3D: the Gazin tokens in globals.css (fallbacks = official HEX).
  const tokens = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string) => tokens.getPropertyValue(name).trim() || fallback
  const palette: DNAPalette = {
    blue: token('--gazin-blue', '#080EA0'), bright: token('--gazin-blue-bright', '#4169FE'),
    mid: token('--gazin-blue-mid', '#2444D5'), light: token('--gazin-blue-light', '#DCE5FF'), white: token('--gazin-white', '#FFFFFF'),
  }
  const particles = createDNAParticles(organic, scene, gentle, palette)
  const network = createDNANetwork(scene, gentle, palette)
  const energy = createDNAEnergy(organic, scene, gentle, palette)
  const stage = canvas.parentElement

  // DNA trait hotspots: HTML buttons anchored to points on the strands, alternating
  // between them from top to bottom, re-projected to screen space every frame.
  const hotspotLayer = root.querySelector<HTMLElement>('.dna-hotspots')
  const hotspots = Array.from(root.querySelectorAll<HTMLElement>('.dna-hotspot'))
  const anchors = hotspots.map((_, i) => {
    const t = .9 - i * (.8 / Math.max(1, hotspots.length - 1))
    return { point: helix(t, i % 2), axis: new THREE.Vector3(0, (t - .5) * 9.4, 0), t }
  })
  const projected = new THREE.Vector3()
  const axisPoint = new THREE.Vector3()
  const viewPoint = new THREE.Vector3()
  const viewAxis = new THREE.Vector3()
  let hovering = false, speed = 1, spin = 0
  const hoverOn = () => { hovering = true }
  const hoverOff = () => { hovering = false }
  hotspots.forEach(spot => {
    spot.addEventListener('pointerenter', hoverOn)
    spot.addEventListener('pointerleave', hoverOff)
    spot.addEventListener('focus', hoverOn)
    spot.addEventListener('blur', hoverOff)
  })
  const placeHotspots = () => {
    if (!hotspotLayer) return
    const presence = THREE.MathUtils.clamp((state.opacity - .35) / .5, 0, 1) * state.entrance
    hotspotLayer.style.opacity = presence.toFixed(3)
    hotspotLayer.dataset.active = presence > .3 ? 'true' : 'false'
    organic.updateMatrixWorld()
    anchors.forEach(({ point, axis, t }, i) => {
      const spot = hotspots[i]
      // Points are born one at a time from the base up (state.traits staggers them ~0.2 s
      // apart), never before the fragmentation wave has formed the particles at their height.
      const born = state.traits >= 1 || (state.formation >= t * .72 + .22 && state.traits >= (t - .1) / .8 * .97)
      projected.copy(point).applyMatrix4(organic.matrixWorld)
      axisPoint.copy(axis).applyMatrix4(organic.matrixWorld)
      viewPoint.copy(projected).applyMatrix4(camera.matrixWorldInverse)
      viewAxis.copy(axisPoint).applyMatrix4(camera.matrixWorldInverse)
      const radius = Math.max(.0001, projected.distanceTo(axisPoint))
      const front = THREE.MathUtils.clamp((viewPoint.z - viewAxis.z) / radius, -1, 1)
      if (born && spot.dataset.born !== 'true') {
        spot.dataset.born = 'true'
        if (!reduced && state.traits < 1) energy.burst(projected)
      }
      projected.project(camera)
      axisPoint.project(camera)
      const x = (projected.x + 1) / 2 * width
      const y = (1 - projected.y) / 2 * viewportHeight
      const inside = x > 8 && x < width - 8 && y > 8 && y < viewportHeight - 8
      spot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      spot.style.setProperty('--front', ((front + 1) / 2).toFixed(3))
      const side = projected.x < axisPoint.x ? 'left' : 'right'
      if (spot.dataset.side !== side) spot.dataset.side = side
      const hidden = inside ? 'false' : 'true'
      if (spot.dataset.hidden !== hidden) spot.dataset.hidden = hidden
    })
  }

  let width = 1, viewportHeight = 1, mobile = false
  let frame = 0, visible = true, lost = false, disposed = false
  let lastTime = 0, time = 0, slowFrames = 0
  const pointer = new THREE.Vector2()
  const smoothPointer = new THREE.Vector2()
  // Interaction cursor: follows quickly (NDC, y up), carries velocity and fades in/out.
  const mouse: DNAMouse = { x: 9, y: 9, vx: 0, vy: 0, strength: 0 }
  const mouseTarget = new THREE.Vector2(9, 9)
  let mouseInside = false, mouseSeen = false
  const resize = () => {
    width = canvas.clientWidth
    viewportHeight = canvas.clientHeight
    mobile = width < 768
    renderer.setSize(width, viewportHeight, false)
    camera.aspect = width / viewportHeight
    camera.updateProjectionMatrix()
    requestRender()
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || reduced) return
    const x = event.clientX / width * 2 - 1, y = event.clientY / viewportHeight * 2 - 1
    // While a trait is hovered, parallax holds still so the point stays under the cursor.
    if (!hovering) pointer.set(x, y)
    mouseTarget.set(x, -y)
    if (!mouseSeen) { mouse.x = mouseTarget.x; mouse.y = mouseTarget.y; mouseSeen = true }
    mouseInside = true
    requestRender()
  }
  const resetPointer = () => { pointer.set(0, 0); mouseInside = false }
  const render = (now: number) => {
    frame = 0
    if (disposed || lost || document.hidden || !visible) return
    const rawDelta = lastTime ? (now - lastTime) / 1000 : 1 / 60
    const delta = Math.min(rawDelta, .05)
    lastTime = now
    // Hovering a trait eases the helix's own rotation to a stop; particles keep living.
    speed += ((hovering ? 0 : 1) - speed) * (1 - Math.exp(-delta * 8))
    if (!reduced) { time += delta; spin += delta * speed }
    if (rawDelta > .034 && rawDelta < .15) slowFrames++
    if (!gentle && slowFrames > 75) {
      gentle = true
      renderer.setPixelRatio(1)
      particles.simplify()
      root.dataset.quality = 'adaptive'
    }
    smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 4))
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(35) / 2) * camera.position.z
    base.position.set(mobile ? 0 : state.x * viewHeight * camera.aspect * state.entrance, mobile ? 2.5 : state.y, 0)
    const scale = mobile ? .33 : Math.min(1, camera.aspect / 1.3)
    base.scale.setScalar(state.scale * scale * (.87 + .13 * state.entrance))
    base.rotation.set(0, state.turn, mobile ? -.18 : state.tilt * state.entrance)
    organic.rotation.set(reduced ? 0 : Math.sin(spin * .23) * .045 + smoothPointer.y * .055, reduced ? .3 : spin * .075 + smoothPointer.x * .18, 0)
    organic.position.y = reduced ? 0 : Math.sin(spin * .6) * .055
    const follow = 1 - Math.exp(-delta * 14)
    const nx = mouse.x + (mouseTarget.x - mouse.x) * follow, ny = mouse.y + (mouseTarget.y - mouse.y) * follow
    const velocity = 1 - Math.exp(-delta * 8)
    mouse.vx += (THREE.MathUtils.clamp((nx - mouse.x) / delta, -4, 4) - mouse.vx) * velocity
    mouse.vy += (THREE.MathUtils.clamp((ny - mouse.y) / delta, -4, 4) - mouse.vy) * velocity
    mouse.x = nx; mouse.y = ny
    mouse.strength += ((mouseInside && !reduced ? 1 : 0) - mouse.strength) * (1 - Math.exp(-delta * 3))
    const frameData: DNAFrame = { time, state, parallax: smoothPointer, mouse, pixelRatio: renderer.getPixelRatio(), height: viewportHeight, aspect: camera.aspect, viewHeight, reduced }
    particles.update(frameData)
    network.update(frameData)
    energy.update(state, time, renderer.getPixelRatio(), viewportHeight)
    if (stage) {
      stage.style.setProperty('--ambient', state.ambient.toFixed(3))
      stage.style.setProperty('--mx', `${((mouse.x + 1) / 2 * 100).toFixed(2)}%`)
      stage.style.setProperty('--my', `${((1 - mouse.y) / 2 * 100).toFixed(2)}%`)
      stage.style.setProperty('--glow', mouse.strength.toFixed(3))
    }
    renderer.render(scene, camera)
    placeHotspots()
    if (import.meta.env.DEV) {
      canvas.dataset.particleTime = time.toFixed(3)
      canvas.dataset.turn = state.turn.toFixed(4)
      canvas.dataset.pointer = smoothPointer.x.toFixed(3)
      canvas.dataset.formation = state.formation.toFixed(3)
      canvas.dataset.frame = String(renderer.info.render.frame)
    }
    if (!reduced) frame = requestAnimationFrame(render)
  }
  function requestRender() { if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(render) }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0 }
    else requestRender()
  })
  observer.observe(root)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const visibility = () => {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0
    requestRender()
  }
  const contextLost = (event: Event) => {
    event.preventDefault()
    lost = true
    cancelAnimationFrame(frame)
    onFailure()
  }
  window.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerleave', resetPointer)
  document.addEventListener('visibilitychange', visibility)
  canvas.addEventListener('webglcontextlost', contextLost)
  resize()
  // First frame is actually rendered before the loader reports scene readiness.
  cancelAnimationFrame(frame); frame = 0; render(performance.now())
  function dispose() {
    disposed = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    resizeObserver.disconnect()
    window.removeEventListener('pointermove', move)
    document.removeEventListener('pointerleave', resetPointer)
    document.removeEventListener('visibilitychange', visibility)
    canvas.removeEventListener('webglcontextlost', contextLost)
    hotspots.forEach(spot => {
      spot.removeEventListener('pointerenter', hoverOn)
      spot.removeEventListener('pointerleave', hoverOff)
      spot.removeEventListener('focus', hoverOn)
      spot.removeEventListener('blur', hoverOff)
      spot.style.removeProperty('transform'); spot.style.removeProperty('--front'); delete spot.dataset.born
    })
    hotspotLayer?.removeAttribute('style')
    particles.dispose()
    network.dispose()
    energy.dispose()
    ;['--mx', '--my', '--glow', '--ambient'].forEach(name => stage?.style.removeProperty(name))
    renderer.dispose()
  }
  const ray = new THREE.Vector3()
  return {
    ignite(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      ray.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height * 2 - 1), .5).unproject(camera).sub(camera.position).normalize()
      // Intersect with the z = 0 plane, where the helix lives.
      energy.ignite(camera.position.clone().addScaledVector(ray, -camera.position.z / ray.z))
      requestRender()
    },
    dispose,
  }
}
