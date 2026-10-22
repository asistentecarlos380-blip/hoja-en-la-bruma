"use client";

import { useGame } from "@/lib/game/context";

export default function Victory() {
  const { state, dispatch } = useGame();
  const g = state.game;
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900 via-yellow-700/30 to-slate-950" />
      <div className="mist-overlay" />
      <div className="ebf-frame ebf-frame-gold text-center relative z-10 max-w-2xl">
        <h2 className="title-font text-5xl text-[#ffd700] mb-4 drop-shadow-[0_3px_0_#000]">
          ✦ EL SOL TRAS LA BRUMA ✦
        </h2>
        <p className="text-slate-200 italic mb-3">
          Has completado la línea temporal alternativa de <b>Hojas en la Bruma</b>.
          Tu séptima postura, Bruma que Borra el Horizonte, difractó los primeros rayos
          del alba sobre Muzan y terminó con quinientos años de reinado de terror.
        </p>
        <p className="text-slate-300 text-sm mb-6">
          En esta línea, Rengoku sobrevivió, Muichiro no perdió la memoria hasta el final,
          y la Aldea de los Herradores jamás fue destruida. Los Pilares vivieron para ver
          el fin de la era de los demonios.
        </p>
        <div className="grid grid-cols-2 gap-3 text-left mb-4">
          <div className="ebf-frame !p-2 text-xs">
            <div className="text-[#ffd700] title-font">Nivel final</div>
            <div className="text-2xl text-cyan-200">{g.level}</div>
          </div>
          <div className="ebf-frame !p-2 text-xs">
            <div className="text-[#ffd700] title-font">Rango final</div>
            <div className="text-2xl text-red-300">{g.rank}</div>
          </div>
          <div className="ebf-frame !p-2 text-xs">
            <div className="text-[#ffd700] title-font">Demonios abatidos</div>
            <div className="text-2xl text-orange-300">{g.demonsSlain}</div>
          </div>
          <div className="ebf-frame !p-2 text-xs">
            <div className="text-[#ffd700] title-font">Aliados invocados</div>
            <div className="text-2xl text-purple-300">{g.allies.length}</div>
          </div>
        </div>
        <p className="text-slate-400 italic text-xs mb-4">
          «La espada que no corta a los débiles es la hoja más fuerte. Tu bruma no ha sido
          solo una técnica: ha sido un escudo para quienes amabas.» — Ubuyashiki Kagaya.
        </p>
        <button
          className="ebf-btn glow-pulse"
          onClick={() => dispatch({ type: "SET_PHASE", phase: "worldmap" })}
        >
          Seguir explorando el mundo
        </button>
      </div>
    </div>
  );
}
