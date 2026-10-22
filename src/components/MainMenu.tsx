"use client";

import { useState } from "react";
import { useGame } from "@/lib/game/context";

export default function MainMenu() {
  const { dispatch } = useGame();
  const [showNewGame, setShowNewGame] = useState(false);
  const [name, setName] = useState("Shinjo Ren");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950" />
      <div className="mist-overlay" />
      {/* Moon */}
      <div className="absolute top-16 right-24 w-40 h-40 rounded-full bg-[#f4e6c2] shadow-[0_0_60px_20px_rgba(244,230,194,0.3)] opacity-80" />

      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="ebf-frame ebf-frame-gold px-10 py-10">
          <div className="title-font text-5xl md:text-6xl text-[#ffd700] drop-shadow-[0_3px_0_#000] mb-2">
            KIMETSU NO YAIBA
          </div>
          <div className="title-font text-3xl md:text-4xl text-slate-200 drop-shadow-[0_2px_0_#000] mb-6">
            Hojas en la Bruma
          </div>
          <div className="text-slate-300 italic mb-2">— Un JRPG de mundo abierto en una línea temporal alternativa —</div>
          <div className="text-slate-400 text-sm mb-8">
            Eres Shinjo Ren, portador de la Respiración de la Bruma Plateada. Tu existencia altera el destino
            de los Pilares. Salva a Rengoku, evita la masacre del Castillo Infinito... y enfrenta a Muzan con
            una hoja que refleja la luz del sol.
          </div>

          {!showNewGame ? (
            <div className="flex flex-col items-center gap-3">
              <button
                className="ebf-btn glow-pulse w-72"
                onClick={() => setShowNewGame(true)}
              >
                ⚔ NUEVA PARTIDA (WHAT IF)
              </button>
              <button
                className="ebf-btn w-72"
                onClick={async () => {
                  const r = await fetch("/api/load");
                  const data = await r.json();
                  if (data.save) {
                    dispatch({ type: "LOAD_STATE", payload: data.save });
                  } else {
                    alert("No hay ninguna partida guardada.");
                  }
                }}
              >
                📖 CARGAR PARTIDA
              </button>
              <div className="mt-6 text-xs text-slate-500 max-w-md">
                Inspirado en Epic Battle Fantasy y en el universo de Kimetsu no Yaiba.
                <br />
                Proyecto fan-made sin ánimo de lucro.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-300">Nombre del cazador</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#0a0c18] border-2 border-[#d4af37] rounded px-3 py-2 text-center text-white w-72 focus:outline-none focus:border-yellow-300"
                />
              </label>
              <div className="flex gap-3">
                <button
                  className="ebf-btn"
                  onClick={() => dispatch({ type: "NEW_GAME", playerName: name })}
                >
                  ⚔ COMENZAR
                </button>
                <button
                  className="ebf-btn ebf-btn-danger"
                  onClick={() => setShowNewGame(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
