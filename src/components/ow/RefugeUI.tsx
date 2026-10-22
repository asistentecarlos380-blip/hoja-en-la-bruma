"use client";

import { useEffect, useRef } from "react";
import type { OWHud } from "@/game3d/ow/engine";

export function RefugeTransition({ hud }: { hud: OWHud }) {
  const tr = hud.transition;
  if (!tr) return null;
  if (tr.kind === "fall") return (
    <div className="absolute inset-0 z-[100] pointer-events-auto" aria-label="Caída por la ladera" data-testid="fall-sequence">
      <div className="absolute inset-x-0 top-0 h-[9vh] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[12vh] bg-black flex items-center justify-center px-5">
        <p className="text-sm md:text-base text-stone-200 italic text-center">{tr.progress < 0.5 ? "Tanjiro: «¡Agárrate! ¡El sendero se está rompiendo!»" : "La nieve amortigua la caída. Una lámpara brilla al pie de la pendiente."}</p>
      </div>
    </div>
  );
  const sleeping = tr.kind === "sleep";
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 pointer-events-auto" style={{ opacity: tr.opacity }} role="status" aria-live="polite" data-testid={`transition-${tr.kind}`}>
      <span className="mb-7 text-[10px] uppercase tracking-[0.5em] text-amber-300/60 font-sans">{sleeping ? "Mientras la montaña descansa" : tr.kind === "enter" ? "Un refugio en la colina" : "Monte Kumotori"}</span>
      <div className="mb-5 text-amber-100/80" aria-hidden="true">
        {sleeping ? <svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M31 6a18 18 0 1 0 11 29C21 43 7 22 31 6Z" stroke="currentColor" strokeWidth="1" /></svg> : <svg width="44" height="44" viewBox="0 0 48 48" fill="none"><path d="m5 21 19-14 19 14M11 18v23h26V18M20 41V27h8v14" stroke="currentColor" strokeWidth="1" /></svg>}
      </div>
      <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-stone-100">{sleeping ? "La noche pasa…" : tr.kind === "enter" ? "La casa de Saburo" : "Un nuevo amanecer"}</h2>
      <div className="mt-6 text-3xl tracking-[0.22em] text-amber-100/90 tabular-nums font-sans" aria-hidden="true">{sleeping ? hud.clock : tr.kind === "enter" ? "22:30" : "06:15"}</div>
      <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-stone-400">{sleeping ? "El viento se apaga. Los copos dejan de caer. Por primera vez en horas, todo está en calma." : tr.kind === "enter" ? "El anciano os deja entrar. La puerta se cierra detrás de vosotros, y el frío queda afuera." : "Ya no nieva. El camino a casa de Nezuko vuelve a ser transitable."}</p>
      {sleeping && <div className="mt-8 h-px w-40 bg-stone-800 overflow-hidden"><div className="h-full bg-amber-200/70" style={{ width: `${tr.progress * 100}%` }} /></div>}
    </div>
  );
}

export function SleepDialog({ onAnswer }: { onAnswer: (sleep: boolean) => void }) {
  const confirm = useRef<HTMLButtonElement>(null);
  useEffect(() => { confirm.current?.focus(); }, []);
  return (
    <div className="absolute inset-0 z-[80] bg-[#100e0b]/80 backdrop-blur-sm flex items-center justify-center p-5 font-sans" role="dialog" aria-modal="true" aria-labelledby="sleep-title" data-testid="sleep-prompt">
      <div className="w-full max-w-md border border-[#b5915b]/60 bg-[#201c17] rounded-lg px-7 py-8 shadow-2xl">
        <span className="text-[10px] uppercase tracking-[0.32em] text-amber-300/70">Cuarto de invitados</span>
        <h2 id="sleep-title" className="font-serif text-3xl text-[#f4e7ce] mt-3">Hasta el amanecer</h2>
        <p className="mt-4 text-sm text-stone-300 leading-7">Saburo ha dejado sábanas limpias sobre el tatami. Tanjiro está a salvo. Afuera todavía nieva.</p>
        <div className="my-6 flex items-center justify-between border-y border-stone-600/40 py-4 text-sm">
          <span className="text-stone-400">Noche <b className="block text-lg font-normal text-stone-100 mt-1">22:30</b></span>
          <span className="text-amber-300/60 text-xl">→</span>
          <span className="text-right text-amber-200/70">Mañana <b className="block text-lg font-normal text-amber-100 mt-1">06:15</b></span>
        </div>
        <p className="text-xs leading-6 text-stone-400 mb-6">Dormir hará pasar el tiempo. La nevada terminará y podréis salir hacia la casa de los Kamado.</p>
        <button ref={confirm} onClick={() => onAnswer(true)} className="w-full rounded border border-amber-200/50 bg-[#c4a16c] hover:bg-[#ddbe8f] text-[#201a12] font-semibold text-sm py-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">Dormir hasta el amanecer</button>
        <button onClick={() => onAnswer(false)} className="mt-3 w-full py-2 text-xs text-stone-400 hover:text-stone-100">Todavía no · seguir explorando</button>
        <span className="block mt-3 text-center text-[10px] text-stone-500">Enter para dormir · Esc para volver</span>
      </div>
    </div>
  );
}

export function CabinPlan({ hud }: { hud: OWHud }) {
  const x = (hud.player.x + 8) * 8;
  const y = (hud.player.z + 6.5) * 8;
  return (
    <div className="hidden sm:block bg-[#1b1713]/85 border border-amber-200/25 rounded-lg p-2 text-center">
      <div className="text-[9px] tracking-[0.17em] uppercase text-amber-200/70 mb-2">Casa de Saburo</div>
      <svg width="128" height="104" viewBox="0 0 128 104" role="img" aria-label="Plano del cuarto, baño y entrada de la cabaña">
        <rect x="1" y="1" width="126" height="102" rx="1" fill="#775536" stroke="#b99d75" />
        <rect x="4" y="4" width="53" height="48" fill="#92916a" />
        <rect x="89" y="3" width="35" height="33" fill="#657a73" />
        <path d="M58 0v57H50m-18 0H0m88-57v40h10m18 0h12" stroke="#ecd6b6" fill="none" />
        <rect x="13" y="7" width="17" height="22" rx="1" fill="#d3c4a7" />
        <rect x="36" y="21" width="14" height="24" rx="1" fill="#bb9682" stroke="#f6e7c7" />
        <text x="92" y="23" fontSize="7" fill="#f5e8d2">Baño</text>
        <text x="9" y="47" fontSize="7" fill="#fcf0cf">Cuarto</text>
        <rect x="68" y="61" width="19" height="16" fill="#392a1e" />
        <circle cx="77" cy="69" r="4" fill="#dd8e47" />
        <path d="M54 103h20" stroke="#eddcae" strokeWidth="3" />
        <circle cx={x} cy={y} r="3.5" fill="#a5e9ff" stroke="#214151" />
      </svg>
      <div className="text-[9px] text-stone-400 mt-1">{hud.morning ? "Mañana · puerta abierta" : "Noche · refugio seguro"}</div>
    </div>
  );
}
