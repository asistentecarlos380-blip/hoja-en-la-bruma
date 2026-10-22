import { WHAT_IF_STORY, type StoryChapter, type MissionObjective } from "./storyData";

/** ¿Se ha completado este objetivo según los nodos ya visitados? */
export function isObjectiveDone(objective: MissionObjective, visited: string[]): boolean {
  return objective.completeOnNodeIds.some((id) => visited.includes(id));
}

/** ¿Se ha completado toda la misión del capítulo? */
export function isChapterComplete(chapter: StoryChapter, visited: string[]): boolean {
  return chapter.mission.objectives.every((o) => isObjectiveDone(o, visited));
}

/** Número de capítulos totalmente completados. */
export function chaptersCompleted(visited: string[]): number {
  return WHAT_IF_STORY.filter((c) => isChapterComplete(c, visited)).length;
}

/** Capítulo en curso (el primero sin completar). */
export function activeChapter(visited: string[]): StoryChapter {
  return WHAT_IF_STORY.find((c) => !isChapterComplete(c, visited)) ?? WHAT_IF_STORY[WHAT_IF_STORY.length - 1];
}

export function activeChapterIndex(visited: string[]): number {
  const idx = WHAT_IF_STORY.findIndex((c) => !isChapterComplete(c, visited));
  return idx === -1 ? WHAT_IF_STORY.length - 1 : idx;
}

/** Un capítulo se abre cuando todos los anteriores están completos. */
export function isChapterUnlocked(index: number, visited: string[]): boolean {
  return index === 0 || WHAT_IF_STORY.slice(0, index).every((c) => isChapterComplete(c, visited));
}

/** Formas de respiración disponibles según el avance de la historia. */
export function unlockedFormNumbers(visited: string[]): number[] {
  const total = Math.min(7, 1 + chaptersCompleted(visited));
  return Array.from({ length: total }, (_, i) => i + 1);
}

/** Rango del Cuerpo según capítulos completados y demonios cazados. */
export function playerRank(visited: string[], demonsSlain: number): string {
  const done = chaptersCompleted(visited);
  if (done >= 8 || demonsSlain >= 40) return "Pilar honorario";
  if (done >= 6) return "Kinoe";
  if (done >= 4) return "Kinoto";
  if (done >= 2) return "Mizunoe";
  return "Mizunoto";
}
