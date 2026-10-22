import * as THREE from "three";
import { LEVEL, type PlatformDef } from "./level";

export type Plat = {
  def: PlatformDef;
  group: THREE.Group;
  center: THREE.Vector3;
  half: THREE.Vector3;
  base: THREE.Vector3;
  vel: THREE.Vector3;
  prev: THREE.Vector3;
};

export type World = {
  platforms: Plat[];
  gate: THREE.Group;
  portalMat: THREE.MeshBasicMaterial;
  update: (t: number, dt: number) => void;
  setGateOpen: (open: boolean) => void;
};

function glowTexture(inner: string, outer: string): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function torii(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: "#b3242b", roughness: 0.6, emissive: "#2a0507", emissiveIntensity: 0.6 });
  const dark = new THREE.MeshStandardMaterial({ color: "#2a1214", roughness: 0.8 });
  const pillar = new THREE.CylinderGeometry(0.16 * scale, 0.2 * scale, 4.2 * scale, 10);
  const p1 = new THREE.Mesh(pillar, mat);
  p1.position.set(-1.5 * scale, 2.1 * scale, 0);
  const p2 = p1.clone();
  p2.position.x = 1.5 * scale;
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.6 * scale, 0.28 * scale, 0.5 * scale), dark);
  top.position.y = 4.2 * scale;
  const top2 = new THREE.Mesh(new THREE.BoxGeometry(4.1 * scale, 0.2 * scale, 0.36 * scale), mat);
  top2.position.y = 3.75 * scale;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(3.6 * scale, 0.22 * scale, 0.3 * scale), mat);
  beam.position.y = 3.1 * scale;
  g.add(p1, p2, top, top2, beam);
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return g;
}

function lantern(): THREE.Group {
  const g = new THREE.Group();
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.1, 8), new THREE.MeshStandardMaterial({ color: "#2c2118", roughness: 0.9 }));
  post.position.y = 1.05;
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.66, 0.52), new THREE.MeshStandardMaterial({ color: "#ffb457", emissive: "#ff9a2e", emissiveIntensity: 2.1, roughness: 0.4 }));
  box.position.y = 2.3;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.28, 4), new THREE.MeshStandardMaterial({ color: "#2c2118", roughness: 0.9 }));
  cap.position.y = 2.78;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("rgba(255,190,110,0.95)", "rgba(255,140,40,0.35)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  glow.scale.setScalar(2.6);
  glow.position.y = 2.3;
  g.add(post, box, cap, glow);
  post.castShadow = true;
  g.userData.sway = Math.random() * Math.PI * 2;
  return g;
}

function bamboo(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: "#3f7a4a", roughness: 0.75, emissive: "#0d2413", emissiveIntensity: 0.5 });
  const n = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const h = 3.4 + Math.random() * 3.4;
    const culm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, h, 7), mat);
    culm.position.set((Math.random() - 0.5) * 1.5, h / 2, (Math.random() - 0.5) * 1.5);
    culm.rotation.z = (Math.random() - 0.5) * 0.12;
    culm.castShadow = true;
    g.add(culm);
    for (let j = 0; j < 3; j++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.9, 4), mat);
      leaf.position.copy(culm.position).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, h * (0.55 + j * 0.16), (Math.random() - 0.5) * 0.8));
      leaf.rotation.set(Math.random(), Math.random() * 3, Math.PI / 2.4);
      g.add(leaf);
    }
  }
  return g;
}

function rock(): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.6 + Math.random() * 0.8, 0),
    new THREE.MeshStandardMaterial({ color: "#4a4f5c", roughness: 1, flatShading: true }),
  );
  m.scale.set(1, 0.7 + Math.random() * 0.5, 1);
  m.rotation.set(Math.random(), Math.random() * 3, Math.random());
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function platformMesh(def: PlatformDef): THREE.Group {
  const g = new THREE.Group();
  const palette =
    def.kind === "wood"
      ? { body: "#5d4227", top: "#8a6242" }
      : def.kind === "arena"
        ? { body: "#2b2333", top: "#4a3550" }
        : { body: "#3a3f4d", top: "#7c8794" };
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(def.w, def.h, def.d),
    new THREE.MeshStandardMaterial({ color: palette.body, roughness: 0.95, flatShading: true }),
  );
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(def.w * 1.01, 0.18, def.d * 1.01),
    new THREE.MeshStandardMaterial({ color: palette.top, roughness: 0.85 }),
  );
  top.position.y = def.h / 2 - 0.06;
  body.castShadow = body.receiveShadow = true;
  top.receiveShadow = true;
  g.add(body, top);

  // Base rocosa irregular bajo la plataforma.
  const underside = new THREE.Mesh(
    new THREE.ConeGeometry(Math.min(def.w, def.d) * 0.55, def.h * 2.4, 7),
    new THREE.MeshStandardMaterial({ color: "#232833", roughness: 1, flatShading: true }),
  );
  underside.position.y = -def.h * 1.5;
  underside.rotation.x = Math.PI;
  g.add(underside);

  const deco = def.deco ?? [];
  deco.forEach((kind, i) => {
    const px = (i % 2 === 0 ? -1 : 1) * (def.w * 0.32);
    const pz = (i < 2 ? -1 : 1) * (def.d * 0.3);
    let obj: THREE.Object3D | null = null;
    if (kind === "torii") {
      obj = torii(def.kind === "arena" ? 1.5 : 0.95);
      obj.position.set(0, def.h / 2, def.d * 0.28);
    } else if (kind === "lantern") {
      obj = lantern();
      obj.position.set(px, def.h / 2, pz);
    } else if (kind === "bamboo") {
      obj = bamboo();
      obj.position.set(px * 1.15, def.h / 2, pz * 1.1);
    } else if (kind === "rock") {
      obj = rock();
      obj.position.set(px, def.h / 2 + 0.2, pz);
    }
    if (obj) g.add(obj);
  });
  return g;
}

export function buildWorld(scene: THREE.Scene): World {
  /* ---------- cielo, luna y estrellas ---------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 20),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(LEVEL.skyTop) },
        bottom: { value: new THREE.Color(LEVEL.skyBottom) },
      },
      vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vPos;
        void main(){ float h = clamp((normalize(vPos).y + 0.25) / 1.1, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, pow(h, 0.85)), 1.0); }`,
    }),
  );
  scene.add(sky);

  const moon = new THREE.Mesh(new THREE.CircleGeometry(15, 40), new THREE.MeshBasicMaterial({ color: LEVEL.moonColor, fog: false }));
  moon.position.set(-90, 78, -230);
  scene.add(moon);
  const moonGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(255,250,235,0.75)", "rgba(190,205,255,0.22)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }),
  );
  moonGlow.scale.setScalar(120);
  moonGlow.position.copy(moon.position);
  scene.add(moonGlow);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(700 * 3);
  for (let i = 0; i < 700; i++) {
    const r = 300 + Math.random() * 90;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 0.85);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) + 20;
    starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: "#dfe7ff", size: 1.5, sizeAttenuation: true, transparent: true, opacity: 0.85, fog: false })));

  /* ---------- montañas lejanas ---------- */
  const mtn = new THREE.MeshStandardMaterial({ color: "#141a2c", roughness: 1, flatShading: true });
  for (let i = 0; i < 16; i++) {
    const h = 40 + Math.random() * 70;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(28 + Math.random() * 34, h, 5), mtn);
    const a = (i / 16) * Math.PI * 2;
    cone.position.set(Math.cos(a) * 210, h / 2 - 30, Math.sin(a) * 210 - 40);
    scene.add(cone);
  }

  /* ---------- luces ---------- */
  scene.add(new THREE.HemisphereLight("#7f96d8", "#120e18", 0.85));
  const sun = new THREE.DirectionalLight("#cfd9ff", 1.25);
  sun.position.set(-46, 62, -40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 220;
  sun.shadow.camera.left = -70;
  sun.shadow.camera.right = 70;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -50;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  const warm = new THREE.PointLight("#ffab4a", 22, 26, 2);
  warm.position.set(0, 4, 2);
  scene.add(warm);
  const arenaLight = new THREE.PointLight("#ff5f7a", 40, 46, 2);
  arenaLight.position.set(LEVEL.boss.x, LEVEL.boss.y + 4, LEVEL.boss.z);
  scene.add(arenaLight);

  /* ---------- plataformas ---------- */
  const platforms: Plat[] = [];
  const platGroup = new THREE.Group();
  scene.add(platGroup);
  for (const def of LEVEL.platforms) {
    const group = platformMesh(def);
    group.position.set(def.x, def.y, def.z);
    platGroup.add(group);
    platforms.push({
      def,
      group,
      center: new THREE.Vector3(def.x, def.y, def.z),
      half: new THREE.Vector3(def.w / 2, def.h / 2, def.d / 2),
      base: new THREE.Vector3(def.x, def.y, def.z),
      vel: new THREE.Vector3(),
      prev: new THREE.Vector3(def.x, def.y, def.z),
    });
  }

  /* ---------- portal final ---------- */
  const gate = new THREE.Group();
  const bigTorii = torii(2.1);
  gate.add(bigTorii);
  const portalMat = new THREE.MeshBasicMaterial({
    color: "#9fd8ff",
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const portal = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 7.4), portalMat);
  portal.position.y = 4.4;
  gate.add(portal);
  const gateGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(190,235,255,0.9)", "rgba(120,180,255,0.25)"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
  );
  gateGlow.scale.setScalar(14);
  gateGlow.position.y = 4.4;
  gate.add(gateGlow);
  gate.position.set(LEVEL.gate.x, LEVEL.gate.y, LEVEL.gate.z);
  scene.add(gate);

  /* ---------- pétalos de cerezo ---------- */
  const petalCount = 620;
  const petalGeo = new THREE.BufferGeometry();
  const petalPos = new Float32Array(petalCount * 3);
  const petalSpeed = new Float32Array(petalCount);
  for (let i = 0; i < petalCount; i++) {
    petalPos[i * 3] = (Math.random() - 0.5) * 90;
    petalPos[i * 3 + 1] = Math.random() * 46 - 6;
    petalPos[i * 3 + 2] = Math.random() * -130 + 20;
    petalSpeed[i] = 0.6 + Math.random() * 1.5;
  }
  petalGeo.setAttribute("position", new THREE.Float32BufferAttribute(petalPos, 3));
  const petals = new THREE.Points(
    petalGeo,
    new THREE.PointsMaterial({ color: "#ffc4dd", size: 0.34, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  scene.add(petals);

  /* ---------- capas de bruma ---------- */
  const mistMat = new THREE.MeshBasicMaterial({ color: "#a9bfe6", transparent: true, opacity: 0.055, depthWrite: false, side: THREE.DoubleSide });
  const mists: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), mistMat.clone());
    m.rotation.x = -Math.PI / 2;
    m.position.set((Math.random() - 0.5) * 30, -4 + i * 4.5, -50 - i * 8);
    scene.add(m);
    mists.push(m);
  }

  let gateOpen = false;

  const update = (t: number, dt: number) => {
    for (const p of platforms) {
      p.prev.copy(p.center);
      const mv = p.def.move;
      if (mv) {
        const s = Math.sin(t * mv.speed + (mv.phase ?? 0)) * mv.range;
        if (mv.axis === "x") p.group.position.x = p.base.x + s;
        if (mv.axis === "y") p.group.position.y = p.base.y + s;
        if (mv.axis === "z") p.group.position.z = p.base.z + s;
      }
      p.center.copy(p.group.position);
      p.vel.copy(p.center).sub(p.prev).divideScalar(Math.max(dt, 0.0001));
      // Balanceo suave de faroles y bambú.
      p.group.children.forEach((child) => {
        if (child.userData.sway !== undefined) child.rotation.z = Math.sin(t * 1.4 + child.userData.sway) * 0.03;
      });
    }

    const pos = petalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < petalCount; i++) {
      const y = pos.getY(i) - petalSpeed[i] * dt;
      pos.setY(i, y < -8 ? 42 : y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.7 + i) * dt * 0.7);
    }
    pos.needsUpdate = true;

    mists.forEach((m, i) => {
      m.position.x = Math.sin(t * 0.06 + i) * 22;
      (m.material as THREE.MeshBasicMaterial).opacity = 0.04 + Math.sin(t * 0.3 + i) * 0.02;
    });

    if (gateOpen) {
      portalMat.opacity = 0.35 + Math.sin(t * 3) * 0.12;
      gateGlow.scale.setScalar(14 + Math.sin(t * 2.2) * 1.6);
      portal.rotation.z = t * 0.15;
    }
    arenaLight.intensity = 34 + Math.sin(t * 2.6) * 10;
  };

  return {
    platforms,
    gate,
    portalMat,
    update,
    setGateOpen: (open: boolean) => {
      gateOpen = open;
      if (!open) portalMat.opacity = 0;
    },
  };
}
