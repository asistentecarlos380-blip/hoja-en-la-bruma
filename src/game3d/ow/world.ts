import * as THREE from "three";

export type Biome = "snow" | "forest" | "wisteria" | "gravel" | "swamp" | "city" | "spider" | "rail" | "castle";
type ZoneSeed = { id: string; name: string; x: number; z: number; r: number; biome: Biome; lift?: number; matchHeight?: string };
export type Zone = ZoneSeed & { h: number };

export type Collider =
  | { kind: "circle"; x: number; z: number; r: number }
  | { kind: "box"; x: number; z: number; hw: number; hd: number };

export type OWWorld = {
  colliders: Collider[];
  moon: THREE.DirectionalLight;
  setMorning: (morning: boolean) => void;
  update: (t: number, dt: number, player: THREE.Vector3) => void;
};

const SEEDS: ZoneSeed[] = [
  { id: "kumotori", name: "Aldea del Monte Kumotori", x: -120, z: 128, r: 34, biome: "snow" },
  { id: "kamado", name: "Casa de los Kamado", x: -218, z: 212, r: 16, biome: "snow", lift: 7 },
  { id: "sagiri", name: "Monte Sagiri", x: -150, z: 35, r: 30, biome: "forest" },
  { id: "fujikasane", name: "Monte Fujikasane", x: -120, z: -60, r: 28, biome: "wisteria" },
  { id: "sede", name: "Sede del Cuerpo · Aldea de la Glicinia", x: -25, z: 38, r: 30, biome: "gravel" },
  { id: "jardin", name: "Jardín del Patrimonio Ubuyashiki", x: -25, z: 0, r: 13, biome: "gravel", matchHeight: "sede" },
  { id: "pantano", name: "Pueblo del noroeste · Pantano", x: 70, z: 125, r: 32, biome: "swamp" },
  { id: "asakusa", name: "Asakusa", x: 115, z: 35, r: 32, biome: "city" },
  { id: "mansion", name: "Mansión Tsuzumi", x: 135, z: -65, r: 24, biome: "forest" },
  { id: "natagumo", name: "Monte Natagumo", x: 45, z: -112, r: 40, biome: "spider" },
  { id: "mugen", name: "Estación del Tren Mugen", x: -55, z: -118, r: 28, biome: "rail" },
  { id: "castillo", name: "Castillo Infinito", x: -138, z: -138, r: 30, biome: "castle" },
];

export const WORLD_HALF = 258;

function noiseH(x: number, z: number) {
  return (
    2.6 * Math.sin(x * 0.031) * Math.cos(z * 0.027) +
    1.4 * Math.sin(x * 0.071 + 1.3) * Math.sin(z * 0.058 + 0.4) +
    0.5 * Math.sin(x * 0.16 + z * 0.11)
  );
}

const PEAKS = [
  { x: -182, z: 40, h: 34, s: 26 },
  { x: -185, z: 175, h: 15, s: 24 },
  { x: -60, z: 176, h: 26, s: 28 },
  { x: -230, z: 235, h: 29, s: 32 },
  { x: 176, z: 120, h: 30, s: 30 },
  { x: 100, z: -172, h: 28, s: 28 },
  { x: -178, z: -62, h: 24, s: 24 },
  { x: 20, z: 128, h: 10, s: 16 },
  { x: 65, z: -30, h: 9, s: 15 },
  { x: 175, z: -10, h: 22, s: 24 },
];

function baseHeight(x: number, z: number) {
  let h = noiseH(x, z);
  for (const p of PEAKS) h += p.h * Math.exp(-((x - p.x) ** 2 + (z - p.z) ** 2) / (2 * p.s * p.s));
  const e = Math.max(Math.abs(x), Math.abs(z)) - 250;
  if (e > 0) h += e * e * 0.1;
  return h;
}

export const ZONES: Zone[] = [];
for (const s of SEEDS) {
  const match = s.matchHeight ? ZONES.find((z) => z.id === s.matchHeight) : undefined;
  ZONES.push({ ...s, h: match ? match.h : baseHeight(s.x, s.z) + (s.lift ?? 0) });
}
export const ZONE_BY_ID: Record<string, Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z]));

export function at(id: string, dx: number, dz: number) {
  const z = ZONE_BY_ID[id];
  return { x: z.x + dx, z: z.z + dz };
}

function smooth(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export function terrainHeight(x: number, z: number) {
  let h = baseHeight(x, z);
  for (const zn of ZONES) {
    const d = Math.hypot(x - zn.x, z - zn.z);
    const outer = zn.r * (zn.lift ? 2.4 : 1.4);
    if (d < outer) h += (zn.h - h) * smooth(outer, zn.r * 0.8, d);
  }
  return h;
}

export function zoneAt(x: number, z: number): Zone | null {
  let best: Zone | null = null;
  let bestRatio = 1.05;
  for (const zn of ZONES) {
    const ratio = Math.hypot(x - zn.x, z - zn.z) / zn.r;
    if (ratio < bestRatio) {
      bestRatio = ratio;
      best = zn;
    }
  }
  return best;
}

export const ROADS: [string, string][] = [
  ["kumotori", "kamado"], ["kumotori", "sagiri"], ["sagiri", "fujikasane"], ["fujikasane", "sede"],
  ["kumotori", "sede"], ["sede", "jardin"], ["sede", "pantano"], ["sede", "asakusa"], ["asakusa", "pantano"],
  ["asakusa", "mansion"], ["mansion", "natagumo"], ["natagumo", "mugen"], ["jardin", "mugen"], ["mugen", "castillo"],
];

const SEGMENTS = ROADS.map(([a, b]) => [ZONE_BY_ID[a], ZONE_BY_ID[b]] as const);

export function roadDistance(x: number, z: number) {
  let best = Infinity;
  for (const [a, b] of SEGMENTS) {
    const vx = b.x - a.x;
    const vz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * vx + (z - a.z) * vz) / (vx * vx + vz * vz)));
    const d = Math.hypot(x - (a.x + vx * t), z - (a.z + vz * t));
    if (d < best) best = d;
  }
  return best;
}

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BIOME_COLOR: Record<Biome, THREE.Color> = {
  snow: new THREE.Color("#d5dfec"),
  forest: new THREE.Color("#2e5a36"),
  wisteria: new THREE.Color("#4a4268"),
  gravel: new THREE.Color("#a29f92"),
  swamp: new THREE.Color("#2a3a2c"),
  city: new THREE.Color("#4e4c56"),
  spider: new THREE.Color("#262c29"),
  rail: new THREE.Color("#4f4a40"),
  castle: new THREE.Color("#2c1834"),
};
const BASE = new THREE.Color("#36613b");
const ROAD = new THREE.Color("#7d6446");
const ROCK = new THREE.Color("#5c616b");
const SNOWCAP = new THREE.Color("#e6edf6");

function colorAt(x: number, z: number, y: number, out: THREE.Color) {
  out.copy(BASE);
  for (const zn of ZONES) {
    const w = smooth(zn.r * 1.3, zn.r * 0.7, Math.hypot(x - zn.x, z - zn.z));
    if (w > 0) out.lerp(BIOME_COLOR[zn.biome], w);
  }
  const rd = roadDistance(x, z);
  if (rd < 3.4) out.lerp(ROAD, smooth(3.4, 1.8, rd) * 0.9);
  if (y > 12) out.lerp(ROCK, smooth(12, 20, y));
  if (y > 25) out.lerp(SNOWCAP, smooth(25, 31, y));
  out.multiplyScalar(0.9 + 0.1 * Math.sin(x * 0.9) * Math.cos(z * 0.7));
}

/* ------------------------------------------------------------------ */
/* Utilidades de props                                                 */
/* ------------------------------------------------------------------ */

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function M(color: string, emissive?: string, ei = 0, rough = 0.85) {
  const key = `${color}|${emissive}|${ei}|${rough}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, emissive: emissive ?? "#000000", emissiveIntensity: ei });
    matCache.set(key, m);
  }
  return m;
}

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let warmGlow: THREE.Texture | null = null;
function glowSprite(scale: number, tex?: THREE.Texture) {
  if (!warmGlow) warmGlow = glowTexture("rgba(255,195,120,0.95)", "rgba(255,140,40,0.32)");
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex ?? warmGlow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  s.scale.setScalar(scale);
  return s;
}

function windowTexture(seed: number) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1c1a24";
  ctx.fillRect(0, 0, 64, 128);
  const rnd = mulberry32(seed);
  for (let y = 8; y < 128; y += 18) {
    for (let x = 6; x < 64; x += 14) {
      ctx.fillStyle = rnd() > 0.4 ? `rgba(255,${190 + Math.floor(rnd() * 50)},110,0.95)` : "#2a2733";
      ctx.fillRect(x, y, 8, 10);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function shadowAll(o: THREE.Object3D, cast = true) {
  o.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = cast;
      m.receiveShadow = true;
    }
  });
}

export function buildWorld(scene: THREE.Scene): OWWorld {
  const colliders: Collider[] = [];
  const animated: { obj: THREE.Object3D; base: number; kind: "float" | "flicker" | "spin" }[] = [];
  const root = new THREE.Group();
  scene.add(root);

  const place = (o: THREE.Object3D, x: number, z: number, yOff = 0) => {
    o.position.set(x, terrainHeight(x, z) + yOff, z);
    root.add(o);
    return o;
  };

  /* ---------- cielo ---------- */
  const sky = new THREE.Mesh(
      new THREE.SphereGeometry(520, 32, 20),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color("#1e2f5e") }, bottom: { value: new THREE.Color("#0a0f1e") } },
        vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vPos;
          void main(){ float h = clamp((normalize(vPos).y + 0.2) / 1.1, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.8)), 1.0); }`,
      }),
  );
  scene.add(sky);
  const moonDisk = new THREE.Mesh(new THREE.CircleGeometry(18, 40), new THREE.MeshBasicMaterial({ color: "#f6efdc", fog: false }));
  moonDisk.position.set(-160, 150, -380);
  moonDisk.lookAt(0, 0, 0);
  scene.add(moonDisk);
  const moonGlow = glowSprite(150, glowTexture("rgba(255,250,235,0.7)", "rgba(190,205,255,0.2)"));
  (moonGlow.material as THREE.SpriteMaterial).fog = false;
  moonGlow.position.copy(moonDisk.position);
  scene.add(moonGlow);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    const r = 420 + Math.random() * 60;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 0.9);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) + 30;
    starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: "#dfe7ff", size: 1.6, transparent: true, opacity: 0.85, fog: false }));
  scene.add(stars);

  const farMtn = M("#141b2e", undefined, 0, 1);
  for (let i = 0; i < 22; i++) {
    const h = 60 + Math.random() * 80;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(40 + Math.random() * 40, h, 5), farMtn);
    const a = (i / 22) * Math.PI * 2;
    cone.position.set(Math.cos(a) * 280, h / 2 - 20, Math.sin(a) * 280);
    scene.add(cone);
  }

  /* ---------- luces ---------- */
  const hemisphere = new THREE.HemisphereLight("#90a8e4", "#1a1420", 1.15);
  scene.add(hemisphere);
  const moon = new THREE.DirectionalLight("#d5deff", 1.35);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -45;
  moon.shadow.camera.right = 45;
  moon.shadow.camera.top = 45;
  moon.shadow.camera.bottom = -45;
  moon.shadow.camera.near = 1;
  moon.shadow.camera.far = 220;
  moon.shadow.bias = -0.0008;
  scene.add(moon, moon.target);
  for (const [id, color, power] of [
    ["sede", "#ffb15e", 60],
    ["asakusa", "#ffa64d", 80],
    ["natagumo", "#ff3b5c", 50],
    ["castillo", "#b14dff", 90],
  ] as [string, string, number][]) {
    const z = ZONE_BY_ID[id];
    const l = new THREE.PointLight(color, power, z.r * 2.2, 1.6);
    l.position.set(z.x, z.h + 9, z.z);
    scene.add(l);
  }

  /* ---------- terreno ---------- */
  const SIZE = 560;
  const SEG = 240;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = terrainHeight(x, z);
    pos.setY(i, y);
    colorAt(x, z, y, tmp);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  terrain.receiveShadow = true;
  scene.add(terrain);

  /* ---------- constructores ---------- */
  const house = (x: number, z: number, w: number, d: number, h: number, wall: string, roof: string, flip = false) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(wall));
    body.position.y = h / 2;
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.25, d + 0.1), M("#2b1f17"));
    beam.position.y = h - 0.1;
    const roofH = Math.max(1.6, Math.min(w, d) * 0.45);
    const r = new THREE.Mesh(new THREE.ConeGeometry(Math.SQRT1_2, 1, 4), M(roof, undefined, 0, 0.7));
    r.rotation.y = Math.PI / 4;
    r.scale.set(w * 1.22, roofH, d * 1.22);
    r.position.y = h + roofH / 2;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.08), M("#2a1d14"));
    door.position.set(0, 0.95, d / 2 + 0.04);
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.06), M("#ffcf8a", "#ff9a3a", 1.6));
    win.position.set(w * 0.28, h * 0.6, d / 2 + 0.04);
    const win2 = win.clone();
    win2.position.x = -w * 0.28;
    g.add(body, beam, r, door, win, win2);
    if (flip) g.rotation.y = Math.PI;
    shadowAll(g);
    place(g, x, z);
    colliders.push({ kind: "box", x, z, hw: w / 2 + 0.2, hd: d / 2 + 0.2 });
    return g;
  };

  // Casa de Urokodaki: residencia tradicional de madera con veranda, techo a dos aguas y shoji.
  const urokodakiHouse = (x: number, z: number) => {
    const g = new THREE.Group();
    const W = 12, D = 9, H = 4.3;
    const timber = M("#34251c"), plaster = M("#b9aa8c"), roofMat = M("#29332d");
    const wood = M("#74533a"), paper = M("#e4cfa5", "#b48a50", 0.35);
    const addBox = (w: number, h: number, d: number, px: number, py: number, pz: number, mat: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(px, py, pz); g.add(mesh); return mesh;
    };
    addBox(W, 0.55, D, 0, 0.28, 0, timber);
    addBox(W, H - 0.55, D, 0, H / 2 + 0.28, 0, plaster);
    // Amplio engawa (porche japonés), escalones y postes.
    addBox(W + 1.6, 0.28, 2.4, 0, 0.65, D / 2 + 1.05, wood);
    addBox(3.1, 0.23, 0.9, 0, 0.35, D / 2 + 2.55, wood);
    addBox(2.5, 0.18, 0.8, 0, 0.16, D / 2 + 3.25, wood);
    for (const px of [-5.6, -2.8, 2.8, 5.6]) {
      addBox(0.22, H, 0.24, px, H / 2, D / 2 + 0.12, timber);
      addBox(0.24, 2.9, 0.24, px, 2.1, D / 2 + 2, timber);
    }
    addBox(W + 1.2, 0.28, 0.3, 0, H, D / 2 + 1, timber);
    // Tejado a dos aguas: dos planos inclinados con aleros profundos.
    const half = (D + 2.8) / 2, rise = 2.55;
    const slope = Math.hypot(half, rise), angle = Math.atan2(rise, half);
    for (const sign of [-1, 1]) {
      const panel = addBox(W + 2.2, 0.28, slope + 0.4, 0, H + rise / 2, sign * half / 2, roofMat);
      panel.rotation.x = -sign * angle;
    }
    addBox(W + 2.3, 0.24, 0.34, 0, H + rise, 0, timber);
    // Shoji iluminados, cuadrícula de madera y entrada principal.
    for (const cx of [-4.2, -1.4, 1.4, 4.2]) {
      addBox(2.35, 2.65, 0.09, cx, 2.02, D / 2 + 0.11, paper);
      for (const offset of [-0.78, 0, 0.78])
        addBox(0.055, 2.7, 0.12, cx + offset, 2.02, D / 2 + 0.19, timber);
      for (const yy of [1.25, 2.05, 2.85])
        addBox(2.4, 0.055, 0.12, cx, yy, D / 2 + 0.19, timber);
    }
    for (const side of [-1, 1]) {
      addBox(0.12, 1.6, 2.1, side * (W / 2 + 0.07), 2.2, -0.8, paper);
      for (const zz of [-1.5, -0.8, -0.1])
        addBox(0.15, 1.7, 0.06, side * (W / 2 + 0.16), 2.2, zz, timber);
    }
    shadowAll(g);
    place(g, x, z);
    colliders.push({ kind: "box", x, z, hw: W / 2 + 0.2, hd: D / 2 + 0.2 });
    return g;
  };

  const torii = (x: number, z: number, scale = 1, rotY = 0) => {
    const g = new THREE.Group();
    const red = M("#b3242b", "#2a0507", 0.6, 0.6);
    const dark = M("#2a1214");
    for (const sx of [-1.6, 1.6]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 4.4, 10), red);
      p.position.set(sx * scale, 2.2 * scale, 0);
      p.scale.setScalar(scale);
      g.add(p);
      colliders.push({ kind: "circle", x: x + Math.cos(rotY) * sx * scale, z: z - Math.sin(rotY) * sx * scale, r: 0.3 * scale });
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.3, 0.5), dark);
    top.position.y = 4.4;
    const top2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 0.36), red);
    top2.position.y = 3.95;
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.22, 0.3), red);
    beam.position.y = 3.2;
    for (const b of [top, top2, beam]) {
      b.scale.setScalar(scale);
      b.position.y *= scale;
      g.add(b);
    }
    g.rotation.y = rotY;
    shadowAll(g);
    place(g, x, z);
  };

  const lantern = (x: number, z: number) => {
    const g = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.1, 6), M("#2c2118"));
    post.position.y = 1.05;
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.64, 0.5), M("#ffb457", "#ff9a2e", 2.2, 0.4));
    box.position.y = 2.3;
    const glow = glowSprite(2.8);
    glow.position.y = 2.3;
    g.add(post, box, glow);
    post.castShadow = true;
    place(g, x, z);
    animated.push({ obj: glow, base: Math.random() * 6, kind: "flicker" });
    colliders.push({ kind: "circle", x, z, r: 0.25 });
  };

  const stoneLantern = (x: number, z: number) => {
    const g = new THREE.Group();
    const stone = M("#6d717a", undefined, 0, 1);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 6), stone);
    base.position.y = 0.45;
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), M("#ffd08a", "#ff9a3a", 1.4));
    light.position.y = 1.15;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.45, 6), stone);
    cap.position.y = 1.62;
    g.add(base, light, cap);
    shadowAll(g);
    place(g, x, z);
    colliders.push({ kind: "circle", x, z, r: 0.45 });
  };

  const bamboo = (x: number, z: number, rnd: () => number) => {
    const g = new THREE.Group();
    const mat = M("#4b8a52", "#0d2413", 0.4, 0.7);
    for (let i = 0; i < 5; i++) {
      const h = 4 + rnd() * 4;
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, h, 6), mat);
      c.position.set((rnd() - 0.5) * 1.6, h / 2, (rnd() - 0.5) * 1.6);
      c.castShadow = true;
      g.add(c);
    }
    place(g, x, z);
    colliders.push({ kind: "circle", x, z, r: 0.8 });
  };

  const rock = (x: number, z: number, s: number) => {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), M("#4d525e", undefined, 0, 1));
    m.material = new THREE.MeshStandardMaterial({ color: "#4d525e", roughness: 1, flatShading: true });
    m.scale.y = 0.7;
    m.rotation.set(Math.random(), Math.random() * 3, Math.random());
    shadowAll(m);
    place(m, x, z, s * 0.25);
    colliders.push({ kind: "circle", x, z, r: s * 0.85 });
  };

  const water = (x: number, z: number, r: number, color = "#1f4a5c") => {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(r, 28),
      new THREE.MeshStandardMaterial({ color, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.82 }),
    );
    m.rotation.x = -Math.PI / 2;
    place(m, x, z, 0.07);
  };

  const webMat = new THREE.MeshBasicMaterial({ color: "#dfe6f0", wireframe: true, transparent: true, opacity: 0.33 });
  const web = (x: number, z: number, y: number, s: number) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.15, s, 12, 5), webMat);
    m.rotation.set(-0.3 + Math.random() * 0.6, Math.random() * Math.PI, 0);
    place(m, x, z, y);
  };

  /* ---------- árboles instanciados ---------- */
  type TreeType = "pine" | "snowpine" | "round" | "wisteria" | "dead" | "dark";
  const trees: { x: number; z: number; s: number; type: TreeType }[] = [];
  const addTree = (x: number, z: number, type: TreeType, s: number) => {
    trees.push({ x, z, s, type });
    colliders.push({ kind: "circle", x, z, r: 0.45 * s });
  };
  const rnd = mulberry32(20240607);
  const insideZone = (x: number, z: number, pad = 1) => ZONES.some((zn) => Math.hypot(x - zn.x, z - zn.z) < zn.r * pad);
  const biomeTrees: Record<Biome, TreeType[]> = {
    snow: ["snowpine", "snowpine", "pine"],
    forest: ["round", "pine", "round"],
    wisteria: ["wisteria"],
    gravel: ["wisteria", "round"],
    swamp: ["dead", "dead", "round"],
    city: ["round"],
    spider: ["dark", "dead", "dark"],
    rail: ["round", "pine"],
    castle: ["dead"],
  };
  for (const zn of ZONES) {
    if (zn.biome === "city" || zn.biome === "castle" || zn.id === "jardin" || zn.id === "kamado") continue;
    const count = Math.floor(zn.r * 1.3);
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2;
      const d = zn.r * (0.95 + rnd() * 0.75);
      const x = zn.x + Math.cos(a) * d;
      const z = zn.z + Math.sin(a) * d;
      if (roadDistance(x, z) < 5 || Math.abs(x) > WORLD_HALF - 4 || Math.abs(z) > WORLD_HALF - 4) continue;
      if (ZONES.some((o) => o !== zn && Math.hypot(x - o.x, z - o.z) < o.r)) continue;
      const types = biomeTrees[zn.biome];
      addTree(x, z, types[Math.floor(rnd() * types.length)], 0.9 + rnd() * 0.7);
    }
  }
  for (let i = 0; i < 1450; i++) {
    const x = (rnd() * 2 - 1) * (WORLD_HALF - 6);
    const z = (rnd() * 2 - 1) * (WORLD_HALF - 6);
    if (roadDistance(x, z) < 5.5 || insideZone(x, z, 1.15)) continue;
    if (terrainHeight(x, z) > 24) continue;
    const near = zoneAt(x, z) ?? ZONES.reduce((a, b) => (Math.hypot(x - a.x, z - a.z) < Math.hypot(x - b.x, z - b.z) ? a : b));
    const pool = Math.hypot(x - near.x, z - near.z) < near.r * 2.2 ? biomeTrees[near.biome] : (["pine", "round", "round"] as TreeType[]);
    addTree(x, z, pool[Math.floor(rnd() * pool.length)], 0.8 + rnd() * 0.9);
  }
  // Bosque denso dentro de Natagumo con claros para cada combate.
  const nata = ZONE_BY_ID.natagumo;
  const clearings = [[0, 32], [-20, 12], [22, 6], [18, -18], [-4, -22]].map(([dx, dz]) => ({ x: nata.x + dx, z: nata.z + dz }));
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2;
    const d = rnd() * nata.r * 0.95;
    const x = nata.x + Math.cos(a) * d;
    const z = nata.z + Math.sin(a) * d;
    if (roadDistance(x, z) < 4 || clearings.some((c) => Math.hypot(x - c.x, z - c.z) < 10)) continue;
    addTree(x, z, rnd() > 0.5 ? "dark" : "dead", 1 + rnd() * 0.6);
  }

  const TREE_SPEC: Record<TreeType, { trunk: string; canopy?: string; emissive?: string; th: number; geo?: THREE.BufferGeometry; cy: number }> = {
    pine: { trunk: "#3a2a1c", canopy: "#24452f", th: 1.6, geo: new THREE.ConeGeometry(1.4, 3.6, 7), cy: 1.6 },
    snowpine: { trunk: "#3a2a1c", canopy: "#c9d6e3", th: 1.5, geo: new THREE.ConeGeometry(1.4, 3.6, 7), cy: 1.6 },
    round: { trunk: "#3d2b1d", canopy: "#2f6a3a", th: 2, geo: new THREE.IcosahedronGeometry(1.6, 0), cy: 1.1 },
    wisteria: { trunk: "#3d2b1d", canopy: "#9a7ad6", emissive: "#3a2366", th: 2.2, geo: new THREE.IcosahedronGeometry(1.7, 0), cy: 0.9 },
    dead: { trunk: "#2b2420", th: 4.6, cy: 0 },
    dark: { trunk: "#1e1814", canopy: "#16261d", th: 1.9, geo: new THREE.ConeGeometry(1.5, 4.2, 6), cy: 1.9 },
  };
  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.28, 1, 6);
  trunkGeo.translate(0, 0.5, 0);
  const dummy = new THREE.Object3D();
  (Object.keys(TREE_SPEC) as TreeType[]).forEach((type) => {
    const list = trees.filter((t) => t.type === type);
    if (!list.length) return;
    const spec = TREE_SPEC[type];
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, M(spec.trunk, undefined, 0, 1), list.length);
    trunkMesh.castShadow = true;
    let canopyMesh: THREE.InstancedMesh | null = null;
    if (spec.geo && spec.canopy) {
      const mat = new THREE.MeshStandardMaterial({ color: spec.canopy, roughness: 0.9, flatShading: true, emissive: spec.emissive ?? "#000000", emissiveIntensity: spec.emissive ? 0.55 : 0 });
      canopyMesh = new THREE.InstancedMesh(spec.geo, mat, list.length);
      canopyMesh.castShadow = true;
      canopyMesh.receiveShadow = true;
    }
    list.forEach((t, i) => {
      const y = terrainHeight(t.x, t.z);
      dummy.position.set(t.x, y - 0.1, t.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(t.s, spec.th * t.s, t.s);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);
      if (canopyMesh) {
        dummy.position.set(t.x, y + spec.th * t.s + spec.cy * t.s - 0.2, t.z);
        dummy.rotation.set(0, (t.x * 13.7 + t.z) % 6.28, 0);
        dummy.scale.setScalar(t.s);
        dummy.updateMatrix();
        canopyMesh.setMatrixAt(i, dummy.matrix);
      }
    });
    root.add(trunkMesh);
    if (canopyMesh) root.add(canopyMesh);
  });

  /* ---------- decorado por zonas ---------- */
  const Z = (id: string, dx: number, dz: number) => at(id, dx, dz);
  let p = Z("kumotori", 0, 0);

  // Kumotori: tu casa y la aldea nevada.
  p = Z("kumotori", -12, 2); house(p.x, p.z, 7, 6, 3.4, "#6b5139", "#3b2a2a");
  p = Z("kumotori", 11, -5); house(p.x, p.z, 6, 5, 3.1, "#5f4a36", "#4a2626");
  p = Z("kumotori", 15, 11); house(p.x, p.z, 5, 5, 3, "#665040", "#33302e");
  p = Z("kumotori", -2, -15); house(p.x, p.z, 6, 5, 3.2, "#5f4a36", "#4a2626", true);
  p = Z("kumotori", -22, -11); house(p.x, p.z, 5, 5, 3, "#6b5139", "#3b2a2a", true);
  for (const [dx, dz] of [[-4, 7], [4, 7], [0, -5], [-18, 4], [8, 2]]) { p = Z("kumotori", dx, dz); lantern(p.x, p.z); }
  p = Z("kamado", 0, -3); house(p.x, p.z, 7, 6, 3.4, "#5a4330", "#2e2a28");
  p = Z("kamado", 4, 2); lantern(p.x, p.z);
  // Cabaña del viejo Saburo a media ladera: el recodo donde el viento siempre empuja.
  p = Z("kumotori", 20, 22); house(p.x, p.z, 6, 5, 3.1, "#4a3a2c", "#2a2420");
  p = Z("kumotori", 16, 24); lantern(p.x, p.z);
  p = Z("kumotori", 24, 20); lantern(p.x, p.z);

  // Monte Sagiri: cabaña de Urokodaki y cascada.
  p = Z("sagiri", -2, -5); urokodakiHouse(p.x, p.z);
  // Entrada acogedora, jardín de piedra y faroles a ambos lados del sendero.
  for (const [dx, dz] of [[-7, 2], [7, 2], [-7, 7], [7, 7]]) {
    const q = Z("sagiri", -2 + dx, -5 + dz); lantern(q.x, q.z);
  }
  for (const [dx, dz] of [[-9, -2], [9, -2], [-9, 5], [9, 5]]) {
    const q = Z("sagiri", -2 + dx, -5 + dz); rock(q.x, q.z, 0.65);
  }
  p = Z("sagiri", -22, -6);
  const fall = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 16),
    new THREE.MeshBasicMaterial({ color: "#bfe6ff", transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  fall.rotation.y = Math.PI / 2;
  place(fall, p.x - 3, p.z, 8);
  animated.push({ obj: fall, base: 0, kind: "flicker" });
  water(p.x + 1, p.z, 5, "#2a6a8a");
  for (let i = 0; i < 8; i++) { p = Z("sagiri", -18 + rnd() * 36, -18 + rnd() * 36); if (roadDistance(p.x, p.z) > 4 && Math.hypot(p.x - ZONE_BY_ID.sagiri.x - 2, p.z - ZONE_BY_ID.sagiri.z - 5) > 6) rock(p.x, p.z, 0.6 + rnd()); }

  // Fujikasane: torii de entrada y glicinias.
  p = Z("fujikasane", 0, 24); torii(p.x, p.z, 1.2, 0);
  for (const [dx, dz] of [[-6, 22], [6, 22]]) { p = Z("fujikasane", dx, dz); stoneLantern(p.x, p.z); }

  // Sede del Cuerpo.
  p = Z("sede", 0, -8);
  house(p.x, p.z, 16, 9, 4.4, "#d8cfbd", "#3b2d4d");
  p = Z("sede", 0, 24); torii(p.x, p.z, 1.3, 0);
  for (const dz of [10, 15, 20]) for (const dx of [-4, 4]) { p = Z("sede", dx, dz); lantern(p.x, p.z); }
  p = Z("sede", 14, 6); house(p.x, p.z, 6, 5, 3, "#d8cfbd", "#3b2d4d");
  p = Z("sede", -14, 6); house(p.x, p.z, 6, 5, 3, "#d8cfbd", "#3b2d4d");

  // Jardín de los Pilares.
  p = Z("jardin", 0, 0);
  const gravel = new THREE.Mesh(new THREE.CircleGeometry(10, 36), M("#e8e6dc", undefined, 0, 1));
  gravel.rotation.x = -Math.PI / 2;
  place(gravel, p.x, p.z, 0.05);
  gravel.receiveShadow = true;
  for (const [dx, dz] of [[-9, 4], [9, 4], [-9, -6], [9, -6]]) { p = Z("jardin", dx, dz); stoneLantern(p.x, p.z); }
  p = Z("jardin", 0, -10); house(p.x, p.z, 10, 5, 3.4, "#e6dccb", "#2e2440", true);

  // Pantano.
  p = Z("pantano", -20, 6); house(p.x, p.z, 6, 5, 3, "#4e3e2e", "#2b2b26");
  p = Z("pantano", -8, 22); house(p.x, p.z, 5, 5, 3, "#4e3e2e", "#2b2b26");
  for (const [dx, dz, r] of [[10, -8, 9], [20, 6, 5], [-2, -18, 6], [24, -16, 4]]) { p = Z("pantano", dx, dz); water(p.x, p.z, r, "#1d3b30"); }
  for (const [dx, dz] of [[-15, 12], [-10, 8]]) { p = Z("pantano", dx, dz); lantern(p.x, p.z); }

  // Asakusa: manzanas iluminadas y la gran linterna.
  const blockMat = (seed: number) => {
    const tex = windowTexture(seed);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffcf7a", emissiveIntensity: 0.9, roughness: 0.8 });
  };
  let seed = 3;
  for (const dx of [-20, -11, 11, 20]) {
    for (const dz of [-20, -10, 9, 19]) {
      const h = 6 + ((seed * 7) % 6);
      const w = 7;
      const d = 7;
      p = Z("asakusa", dx, dz);
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blockMat(seed++));
      b.position.y = h / 2;
      const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.5, d + 0.6), M("#2a2633"));
      top.position.y = h + 0.25;
      const g = new THREE.Group();
      g.add(b, top);
      shadowAll(g);
      place(g, p.x, p.z);
      colliders.push({ kind: "box", x: p.x, z: p.z, hw: w / 2 + 0.2, hd: d / 2 + 0.2 });
    }
  }
  p = Z("asakusa", 0, 27);
  torii(p.x, p.z, 1.5, 0);
  const bigLantern = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.2, 14), M("#d23b2f", "#a01a10", 1.2, 0.5));
  place(bigLantern, p.x, p.z, 4.4);
  for (const dz of [-14, -4, 4, 14, 22]) for (const dx of [-4, 4]) { p = Z("asakusa", dx, dz); lantern(p.x, p.z); }

  // Mansión Tsuzumi.
  p = Z("mansion", 0, -12);
  house(p.x, p.z, 18, 10, 5.5, "#3e3044", "#1d1622");
  for (const [dx, dz] of [[-4, 18], [4, 18]]) { p = Z("mansion", dx, dz); lantern(p.x, p.z); }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    p = Z("mansion", Math.cos(a) * 20, Math.sin(a) * 20);
    if (roadDistance(p.x, p.z) > 4 && Math.abs(Math.sin(a) * 20 - 18) > 5) bamboo(p.x, p.z, rnd);
  }

  // Natagumo: telarañas.
  for (const c of clearings) {
    for (let i = 0; i < 4; i++) {
      const a = rnd() * Math.PI * 2;
      web(c.x + Math.cos(a) * 8, c.z + Math.sin(a) * 8, 2 + rnd() * 3, 1.6 + rnd() * 1.8);
    }
  }

  // Estación del Tren Mugen.
  const mg = ZONE_BY_ID.mugen;
  for (const dz of [-10.8, -9.2]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(90, 0.15, 0.18), M("#7c7c84", undefined, 0, 0.4));
    place(rail, mg.x, mg.z + dz, 0.1);
  }
  for (let i = 0; i < 4; i++) {
    const cx = mg.x - 6 + i * 9;
    const cz = mg.z - 10;
    const g = new THREE.Group();
    const car = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3, 3), M(i === 0 ? "#1d1d22" : "#1f3b2a"));
    car.position.y = 2;
    const wins = new THREE.Mesh(new THREE.BoxGeometry(7, 0.7, 3.05), M("#ffd88a", "#ffb43a", 1.4));
    wins.position.y = 2.4;
    g.add(car, wins);
    if (i === 0) {
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.6, 10), M("#151518"));
      chimney.position.set(-2.6, 4.2, 0);
      g.add(chimney);
    }
    shadowAll(g);
    place(g, cx, cz);
    colliders.push({ kind: "box", x: cx, z: cz, hw: 4.2, hd: 1.6 });
  }
  const platform = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 4), M("#6b6458"));
  place(platform, mg.x + 4, mg.z - 5, 0.05);
  platform.receiveShadow = true;
  for (const dx of [-8, 4, 16]) { p = { x: mg.x + dx, z: mg.z - 4 }; lantern(p.x, p.z); }

  // Castillo Infinito.
  const cs = ZONE_BY_ID.castillo;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(26, 8), M("#2a1636", "#1a0826", 0.6, 0.6));
  floor.rotation.x = -Math.PI / 2;
  place(floor, cs.x, cs.z, 0.06);
  floor.receiveShadow = true;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const x = cs.x + Math.cos(a) * 22;
    const z = cs.z + Math.sin(a) * 22;
    if (roadDistance(x, z) < 4) continue;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 12, 8), M("#3a1d48", "#5a1a7a", 0.5));
    shadowAll(pillar);
    place(pillar, x, z, 6);
    colliders.push({ kind: "circle", x, z, r: 1 });
  }
  for (let i = 0; i < 14; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(2 + rnd() * 3, 0.4, 2 + rnd() * 3), M("#4a2a5a", "#6a2a8a", 0.7));
    const a = rnd() * Math.PI * 2;
    const d = 6 + rnd() * 30;
    place(box, cs.x + Math.cos(a) * d, cs.z + Math.sin(a) * d, 7 + rnd() * 14);
    box.rotation.set(rnd(), rnd() * 3, rnd() * 0.5);
    animated.push({ obj: box, base: box.position.y, kind: "float" });
  }
  p = Z("castillo", 0, 26); torii(p.x, p.z, 1.6, 0);

  /* ---------- pétalos alrededor del jugador ---------- */
  const PETALS = 500;
  const petalGeo = new THREE.BufferGeometry();
  const petalPos = new Float32Array(PETALS * 3);
  const petalSpeed = new Float32Array(PETALS);
  for (let i = 0; i < PETALS; i++) {
    petalPos[i * 3] = (Math.random() - 0.5) * 70;
    petalPos[i * 3 + 1] = Math.random() * 30;
    petalPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
    petalSpeed[i] = 0.6 + Math.random() * 1.4;
  }
  petalGeo.setAttribute("position", new THREE.Float32BufferAttribute(petalPos, 3));
  const petals = new THREE.Points(
    petalGeo,
    new THREE.PointsMaterial({ color: "#ffc4dd", size: 0.32, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  petals.frustumCulled = false;
  scene.add(petals);

  let morning = false;
  const setMorning = (value: boolean) => {
    morning = value;
    sky.material.uniforms.top.value.set(value ? "#87b8d4" : "#1e2f5e");
    sky.material.uniforms.bottom.value.set(value ? "#f6e7c9" : "#0a0f1e");
    moonDisk.visible = moonGlow.visible = stars.visible = !value;
    hemisphere.color.set(value ? "#dcecff" : "#90a8e4");
    hemisphere.groundColor.set(value ? "#8d8670" : "#1a1420");
    hemisphere.intensity = value ? 2.9 : 1.15;
    moon.color.set(value ? "#ffe3a8" : "#d5deff");
    moon.intensity = value ? 3.1 : 1.35;
  };
  const update = (t: number, dt: number, player: THREE.Vector3) => {
    petals.visible = !(Math.hypot(player.x + 120, player.z - 128) < 85) && !morning;
    moon.position.set(player.x - 40, player.y + 70, player.z - 30);
    moon.target.position.copy(player);

    petals.position.set(player.x, player.y - 6, player.z);
    const pp = petalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < PETALS; i++) {
      let y = pp.getY(i) - petalSpeed[i] * dt;
      if (y < -4) y = 30;
      pp.setY(i, y);
      pp.setX(i, pp.getX(i) + Math.sin(t * 0.7 + i) * dt * 0.6);
    }
    pp.needsUpdate = true;

    for (const a of animated) {
      if (a.kind === "float") {
        a.obj.position.y = a.base + Math.sin(t * 0.6 + a.base) * 1.2;
        a.obj.rotation.y += dt * 0.15;
      } else if (a.kind === "flicker") {
        const s = a.obj as THREE.Sprite | THREE.Mesh;
        const mat = s.material as THREE.Material & { opacity: number };
        mat.opacity = 0.75 + Math.sin(t * 6 + a.base) * 0.12 + Math.sin(t * 13 + a.base) * 0.06;
      }
    }
  };

  return { colliders, moon, update, setMorning };
}
