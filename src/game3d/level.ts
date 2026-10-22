import * as THREE from "three";

export type PlatformDef = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  kind?: "stone" | "wood" | "arena";
  move?: { axis: "x" | "y" | "z"; range: number; speed: number; phase?: number };
  deco?: ("torii" | "lantern" | "bamboo" | "rock")[];
};

export type OrbDef = { x: number; y: number; z: number };
export type EnemyDef = { x: number; y: number; z: number; hp?: number };
export type CheckpointDef = { x: number; y: number; z: number; name: string };

export const LEVEL = {
  name: "Ascenso a la Montaña de la Bruma",
  fogColor: "#0a0f1e",
  fogDensity: 0.019,
  skyTop: "#1b2a55",
  skyBottom: "#070a14",
  moonColor: "#f6efdc",
  gravity: -30,
  startY: -22,
  platforms: [
    { x: 0, y: 0, z: 2, w: 18, h: 2.4, d: 18, kind: "stone", deco: ["torii", "lantern", "bamboo", "bamboo"] },
    { x: 0, y: 0.4, z: -13, w: 6.5, h: 1.6, d: 6.5, kind: "stone", deco: ["lantern"] },
    { x: -7.5, y: 1.6, z: -19, w: 5.5, h: 1.6, d: 5.5, kind: "stone", deco: ["rock"] },
    { x: -1, y: 2.8, z: -26, w: 5.5, h: 1.6, d: 5.5, kind: "wood", deco: ["lantern"] },
    { x: 7.5, y: 3.8, z: -33, w: 5.5, h: 1.4, d: 5.5, kind: "wood", move: { axis: "x", range: 6.5, speed: 1.15 } },
    { x: 0, y: 5, z: -42, w: 10, h: 2, d: 10, kind: "stone", deco: ["torii", "lantern", "lantern"] },
    { x: -8.5, y: 6.2, z: -49, w: 5.5, h: 1.4, d: 5.5, kind: "stone", deco: ["rock"] },
    { x: -8.5, y: 8, z: -57, w: 5.5, h: 1.4, d: 5.5, kind: "wood", move: { axis: "y", range: 3, speed: 0.95, phase: 1.2 } },
    { x: -1, y: 9.6, z: -63, w: 6, h: 1.4, d: 6, kind: "stone", deco: ["lantern"] },
    { x: 7.5, y: 10.8, z: -69, w: 5, h: 1.4, d: 5, kind: "wood", move: { axis: "z", range: 5, speed: 1.05, phase: 0.6 } },
    { x: 0, y: 12, z: -78, w: 11, h: 2, d: 11, kind: "stone", deco: ["torii", "bamboo", "lantern"] },
    { x: 0, y: 13, z: -95, w: 30, h: 2.6, d: 26, kind: "arena", deco: ["torii", "lantern", "lantern", "bamboo", "bamboo", "rock"] },
  ] as PlatformDef[],
  orbs: [
    { x: 4, y: 2.2, z: -4 }, { x: -4, y: 2.2, z: -6 }, { x: 0, y: 2.4, z: -13 },
    { x: -7.5, y: 3.6, z: -19 }, { x: -1, y: 4.8, z: -26 }, { x: 3.5, y: 5.6, z: -30 },
    { x: 7.5, y: 5.8, z: -33 }, { x: 11, y: 5.8, z: -33 }, { x: -3, y: 7, z: -42 },
    { x: 3, y: 7, z: -42 }, { x: -8.5, y: 8.2, z: -49 }, { x: -8.5, y: 10.4, z: -57 },
    { x: -4.5, y: 11.4, z: -60 }, { x: -1, y: 11.6, z: -63 }, { x: 7.5, y: 12.8, z: -69 },
    { x: 3.5, y: 13.4, z: -73 }, { x: 0, y: 14, z: -78 }, { x: -4, y: 14, z: -78 },
    { x: 4, y: 14, z: -78 }, { x: 0, y: 15, z: -86 }, { x: -9, y: 15.2, z: -95 },
    { x: 9, y: 15.2, z: -95 },
  ] as OrbDef[],
  enemies: [
    { x: 0, y: 3, z: -13, hp: 2 },
    { x: -7.5, y: 4, z: -19, hp: 2 },
    { x: 4, y: 5.6, z: -30, hp: 2 },
    { x: 0, y: 7.4, z: -42, hp: 3 },
    { x: -8.5, y: 8.6, z: -49, hp: 3 },
    { x: -1, y: 12, z: -63, hp: 3 },
    { x: 0, y: 14.4, z: -78, hp: 4 },
    { x: -6, y: 15.4, z: -92, hp: 4 },
    { x: 6, y: 15.4, z: -92, hp: 4 },
  ] as EnemyDef[],
  boss: { x: 0, y: 16.5, z: -97, hp: 12 },
  gate: { x: 0, y: 14.4, z: -104 },
  checkpoints: [
    { x: 0, y: 1.2, z: 2, name: "Aldea del carbón" },
    { x: 0, y: 6, z: -42, name: "Torii de la ladera" },
    { x: 0, y: 13, z: -78, name: "Umbral de la Luna" },
  ] as CheckpointDef[],
};

export const PLAYER = {
  half: new THREE.Vector3(0.36, 0.85, 0.36),
  speed: 8.2,
  airControl: 0.62,
  jump: 12.4,
  doubleJump: 11,
  dashSpeed: 21,
  dashTime: 0.17,
  dashCooldown: 0.55,
  coyote: 0.12,
  jumpBuffer: 0.14,
  maxHp: 5,
  maxBreath: 100,
  breathRegen: 26,
  doubleJumpCost: 22,
  dashCost: 26,
  attackRange: 3.6,
  attackArc: Math.PI * 0.75,
  attackCooldown: 0.3,
};
