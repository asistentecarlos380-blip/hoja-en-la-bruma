import * as THREE from "three";
import { buildHumanoid, animateHumanoid, makeLabel } from "./characters";
import { LOOKS } from "./campaign";
import { CABIN_FLOOR, CABIN_SPOTS } from "./prologue";
import type { Collider } from "./world";

export type Cabin = {
  scene: THREE.Scene;
  colliders: Collider[];
  setMorning: (morning: boolean) => void;
  update: (time: number, sleeping: boolean) => void;
  dispose: () => void;
};

/** Interior independiente: sin nieve, colisiones propias y techo retirado para la cámara. */
export function buildCabin(): Cabin {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#15141b");
  const colliders: Collider[] = [];
  const mats: THREE.Material[] = [];
  function material(color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.88, ...extra });
    mats.push(m);
    return m;
  }
  const cedar = material("#815032");
  const dark = material("#372519");
  const wood = material("#bc8d5b");
  const paper = material("#e6d7b1");
  const sheet = material("#f5efe3");
  const indigo = material("#4e6879");
  const brass = material("#c49b57", { metalness: 0.35, roughness: 0.45 });
  const ceramic = material("#bfc9c0", { roughness: 0.25 });
  const windowMat = material("#c0d4e5", { emissive: "#617da3", emissiveIntensity: 0.5 });

  function box(x: number, y: number, z: number, w: number, h: number, d: number, m: THREE.Material, solid = false) {
    const obj = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    obj.position.set(x, y, z);
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
    if (solid) colliders.push({ kind: "box", x, z, hw: w / 2, hd: d / 2 });
    return obj;
  }
  function cylinder(x: number, y: number, z: number, radius: number, height: number, m: THREE.Material) {
    const obj = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), m);
    obj.position.set(x, y, z);
    obj.castShadow = true;
    obj.receiveShadow = true;
    scene.add(obj);
    return obj;
  }
  function label(text: string, x: number, y: number, z: number, color = "#e4ceb1") {
    const sprite = makeLabel(text, color);
    sprite.position.set(x, y, z);
    scene.add(sprite);
    return sprite;
  }

  // Planchas con variación de tono y pequeñas juntas.
  box(0, -0.15, 0, 16.5, 0.5, 13.5, dark);
  for (let x = -7.7; x < 8; x += 0.55) {
    const m = material(new THREE.Color("#a47145").multiplyScalar(0.92 + 0.14 * Math.sin(x * 19)).getStyle());
    box(x, CABIN_FLOOR - 0.06, 0, 0.52, 0.12, 13, m);
  }
  // Paredes posteriores y laterales; pared frontal recortada, estilo casa de muñecas.
  box(0, 1.6, -6.5, 16.4, 3.2, 0.28, cedar, true);
  box(-8, 1.6, 0, 0.28, 3.2, 13, cedar, true);
  box(8, 1.6, 0, 0.28, 3.2, 13, cedar, true);
  box(-4.8, 0.43, 6.5, 6.4, 0.85, 0.24, cedar, true);
  box(4.8, 0.43, 6.5, 6.4, 0.85, 0.24, cedar, true);
  // Puerta exterior interactiva (no se cruza andando para evitar salir durante la noche).
  box(0, 0.55, 6.4, 2.8, 1.1, 0.16, dark, true);
  box(0, 0.58, 6.28, 2.5, 0.84, 0.06, paper);
  for (let i = -1; i <= 1; i++) box(i * 0.77, 0.58, 6.22, 0.045, 0.85, 0.06, dark);
  box(0, 0.7, 6.2, 2.6, 0.05, 0.06, dark);
  label("SALIDA", 0, 1.35, 6.15);

  // Ventanales shōji: azul frío durante la noche, crema al amanecer.
  for (const x of [-4.7, 0.2, 5.6]) {
    box(x, 2.0, -6.3, 2.6, 1.65, 0.06, windowMat);
    for (let i = -1; i <= 1; i++) box(x + i * 0.8, 2, -6.24, 0.045, 1.7, 0.05, dark);
    for (const y of [1.2, 1.75, 2.3, 2.85]) box(x, y, -6.24, 2.7, 0.04, 0.05, dark);
  }
  for (const x of [-8, -0.6, 3, 8]) {
    box(x, 1.8, -6.3, 0.22, 3.6, 0.24, dark);
  }
  // Cuarto: puerta abierta al frente. Se puede entrar por el hueco de 2.4 metros.
  box(-0.65, 0.75, -3, 0.18, 1.5, 7, dark, true);
  box(-6, 0.6, 0.55, 4, 1.2, 0.15, paper, true);
  box(-1.1, 0.6, 0.55, 0.8, 1.2, 0.15, paper, true);
  box(-4, 1.25, 0.55, 0.15, 2.5, 0.2, dark);
  box(-1.5, 1.25, 0.55, 0.15, 2.5, 0.2, dark);
  box(-2.75, 2.5, 0.55, 2.65, 0.12, 0.2, dark);
  label("CUARTO", -2.75, 2.85, 0.55);

  // Tejido de tatami y bordes índigo.
  const matCanvas = document.createElement("canvas");
  matCanvas.width = matCanvas.height = 128;
  const ctx = matCanvas.getContext("2d")!;
  ctx.fillStyle = "#a6a075"; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "#c7bd8f";
  for (let y = 0; y < 128; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke(); }
  const texture = new THREE.CanvasTexture(matCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  const tatamiMat = material("#ffffff", { map: texture });
  box(-4.2, 0.22, -2.75, 6.9, 0.08, 5.9, tatamiMat);
  for (const x of [-7.65, -4.15, -0.8]) box(x, 0.27, -2.75, 0.085, 0.02, 5.9, indigo);
  for (const z of [-5.7, -2.75, 0.2]) box(-4.2, 0.27, z, 6.9, 0.02, 0.085, indigo);

  // Cama individual del anfitrión.
  box(-5.8, 0.55, -4.65, 2, 0.62, 2.65, dark, true);
  box(-5.8, 0.91, -4.65, 1.9, 0.18, 2.5, sheet);
  box(-5.8, 1.08, -5.5, 1.4, 0.18, 0.5, sheet);
  box(-5.8, 1.03, -4.25, 1.88, 0.14, 1.6, indigo);
  box(-5.8, 1.13, -6, 2.1, 1.2, 0.16, wood);
  label("Cama de Saburo", -5.8, 1.9, -4.8, "#e6d7bb");

  // Futón del jugador, dispuesto sobre el tatami con sábana y manta.
  box(-2.8, 0.33, -2.65, 1.8, 0.16, 3.0, sheet);
  box(-2.8, 0.43, -2.25, 1.78, 0.08, 2.15, material("#aa7868"));
  box(-2.8, 0.44, -3.75, 1.2, 0.2, 0.5, sheet);
  for (let i = 0; i < 7; i++) box(-3.57 + i * 0.25, 0.479, -2.2, 0.025, 0.008, 1.9, material("#b98a76"));
  const sleepMarker = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.15, 48), new THREE.MeshBasicMaterial({ color: "#e8c277", transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
  sleepMarker.rotation.x = -Math.PI / 2;
  sleepMarker.position.set(-2.8, 0.51, -2.5);
  scene.add(sleepMarker);
  const sleepLabel = label("Tatami · dormir", -2.8, 1.25, -2.5, "#ffe3a1");

  // Baño: mampara abierta, bañera de madera, lavabo y retrete discreto.
  box(3.05, 0.7, -4, 0.16, 1.4, 5, paper, true);
  box(3.7, 0.65, -1.5, 1.25, 1.3, 0.16, paper, true);
  box(7.7, 0.65, -1.5, 0.5, 1.3, 0.16, paper, true);
  label("BAÑO", 5.7, 2.5, -1.5);
  const tile = material("#727f7b");
  for (let x = 3.3; x < 7.9; x += 0.55) for (let z = -6.15; z < -1.6; z += 0.55) box(x, 0.2, z, 0.52, 0.06, 0.52, tile);
  box(6.55, 0.58, -4.6, 2.1, 0.8, 2.6, wood, true);
  box(6.55, 1.0, -4.6, 1.8, 0.04, 2.3, material("#4f6a65", { roughness: 0.2, metalness: 0.25 }));
  for (const x of [5.5, 7.6]) box(x, 1.08, -4.6, 0.12, 0.2, 2.7, dark);
  cylinder(6.8, 0.75, -2.3, 0.43, 0.8, wood);
  cylinder(6.8, 1.2, -2.3, 0.5, 0.15, ceramic);
  colliders.push({ kind: "circle", x: 6.8, z: -2.3, r: 0.5 });
  box(4.25, 0.35, -5.3, 0.75, 0.3, 1.0, ceramic, true);
  const seat = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 8, 20), ceramic);
  seat.rotation.x = -Math.PI / 2; seat.position.set(4.25, 0.53, -5.2); scene.add(seat);
  // Toalla sobre un soporte.
  box(7.8, 1.7, -2.5, 0.08, 0.8, 0.5, sheet);

  // Sala: irori con brasas, tetera, dos tazas, cojines y leña.
  box(1.3, 0.36, 1.9, 2.2, 0.35, 2, dark, true);
  box(1.3, 0.57, 1.9, 1.8, 0.08, 1.6, material("#211a18"));
  const ember = material("#ed7625", { emissive: "#ed531a", emissiveIntensity: 1.5 });
  for (let i = 0; i < 6; i++) cylinder(0.8 + (i % 3) * 0.45, 0.63, 1.5 + Math.floor(i / 3) * 0.6, 0.16, 0.09, ember);
  cylinder(1.35, 0.86, 1.9, 0.35, 0.42, material("#3b3a35", { metalness: 0.6 }));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 20, Math.PI), dark);
  handle.position.set(1.35, 1.1, 1.9); scene.add(handle);
  box(-0.4, 0.26, 3.2, 0.9, 0.14, 0.8, indigo);
  box(3, 0.26, 3.1, 0.9, 0.14, 0.8, indigo);
  box(-6.1, 0.75, 4.2, 2.4, 1.1, 0.9, cedar, true);
  cylinder(-5.7, 1.38, 4.2, 0.18, 0.2, ceramic);
  cylinder(-6.2, 1.38, 4.2, 0.18, 0.2, ceramic);
  box(6.1, 0.65, 4.8, 2.0, 0.9, 1.0, cedar, true);
  label("Cabaña de Saburo", 0, 3.5, -5.8);

  const host = buildHumanoid({ ...LOOKS.saburo, sword: false });
  const companion = buildHumanoid({ ...LOOKS.tanjiro, sword: false });
  const hostSpot = CABIN_SPOTS.find((s) => s.id === "saburo")!;
  const tanjiroSpot = CABIN_SPOTS.find((s) => s.id === "tanjiro")!;
  host.group.position.set(hostSpot.x, CABIN_FLOOR, hostSpot.z); host.group.rotation.y = 0.8;
  companion.group.position.set(tanjiroSpot.x, CABIN_FLOOR, tanjiroSpot.z); companion.group.rotation.y = -1.4;
  scene.add(host.group, companion.group);
  label("Saburo", hostSpot.x, 2.5, hostSpot.z);
  label("Tanjiro", tanjiroSpot.x, 2.5, tanjiroSpot.z, "#acd9ba");

  const ambient = new THREE.HemisphereLight("#f7dfae", "#43352c", 1.7);
  const fire = new THREE.PointLight("#ff9b45", 38, 18, 1.5);
  fire.position.set(1.3, 1.6, 1.9); fire.castShadow = true; fire.shadow.mapSize.set(512, 512);
  const key = new THREE.DirectionalLight("#f6d3a1", 1.5);
  key.position.set(-4, 10, 6); key.castShadow = true;
  key.shadow.camera.left = -10; key.shadow.camera.right = 10; key.shadow.camera.top = 9; key.shadow.camera.bottom = -9;
  key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.001;
  const dawn = new THREE.DirectionalLight("#ffe8bd", 0);
  dawn.position.set(0, 7, -8);
  scene.add(ambient, fire, key, dawn);
  // Farol colgante.
  box(0, 3.3, 2.5, 0.05, 1.0, 0.05, brass);
  box(0, 2.7, 2.5, 0.45, 0.6, 0.45, material("#edd3a3", { emissive: "#f0ae55", emissiveIntensity: 0.55 }));

  let morning = false;
  return {
    scene, colliders,
    setMorning(value) {
      morning = value;
      windowMat.color.set(value ? "#fff2cd" : "#c0d4e5");
      windowMat.emissive.set(value ? "#ffdc8b" : "#617da3");
      windowMat.emissiveIntensity = value ? 0.8 : 0.5;
      dawn.intensity = value ? 2.4 : 0;
      ambient.intensity = value ? 2.2 : 1.7;
      scene.background = new THREE.Color(value ? "#27231f" : "#15141b");
      sleepLabel.visible = !value;
      sleepMarker.visible = !value;
    },
    update(time, sleeping) {
      fire.intensity = (morning ? 17 : 36) + Math.sin(time * 5) * 2 + Math.sin(time * 9) * 1.3;
      sleepMarker.material.opacity = 0.35 + Math.sin(time * 2) * 0.12;
      animateHumanoid(host, time, 0, true);
      animateHumanoid(companion, time, 0, true);
      companion.group.visible = !sleeping;
    },
    dispose() {
      const textures = new Set<THREE.Texture>();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const materials = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
        for (const mat of materials) {
          const tex = (mat as THREE.MeshStandardMaterial).map;
          if (tex) textures.add(tex);
        }
      });
      textures.forEach((t) => t.dispose()); mats.forEach((m) => m.dispose());
    },
  };
}
