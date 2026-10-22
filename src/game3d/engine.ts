import * as THREE from "three";
import { buildWorld, type Plat, type World } from "./build";
import { LEVEL, PLAYER } from "./level";

export type HudState = {
  hp: number;
  maxHp: number;
  breath: number;
  maxBreath: number;
  lives: number;
  orbs: number;
  totalOrbs: number;
  time: number;
  score: number;
  combo: number;
  bossHp: number;
  bossMaxHp: number;
  bossActive: boolean;
  checkpoint: string;
  gateOpen: boolean;
  hitFlash: number;
  progress: number;
};

export type EngineEvent = "gameover" | "victory" | "pause" | "resume" | "checkpoint" | "bossdown";

type Enemy = {
  group: THREE.Group;
  body: THREE.MeshStandardMaterial;
  pos: THREE.Vector3;
  home: THREE.Vector3;
  hp: number;
  maxHp: number;
  dead: boolean;
  t: number;
  flash: number;
  boss: boolean;
  shoot: number;
};

type Orb = { mesh: THREE.Group; pos: THREE.Vector3; taken: boolean; t: number };
type Shot = { mesh: THREE.Mesh; vel: THREE.Vector3; life: number };

const KEYMAP: Record<string, string> = {
  KeyW: "fwd", ArrowUp: "fwd", KeyS: "back", ArrowDown: "back",
  KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right",
  Space: "jump", ShiftLeft: "dash", ShiftRight: "dash",
  KeyJ: "attack", KeyK: "attack", KeyQ: "camL", KeyE: "camR",
  Escape: "pause", KeyP: "pause",
};

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private world: World;
  private clock = new THREE.Clock();
  private raf = 0;

  private player = new THREE.Group();
  private rig!: { legs: THREE.Group[]; arms: THREE.Group[]; torso: THREE.Group; sword: THREE.Group; haori: THREE.Mesh };
  private pos = new THREE.Vector3(0, 3, 6);
  private vel = new THREE.Vector3();
  private yaw = Math.PI;
  private grounded = false;
  private onPlat: Plat | null = null;
  private coyote = 0;
  private jumpBuf = 0;
  private usedDouble = false;
  private dashT = 0;
  private dashCd = 0;
  private atkCd = 0;
  private slashT = 0;
  private iFrames = 0;
  private runPhase = 0;

  private camYaw = 0;
  private camPitch = 0.24;
  private dragging = false;
  private lastPointer = { x: 0, y: 0 };
  private shake = 0;
  private colliders: THREE.Object3D[] = [];

  private enemies: Enemy[] = [];
  private orbs: Orb[] = [];
  private shots: Shot[] = [];
  private boss: Enemy | null = null;
  private arcs: { mesh: THREE.Mesh; life: number }[] = [];

  private pGeo = new THREE.BufferGeometry();
  private pPos!: Float32Array;
  private pVel!: Float32Array;
  private pCol!: Float32Array;
  private pLife!: Float32Array;
  private pHead = 0;
  private points!: THREE.Points;

  private keys = new Set<string>();
  private touch = { x: 0, y: 0, jump: false, dash: false, attack: false };
  private audio: AudioContext | null = null;

  private hp = PLAYER.maxHp;
  private breath = PLAYER.maxBreath;
  private lives = 3;
  private orbCount = 0;
  private score = 0;
  private combo = 0;
  private comboT = 0;
  private time = 0;
  private cpIndex = 0;
  private gateOpen = false;
  private hitFlash = 0;
  private started = false;
  private paused = false;
  private over = false;
  private hudT = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private onHud: (s: HudState) => void,
    private onEvent: (e: EngineEvent, payload?: string) => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
    this.scene.fog = new THREE.FogExp2(LEVEL.fogColor, LEVEL.fogDensity);

    this.world = buildWorld(this.scene);
    this.colliders = this.world.platforms.map((p) => p.group.children[0]);
    this.buildPlayer();
    this.buildActors();
    this.buildParticles();
    this.bindInput();
    this.resize();
    window.addEventListener("resize", this.resize);
    this.loop();
  }

  /* ------------------------------ construcción ------------------------------ */

  private buildPlayer() {
    const skin = new THREE.MeshStandardMaterial({ color: "#f2cba4", roughness: 0.75 });
    const uniform = new THREE.MeshStandardMaterial({ color: "#1d2230", roughness: 0.85 });
    const haoriMat = new THREE.MeshStandardMaterial({ color: "#9db4d6", roughness: 0.7, emissive: "#1d2b45", emissiveIntensity: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: "#2a1c1c", roughness: 0.9 });
    const steel = new THREE.MeshStandardMaterial({ color: "#e8f4ff", emissive: "#8fd0ff", emissiveIntensity: 1.4, roughness: 0.25, metalness: 0.6 });

    const torso = new THREE.Group();
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.4), uniform);
    chest.position.y = 1.02;
    const haori = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.92, 0.52), haoriMat);
    haori.position.y = 0.98;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.36), skin);
    head.position.y = 1.6;
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.4), hairMat);
    hair.position.y = 1.76;
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.4, 0.16), hairMat);
    tail.position.set(0, 1.5, -0.22);
    torso.add(chest, haori, head, hair, tail);

    const legs: THREE.Group[] = [];
    for (const sx of [-0.17, 0.17]) {
      const leg = new THREE.Group();
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.66, 0.24), uniform);
      m.position.y = -0.33;
      leg.add(m);
      leg.position.set(sx, 0.66, 0);
      torso.add(leg);
      legs.push(leg);
    }
    const arms: THREE.Group[] = [];
    for (const sx of [-0.4, 0.4]) {
      const arm = new THREE.Group();
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.58, 0.19), sx > 0 ? haoriMat : uniform);
      m.position.y = -0.29;
      arm.add(m);
      arm.position.set(sx, 1.3, 0);
      torso.add(arm);
      arms.push(arm);
    }

    const sword = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 1.5), steel);
    blade.position.z = 0.8;
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.8, roughness: 0.3 }));
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.42, 8), new THREE.MeshStandardMaterial({ color: "#2b1c1c", roughness: 0.9 }));
    handle.rotation.x = Math.PI / 2;
    handle.position.z = -0.22;
    sword.add(blade, guard, handle);
    sword.position.set(0.44, 1.06, 0.12);
    sword.rotation.set(-0.5, 0.2, 0.3);
    torso.add(sword);

    torso.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
      }
    });

    this.player.add(torso);
    this.rig = { legs, arms, torso, sword, haori };
    this.scene.add(this.player);
  }

  private enemyRig(scale: number, boss: boolean): { group: THREE.Group; mat: THREE.MeshStandardMaterial } {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: boss ? "#2b0b33" : "#41111f",
      emissive: boss ? "#8b1fa8" : "#8c1226",
      emissiveIntensity: boss ? 1.1 : 0.55,
      roughness: 0.6,
      flatShading: true,
    });
    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(scale, boss ? 1 : 0), mat);
    body.castShadow = true;
    g.add(body);
    const eyeMat = new THREE.MeshBasicMaterial({ color: boss ? "#ff4d6d" : "#ffd84a" });
    const eyes = boss ? 4 : 2;
    for (let i = 0; i < eyes; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.13, 8, 8), eyeMat);
      const a = (i / eyes) * Math.PI * 2;
      e.position.set(Math.cos(a) * scale * 0.55, scale * 0.22, Math.sin(a) * scale * 0.55 + scale * 0.35);
      g.add(e);
    }
    for (let i = 0; i < (boss ? 9 : 5); i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(scale * 0.14, scale * 0.6, 5), mat);
      const a = (i / (boss ? 9 : 5)) * Math.PI * 2;
      spike.position.set(Math.cos(a) * scale * 0.85, Math.sin(a * 2) * scale * 0.3, Math.sin(a) * scale * 0.85);
      spike.lookAt(spike.position.clone().multiplyScalar(2.2));
      g.add(spike);
    }
    return { group: g, mat };
  }

  private buildActors() {
    for (const e of LEVEL.enemies) {
      const { group, mat } = this.enemyRig(0.72, false);
      group.position.set(e.x, e.y, e.z);
      this.scene.add(group);
      this.enemies.push({
        group, body: mat, pos: group.position, home: new THREE.Vector3(e.x, e.y, e.z),
        hp: e.hp ?? 2, maxHp: e.hp ?? 2, dead: false, t: Math.random() * 6, flash: 0, boss: false, shoot: 0,
      });
    }

    const { group: bg, mat: bm } = this.enemyRig(2.0, true);
    bg.position.set(LEVEL.boss.x, LEVEL.boss.y, LEVEL.boss.z);
    this.scene.add(bg);
    this.boss = {
      group: bg, body: bm, pos: bg.position, home: bg.position.clone(),
      hp: LEVEL.boss.hp, maxHp: LEVEL.boss.hp, dead: false, t: 0, flash: 0, boss: true, shoot: 2.2,
    };
    this.enemies.push(this.boss);

    const orbMat = new THREE.MeshStandardMaterial({ color: "#bff0ff", emissive: "#67d8ff", emissiveIntensity: 2.2, roughness: 0.2 });
    for (const o of LEVEL.orbs) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), orbMat);
      g.add(core);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.035, 6, 20), new THREE.MeshBasicMaterial({ color: "#ffd76a", transparent: true, opacity: 0.85 }));
      ring.rotation.x = Math.PI / 2.4;
      g.add(ring);
      g.position.set(o.x, o.y, o.z);
      this.scene.add(g);
      this.orbs.push({ mesh: g, pos: g.position, taken: false, t: Math.random() * 6 });
    }
  }

  private buildParticles() {
    const N = 620;
    this.pPos = new Float32Array(N * 3);
    this.pVel = new Float32Array(N * 3);
    this.pCol = new Float32Array(N * 3);
    this.pLife = new Float32Array(N);
    for (let i = 0; i < N; i++) this.pPos[i * 3 + 1] = -9999;
    this.pGeo.setAttribute("position", new THREE.BufferAttribute(this.pPos, 3));
    this.pGeo.setAttribute("color", new THREE.BufferAttribute(this.pCol, 3));
    this.points = new THREE.Points(
      this.pGeo,
      new THREE.PointsMaterial({ size: 0.24, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.points.frustumCulled = false;
    this.scene.add(this.points);
  }

  private burst(at: THREE.Vector3, count: number, color: THREE.Color, speed = 6, up = 3) {
    const N = this.pLife.length;
    for (let i = 0; i < count; i++) {
      const idx = this.pHead % N;
      this.pHead++;
      this.pPos[idx * 3] = at.x;
      this.pPos[idx * 3 + 1] = at.y;
      this.pPos[idx * 3 + 2] = at.z;
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI;
      const s = speed * (0.4 + Math.random() * 0.8);
      this.pVel[idx * 3] = Math.sin(b) * Math.cos(a) * s;
      this.pVel[idx * 3 + 1] = Math.abs(Math.cos(b)) * s * 0.7 + up;
      this.pVel[idx * 3 + 2] = Math.sin(b) * Math.sin(a) * s;
      this.pCol[idx * 3] = color.r;
      this.pCol[idx * 3 + 1] = color.g;
      this.pCol[idx * 3 + 2] = color.b;
      this.pLife[idx] = 0.5 + Math.random() * 0.6;
    }
  }

  private updateParticles(dt: number) {
    const N = this.pLife.length;
    for (let i = 0; i < N; i++) {
      if (this.pLife[i] <= 0) continue;
      this.pLife[i] -= dt;
      this.pPos[i * 3] += this.pVel[i * 3] * dt;
      this.pPos[i * 3 + 1] += this.pVel[i * 3 + 1] * dt;
      this.pPos[i * 3 + 2] += this.pVel[i * 3 + 2] * dt;
      this.pVel[i * 3 + 1] -= 12 * dt;
      if (this.pLife[i] <= 0) this.pPos[i * 3 + 1] = -9999;
    }
    (this.pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.pGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  /* ------------------------------ audio ------------------------------ */

  private ensureAudio() {
    if (!this.audio) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audio = new Ctx();
    }
    if (this.audio.state === "suspended") void this.audio.resume();
  }

  private tone(freq: number, to: number, dur: number, type: OscillatorType, vol = 0.16) {
    if (!this.audio) return;
    const t = this.audio.currentTime;
    const osc = this.audio.createOscillator();
    const gain = this.audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(this.audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol = 0.14) {
    if (!this.audio) return;
    const ctx = this.audio;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
  }

  /* ------------------------------ entrada ------------------------------ */

  private onKeyDown = (e: KeyboardEvent) => {
    const act = KEYMAP[e.code];
    if (!act) return;
    e.preventDefault();
    if (act === "pause") {
      this.togglePause();
      return;
    }
    if (act === "jump" && !this.keys.has("jump")) this.jumpBuf = PLAYER.jumpBuffer;
    this.keys.add(act);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    const act = KEYMAP[e.code];
    if (act) this.keys.delete(act);
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button === 0 && e.target === this.canvas) {
      this.dragging = true;
      this.lastPointer = { x: e.clientX, y: e.clientY };
    }
    if (e.button === 2) this.attack();
  };
  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastPointer.x;
    const dy = e.clientY - this.lastPointer.y;
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this.camYaw -= dx * 0.006;
    this.camPitch = THREE.MathUtils.clamp(this.camPitch + dy * 0.004, -0.25, 0.9);
  };
  private onPointerUp = () => {
    this.dragging = false;
  };
  private onContext = (e: Event) => e.preventDefault();

  private bindInput() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("contextmenu", this.onContext);
  }

  setTouch(input: Partial<{ x: number; y: number; jump: boolean; dash: boolean; attack: boolean }>) {
    Object.assign(this.touch, input);
    if (input.jump) this.jumpBuf = PLAYER.jumpBuffer;
    if (input.attack) this.attack();
  }

  /* ------------------------------ control de flujo ------------------------------ */

  start() {
    this.ensureAudio();
    this.started = true;
    this.paused = false;
  }

  togglePause() {
    if (!this.started || this.over) return;
    this.paused = !this.paused;
    this.onEvent(this.paused ? "pause" : "resume");
  }

  restart() {
    this.hp = PLAYER.maxHp;
    this.breath = PLAYER.maxBreath;
    this.lives = 3;
    this.orbCount = 0;
    this.score = 0;
    this.combo = 0;
    this.time = 0;
    this.cpIndex = 0;
    this.over = false;
    this.gateOpen = false;
    this.world.setGateOpen(false);
    this.pos.set(LEVEL.checkpoints[0].x, LEVEL.checkpoints[0].y + 1.4, LEVEL.checkpoints[0].z);
    this.vel.set(0, 0, 0);
    for (const o of this.orbs) {
      o.taken = false;
      o.mesh.visible = true;
    }
    for (const e of this.enemies) {
      e.dead = false;
      e.hp = e.maxHp;
      e.group.visible = true;
      e.pos.copy(e.home);
    }
    for (const s of this.shots) this.scene.remove(s.mesh);
    this.shots = [];
    this.paused = false;
    this.started = true;
    this.onEvent("resume");
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("contextmenu", this.onContext);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      }
    });
    this.renderer.dispose();
    void this.audio?.close();
  }

  private resize = () => {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  };

  /* ------------------------------ bucle ------------------------------ */

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.04);
    const t = this.clock.elapsedTime;
    this.world.update(t, dt);
    if (this.started && !this.paused && !this.over) {
      this.time += dt;
      this.update(dt, t);
    } else {
      this.animateRig(dt, 0);
    }
    this.updateParticles(dt);
    this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
    this.hudT += dt;
    if (this.hudT > 0.07) {
      this.hudT = 0;
      this.pushHud();
    }
  };

  private pushHud() {
    const target = LEVEL.gate.z;
    const start = LEVEL.checkpoints[0].z;
    const progress = THREE.MathUtils.clamp((start - this.pos.z) / (start - target), 0, 1);
    this.onHud({
      hp: this.hp, maxHp: PLAYER.maxHp, breath: this.breath, maxBreath: PLAYER.maxBreath,
      lives: this.lives, orbs: this.orbCount, totalOrbs: LEVEL.orbs.length,
      time: this.time, score: this.score, combo: this.combo,
      bossHp: this.boss && !this.boss.dead ? this.boss.hp : 0,
      bossMaxHp: this.boss ? this.boss.maxHp : 1,
      bossActive: !!this.boss && !this.boss.dead && this.pos.distanceTo(this.boss.pos) < 26,
      checkpoint: LEVEL.checkpoints[this.cpIndex].name,
      gateOpen: this.gateOpen, hitFlash: this.hitFlash, progress,
    });
    this.hitFlash = Math.max(0, this.hitFlash - 0.08);
  }

  /* ------------------------------ simulación ------------------------------ */

  private inputVector(out: THREE.Vector3) {
    let x = 0;
    let z = 0;
    if (this.keys.has("fwd")) z -= 1;
    if (this.keys.has("back")) z += 1;
    if (this.keys.has("left")) x -= 1;
    if (this.keys.has("right")) x += 1;
    x += this.touch.x;
    z += this.touch.y;
    out.set(x, 0, z);
    if (out.lengthSq() > 1) out.normalize();
    // Relativo a la cámara: adelante = alejarse de la cámara.
    const c = this.camYaw;
    const ix = out.x;
    const iz = out.z;
    out.set(Math.cos(c) * ix + Math.sin(c) * iz, 0, -Math.sin(c) * ix + Math.cos(c) * iz);
    if (out.lengthSq() > 1) out.normalize();
  }

  private update(dt: number, t: number) {
    const wish = new THREE.Vector3();
    this.inputVector(wish);
    const moving = wish.lengthSq() > 0.01;

    if (this.keys.has("camL")) this.camYaw += 1.9 * dt;
    if (this.keys.has("camR")) this.camYaw -= 1.9 * dt;

    this.breath = Math.min(PLAYER.maxBreath, this.breath + PLAYER.breathRegen * dt);
    this.atkCd = Math.max(0, this.atkCd - dt);
    this.dashCd = Math.max(0, this.dashCd - dt);
    this.slashT = Math.max(0, this.slashT - dt);
    this.iFrames = Math.max(0, this.iFrames - dt);
    this.jumpBuf = Math.max(0, this.jumpBuf - dt);
    this.comboT = Math.max(0, this.comboT - dt);
    if (this.comboT === 0) this.combo = 0;

    if ((this.keys.has("attack") || this.touch.attack) && this.atkCd <= 0) this.attack();
    this.touch.attack = false;
    this.touch.jump = false;

    // Salto con búfer, coyote y doble salto de respiración.
    if (this.jumpBuf > 0) {
      if (this.grounded || this.coyote > 0) {
        this.vel.y = PLAYER.jump;
        this.grounded = false;
        this.coyote = 0;
        this.jumpBuf = 0;
        this.usedDouble = false;
        this.tone(300, 620, 0.14, "square", 0.12);
        this.burst(this.pos.clone().add(new THREE.Vector3(0, -0.6, 0)), 8, new THREE.Color("#cfe3ff"), 3, 1);
      } else if (!this.usedDouble && this.breath >= PLAYER.doubleJumpCost) {
        this.vel.y = PLAYER.doubleJump;
        this.usedDouble = true;
        this.jumpBuf = 0;
        this.breath -= PLAYER.doubleJumpCost;
        this.tone(520, 900, 0.16, "triangle", 0.12);
        this.burst(this.pos.clone(), 18, new THREE.Color("#bfe9ff"), 5, 0.5);
      }
    }

    // Dash (Respiración del Trueno).
    if ((this.keys.has("dash") || this.touch.dash) && this.dashCd <= 0 && this.breath >= PLAYER.dashCost) {
      this.touch.dash = false;
      const dir = moving ? wish.clone() : new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this.vel.x = dir.x * PLAYER.dashSpeed;
      this.vel.z = dir.z * PLAYER.dashSpeed;
      this.vel.y = Math.max(this.vel.y, 1.5);
      this.dashT = PLAYER.dashTime;
      this.dashCd = PLAYER.dashCooldown;
      this.breath -= PLAYER.dashCost;
      this.iFrames = Math.max(this.iFrames, PLAYER.dashTime + 0.06);
      this.tone(180, 720, 0.16, "sawtooth", 0.1);
      this.burst(this.pos.clone(), 16, new THREE.Color("#ffe6a3"), 7, 1);
    }
    this.touch.dash = false;

    if (this.dashT > 0) {
      this.dashT -= dt;
    } else {
      const accel = this.grounded ? 78 : 78 * PLAYER.airControl;
      this.vel.x += (wish.x * PLAYER.speed - this.vel.x) * Math.min(1, accel * dt * 0.16);
      this.vel.z += (wish.z * PLAYER.speed - this.vel.z) * Math.min(1, accel * dt * 0.16);
    }

    this.vel.y = Math.max(-58, this.vel.y + LEVEL.gravity * dt);
    if (moving) this.yaw = Math.atan2(wish.x, wish.z);

    // Integración con resolución eje a eje.
    const wasGrounded = this.grounded;
    this.moveAxis("x", this.vel.x * dt);
    this.moveAxis("z", this.vel.z * dt);
    this.moveAxis("y", this.vel.y * dt);

    if (this.onPlat) {
      this.pos.add(this.onPlat.vel.clone().multiplyScalar(dt));
    }
    if (this.grounded) {
      this.coyote = PLAYER.coyote;
      this.usedDouble = false;
      if (!wasGrounded && this.vel.y <= 0) {
        this.burst(this.pos.clone().add(new THREE.Vector3(0, -0.8, 0)), 10, new THREE.Color("#dfe7f5"), 3, 0.6);
        this.tone(120, 70, 0.09, "sine", 0.08);
      }
    } else {
      this.coyote = Math.max(0, this.coyote - dt);
    }

    this.updateCheckpoints();
    this.updateOrbs(t);
    this.updateEnemies(dt, t);
    this.updateShots(dt);
    this.updateArcs(dt);
    this.animateRig(dt, moving ? Math.hypot(this.vel.x, this.vel.z) : 0);

    this.player.position.copy(this.pos).add(new THREE.Vector3(0, -PLAYER.half.y, 0));
    this.rig.torso.rotation.y = this.yaw;

    if (this.pos.y < LEVEL.startY) this.fall();
    if (this.gateOpen && this.pos.distanceTo(new THREE.Vector3(LEVEL.gate.x, LEVEL.gate.y + 2, LEVEL.gate.z)) < 3.4) this.victory();
  }

  private moveAxis(axis: "x" | "y" | "z", delta: number) {
    if (axis === "y") {
      this.grounded = false;
      this.onPlat = null;
    }
    if (delta === 0) return;
    this.pos[axis] += delta;
    const h = PLAYER.half;
    for (const p of this.world.platforms) {
      const c = p.center;
      const hx = p.half.x;
      const hy = p.half.y;
      const hz = p.half.z;
      const overlapX = hx + h.x - Math.abs(this.pos.x - c.x);
      const overlapY = hy + h.y - Math.abs(this.pos.y - c.y);
      const overlapZ = hz + h.z - Math.abs(this.pos.z - c.z);
      if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) continue;
      if (axis === "y") {
        if (delta < 0) {
          this.pos.y = c.y + hy + h.y;
          this.vel.y = 0;
          this.grounded = true;
          this.onPlat = p;
        } else {
          this.pos.y = c.y - hy - h.y;
          this.vel.y = Math.min(this.vel.y, 0);
        }
      } else if (axis === "x") {
        this.pos.x = c.x + Math.sign(this.pos.x - c.x) * (hx + h.x);
        this.vel.x = 0;
      } else {
        this.pos.z = c.z + Math.sign(this.pos.z - c.z) * (hz + h.z);
        this.vel.z = 0;
      }
    }
  }

  private updateCheckpoints() {
    for (let i = LEVEL.checkpoints.length - 1; i > this.cpIndex; i--) {
      const cp = LEVEL.checkpoints[i];
      if (Math.hypot(this.pos.x - cp.x, this.pos.z - cp.z) < 4.2 && this.pos.y > cp.y - 3 && this.pos.y < cp.y + 5) {
        this.cpIndex = i;
        this.score += 200;
        this.hp = Math.min(PLAYER.maxHp, this.hp + 1);
        this.tone(660, 990, 0.22, "triangle", 0.14);
        this.burst(this.pos.clone().add(new THREE.Vector3(0, 1, 0)), 26, new THREE.Color("#ffd76a"), 5, 2);
        this.onEvent("checkpoint", cp.name);
        break;
      }
    }
  }

  private updateOrbs(t: number) {
    for (const o of this.orbs) {
      if (o.taken) continue;
      o.t += 0.016;
      o.mesh.rotation.y += 0.03;
      o.mesh.position.y = o.pos.y + Math.sin(t * 2 + o.t) * 0.18;
      if (this.pos.distanceTo(o.mesh.position) < 1.5) {
        o.taken = true;
        o.mesh.visible = false;
        this.orbCount++;
        this.score += 40;
        this.breath = Math.min(PLAYER.maxBreath, this.breath + 18);
        if (this.orbCount % 5 === 0) this.hp = Math.min(PLAYER.maxHp, this.hp + 1);
        this.tone(880, 1420, 0.13, "sine", 0.12);
        this.burst(o.mesh.position.clone(), 14, new THREE.Color("#8ff0ff"), 4, 1.5);
      }
    }
  }

  private attack() {
    if (!this.started || this.paused || this.over) return;
    if (this.atkCd > 0) return;
    this.atkCd = PLAYER.attackCooldown;
    this.slashT = 0.26;
    this.noise(0.12, 0.1);
    this.tone(880, 260, 0.1, "sawtooth", 0.07);

    const fwd = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const origin = this.pos.clone().add(new THREE.Vector3(0, 0.4, 0));

    // Arco de corte horizontal frente al personaje.
    const arcGeo = new THREE.TorusGeometry(1.7, 0.09, 6, 26, Math.PI * 1.05);
    arcGeo.rotateX(Math.PI / 2);
    const arc = new THREE.Mesh(
      arcGeo,
      new THREE.MeshBasicMaterial({ color: "#dff2ff", transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    arc.position.copy(origin);
    arc.rotation.y = this.yaw;
    arc.userData.yaw = this.yaw;
    this.scene.add(arc);
    this.arcs.push({ mesh: arc, life: 0.26 });
    this.burst(origin.clone().add(fwd.clone().multiplyScalar(1.6)), 12, new THREE.Color("#e8f6ff"), 6, 1);
    this.shake = Math.max(this.shake, 0.16);

    let hitAny = false;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const to = e.pos.clone().sub(this.pos);
      const dist = to.length();
      const radius = e.boss ? 3.1 : 1.5;
      if (dist > PLAYER.attackRange + radius) continue;
      to.y = 0;
      if (to.lengthSq() > 0.001) to.normalize();
      const flat = fwd.clone();
      if (to.dot(flat) < Math.cos(PLAYER.attackArc / 2) && dist > radius + 0.6) continue;
      this.damageEnemy(e, 1 + Math.floor(this.combo / 8), flat);
      hitAny = true;
    }
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      if (s.mesh.position.distanceTo(this.pos) < PLAYER.attackRange) {
        this.burst(s.mesh.position.clone(), 10, new THREE.Color("#ff9ec4"), 5, 1);
        this.scene.remove(s.mesh);
        this.shots.splice(i, 1);
        this.score += 30;
        hitAny = true;
      }
    }
    if (hitAny) {
      this.combo++;
      this.comboT = 1.6;
      this.score += 10 * this.combo;
    }
  }

  private damageEnemy(e: Enemy, dmg: number, dir: THREE.Vector3) {
    e.hp -= dmg;
    e.flash = 0.22;
    e.body.emissiveIntensity = 3;
    this.shake = Math.max(this.shake, 0.3);
    this.tone(220, 90, 0.14, "square", 0.13);
    this.burst(e.pos.clone(), 16, new THREE.Color("#ff6b81"), 7, 2);
    if (!e.boss) e.group.position.add(dir.clone().multiplyScalar(0.5));
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      e.group.visible = false;
      this.score += e.boss ? 2000 : 150;
      this.burst(e.pos.clone(), e.boss ? 90 : 30, new THREE.Color(e.boss ? "#ff8ae0" : "#ff4d6d"), e.boss ? 14 : 8, 4);
      this.tone(e.boss ? 90 : 320, e.boss ? 40 : 120, e.boss ? 0.8 : 0.3, "sawtooth", 0.18);
      if (e.boss) {
        this.gateOpen = true;
        this.world.setGateOpen(true);
        this.shake = 0.9;
        this.onEvent("bossdown");
      }
    }
  }

  private updateEnemies(dt: number, t: number) {
    for (const e of this.enemies) {
      if (e.dead) continue;
      e.t += dt;
      if (e.flash > 0) {
        e.flash -= dt;
        e.body.emissiveIntensity = Math.max(e.boss ? 1.1 : 0.55, e.body.emissiveIntensity - dt * 10);
      }
      const toPlayer = this.pos.clone().sub(e.pos);
      const dist = toPlayer.length();

      if (e.boss) {
        const target = new THREE.Vector3(
          LEVEL.boss.x + Math.sin(t * 0.45) * 6,
          LEVEL.boss.y + Math.sin(t * 0.8) * 0.9,
          LEVEL.boss.z + Math.cos(t * 0.38) * 3.4,
        );
        e.pos.lerp(target, Math.min(1, dt * 1.6));
        e.group.rotation.y += dt * 0.6;
        e.group.rotation.x = Math.sin(t * 0.7) * 0.12;
        e.shoot -= dt;
        const inArena = this.pos.distanceTo(new THREE.Vector3(LEVEL.boss.x, this.pos.y, LEVEL.boss.z)) < 22;
        if (e.shoot <= 0 && inArena) {
          e.shoot = e.hp < e.maxHp * 0.5 ? 1.05 : 1.7;
          const spread = e.hp < e.maxHp * 0.5 ? 3 : 1;
          for (let i = 0; i < spread; i++) {
            const dir = toPlayer.clone().normalize();
            const angle = (i - (spread - 1) / 2) * 0.22;
            dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            this.spawnShot(e.pos.clone(), dir.multiplyScalar(15));
          }
          this.tone(160, 320, 0.2, "sawtooth", 0.08);
        }
      } else {
        const bob = Math.sin(e.t * 2.1) * 0.35;
        if (dist < 15) {
          const dir = toPlayer.clone().setY(0).normalize();
          e.pos.add(dir.multiplyScalar(Math.min(2.6, dist * 0.5) * dt));
          e.pos.y += (e.home.y + bob + 0.4 - e.pos.y) * Math.min(1, dt * 2);
        } else {
          e.pos.lerp(e.home.clone().add(new THREE.Vector3(0, bob, 0)), Math.min(1, dt * 1.4));
        }
        e.group.rotation.y += dt * 1.4;
        e.group.rotation.z = Math.sin(e.t * 1.6) * 0.18;
      }
      e.group.position.copy(e.pos);

      // Daño por contacto.
      const hitDist = e.boss ? 2.6 : 1.35;
      if (dist < hitDist && this.iFrames <= 0) this.hurt(e.boss ? 2 : 1, toPlayer.clone().normalize().multiplyScalar(-1));
    }
  }

  private spawnShot(at: THREE.Vector3, vel: THREE.Vector3) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 10, 10),
      new THREE.MeshBasicMaterial({ color: "#ff7ab0" }),
    );
    mesh.position.copy(at);
    this.scene.add(mesh);
    this.shots.push({ mesh, vel, life: 5 });
  }

  private updateShots(dt: number) {
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.life -= dt;
      s.mesh.position.add(s.vel.clone().multiplyScalar(dt));
      s.mesh.scale.setScalar(1 + Math.sin(s.life * 20) * 0.12);
      if (s.mesh.position.distanceTo(this.pos) < 1.0 && this.iFrames <= 0) {
        this.hurt(1, s.vel.clone().normalize().multiplyScalar(-1));
        this.scene.remove(s.mesh);
        this.shots.splice(i, 1);
        continue;
      }
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        this.shots.splice(i, 1);
      }
    }
  }

  private updateArcs(dt: number) {
    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const a = this.arcs[i];
      a.life -= dt;
      const k = Math.max(0, a.life / 0.26);
      a.mesh.rotation.y = (a.mesh.userData.yaw as number) + (0.5 - k) * 0.9;
      a.mesh.scale.setScalar(0.7 + (1 - k) * 0.7);
      (a.mesh.material as THREE.MeshBasicMaterial).opacity = k * 0.95;
      if (a.life <= 0) {
        this.scene.remove(a.mesh);
        a.mesh.geometry.dispose();
        (a.mesh.material as THREE.Material).dispose();
        this.arcs.splice(i, 1);
      }
    }
  }

  private hurt(dmg: number, knock: THREE.Vector3) {
    this.hp -= dmg;
    this.iFrames = 1.15;
    this.combo = 0;
    this.shake = 0.55;
    this.hitFlash = 1;
    this.vel.add(knock.multiplyScalar(9)).add(new THREE.Vector3(0, 5, 0));
    this.tone(200, 60, 0.28, "square", 0.16);
    this.burst(this.pos.clone(), 22, new THREE.Color("#ff4d4d"), 7, 2);
    if (this.hp <= 0) this.die();
  }

  private fall() {
    this.lives--;
    this.tone(300, 50, 0.6, "sine", 0.16);
    if (this.lives < 0) {
      this.die(true);
      return;
    }
    this.respawn();
  }

  private die(fromFall = false) {
    if (this.over) return;
    if (!fromFall) {
      this.lives--;
      if (this.lives >= 0) {
        this.respawn();
        return;
      }
    }
    this.over = true;
    this.hp = 0;
    this.shake = 1;
    this.burst(this.pos.clone(), 60, new THREE.Color("#ff5f7a"), 10, 3);
    this.onEvent("gameover");
    this.pushHud();
  }

  private respawn() {
    const cp = LEVEL.checkpoints[this.cpIndex];
    this.pos.set(cp.x, cp.y + 1.2, cp.z);
    this.vel.set(0, 0, 0);
    this.hp = PLAYER.maxHp;
    this.breath = PLAYER.maxBreath;
    this.iFrames = 1.6;
    this.combo = 0;
    this.tone(420, 720, 0.25, "triangle", 0.12);
    this.burst(this.pos.clone(), 26, new THREE.Color("#bff0ff"), 6, 2);
  }

  private victory() {
    if (this.over) return;
    this.over = true;
    const timeBonus = Math.max(0, Math.round(4200 - this.time * 12));
    this.score += timeBonus + this.orbCount * 60;
    this.shake = 0.6;
    this.tone(523, 1046, 0.5, "triangle", 0.16);
    window.setTimeout(() => this.tone(784, 1568, 0.6, "triangle", 0.14), 180);
    this.burst(this.pos.clone().add(new THREE.Vector3(0, 1.5, 0)), 120, new THREE.Color("#ffd76a"), 9, 4);
    this.onEvent("victory");
    this.pushHud();
  }

  /* ------------------------------ presentación ------------------------------ */

  private animateRig(dt: number, speed: number) {
    this.runPhase += dt * (2 + speed * 1.5);
    const swing = Math.min(1, speed / PLAYER.speed);
    const s = Math.sin(this.runPhase * 3.2) * swing;
    this.rig.legs[0].rotation.x = s * 0.9;
    this.rig.legs[1].rotation.x = -s * 0.9;
    this.rig.arms[0].rotation.x = -s * 0.7;
    this.rig.arms[1].rotation.x = s * 0.5;
    this.rig.torso.position.y = Math.abs(s) * 0.06 + (this.grounded ? 0 : 0.06);
    this.rig.torso.rotation.x = THREE.MathUtils.lerp(this.rig.torso.rotation.x, swing * 0.16 - (this.grounded ? 0 : 0.1), Math.min(1, dt * 9));
    this.rig.haori.rotation.x = THREE.MathUtils.lerp(this.rig.haori.rotation.x, -swing * 0.22, Math.min(1, dt * 6));

    // Parpadeo de invulnerabilidad.
    const blink = this.iFrames > 0 && Math.floor(this.iFrames * 18) % 2 === 0;
    this.rig.torso.visible = !blink;

    // Tajo de katana.
    if (this.slashT > 0) {
      const k = 1 - this.slashT / 0.26;
      this.rig.sword.rotation.set(-0.5 - k * 2.6, 0.2 + k * 1.4, 0.3 + k * 1.2);
      this.rig.arms[1].rotation.x = -1.4 + k * 2.2;
    } else {
      this.rig.sword.rotation.set(-0.5 + s * 0.1, 0.2, 0.3);
    }
  }

  private updateCamera(dt: number) {
    const target = this.pos.clone().add(new THREE.Vector3(0, 1.25, 0));
    let dist = 10.2;
    const dir = new THREE.Vector3(
      Math.sin(this.camYaw) * Math.cos(this.camPitch),
      Math.sin(this.camPitch) + 0.32,
      Math.cos(this.camYaw) * Math.cos(this.camPitch),
    ).normalize();

    const ray = new THREE.Raycaster(target, dir, 0.6, dist);
    const hits = ray.intersectObjects(this.colliders, false);
    if (hits.length) dist = Math.max(2.6, hits[0].distance - 0.5);

    const desired = target.clone().add(dir.multiplyScalar(dist));
    const k = 1 - Math.exp(-11 * dt);
    this.camera.position.lerp(desired, k);
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 1.9);
      this.camera.position.add(
        new THREE.Vector3((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake).multiplyScalar(0.7),
      );
    }
    this.camera.lookAt(target);
  }
}
