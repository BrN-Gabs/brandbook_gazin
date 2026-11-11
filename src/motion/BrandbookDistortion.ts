let nextDistortionId = 0
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

/** A fixed grid stores directional pointer impulses; each cell relaxes independently.
 * The SVG displaces the original DOM text, preserving its font, layout and semantics.
 */
export function createBrandbookDistortion() {
  const title = document.querySelector<HTMLElement>('#introduction-title')
  if (!title) return { reset() {}, destroy() {} }
  const originalFilter = title.style.getPropertyValue('filter')
  const originalPriority = title.style.getPropertyPriority('filter')
  const id = `brandbook-distortion-${++nextDistortionId}`
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('brandbook-distortion-definitions')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `<defs><filter id="${id}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feImage x="0" y="0" preserveAspectRatio="none" result="displacement"/>
    <feDisplacementMap in="SourceGraphic" in2="displacement" scale="0" xChannelSelector="R" yChannelSelector="G"/>
  </filter></defs>`
  const filter = svg.querySelector('filter')!
  const map = svg.querySelector('feImage')!
  const displacement = svg.querySelector('feDisplacementMap')!
  document.body.append(svg)

  let bounds = title.getBoundingClientRect()
  let cellSize = 20
  let columns = 0
  let rows = 0
  let radius = 150
  let maxOffset = 70
  let offsetsX = new Float32Array(0)
  let offsetsY = new Float32Array(0)
  let lastPointer: { x: number; y: number } | undefined
  let inside = false
  let disposed = false
  let applied = false
  let frame = 0
  let previousTime = 0

  function reset() {
    inside = false
    lastPointer = undefined
    previousTime = 0
    cancelAnimationFrame(frame)
    frame = 0
    offsetsX.fill(0)
    offsetsY.fill(0)
    displacement.setAttribute('scale', '0')
    if (!applied) return
    if (originalFilter) title!.style.setProperty('filter', originalFilter, originalPriority)
    else title!.style.removeProperty('filter')
    applied = false
  }

  function measure() {
    bounds = title!.getBoundingClientRect()
    const fontSize = parseFloat(getComputedStyle(title!).fontSize)
    cellSize = Math.max(12, Math.min(24, fontSize * 0.1))
    radius = Math.max(90, Math.min(200, fontSize * 0.95))
    maxOffset = Math.max(28, Math.min(132, fontSize * 0.65))
    columns = Math.ceil(bounds.width / cellSize)
    rows = Math.ceil(bounds.height / cellSize)
    offsetsX = new Float32Array(columns * rows)
    offsetsY = new Float32Array(columns * rows)
    filter.setAttribute('x', '0')
    filter.setAttribute('y', '0')
    filter.setAttribute('width', String(bounds.width))
    filter.setAttribute('height', String(bounds.height))
    map.setAttribute('width', String(bounds.width))
    map.setAttribute('height', String(bounds.height))
  }

  function render(now: number) {
    frame = 0
    if (disposed || document.hidden) return
    const delta = Math.min(64, previousTime ? now - previousTime : 16)
    previousTime = now
    const decay = Math.exp(-delta / 240)
    const tiles: string[] = []
    let energy = 0
    for (let index = 0; index < offsetsX.length; index++) {
      const dx = offsetsX[index] *= decay
      const dy = offsetsY[index] *= decay
      energy = Math.max(energy, Math.abs(dx), Math.abs(dy))
      if (Math.abs(dx) + Math.abs(dy) < 0.2) continue
      // 50% is exactly neutral. Negative sampling offsets pull the letters with the pointer.
      const red = 50 - dx / maxOffset * 50
      const green = 50 - dy / maxOffset * 50
      tiles.push(`<rect x="${index % columns * cellSize}" y="${Math.floor(index / columns) * cellSize}" width="${cellSize}" height="${cellSize}" fill="rgb(${red.toFixed(2)}%,${green.toFixed(2)}%,50%)"/>`)
    }
    if (energy < 0.2) {
      // Keep the last pointer sample while resting so the next movement has no jump.
      const pointer = lastPointer
      const wasInside = inside
      reset()
      lastPointer = pointer
      inside = wasInside
      return
    }
    const texture = `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" shape-rendering="crispEdges"><path fill="rgb(50%,50%,50%)" d="M0 0H${bounds.width}V${bounds.height}H0Z"/>${tiles.join('')}</svg>`
    map.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(texture)}`)
    displacement.setAttribute('scale', String(maxOffset * 2))
    if (!applied) { title!.style.filter = `url(#${id})`; applied = true }
    frame = requestAnimationFrame(render)
  }

  function impulse(x: number, y: number, dx: number, dy: number) {
    for (let row = Math.max(0, Math.floor((y - radius) / cellSize)); row < Math.min(rows, Math.ceil((y + radius) / cellSize)); row++) {
      for (let column = Math.max(0, Math.floor((x - radius) / cellSize)); column < Math.min(columns, Math.ceil((x + radius) / cellSize)); column++) {
        const distance = Math.hypot((column + 0.5) * cellSize - x, (row + 0.5) * cellSize - y)
        if (distance >= radius) continue
        const influence = (1 - distance / radius) ** 2 * 4.2
        const index = row * columns + column
        offsetsX[index] = clamp(offsetsX[index] + dx * influence, maxOffset)
        offsetsY[index] = clamp(offsetsY[index] + dy * influence, maxOffset)
      }
    }
  }

  function onMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const previous = lastPointer
    if (!inside) { bounds = title!.getBoundingClientRect(); inside = true }
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    // A fresh entry gives a small initial response; subsequent cuts follow actual direction/speed.
    const dx = previous ? clamp(event.clientX - previous.x, 48) : 8
    const dy = previous ? clamp(event.clientY - previous.y, 48) : 0
    impulse(x, y, dx, dy)
    lastPointer = { x: event.clientX, y: event.clientY }
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(render)
  }
  function onLeave() { inside = false; lastPointer = undefined }
  const resize = new ResizeObserver(() => { reset(); measure() })
  resize.observe(title)
  measure()
  title.addEventListener('pointermove', onMove)
  title.addEventListener('pointerleave', onLeave)
  window.addEventListener('scroll', reset, { passive: true })
  window.addEventListener('blur', reset)
  document.addEventListener('visibilitychange', reset)

  return {
    reset,
    destroy() {
      disposed = true
      reset()
      resize.disconnect()
      title.removeEventListener('pointermove', onMove)
      title.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', reset)
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', reset)
      svg.remove()
    },
  }
}
