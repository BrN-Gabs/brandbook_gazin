import * as THREE from 'three'
import type { DNAState } from './DNAScrollController'

/** Gazin palette, read from the CSS tokens so 2D and 3D share one source of colour. */
export type DNAPalette = { blue: string; bright: string; mid: string; light: string; white: string }

/** Mouse in NDC (y up), smoothed velocity in NDC/s and a 0–1 presence strength. */
export type DNAMouse = { x: number; y: number; vx: number; vy: number; strength: number }
export type DNAFrame = {
  time: number; state: DNAState; parallax: THREE.Vector2; mouse: DNAMouse
  pixelRatio: number; height: number; aspect: number; viewHeight: number; reduced: boolean
}

const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSoft;
  void main() {
    float radius = length(gl_PointCoord - .5) * 2.;
    if (radius > 1.) discard;
    float halo = exp(-radius * radius * mix(7., 2.2, vSoft));
    float core = exp(-radius * radius * 42.) * (1. - vSoft) * .8;
    gl_FragColor = vec4(vColor, (halo + core) * vAlpha * (1. - smoothstep(.65, 1., radius)));
  }
`

// Shared by every particle layer: screen-space mouse repulsion/swirl and depth of field.
const interaction = /* glsl */ `
  uniform vec2 uMouse, uMouseVelocity;
  uniform float uMouseStrength, uAspect, uFocus, uRadius, uPush, uBokeh;
  float interact(inout vec4 viewPosition, vec2 seed) {
    vec4 clip = projectionMatrix * viewPosition;
    vec2 ndc = clip.xy / clip.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.);
    float influence = exp(-dot(d, d) * uRadius) * uMouseStrength;
    vec2 dir = normalize(d + vec2(.0001));
    vec2 swirl = vec2(-dir.y, dir.x);
    viewPosition.xy += (dir * (.45 + seed.x * .7) + swirl * (seed.y - .35) * .9) * influence * uPush;
    viewPosition.xy += uMouseVelocity * influence * (.8 + seed.y * 1.4) * uPush;
    viewPosition.z += (seed.x - .5) * influence * uPush * 1.2;
    return influence;
  }
  float focusBlur(vec4 viewPosition) { return clamp(abs(-viewPosition.z - uFocus) / 4.5, 0., 1.); }
`

// Stable seeds: the structure does not regenerate or jump during scroll/resize.
const random = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value) }
// The second strand is offset by ~140° (not 180°), giving real DNA's major and minor grooves.
export const helix = (t: number, strand: number) => {
  const angle = t * Math.PI * 3.9 + strand * Math.PI * .78
  return new THREE.Vector3(Math.cos(angle) * 1.28, (t - .5) * 9.4, Math.sin(angle) * 1.28)
}

/** Glitter-tube strands plus beaded base-pair rungs, like a particle-rendered double helix. */
function buildHelix(count: number, salt: number, rungs: number) {
  const position = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 4)
  const kind = new Float32Array(count)
  // Each particle's birth point on the luminous centre line (opening fragmentation).
  const origins = new Float32Array(count * 3)
  const point = new THREE.Vector3()
  const origin = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    const r = (n: number) => random(i * 9 + n + salt)
    let t: number
    if (r(0) < .68) {
      t = r(1)
      point.copy(helix(t, i % 2))
      origin.copy(point)
      // Filled circular cross-section (sqrt keeps density even), slightly denser at the core.
      const angle = r(2) * Math.PI * 2
      const radius = Math.pow(r(3), .62) * .24
      const outward = new THREE.Vector3(point.x, 0, point.z).normalize()
      point.addScaledVector(outward, Math.cos(angle) * radius)
      point.y += Math.sin(angle) * radius * .9
      point.addScaledVector(new THREE.Vector3(-outward.z, 0, outward.x), (r(4) - .5) * .1)
    } else {
      // Rungs are rows of discrete beads with a small gap where the base pair meets.
      t = (Math.floor(r(1) * rungs) + .5) / rungs
      const beads = 15
      let u = (Math.floor(r(2) * beads) + .5) / beads
      if (Math.abs(u - .5) < .05) u += u < .5 ? -.05 : .05
      point.copy(helix(t, 0)).lerp(helix(t, 1), .1 + u * .8)
      origin.copy(point)
      point.x += (r(3) - .5) * .045
      point.y += (r(4) - .5) * .045
      point.z += (r(5) - .5) * .045
      kind[i] = 1
    }
    position.set(point.toArray(), i * 3)
    origins.set(origin.toArray(), i * 3)
    seeds.set([r(6), r(7), r(8), t], i * 4)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  geometry.setAttribute('aKind', new THREE.BufferAttribute(kind, 1))
  geometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3))
  return geometry
}

const helixVertex = /* glsl */ `
  attribute vec4 aSeed;
  attribute float aKind;
  attribute vec3 aOrigin;
  uniform float uTime, uFormation, uOpacity, uPixelRatio, uHeight, uReduced;
  uniform vec3 uDeep, uBlue, uIce;
  varying vec3 vColor;
  varying float vAlpha, vSoft;
  ${interaction}
  void main() {
    float motion = 1. - uReduced;
    float detached = step(.9, aSeed.z);
    float cycle = fract(uTime * (.045 + aSeed.x * .045) + aSeed.y);
    // Fragmentation sweeps from the base up: each particle leaves the luminous centre line.
    float reveal = smoothstep(aSeed.w * .72, aSeed.w * .72 + .28, uFormation);
    float settle = reveal * reveal * (3. - 2. * reveal);
    float drift = cycle * cycle * detached * motion * reveal;
    vec3 direction = vec3(cos(aSeed.x * 6.283), .4 + aSeed.y, sin(aSeed.x * 6.283));
    vec3 p = position + direction * drift * (1.4 + aSeed.y * 1.8);
    p += vec3(sin(uTime * .3 + aSeed.x * 25.), cos(uTime * .24 + aSeed.y * 20.), 0.) * drift * .18;
    // Living surface: a gentle breathing shimmer along the strands.
    p += normalize(vec3(position.x, 0., position.z) + .0001) * sin(uTime * 1.4 + aSeed.w * 40.) * .014 * motion;
    // A small scatter around the centre line so the split reads as a physical fragmentation.
    vec3 scatter = (vec3(aSeed.x, aSeed.y, aSeed.z) - .5) * .5 * sin(reveal * 3.1416);
    p = mix(aOrigin, p, settle) + scatter;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.);
    float glow = interact(viewPosition, aSeed.xy) * motion;
    gl_Position = projectionMatrix * viewPosition;
    float blur = focusBlur(viewPosition);
    float sparkle = step(.955, aSeed.x);
    float twinkle = .5 + .5 * sin(uTime * (1.5 + aSeed.y * 3.5) + aSeed.z * 60.);
    float size = mix(.02 + aSeed.y * .03, .04 + aSeed.y * .045, sparkle) * mix(1., 1.4, detached);
    size *= (1. + blur * uBokeh) * (1. + glow * .5);
    gl_PointSize = clamp(size * uHeight * uPixelRatio / -viewPosition.z, 1., 48.);
    vec3 base = mix(uDeep, uBlue, aSeed.y * aSeed.y);
    base = mix(base, mix(uBlue, uIce, .3), aKind * .55);
    vColor = mix(base, uIce, max(max(sparkle * (.55 + .45 * twinkle), glow * .35), (1. - settle) * .85));
    vAlpha = uOpacity * mix(.62, 1., sparkle) * mix(1., (1. - cycle) * .8, detached) * smoothstep(0., .3, reveal);
    vAlpha *= mix(1., .32, blur) * (1. + glow * .5);
    vSoft = max(sparkle * .2, blur);
  }
`

export function createDNAParticles(organic: THREE.Group, scene: THREE.Scene, gentle: boolean, palette: DNAPalette) {
  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []
  const objects: THREE.Object3D[] = []
  const shared = {
    uTime: { value: 0 }, uFormation: { value: 0 }, uOpacity: { value: 1 },
    uPixelRatio: { value: 1 }, uHeight: { value: 900 }, uReduced: { value: 0 },
    uMouse: { value: new THREE.Vector2(9, 9) }, uMouseVelocity: { value: new THREE.Vector2() },
    uMouseStrength: { value: 0 }, uAspect: { value: 1 }, uFocus: { value: 14 }, uAmbient: { value: 1 },
    // Depth through luminance of one family: deep institutional blue → vibrant blue → white sparkle.
    uDeep: { value: new THREE.Color(palette.mid).lerp(new THREE.Color(palette.blue), .35) },
    uBlue: { value: new THREE.Color(palette.bright) },
    uIce: { value: new THREE.Color(palette.light).lerp(new THREE.Color(palette.white), .55) },
  }
  const material = (vertexShader: string, extra: Record<string, { value: unknown }>) => {
    const item = new THREE.ShaderMaterial({
      uniforms: { ...shared, ...extra }, vertexShader, fragmentShader: particleFragment,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    materials.push(item)
    return item
  }
  const add = (parent: THREE.Object3D, object: THREE.Points) => {
    object.frustumCulled = false
    parent.add(object)
    objects.push(object); geometries.push(object.geometry)
    return object
  }

  // 1. Main helix.
  const count = gentle ? 9000 : 26000
  const helixGeometry = buildHelix(count, 0, 26)
  add(organic, new THREE.Points(helixGeometry, material(helixVertex, { uRadius: { value: 16 }, uPush: { value: .55 }, uBokeh: { value: 1.6 } })))

  // 2. Interactive dust: tiny particles orbiting the helix that scatter and swirl around the cursor.
  const dustCount = gentle ? 1100 : 3800
  const dustPosition = new Float32Array(dustCount * 3)
  const dustSeeds = new Float32Array(dustCount * 4)
  for (let i = 0; i < dustCount; i++) {
    const r = (n: number) => random(i * 7 + n + 5000)
    dustPosition.set([1.1 + Math.pow(r(0), 1.6) * 3.2, (r(1) - .5) * 11, r(2) * Math.PI * 2], i * 3)
    dustSeeds.set([r(3), r(4), r(5), r(6)], i * 4)
  }
  const dustGeometry = new THREE.BufferGeometry()
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPosition, 3))
  dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(dustSeeds, 4))
  add(organic, new THREE.Points(dustGeometry, material(/* glsl */ `
    attribute vec4 aSeed;
    uniform float uTime, uFormation, uOpacity, uPixelRatio, uHeight, uReduced;
    uniform vec3 uBlue, uIce;
    varying vec3 vColor;
    varying float vAlpha, vSoft;
    ${interaction}
    void main() {
      float motion = 1. - uReduced;
      float angle = position.z + uTime * (.05 + aSeed.x * .1) * motion;
      float radius = position.x + sin(uTime * .35 + aSeed.y * 20.) * .18 * motion;
      vec3 p = vec3(cos(angle) * radius, position.y + sin(uTime * .22 + aSeed.z * 30.) * .3 * motion, sin(angle) * radius);
      float reveal = smoothstep(aSeed.w * .6, aSeed.w * .6 + .4, uFormation);
      vec4 viewPosition = modelViewMatrix * vec4(p * mix(2.4, 1., reveal), 1.);
      float glow = interact(viewPosition, aSeed.xy) * motion;
      gl_Position = projectionMatrix * viewPosition;
      float blur = focusBlur(viewPosition);
      float size = (.007 + aSeed.y * .013) * (1. + blur * uBokeh) * (1. + glow * .8);
      gl_PointSize = clamp(size * uHeight * uPixelRatio / -viewPosition.z, 1., 18.);
      vColor = mix(mix(uBlue, uIce, aSeed.z * .7), uIce, glow * .6);
      float twinkle = .55 + .45 * sin(uTime * (1. + aSeed.y * 2.5) + aSeed.x * 40.);
      vAlpha = uOpacity * reveal * (.22 + .5 * aSeed.x) * twinkle * mix(1., .4, blur) * (1. + glow * 1.2);
      vSoft = blur;
    }
  `, { uRadius: { value: 9 }, uPush: { value: 1.25 }, uBokeh: { value: 2 } })))

  // 3. Out-of-focus helices in the distance, like a macro-lens depth of field.
  const backHelices = [
    { position: new THREE.Vector3(-7, 2.6, -9), rotation: 1.2, scale: 1.45, depth: .5, speed: .05 },
    { position: new THREE.Vector3(8, -3.8, -12), rotation: -.55, scale: 1.7, depth: .8, speed: -.035 },
  ].map((config, index) => {
    const group = new THREE.Group()
    group.position.copy(config.position)
    group.rotation.z = config.rotation
    group.scale.setScalar(config.scale)
    scene.add(group)
    const spinner = new THREE.Group()
    group.add(spinner)
    const opacity = { value: .65 }
    add(spinner, new THREE.Points(buildHelix(gentle ? 1600 : 4200, 9000 + index * 3000, 22), material(helixVertex, {
      uOpacity: opacity, uFormation: { value: 1 }, uRadius: { value: 4 }, uPush: { value: .5 }, uBokeh: { value: 4.5 },
    })))
    objects.push(group)
    return { group, spinner, config, opacity }
  })

  // 4. Background depth layer: fine dust and large bokeh discs, parallax and cursor repulsion.
  const backgroundCount = gentle ? 260 : 750
  const backgroundGeometry = new THREE.BufferGeometry()
  const backgroundPositions = new Float32Array(backgroundCount * 3)
  const backgroundSeeds = new Float32Array(backgroundCount * 4)
  for (let i = 0; i < backgroundCount; i++) {
    backgroundPositions.set([random(i * 11) * 2 - 1, random(i * 11 + 1) * 2 - 1, random(i * 11 + 2)], i * 3)
    backgroundSeeds.set([random(i * 11 + 3), random(i * 11 + 4), random(i * 11 + 5), random(i * 11 + 6)], i * 4)
  }
  backgroundGeometry.setAttribute('position', new THREE.BufferAttribute(backgroundPositions, 3))
  backgroundGeometry.setAttribute('aSeed', new THREE.BufferAttribute(backgroundSeeds, 4))
  const backgroundUniforms = { uPointer: { value: new THREE.Vector2() }, uViewHeight: { value: 9 } }
  add(scene, new THREE.Points(backgroundGeometry, material(/* glsl */ `
    attribute vec4 aSeed;
    uniform float uTime, uPixelRatio, uHeight, uAspect, uViewHeight, uReduced;
    uniform vec2 uPointer, uMouse;
    uniform float uMouseStrength, uAmbient;
    uniform vec3 uBlue, uIce;
    varying vec3 vColor;
    varying float vAlpha, vSoft;
    void main() {
      float motion = 1. - uReduced;
      vec2 p = position.xy * 1.2;
      p += vec2(sin(uTime * .07 + aSeed.x * 20.), cos(uTime * .055 + aSeed.y * 20.)) * .035 * motion;
      p.y = mod(p.y + uTime * (.004 + aSeed.y * .012) * motion + 1.2, 2.4) - 1.2;
      p += uPointer * (.018 + position.z * .035);
      vec2 away = (p - uMouse) * vec2(uAspect, 1.);
      float influence = exp(-dot(away, away) * 7.) * uMouseStrength * motion;
      p += normalize(away + .0001) / vec2(uAspect, 1.) * influence * .12;
      float z = -3. + position.z * 5.;
      float perspective = (14. - z) / 14.;
      vec3 world = vec3(p.x * uViewHeight * uAspect * .5 * perspective, p.y * uViewHeight * .5 * perspective, z);
      vec4 viewPosition = modelViewMatrix * vec4(world, 1.);
      gl_Position = projectionMatrix * viewPosition;
      float bokeh = step(.88, aSeed.z);
      gl_PointSize = mix(1.2 + aSeed.y * 2.4, 24. + aSeed.x * 70., bokeh) * uPixelRatio;
      vColor = mix(uBlue, uIce, aSeed.w * .7 + influence * .5);
      vAlpha = mix(.3 + influence * .7, .07 + aSeed.y * .06, bokeh);
      vAlpha *= (.7 + .3 * sin(uTime * .4 + aSeed.x * 18.)) * uAmbient;
      vSoft = bokeh;
    }
  `, backgroundUniforms)))

  return {
    update({ time, state, parallax, mouse, pixelRatio, height, aspect, viewHeight, reduced }: DNAFrame) {
      shared.uTime.value = time
      shared.uFormation.value = state.formation
      shared.uOpacity.value = state.opacity
      shared.uAmbient.value = state.ambient
      shared.uPixelRatio.value = pixelRatio
      shared.uHeight.value = height
      shared.uReduced.value = reduced ? 1 : 0
      shared.uAspect.value = aspect
      shared.uMouse.value.set(mouse.x, mouse.y)
      shared.uMouseVelocity.value.set(mouse.vx, mouse.vy).multiplyScalar(.1)
      shared.uMouseStrength.value = reduced ? 0 : mouse.strength
      backgroundUniforms.uPointer.value.set(parallax.x, -parallax.y)
      backgroundUniforms.uViewHeight.value = viewHeight
      backHelices.forEach(({ group, spinner, config, opacity }) => {
        opacity.value = .65 * state.ambient
        group.visible = state.ambient > 0
        spinner.rotation.y = time * config.speed * 4
        group.position.set(config.position.x - parallax.x * config.depth, config.position.y + parallax.y * config.depth, config.position.z)
      })
    },
    simplify() {
      helixGeometry.setDrawRange(0, Math.min(count, 9000))
      dustGeometry.setDrawRange(0, Math.min(dustCount, 1100))
      backgroundGeometry.setDrawRange(0, Math.min(backgroundCount, 260))
    },
    dispose() { objects.forEach(object => object.removeFromParent()); geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()) },
  }
}
