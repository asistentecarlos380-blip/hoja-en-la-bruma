export type WaterSwordsman = "player" | "tanjiro" | "makomo" | "sabito" | "giyu";
export const WATER_STYLES: Record<WaterSwordsman, { identity: string; techniques: { name: string; cost: number; power: number; color: number }[] }> = {
 player: { identity: "Equilibrio y adaptación", techniques: [{name:"Corte de la superficie",cost:12,power:1,color:0x69c7f0},{name:"Rueda de agua",cost:17,power:1.2,color:0x4baeea},{name:"Danza de las corrientes",cost:22,power:1.4,color:0x2b96d4}] },
 tanjiro: { identity: "Resistencia y perseverancia", techniques: [{name:"Corte de la superficie · Tanjiro",cost:12,power:1.15,color:0x45baf1},{name:"Rueda de agua · Tanjiro",cost:18,power:1.35,color:0x2996df},{name:"Flujo constante · Tanjiro",cost:25,power:1.55,color:0x167cc5}] },
 makomo: { identity: "Precisión y ligereza", techniques: [{name:"Danza de las corrientes · Makomo",cost:11,power:1.1,color:0x9ae9ff},{name:"Lluvia tras la sequía · Makomo",cost:15,power:1.3,color:0x80d9f5},{name:"Remolino · Makomo",cost:20,power:1.4,color:0x62c8f1}] },
 sabito: { identity: "Fuerza y disciplina", techniques: [{name:"Corte de la superficie · Sabito",cost:15,power:1.35,color:0x3eaff0},{name:"Marea implacable · Sabito",cost:20,power:1.55,color:0x208ed7},{name:"Remolino · Sabito",cost:25,power:1.7,color:0x116fae}] },
 giyu: { identity: "Defensa y movimientos mínimos", techniques: [{name:"Lluvia tras la sequía · Giyu",cost:14,power:1.3,color:0x86d9f7},{name:"Flujo constante · Giyu",cost:20,power:1.55,color:0x3ba8df},{name:"Undécima postura · Calma",cost:30,power:1.9,color:0x1d79bb}] }
};

/** Movimiento visual y desbloqueo: cada postura requiere práctica, no solo energía. */
export type WaterMotion = "slash" | "wheel" | "flow";
export const WATER_MOTIONS: readonly WaterMotion[] = ["slash", "wheel", "flow"];
export function unlockedWaterForms(stationsCompleted: number, daysElapsed: number): number {
  if (stationsCompleted >= 11 && daysElapsed >= 35) return 3;
  if (stationsCompleted >= 6 && daysElapsed >= 15) return 2;
  return 1;
}
export function waterArcPoints(motion: WaterMotion, origin: { x: number; y: number; z: number }, heading: number): {x:number;y:number;z:number}[] {
  const points: {x:number;y:number;z:number}[] = [];
  for (let i = 0; i < 11; i++) {
    const u = i / 10;
    const a = motion === "wheel" ? u * Math.PI * 2 : motion === "flow" ? u * Math.PI * 1.5 : (u - 0.5) * Math.PI * 0.9;
    const sideways = motion === "flow" ? Math.sin(a * 1.7) * 1.15 : Math.sin(a) * (motion === "wheel" ? 1.1 : 1.5);
    const up = motion === "wheel" ? 1.15 + Math.cos(a) * 1.05 : motion === "flow" ? 0.5 + u * 1.45 : 0.9 + u * 0.7;
    const forward = motion === "flow" ? 0.7 + u * 2.2 : 1.1 + Math.cos(a) * 0.3;
    points.push({ x: origin.x + Math.cos(heading) * sideways + Math.sin(heading) * forward,
      y: origin.y + up, z: origin.z - Math.sin(heading) * sideways + Math.cos(heading) * forward });
  }
  return points;
}
