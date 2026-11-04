let nextFilterId = 0

export function introHoverTarget(element: Element | null) {
  return element?.closest<HTMLElement>('.hero-title-motion, .hero-logo, .intro-letter, .introduction h3, .introduction .body-copy')?.closest<HTMLElement>('.hero-title-motion, .hero-logo, #introduction-title, .introduction h3, .introduction .body-copy') ?? null
}

// One local filter and one halftone overlay follow the existing pointer ticker.
// The source text/image remains in the DOM; no duplicate accessible content.
export function createIntroHoverEffect() {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-motion-light').trim()
  const id = `intro-hover-${++nextFilterId}`
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.classList.add('intro-hover-definitions')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `<defs><filter id="${id}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feImage width="240" height="240" result="spot" />
    <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 1 1 0 -1.6" result="ink" />
    <feFlood flood-color="${color}" result="blue" />
    <feComposite in="blue" in2="ink" operator="in" result="blueInk" />
    <feComposite in="blueInk" in2="spot" operator="in" result="litInk" />
    <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="litInk" /></feMerge>
  </filter></defs>`
  const filter = svg.querySelector('filter')!
  const spot = svg.querySelector('feImage')!
  const mask = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><radialGradient id="spot"><stop offset="0" stop-color="white" stop-opacity=".95"/><stop offset=".35" stop-color="white" stop-opacity=".8"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect width="240" height="240" fill="url(#spot)"/></svg>'
  spot.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(mask)}`)
  const overlay = document.createElement('span')
  overlay.className = 'intro-hover-effect'
  overlay.setAttribute('aria-hidden', 'true')
  document.body.append(svg, overlay)

  let target: HTMLElement | null = null
  let originalFilter = ''
  let originalPriority = ''

  function restoreTarget() {
    if (!target) return
    if (originalFilter) target.style.setProperty('filter', originalFilter, originalPriority)
    else target.style.removeProperty('filter')
    target = null
  }

  function update(x: number, y: number, nextTarget: HTMLElement | null, presence: number) {
    if (target !== nextTarget) {
      restoreTarget()
      target = nextTarget
      if (target) {
        originalFilter = target.style.getPropertyValue('filter')
        originalPriority = target.style.getPropertyPriority('filter')
        target.style.filter = `url(#${id})`
      }
    }
    overlay.style.opacity = target ? String(presence) : '0'
    overlay.style.transform = `translate3d(${x - 120}px, ${y - 120}px, 0)`
    if (!target) return
    const rect = target.getBoundingClientRect()
    filter.setAttribute('x', '-30')
    filter.setAttribute('y', '-30')
    filter.setAttribute('width', String(rect.width + 60))
    filter.setAttribute('height', String(rect.height + 60))
    spot.setAttribute('x', String(x - rect.left - 120))
    spot.setAttribute('y', String(y - rect.top - 120))
  }

  return {
    update,
    reset() { restoreTarget(); overlay.style.opacity = '0' },
    destroy() { restoreTarget(); overlay.remove(); svg.remove() },
  }
}
