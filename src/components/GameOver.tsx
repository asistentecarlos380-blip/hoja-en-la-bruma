"use client";

import { useGame } from "@/lib/game/context";

export default function GameOver() {
  const { dispatch } = useGame();
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-slate-950" />
      <div className="mist-overlay" />
      <div className="ebf-frame text-center relative z-10 max-w-lg">
        <h2 className="title-font text-5xl text-red-500 mb-4 drop-shadow-[0_2px_0_#000]">
          HAS CAÍDO
        </h2>
        <p className="text-slate-300 italic mb-6">
          La bruma se cierne sobre tu cuerpo, pero un cuervo kasugai lleva noticias de tu caída
          hasta la Sede. Los cazadores de la Wisteria te encuentran medio muerto y te curan...
          aunque tu orgullo tarda más en sanar.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="ebf-btn"
            onClick={() => {
              dispatch({ type: "HEAL" });
              dispatch({ type: "SET_PHASE", phase: "location" });
            }}
          >
            Volver a la última ubicación (herido)
          </button>
          <button
            className="ebf-btn ebf-btn-danger"
            onClick={() => dispatch({ type: "SET_PHASE", phase: "menu" })}
          >
            Volver al menú principal
          </button>
        </div>
      </div>
    </div>
  );
}
