"use client";

import { useGame } from "@/lib/game/context";
import { BREATH_FORMS } from "@/lib/game/data";

export default function CharacterPanel() {
  const { state, dispatch } = useGame();
  const g = state.game;

  return (
    <div className="space-y-3">
      <div className="ebf-frame flex items-start justify-between">
        <div>
          <h2 className="title-font text-2xl text-[#ffd700]">
            {g.playerName}
          </h2>
          <div className="text-slate-300">
            Rango: <b className="text-[#ffd700]">{g.rank}</b> · Nivel {g.level} · XP {g.xp}/{80 + g.level * 60}
          </div>
          <div className="text-slate-400 text-sm italic">{g.breathingStyle}</div>
        </div>
        <button className="ebf-btn" onClick={() => dispatch({ type: "SET_PHASE", phase: state.previousPhase })}>
          Cerrar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Stat label="HP máx" value={g.maxHp} color="text-red-300" />
        <Stat label="Ataque" value={g.attack} color="text-orange-300" />
        <Stat label="Defensa" value={g.defense} color="text-blue-300" />
        <Stat label="Velocidad" value={g.speed} color="text-cyan-300" />
      </div>

      <div className="ebf-frame">
        <h3 className="title-font text-lg text-[#ffd700] mb-2">Formas de respiración desbloqueadas</h3>
        <div className="space-y-1">
          {BREATH_FORMS.map((f) => {
            const unlocked = g.unlockedForms.includes(f.formNumber);
            return (
              <div key={f.id} className={`p-2 rounded border ${unlocked ? "border-cyan-600/40 bg-cyan-950/20" : "border-slate-700 bg-slate-900/50 opacity-50"}`}>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-cyan-200">{f.name}</div>
                  {unlocked ? (
                    <span className="text-xs text-cyan-300">Coste {f.cost} O2 · x{f.multiplier}</span>
                  ) : (
                    <span className="text-xs text-slate-500">BLOQUEADO</span>
                  )}
                </div>
                {unlocked && <div className="text-xs text-slate-300 italic">{f.description}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="ebf-frame">
        <h3 className="title-font text-lg text-[#ffd700] mb-2">Inventario</h3>
        {g.inventory.length === 0 ? (
          <p className="text-slate-400 text-sm">No tienes objetos todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {g.inventory.map((it) => (
              <div key={it.id} className="p-2 border border-slate-700 rounded flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-bold text-white">
                    {it.name} {it.equipped && <span className="text-[#ffd700] text-xs">✓ EQUIPADO</span>}
                  </div>
                  <div className="text-xs text-slate-400">{it.description}</div>
                  {it.value && it.stat && (
                    <div className="text-xs text-green-300">+{it.value} {it.stat.toUpperCase()}</div>
                  )}
                </div>
                {(it.type === "weapon" || it.type === "armor" || it.type === "relic") && (
                  <button
                    className="ebf-btn !px-2 !py-1 !text-xs !min-w-0"
                    onClick={() => dispatch({ type: "EQUIP_ITEM", itemId: it.id })}
                  >
                    {it.equipped ? "Desequipar" : "Equipar"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ebf-frame">
        <h3 className="title-font text-lg text-[#ffd700] mb-2">Progreso</h3>
        <div className="text-sm text-slate-300 space-y-1">
          <div>Demonios cazados: <b className="text-red-300">{g.demonsSlain}</b></div>
          <div>Invocaciones realizadas: <b className="text-purple-300">{g.gachaPulls}</b></div>
          <div>Aliados reunidos: <b className="text-cyan-300">{g.allies.length}</b></div>
          <div>Capítulo de historia: <b className="text-[#ffd700]">{g.storyChapter}</b></div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="ebf-frame text-center !p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`title-font text-2xl ${color}`}>{value}</div>
    </div>
  );
}
