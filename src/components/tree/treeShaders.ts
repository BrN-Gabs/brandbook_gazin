/* GLSL for the Árvore da Jornada de Sucesso. All layers are additive light on the navy
   background: translucent limbs with luminous rims, flowing energy, particles and fruits. */

/** Limbs (roots, trunk strands, branches) and the trunk core. */
export const limbVertex = /* glsl */ `
  uniform float uAlongY;
  varying float vAlong, vY;
  varying vec3 vNormal, vView;
  void main() {
    vAlong = uAlongY > .5 ? uv.y : uv.x;
    vY = position.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
export const limbFragment = /* glsl */ `
  uniform float uDraw, uTime, uGlow, uDim, uOpacity, uFlow, uBand, uBandOn, uMotion;
  uniform vec3 uColor, uHot;
  varying float vAlong, vY;
  varying vec3 vNormal, vView;
  void main() {
    if (vAlong > uDraw) discard;
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float rim = pow(1. - facing, 1.6);
    // Energy travelling along the limb (roots: towards the trunk; trunk and branches: outwards).
    float flow = pow(.5 + .5 * sin(vAlong * 16. + uTime * 2.2 * uFlow), 12.) * uMotion;
    // Growing tip while the limb is being drawn.
    float head = exp(-pow((uDraw - vAlong) * 24., 2.)) * (1. - step(.999, uDraw));
    // Trunk: the selected concept lights its band and the line of light below it.
    float band = uBandOn * (exp(-pow((vY - uBand) * 5., 2.)) * 1.1 + smoothstep(uBand + .25, uBand - .15, vY) * .3);
    float energy = uGlow + band;
    vec3 color = mix(uColor, uHot, clamp(rim * .25 + energy * .7 + flow * .5 + head, 0., 1.));
    float alpha = (.16 + rim * .62 + flow * .3 + head * 1.4 + energy * .7) * uOpacity * (1. - uDim * .74);
    gl_FragColor = vec4(color, alpha);
  }
`

const softPoint = /* glsl */ `
  float soft(vec2 coord, float sharp) {
    float r = length(coord - .5) * 2.;
    if (r > 1.) discard;
    return exp(-r * r * sharp) * (1. - smoothstep(.7, 1., r));
  }
`

/**
 * The particles that are first the DNA of the opening and then the tree. They form the
 * double helix (turning), the helix loosens, and each particle flies along an arc to its
 * place in the tree — bottom first, so the tree is built from the roots up. Once landed,
 * crown particles breathe in the wind and everything glows with its element.
 */
export const particleVertex = /* glsl */ `
  attribute vec3 aHelix;
  attribute vec4 aSeed;
  attribute vec2 aInfo;
  uniform float uTime, uProgress, uPixel, uScale, uMotion, uDim, uSize, uSpin, uHelixY;
  uniform vec3 uFlight;
  uniform float uGroupGlow[GROUPS], uGroupDim[GROUPS];
  uniform vec2 uWind;
  uniform vec3 uBlue, uBright, uWhite, uGreen, uIce;
  varying vec3 vColor;
  varying float vAlpha;
  vec3 turn(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }
  void main() {
    float order = aSeed.w, canopy = aInfo.y;
    // 1. The helix forms from the base up, then loosens before coming apart.
    float formed = smoothstep(order * .05, .07 + order * .05, uProgress);
    float loosen = smoothstep(.1, .24, uProgress);
    vec3 h = aHelix - vec3(0., uHelixY, 0.);
    h.xz *= 1. + loosen * (.18 + aSeed.x * .45);
    h.y *= 1. + loosen * (aSeed.y - .5) * .06;
    h = turn(h, uSpin) + vec3(0., uHelixY, 0.);
    // 2. Flight to the tree along an arc that bulges away from the helix.
    float start = uFlight.x + order * uFlight.y;
    float m = smoothstep(start, start + uFlight.z, uProgress);
    vec3 away = normalize(vec3(aSeed.x - .5, (aSeed.y - .35) * .8, aSeed.z - .5) + vec3(0.0001));
    vec3 p = mix(h, position, m) + away * sin(m * 3.14159) * (.9 + aSeed.y * 1.6);
    // 3. Living tree: the crown breathes and leans with the cursor.
    float sway = uMotion * m * canopy;
    p.x += (sin(uTime * .55 + position.y * .9 + aSeed.x * 6.28) * .06 + uWind.x * (position.y - 1.8) * .05) * sway;
    p.y += sin(uTime * .75 + position.x * .7 + aSeed.y * 6.28) * .045 * sway;
    p.z += uWind.y * (position.y - 1.8) * .04 * sway;
    int g = int(aInfo.x);
    float glow = uGroupGlow[g] * m;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    float travelling = sin(m * 3.14159);
    gl_PointSize = uSize * (.5 + aSeed.x) * mix(.85, canopy > .5 ? 1. : .8, m) * (1. + glow * .6 + travelling * .35) * uPixel * uScale / -mv.z;
    // DNA colours (white core, blue glitter) → tree colours (blue crown, a few green and white leaves).
    vec3 dna = mix(uBright, uIce, aSeed.y * .8);
    vec3 tree = canopy > .5 ? (aSeed.z < .07 ? uGreen : aSeed.z < .24 ? uWhite : mix(uBlue, uBright, aSeed.y)) : mix(uBright, uIce, .35 + aSeed.y * .4);
    vColor = mix(dna, tree, m);
    float twinkle = 1. - uMotion * .35 * (.5 + .5 * sin(uTime * (1. + aSeed.x * 2.) + aSeed.y * 40.));
    float dim = canopy > .5 ? uDim : uGroupDim[g];
    vAlpha = formed * twinkle * mix(.8, canopy > .5 ? .55 + glow * .9 : .42 + glow * .8, m) * (1. + travelling * .4) * (1. - dim * .68 * m);
  }
`
export const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  ${softPoint}
  void main() { gl_FragColor = vec4(vColor, soft(gl_PointCoord, 3.2) * vAlpha); }
`

/** Energy nodes along the main limbs, visible as the limb is drawn. */
export const nodeVertex = /* glsl */ `
  attribute vec3 aData;
  uniform float uTime, uPixel, uScale, uMotion;
  uniform float uGroupDraw[GROUPS], uGroupGlow[GROUPS], uGroupDim[GROUPS];
  uniform vec3 uBright, uWhite;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    int g = int(aData.y);
    float drawn = step(aData.x, uGroupDraw[g]);
    float glow = uGroupGlow[g];
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mv;
    float pulse = .5 + .5 * sin(uTime * 2. + aData.z * 30.) * uMotion;
    gl_PointSize = (4.5 + glow * 3.5 + pulse * 1.6) * uPixel * uScale / -mv.z;
    vColor = mix(uBright, uWhite, .4 + glow * .5);
    vAlpha = drawn * (.45 + pulse * .35 + glow * .6) * (1. - uGroupDim[g] * .75);
  }
`

/** Background specks and the luminous ground disc. */
export const dustVertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime, uReveal, uRoots, uPixel, uScale, uMotion;
  uniform vec3 uBright, uWhite;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mv;
    float ground = aSeed.z;
    float twinkle = .55 + .45 * sin(uTime * (.6 + aSeed.x) + aSeed.y * 50.) * uMotion;
    gl_PointSize = (ground > .5 ? 2.2 : 1.6 + aSeed.x * 2.2) * uPixel * uScale / -mv.z;
    vColor = mix(uBright, uWhite, aSeed.y * .6);
    // The ground spreads outwards with the roots.
    float reveal = ground > .5 ? smoothstep(aSeed.w - .15, aSeed.w, uRoots * 1.15) * (1. - aSeed.w * .8) : smoothstep(aSeed.w, aSeed.w + .5, uReveal) * .5;
    vAlpha = reveal * twinkle;
  }
`

/** Fruits: luminous spheres with a bright core and a soft rim (instanced). */
export const fruitVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aState;
  uniform float uTime, uMotion;
  varying vec3 vColor, vNormal, vView, vState;
  void main() {
    float id = float(gl_InstanceID);
    float breathe = 1. + sin(uTime * 1.6 + id * 1.7) * .04 * uMotion;
    vec3 p = position * aState.x * (1. + aState.y * .35) * breathe;
    vec4 world = instanceMatrix * vec4(p, 1.);
    world.y += sin(uTime * .9 + id * 2.1) * .07 * uMotion;
    vec4 mv = modelViewMatrix * world;
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vColor = aColor;
    vState = aState;
    gl_Position = projectionMatrix * mv;
  }
`
export const fruitFragment = /* glsl */ `
  uniform vec3 uWhite;
  varying vec3 vColor, vNormal, vView, vState;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float rim = pow(1. - facing, 2.2);
    float core = pow(facing, 4.);
    vec3 color = mix(vColor, uWhite, clamp(core * .55 + vState.y * .35, 0., 1.));
    float alpha = (.3 + rim * .95 + core * .55 + vState.y * .4) * min(vState.x * 2., 1.) * (1. - vState.z * .7);
    gl_FragColor = vec4(color, alpha);
  }
`
export const haloVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aState;
  attribute float aIndex;
  uniform float uTime, uPixel, uScale, uMotion;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * .9 + aIndex * 2.1) * .07 * uMotion;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (34. + aState.y * 30.) * aState.x * uPixel * uScale / -mv.z;
    vColor = aColor;
    vAlpha = (.32 + aState.y * .45) * aState.x * (1. - aState.z * .75);
  }
`
export const haloFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  ${softPoint}
  void main() { gl_FragColor = vec4(vColor, soft(gl_PointCoord, 5.) * vAlpha); }
`
