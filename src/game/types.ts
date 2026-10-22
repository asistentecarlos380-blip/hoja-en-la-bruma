export type Rows = string[];

export type NpcDef = {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  color?: string;
  /** Nodo de historia que inicia al hablarle (solo la primera vez). */
  nodeId?: string;
  /** Diálogo repetible una vez visto el nodo. */
  lines: string[];
  /** Demonio opcional que aparece tras cerrar el diálogo. */
  battle?: string;
};

export type WarpDef = {
  x: number;
  y: number;
  to: string;
  toX: number;
  toY: number;
  label: string;
  /** Capítulos completados necesarios para viajar. */
  requiresChapters?: number;
  /** Basta con haber visto uno de estos nodos. */
  requiresAnyNode?: string[];
};

export type TriggerDef = {
  x: number;
  y: number;
  nodeId: string;
  label?: string;
  battle?: string;
  /** Si es false, se puede volver a activar. */
  once?: boolean;
};

export type MapDef = {
  id: string;
  name: string;
  subtitle: string;
  rows: Rows;
  npcs: NpcDef[];
  warps: WarpDef[];
  triggers: TriggerDef[];
  encounters?: string[];
  encounterRate?: number;
  /** Tinte ambiental aplicado sobre el mapa. */
  tint?: string;
};

export type TileDef = {
  name: string;
  bg: string;
  solid: boolean;
  grass?: boolean;
  emoji?: string;
};
