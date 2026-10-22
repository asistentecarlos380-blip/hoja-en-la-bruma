"use client";

import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const sync = () => setActive(Boolean(document.fullscreenElement));
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const enter = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      return true;
    } catch {
      return false;
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch { /* el navegador puede rechazarlo; no es crítico */ }
  }, []);

  const toggle = useCallback(() => (document.fullscreenElement ? exit() : enter()), [enter, exit]);
  return { active, enter, exit, toggle };
}

/** Detiene la escena si se sale de pantalla completa en un momento importante. */
export function FullscreenGuard({ onEnter, onDecline }: { onEnter: () => void; onDecline: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "KeyF") { e.preventDefault(); onEnter(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnter]);

  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-[#07060a]/95 p-5 font-sans" role="dialog" aria-modal="true" aria-labelledby="fs-title" data-testid="fullscreen-guard">
      <div className="w-full max-w-md rounded-lg border border-amber-200/40 bg-[#1b1812] px-7 py-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 text-amber-200/80" aria-hidden="true">
          <svg width="46" height="46" viewBox="0 0 48 48" fill="none" className="mx-auto"><path d="M6 17V6h11M42 17V6H31M6 31v11h11M42 31v11H31" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
        </div>
        <span className="text-[10px] uppercase tracking-[0.34em] text-amber-300/70">Escena importante</span>
        <h2 id="fs-title" className="mt-3 font-serif text-2xl text-[#f4e7ce]">La historia está en marcha</h2>
        <p className="mt-4 text-sm leading-7 text-stone-300">La partida está detenida para que no te pierdas nada. Vuelve a pantalla completa y continuará justo donde estaba.</p>
        <button onClick={onEnter} className="mt-6 w-full rounded border border-amber-200/50 bg-[#c4a16c] py-3.5 text-sm font-semibold text-[#201a12] hover:bg-[#ddbe8f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100">
          Volver a pantalla completa
        </button>
        <button onClick={onDecline} className="mt-3 w-full py-2 text-xs text-stone-400 hover:text-stone-100">Seguir en ventana · no volver a preguntar</button>
        <span className="mt-3 block text-[10px] text-stone-500">Enter o F para pantalla completa</span>
      </div>
    </div>
  );
}

/** Aviso discreto para capturar el ratón y mirar alrededor sin mantener pulsado. */
export function LookHint({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200/40 bg-black/80 px-4 py-2 text-xs text-amber-100 hover:border-amber-200/80 md:flex"
      data-testid="look-hint"
    >
      <svg width="13" height="18" viewBox="0 0 14 20" fill="none" aria-hidden="true"><rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" /><path d="M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      Haz clic para mirar con el ratón
    </button>
  );
}
