"use client";

import { useState } from "react";

type Props = {
  onConfirm: (first: string, last: string) => void;
};

export default function NameEntry({ onConfirm }: Props) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = first.trim();
    const l = last.trim();
    if (f.length < 2 || l.length < 2) {
      setError("Necesitamos tu nombre completo (mínimo 2 letras en cada campo).");
      return;
    }
    onConfirm(f, l);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-serif relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950" />
      {/* Niebla decorativa */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(200,220,255,0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(180,200,255,0.06), transparent 55%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/90 border border-yellow-700/50 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🌫️</div>
          <h1 className="text-2xl font-bold text-yellow-200 tracking-wide">
            Antes de entrar en la bruma...
          </h1>
          <p className="text-slate-400 text-sm mt-2 italic">
            Eres un joven de diecinueve años, prometido de Nezuko Kamado.
            Todavía no eres cazador: tu historia empieza sin espada, en una aldea
            cubierta de nieve. ¿Cómo te llamas?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-yellow-500/80 uppercase tracking-widest font-sans font-bold">
                Nombre
              </span>
              <input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                placeholder="Ren"
                maxLength={20}
                className="bg-slate-950 border border-slate-700 focus:border-yellow-500 rounded-lg px-3 py-2.5 text-center text-lg text-yellow-100 outline-none transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-yellow-500/80 uppercase tracking-widest font-sans font-bold">
                Apellido
              </span>
              <input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                placeholder="Shinjo"
                maxLength={20}
                className="bg-slate-950 border border-slate-700 focus:border-yellow-500 rounded-lg px-3 py-2.5 text-center text-lg text-yellow-100 outline-none transition-colors"
              />
            </label>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg transition-colors font-sans tracking-wide cursor-pointer"
          >
            Comenzar la historia
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-4 italic">
          Tu nombre aparecerá en los diálogos y será recordado por los demonios.
        </p>
      </div>
    </div>
  );
}
