import * as THREE from 'three'
import { helix, type DNAPalette } from './DNAParticles'
import type { DNAState } from './DNAScrollController'

// The opening's light, inside the SAME scene as the DNA:
// state.energy  0→1  the light leaves the logo and flies to the base of the helix;
// state.draw    0→1  it splits into two heads that trace both strands (and rungs light up behind);
// state.formation    the luminous strands dissolve into the existing particle helix.
const START = .07 // first visible turn: the helix base can sit below the viewport.

const glowFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - .5) * 2.;
    if (r > 1.) discard;
    float glow = exp(-r * r * 4.5) * .75 + exp(-r * r * 30.) * .9;
    gl_FragColor = vec4(vColor, glow * vAlpha * (1. - smoothstep(.7, 1., r)));
  }
`

export function createDNAEnergy(organic: THREE.Group, scene: THREE.Scene, gentle: boolean, palette: DNAPalette) {
  // White energy core, vibrant-blue trail.
  const white = new THREE.Color(palette.white)
  const electric = new THREE.Color(palette.bright)
  const uniforms = {
    uLow: { value: START }, uHigh: { value: START }, uFade: { value: 0 }, uPixelRatio: { value: 1 }, uHeight: { value: 900 },
    uWhite: { value: white }, uElectric: { value: electric },
  }

  // 1. Luminous strands and rungs, as dense soft points along the helix centre lines.
  const perStrand = gentle ? 420 : 900
  const rungs = 26, perRung = 14
  const total = perStrand * 2 + rungs * perRung
  const positions = new Float32Array(total * 3)
  const params = new Float32Array(total * 2) // t along the helix, kind (0 strand, 1 rung)
  let n = 0
  for (let strand = 0; strand < 2; strand++) for (let i = 0; i < perStrand; i++, n++) {
    const t = i / (perStrand - 1)
    positions.set(helix(t, strand).toArray(), n * 3)
    params.set([t, 0], n * 2)
  }
  for (let r = 0; r < rungs; r++) for (let j = 0; j < perRung; j++, n++) {
    const t = (r + .5) / rungs
    positions.set(helix(t, 0).lerp(helix(t, 1), .1 + j / (perRung - 1) * .8).toArray(), n * 3)
    params.set([t, 1], n * 2)
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  lineGeometry.setAttribute('aParam', new THREE.BufferAttribute(params, 2))
  const lineMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fragmentShader: glowFragment,
    vertexShader: /* glsl */ `
      attribute vec2 aParam;
      uniform float uLow, uHigh, uFade, uPixelRatio, uHeight;
      uniform vec3 uWhite, uElectric;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float t = aParam.x;
        float behind = uHigh - t;
        float drawn = smoothstep(-.004, .004, behind) * smoothstep(-.004, .004, t - uLow);
        // Rungs ignite just behind the heads, as if the light were stitching base pairs.
        drawn *= mix(1., smoothstep(.0, .05, behind), aParam.y);
        // Dissolves from the base up, in step with the particle reveal (same 0.72/0.28 sweep).
        float dissolve = 1. - smoothstep(t * .72, t * .72 + .28, uFade);
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * viewPosition;
        float hot = exp(-behind * behind * 900.);
        gl_PointSize = clamp((mix(.17, .08, aParam.y) + hot * .14) * uHeight * uPixelRatio / -viewPosition.z, 1., 60.);
        vColor = mix(uWhite, uElectric, smoothstep(.0, .22, behind) * .85);
        vAlpha = drawn * dissolve * mix(.7, .4, aParam.y) * (1. + hot);
      }
    `,
  })
  const lines = new THREE.Points(lineGeometry, lineMaterial)
  lines.frustumCulled = false
  organic.add(lines)

  // 2. Heads (world space) and a CPU spark pool that leaves the particle trail.
  const headGeometry = new THREE.BufferGeometry()
  const headPositions = new Float32Array(6)
  const headAlpha = new Float32Array(2)
  headGeometry.setAttribute('position', new THREE.BufferAttribute(headPositions, 3).setUsage(THREE.DynamicDrawUsage))
  headGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(headAlpha, 1).setUsage(THREE.DynamicDrawUsage))
  const pointMaterial = (size: number) => new THREE.ShaderMaterial({
    uniforms: { uPixelRatio: uniforms.uPixelRatio, uHeight: uniforms.uHeight, uSize: { value: size } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fragmentShader: glowFragment,
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      attribute vec3 color;
      uniform float uPixelRatio, uHeight, uSize;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = clamp(uSize * uHeight * uPixelRatio / -viewPosition.z, 1., 140.);
        vColor = ${size > .3 ? 'vec3(1.)' : 'color'};
        vAlpha = aAlpha;
      }
    `,
  })
  const headMaterial = pointMaterial(.62)
  const heads = new THREE.Points(headGeometry, headMaterial)
  heads.frustumCulled = false
  scene.add(heads)

  const sparkCount = gentle ? 160 : 420
  const sparkPositions = new Float32Array(sparkCount * 3)
  const sparkColors = new Float32Array(sparkCount * 3)
  const sparkAlpha = new Float32Array(sparkCount)
  const sparks = Array.from({ length: sparkCount }, () => ({ life: 0, max: 1, position: new THREE.Vector3(), velocity: new THREE.Vector3(), color: new THREE.Color() }))
  const sparkGeometry = new THREE.BufferGeometry()
  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3).setUsage(THREE.DynamicDrawUsage))
  sparkGeometry.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3).setUsage(THREE.DynamicDrawUsage))
  sparkGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(sparkAlpha, 1).setUsage(THREE.DynamicDrawUsage))
  const sparkMaterial = pointMaterial(.085)
  const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial)
  sparkPoints.frustumCulled = false
  scene.add(sparkPoints)

  const origin = new THREE.Vector3()
  let ignited = false, cursor = 0, spawnDebt = 0, lastTime = -1
  const bottom = new THREE.Vector3(), control = new THREE.Vector3(), head = new THREE.Vector3(), headB = new THREE.Vector3()
  const spawn = (at: THREE.Vector3, amount: number, spread: number) => {
    for (let k = 0; k < amount; k++) {
      const spark = sparks[cursor]
      cursor = (cursor + 1) % sparkCount
      spark.position.copy(at)
      spark.velocity.set(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize().multiplyScalar(spread * (.2 + Math.random()))
      spark.max = spark.life = .45 + Math.random() * .7
      spark.color.copy(white).lerp(electric, Math.random() * .8)
    }
  }
  const bezier = (p: number) => {
    const a = 1 - p
    return head.set(0, 0, 0).addScaledVector(origin, a * a).addScaledVector(control, 2 * a * p).addScaledVector(bottom, p * p)
  }

  return {
    /** World point (on the z=0 plane) where the DOM light hands over to the scene. */
    ignite(point: THREE.Vector3) { origin.copy(point); ignited = true },
    /** A small burst of sparks (world space), e.g. when a DNA point ignites. */
    burst(point: THREE.Vector3, amount = 26) { spawn(point, gentle ? Math.ceil(amount / 2) : amount, .9) },
    update(state: DNAState, time: number, pixelRatio: number, height: number) {
      const delta = lastTime < 0 ? 0 : Math.min(.05, Math.max(0, time - lastTime))
      lastTime = time
      uniforms.uPixelRatio.value = pixelRatio
      uniforms.uHeight.value = height
      // The drawn window grows mostly upward from the first visible turn.
      uniforms.uHigh.value = START + state.draw * (1 - START)
      uniforms.uLow.value = START * (1 - state.draw)
      uniforms.uFade.value = state.formation
      const active = ignited && state.formation < 1
      lines.visible = active && state.draw > 0
      const fadeHeads = 1 - THREE.MathUtils.smoothstep(state.formation, 0, .35)
      organic.updateMatrixWorld()
      bottom.copy(helix(START, 0)).lerp(helix(START, 1), .5).applyMatrix4(organic.matrixWorld)
      let alphaA = 0, alphaB = 0
      if (active && state.energy > 0) {
        if (state.energy < 1 || state.draw <= 0) {
          // A 3D arc: lifts toward the camera so the flight reads as depth, not a slide.
          control.copy(origin).lerp(bottom, .5).add(new THREE.Vector3(0, 1.6, 3.5))
          bezier(THREE.MathUtils.clamp(state.energy, 0, 1))
          headB.copy(head)
          alphaA = 1; alphaB = 0
        } else {
          const high = START + state.draw * (1 - START)
          head.copy(helix(high, 0)).applyMatrix4(organic.matrixWorld)
          headB.copy(helix(high, 1)).applyMatrix4(organic.matrixWorld)
          const done = THREE.MathUtils.smoothstep(state.draw, .9, 1)
          alphaA = alphaB = 1 - done * .6
        }
        alphaA *= fadeHeads; alphaB *= fadeHeads
        spawnDebt += delta * (gentle ? 70 : 160)
        const amount = Math.floor(spawnDebt)
        spawnDebt -= amount
        if (amount && alphaA > .05) {
          spawn(head, alphaB > 0 ? Math.ceil(amount / 2) : amount, .35)
          if (alphaB > .05) spawn(headB, Math.floor(amount / 2), .35)
        }
      }
      heads.visible = alphaA > 0 || alphaB > 0
      headPositions.set([...head.toArray(), ...headB.toArray()])
      headAlpha[0] = alphaA; headAlpha[1] = alphaB
      headGeometry.attributes.position.needsUpdate = true
      headGeometry.attributes.aAlpha.needsUpdate = true

      let live = 0
      sparks.forEach((spark, i) => {
        if (spark.life > 0) {
          spark.life -= delta
          spark.velocity.multiplyScalar(Math.exp(-delta * 1.8))
          spark.position.addScaledVector(spark.velocity, delta)
          live++
        }
        const life = Math.max(0, spark.life / spark.max)
        sparkPositions.set(spark.position.toArray(), i * 3)
        sparkColors.set([spark.color.r, spark.color.g, spark.color.b], i * 3)
        sparkAlpha[i] = life * life * .9
      })
      sparkPoints.visible = live > 0
      if (live) {
        sparkGeometry.attributes.position.needsUpdate = true
        sparkGeometry.attributes.color.needsUpdate = true
        sparkGeometry.attributes.aAlpha.needsUpdate = true
      }
      return live > 0 || heads.visible || lines.visible
    },
    dispose() {
      lines.removeFromParent(); heads.removeFromParent(); sparkPoints.removeFromParent()
      ;[lineGeometry, headGeometry, sparkGeometry].forEach(item => item.dispose())
      ;[lineMaterial, headMaterial, sparkMaterial].forEach(item => item.dispose())
    },
  }
}
