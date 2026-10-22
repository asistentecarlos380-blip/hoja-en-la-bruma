import * as THREE from "three";

export type Look = {
  skin?: string;
  uniform: string;
  haori: string;
  haori2?: string;
  hair: string;
  longHair?: boolean;
  sword?: boolean;
  scale?: number;
  mask?: string;
  hat?: string;
  muzzle?: boolean;
  character?: "tanjiro" | "nezuko" | "giyu";
  boar?: boolean;
};

export type Humanoid = {
  group: THREE.Group;
  body: THREE.Group;
  legs: THREE.Group[];
  arms: THREE.Group[];
  sword: THREE.Group | null;
  haori: THREE.Mesh;
  basket: THREE.Group;
};

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string, emissive = "#000000", ei = 0, rough = 0.8, metal = 0) {
  const key = `${color}|${emissive}|${ei}|${rough}|${metal}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, roughness: rough, metalness: metal });
    matCache.set(key, m);
  }
  return m;
}

const texCache = new Map<string, THREE.MeshStandardMaterial>();
function checkerMat(a: string, b: string) {
  const key = `${a}|${b}`;
  let m = texCache.get(key);
  if (!m) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? a : b;
        ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
    texCache.set(key, m);
  }
  return m;
}

function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  return mesh;
}

/** Ajusta únicamente la corpulencia: conserva estatura, cabeza y longitud de las extremidades.
 * progress=0: principiante delgado; progress=1: proporciones originales. */
export function setTrainingPhysique(h: Humanoid, progress: number) {
  const t = THREE.MathUtils.clamp(progress, 0, 1);
  const smooth = t * t * (3 - 2 * t);
  const width = THREE.MathUtils.lerp(0.72, 1, smooth);
  const depth = THREE.MathUtils.lerp(0.82, 1, smooth);
  // Primeras dos piezas del cuerpo: uniforme y haori. No deformar la cabeza.
  for (const piece of h.body.children.slice(0, 2)) {
    piece.scale.x = width;
    piece.scale.z = depth;
  }
  for (const [index, arm] of h.arms.entries()) {
    arm.position.x = (index === 0 ? -1 : 1) * THREE.MathUtils.lerp(0.32, 0.41, smooth);
    for (const piece of arm.children) {
      piece.scale.x = THREE.MathUtils.lerp(0.77, 1, smooth);
      piece.scale.z = depth;
    }
  }
  for (const [index, leg] of h.legs.entries()) {
    leg.position.x = (index === 0 ? -1 : 1) * THREE.MathUtils.lerp(0.145, 0.17, smooth);
    for (const piece of leg.children) {
      piece.scale.x = THREE.MathUtils.lerp(0.8, 1, smooth);
      piece.scale.z = depth;
    }
  }
}

/** Humanoide low-poly. Su frente mira hacia +Z. */
export function buildHumanoid(look: Look): Humanoid {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  body.scale.setScalar(look.scale ?? 1);

  const skin = mat(look.skin ?? "#f2cba4");
  const uniform = mat(look.uniform);
  const hair = mat(look.hair, "#000000", 0, 0.95);
  const haoriMat = look.haori2 ? checkerMat(look.haori, look.haori2) : mat(look.haori);

  body.add(box(0.62, 0.72, 0.4, uniform, 0, 1.02, 0));
  const haori = box(0.78, 0.92, 0.5, haoriMat, 0, 0.98, -0.02);
  body.add(haori);

  const basket = new THREE.Group();
  basket.name = "nezuko_basket";
  basket.visible = false;
  const basketBody = box(0.48, 0.74, 0.36, mat("#8a6236"), 0, 1.06, -0.42);
  const basketTop = box(0.50, 0.10, 0.38, mat("#5c3d1e"), 0, 1.44, -0.42);
  const basketCloth = box(0.46, 0.22, 0.37, mat("#6a2832"), 0, 1.28, -0.42);
  basket.add(basketBody, basketTop, basketCloth);
  body.add(basket);

  if (look.boar) {
    body.add(box(0.48, 0.46, 0.52, mat("#6b5a4a", "#000000", 0, 1), 0, 1.62, 0));
    body.add(box(0.2, 0.16, 0.14, mat("#5a4a3a"), 0, 1.56, 0.32));
    for (const sx of [-0.12, 0.12]) {
      const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 5), mat("#f2efe6"));
      tusk.position.set(sx, 1.5, 0.36);
      tusk.rotation.x = -1.2;
      body.add(tusk);
    }
    for (const sx of [-0.25, 0.25]) body.add(box(0.1, 0.16, 0.08, mat("#6b5a4a"), sx, 1.9, 0));
  } else {
    body.add(box(0.38, 0.38, 0.36, skin, 0, 1.6, 0));
    const eye = mat("#141218");
    body.add(box(0.06, 0.06, 0.02, eye, -0.08, 1.63, 0.185), box(0.06, 0.06, 0.02, eye, 0.08, 1.63, 0.185));
    body.add(box(0.42, 0.18, 0.4, hair, 0, 1.79, -0.01));
    body.add(box(0.42, 0.24, 0.1, hair, 0, 1.68, -0.17));
    // Mechones angulares y rasgos faciales más cercanos al estilo anime.
    for (const sx of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.29, 5), hair);
      lock.position.set(sx * 0.18, 1.73, 0.13);
      lock.rotation.z = sx * 0.28;
      body.add(lock);
      body.add(box(0.085, 0.022, 0.022, hair, sx * 0.09, 1.715, 0.197));
    }
    if (look.character === "tanjiro") {
      const scar = box(0.13, 0.065, 0.018, mat("#8c3531"), -0.115, 1.735, 0.196);
      scar.rotation.z = -0.35; body.add(scar);
      for (const sx of [-1, 1]) {
        const earring = box(0.075, 0.17, 0.02, mat("#f1ede1"), sx * 0.24, 1.46, 0.03);
        earring.add(box(0.065, 0.045, 0.023, mat("#c74b38"), 0, -0.04, 0)); body.add(earring);
      }
    }
    if (look.character === "nezuko") {
      for (const sx of [-1, 1]) {
        const ribbon = box(0.13, 0.12, 0.11, mat("#f1a1b5"), sx * 0.2, 1.7, -0.13);
        ribbon.rotation.z = sx * 0.4; body.add(ribbon);
        const tip = box(0.12, 0.28, 0.11, mat("#a95b3a"), sx * 0.19, 1.12, -0.23);
        body.add(tip);
      }
    }
    if (look.character === "giyu") {
      for (const sx of [-1, 1]) body.add(box(0.16, 0.36, 0.14, hair, sx * 0.16, 1.52, -0.12));
    }
    if (look.longHair) body.add(box(0.42, 0.62, 0.12, hair, 0, 1.38, -0.21));
  }
  if (look.mask) {
    body.add(box(0.36, 0.32, 0.05, mat(look.mask, look.mask, 0.2), 0, 1.6, 0.2));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 6), mat(look.mask));
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.6, 0.32);
    body.add(nose);
  }
  if (look.muzzle) {
    const muzzle = box(0.3, 0.06, 0.06, mat("#7a9a3a"), 0, 1.5, 0.2);
    muzzle.name = "nezuko_muzzle";
    body.add(muzzle);
    // Cilindro de bambú real con anillos en los extremos y cordón oscuro.
    const bamboo = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.38, 10), mat("#72934b"));
    bamboo.rotation.z = Math.PI / 2;
    bamboo.position.set(0, 0, 0.055);
    bamboo.name = "nezuko_bamboo_detail";
    muzzle.add(bamboo);
    for (const sx of [-0.16, 0.16]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.012, 6, 12), mat("#3f5d2d"));
      ring.rotation.y = Math.PI / 2; ring.position.set(sx, 0, 0.055); muzzle.add(ring);
    }
  }
  if (look.hat) {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 16), mat(look.hat));
    brim.position.y = 1.85;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.26, 16), mat(look.hat));
    crown.position.y = 1.99;
    body.add(brim, crown);
  }

  const legs: THREE.Group[] = [];
  for (const sx of [-0.17, 0.17]) {
    const leg = new THREE.Group();
    leg.add(box(0.2, 0.66, 0.24, uniform, 0, -0.33, 0));
    leg.position.set(sx, 0.66, 0);
    body.add(leg);
    legs.push(leg);
  }
  const arms: THREE.Group[] = [];
  for (const sx of [-0.41, 0.41]) {
    const arm = new THREE.Group();
    arm.add(box(0.17, 0.58, 0.19, haoriMat, 0, -0.29, 0));
    arm.add(box(0.12, 0.12, 0.12, skin, 0, -0.62, 0));
    arm.position.set(sx, 1.3, 0);
    body.add(arm);
    arms.push(arm);
  }

  let sword: THREE.Group | null = null;
  if (look.sword) {
    sword = new THREE.Group();
    const blade = box(0.07, 0.07, 1.45, mat("#e8f4ff", "#8fd0ff", 1.3, 0.25, 0.6), 0, 0, 0.78);
    const guard = box(0.22, 0.22, 0.06, mat("#d4af37", "#000000", 0, 0.3, 0.8));
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.42, 8), mat("#2b1c1c"));
    handle.rotation.x = Math.PI / 2;
    handle.position.z = -0.22;
    sword.add(blade, guard, handle);
    sword.position.set(0.44, 1.02, 0.14);
    sword.rotation.set(-0.5, 0.2, 0.3);
    body.add(sword);
  }

  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.castShadow = true;
  });
  return { group, body, legs, arms, sword, haori, basket };
}

export function animateHumanoid(h: Humanoid, phase: number, speed01: number, grounded: boolean, slashK = -1) {
  const s = Math.sin(phase) * speed01;
  h.legs[0].rotation.x = s * 0.9;
  h.legs[1].rotation.x = -s * 0.9;
  h.arms[0].rotation.x = -s * 0.7;
  h.arms[1].rotation.x = s * 0.5;
  h.body.position.y = Math.abs(s) * 0.06 + (grounded ? 0 : 0.05);
  h.haori.rotation.x = -speed01 * 0.2;
  if (h.sword) {
    if (slashK >= 0) {
      h.sword.rotation.set(-0.5 - slashK * 2.6, 0.2 + slashK * 1.4, 0.3 + slashK * 1.2);
      h.arms[1].rotation.x = -1.4 + slashK * 2.2;
    } else {
      h.sword.rotation.set(-0.5 + s * 0.1, 0.2, 0.3);
    }
  }
}

function labelCanvas(text: string, color: string, size: number) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = `bold ${size}px sans-serif`;
  const w = Math.ceil(ctx.measureText(text).width) + size;
  c.width = w;
  c.height = Math.ceil(size * 1.6);
  const ctx2 = c.getContext("2d")!;
  ctx2.font = `bold ${size}px sans-serif`;
  ctx2.fillStyle = "rgba(8,10,20,0.72)";
  const r = c.height / 2;
  ctx2.beginPath();
  ctx2.moveTo(r, 0);
  ctx2.lineTo(w - r, 0);
  ctx2.arc(w - r, r, r, -Math.PI / 2, Math.PI / 2);
  ctx2.lineTo(r, c.height);
  ctx2.arc(r, r, r, Math.PI / 2, (Math.PI * 3) / 2);
  ctx2.fill();
  ctx2.fillStyle = color;
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";
  ctx2.fillText(text, w / 2, c.height / 2 + 1);
  return c;
}

export function makeLabel(text: string, color = "#ffe9a8") {
  const c = labelCanvas(text, color, 30);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const h = 0.42;
  s.scale.set((c.width / c.height) * h, h, 1);
  s.renderOrder = 10;
  return s;
}

export function makeMarker(char: string, color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.font = "bold 104px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 64, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
  s.scale.setScalar(0.9);
  s.renderOrder = 11;
  return s;
}

export function buildDemon(scale: number, boss: boolean, tint = "#8c1226") {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({
    color: boss ? "#2b0b33" : "#41111f",
    emissive: tint,
    emissiveIntensity: boss ? 1 : 0.55,
    roughness: 0.6,
    flatShading: true,
  });
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(scale, boss ? 1 : 0), m);
  body.castShadow = true;
  g.add(body);
  const eyeMat = new THREE.MeshBasicMaterial({ color: boss ? "#ff4d6d" : "#ffd84a" });
  const eyes = boss ? 4 : 2;
  for (let i = 0; i < eyes; i++) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.13, 8, 8), eyeMat);
    e.position.set((i - (eyes - 1) / 2) * scale * 0.32, scale * 0.25, scale * 0.86);
    g.add(e);
  }
  const spikes = boss ? 10 : 5;
  for (let i = 0; i < spikes; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(scale * 0.14, scale * 0.6, 5), m);
    const a = (i / spikes) * Math.PI * 2;
    spike.position.set(Math.cos(a) * scale * 0.85, Math.sin(a * 2) * scale * 0.3, Math.sin(a) * scale * 0.85);
    spike.lookAt(spike.position.clone().multiplyScalar(2.2));
    g.add(spike);
  }
  return { group: g, mat: m };
}

export function buildCrow() {
  const g = new THREE.Group();
  const black = mat("#121218", "#000000", 0, 0.6);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.5, 6), mat("#3a2a1c"));
  post.position.y = 0.75;
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), black);
  body.scale.set(0.8, 0.8, 1.3);
  body.position.y = 1.75;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), black);
  head.position.set(0, 2.0, 0.32);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 6), mat("#e8c24a"));
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 1.98, 0.55);
  const wingL = box(0.06, 0.26, 0.5, black, -0.3, 1.78, 0);
  const wingR = box(0.06, 0.26, 0.5, black, 0.3, 1.78, 0);
  g.add(post, body, head, beak, wingL, wingR);
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.castShadow = true;
  });
  return g;
}
