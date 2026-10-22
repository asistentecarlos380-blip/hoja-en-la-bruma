"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Game, type HudState } from "@/game3d/engine";

type Screen = "title" | "playing" | "paused" | "gameover" | "victory";

const INITIAL_HUD: HudState = {
  hp: 5, maxHp: 5, breath: 100, maxBreath: 100, lives: 3, orbs: 0, totalOrbs: 22,
  time: 0, score: 0, combo: 0, bossHp: 0, bossMaxHp: 12, bossActive: false,
  checkpoint: "Aldea del carbón", gateOpen: false, hitFlash: 0, progress: 0,
};

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function rank(score: number) {
  if (score >= 11000) return { r: "S", c: "text-amber-300" };
  if (score >= 8500) return { r: "A", c: "text-emerald-300" };
  if (score >= 6000) return { r: "B", c: "text-cyan-300" };
  return { r: "C", c: "text-slate-300" };
}

export default function Platformer3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [screen, setScreen] = useState<Screen>("title");
  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const game = new Game(canvasRef.current, setHud, (ev, payload) => {
      if (ev === "victory") setScreen("victory");
      else if (ev === "gameover") setScreen("gameover");
      else if (ev === "pause") setScreen("paused");
      else if (ev === "resume") setScreen((s) => (s === "title" ? s : "playing"));
      else if (ev === "checkpoint") setToast(`🏮 Punto de control: ${payload}`);
      else if (ev === "bossdown") setToast("⚔️ ¡La Luna Inferior ha caído! El portal se abre.");
    });
    gameRef.current = game;
    return () => {
      game.dispose();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const start = useCallback(() => {
    gameRef.current?.start();
    setScreen("playing");
  }, []);

  const restart = useCallback(() => {
    gameRef.current?.restart();
    setScreen("playing");
  }, []);

  const playing = screen === "playing";

  return (
    <div className="fixed inset-0 bg-[#05070f] overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {/* Destello al recibir daño */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-150"
        style={{ opacity: hud.hitFlash * 0.55, background: "radial-gradient(circle, rgba(255,0,40,0) 40%, rgba(255,20,60,0.85) 100%)" }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.75)" }} />

      {/* ---------------- HUD ---------------- */}
      {screen !== "title" && (
        <div className="pointer-events-none absolute inset-0 p-3 md:p-4 font-sans">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg border border-[#d4af37]/50 bg-black/60 px-3 py-2 backdrop-blur-sm">
              <div className="flex gap-1 text-lg leading-none">
                {Array.from({ length: hud.maxHp }).map((_, i) => (
                  <span key={i} className={i < hud.hp ? "text-red-500" : "text-slate-700"}>♥</span>
                ))}
              </div>
              <div className="mt-1.5 h-2 w-40 rounded-full bg-slate-900 overflow-hidden border border-cyan-900">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 transition-all" style={{ width: `${(hud.breath / hud.maxBreath) * 100}%` }} />
              </div>
              <div className="mt-1 text-[10px] text-cyan-200/80">Respiración de la Bruma Plateada</div>
              <div className="mt-1 text-[10px] text-slate-400">Vidas: {"🥷".repeat(Math.max(0, hud.lives))}</div>
            </div>

            <div className="text-center rounded-lg border border-[#d4af37]/50 bg-black/60 px-3 py-2 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-widest text-yellow-300/90">Ascenso a la Montaña de la Bruma</div>
              <div className="text-xl font-bold text-white tabular-nums">{fmt(hud.time)}</div>
              <div className="mt-1 h-1.5 w-44 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-amber-300 transition-all" style={{ width: `${hud.progress * 100}%` }} />
              </div>
              <div className="mt-1 text-[10px] text-slate-400">{hud.checkpoint}</div>
            </div>

            <div className="rounded-lg border border-[#d4af37]/50 bg-black/60 px-3 py-2 text-right backdrop-blur-sm">
              <div className="text-sm text-cyan-200">◈ {hud.orbs}/{hud.totalOrbs}</div>
              <div className="text-lg font-bold text-yellow-200 tabular-nums">{hud.score.toLocaleString("es")}</div>
              {hud.combo > 1 && <div className="text-xs text-rose-300 font-bold animate-pulse">{hud.combo}x combo</div>}
            </div>
          </div>

          {hud.bossActive && hud.bossHp > 0 && (
            <div className="mx-auto mt-3 w-full max-w-md">
              <div className="text-center text-[11px] uppercase tracking-[0.3em] text-rose-300">Luna Inferior · Rui</div>
              <div className="mt-1 h-3 rounded-full border border-rose-800 bg-black/70 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-fuchsia-400 transition-all duration-200" style={{ width: `${(hud.bossHp / hud.bossMaxHp) * 100}%` }} />
              </div>
            </div>
          )}

          {toast && (
            <div className="absolute left-1/2 top-24 -translate-x-1/2 rounded-lg border border-[#d4af37]/70 bg-black/85 px-4 py-2 text-sm text-yellow-200">
              {toast}
            </div>
          )}

          <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[11px] text-slate-400 md:block">
            WASD/flechas mover · Espacio saltar (doble salto) · Mayús dash · J o clic tajar · Q/E o arrastrar cámara · Esc pausa
          </div>
        </div>
      )}

      {/* ---------------- Controles táctiles ---------------- */}
      {playing && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:hidden">
          <Joystick onMove={(x, y) => gameRef.current?.setTouch({ x, y })} />
          <div className="flex items-end gap-3">
            <TouchBtn label="DASH" className="bg-cyan-900/80 border-cyan-400/70" onDown={() => gameRef.current?.setTouch({ dash: true })} />
            <TouchBtn label="TAJAR" className="bg-rose-900/80 border-rose-400/70" onDown={() => gameRef.current?.setTouch({ attack: true })} />
            <TouchBtn label="SALTO" className="bg-amber-900/80 border-amber-300/70 w-20 h-20 text-base" onDown={() => gameRef.current?.setTouch({ jump: true })} />
          </div>
        </div>
      )}

      {/* ---------------- Pantallas ---------------- */}
      {screen === "title" && (
        <Overlay>
          <div className="text-6xl mb-2">🌙</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-yellow-200 tracking-wide text-center">
            Kimetsu no Yaiba
          </h1>
          <div className="font-serif text-xl md:text-2xl text-slate-200 mb-1">Hoja en la Bruma 3D</div>
          <p className="text-sm text-slate-400 italic mb-5 text-center max-w-md">
            Plataformero de acción: asciende la montaña nevada, reúne las esquirlas de Nichirin,
            corta a los demonios y derrota a la Luna Inferior antes de cruzar el portal.
          </p>
          <button onClick={start} className="px-8 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold text-lg shadow-lg">
            ⚔ Comenzar ascenso
          </button>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-400">
            <span>WASD / flechas — moverse</span>
            <span>Espacio — salto y doble salto</span>
            <span>Mayús — dash del trueno</span>
            <span>J / clic — tajar con la Nichirin</span>
            <span>Q / E o arrastrar — cámara</span>
            <span>Esc — pausa</span>
          </div>
          <NavLinks />
        </Overlay>
      )}

      {screen === "paused" && (
        <Overlay>
          <h2 className="font-serif text-3xl text-yellow-200 mb-4">Pausa</h2>
          <div className="flex flex-col gap-2 w-56">
            <button onClick={() => gameRef.current?.togglePause()} className="px-5 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold">
              Continuar
            </button>
            <button onClick={restart} className="px-5 py-2.5 rounded-lg border border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-200">
              Reiniciar nivel
            </button>
          </div>
          <NavLinks />
        </Overlay>
      )}

      {screen === "gameover" && (
        <Overlay>
          <div className="text-5xl mb-2">🩸</div>
          <h2 className="font-serif text-4xl text-rose-400 mb-2">Has caído</h2>
          <p className="text-sm text-slate-400 mb-4">La bruma te envuelve... pero los Kakushi te encuentran al pie de la montaña.</p>
          <Stats hud={hud} />
          <button onClick={restart} className="mt-5 px-8 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold">
            ↺ Intentarlo de nuevo
          </button>
          <NavLinks />
        </Overlay>
      )}

      {screen === "victory" && (
        <Overlay>
          <div className="text-5xl mb-2">🌸</div>
          <h2 className="font-serif text-4xl text-yellow-200 mb-1">¡Portal cruzado!</h2>
          <p className="text-sm text-slate-300 mb-3">
            La Luna Inferior cae y el amanecer se filtra entre la bruma. Nezuko te espera al otro lado.
          </p>
          <div className={`text-6xl font-black mb-2 ${rank(hud.score).c}`}>{rank(hud.score).r}</div>
          <Stats hud={hud} />
          <button onClick={restart} className="mt-5 px-8 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold">
            ↺ Jugar otra vez
          </button>
          <NavLinks />
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/78 backdrop-blur-[3px] px-4 font-sans overflow-y-auto">
      {children}
    </div>
  );
}

function Stats({ hud }: { hud: HudState }) {
  const { r } = rank(hud.score);
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        ["Tiempo", fmt(hud.time)],
        ["Esquirlas", `${hud.orbs}/${hud.totalOrbs}`],
        ["Puntos", hud.score.toLocaleString("es")],
        ["Rango", r],
      ].map(([k, v]) => (
        <div key={k} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
          <div className="text-base font-bold text-yellow-200">{v}</div>
        </div>
      ))}
    </div>
  );
}

function NavLinks() {
  return (
    <div className="mt-6 flex gap-3 text-[11px]">
      <Link href="/" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">
        🌍 Mundo abierto 3D
      </Link>
      <Link href="/mundo" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">
        🌫 RPG 2D
      </Link>
      <Link href="/historia" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">
        📖 Modo lectura
      </Link>
    </div>
  );
}

function TouchBtn({ label, className = "", onDown }: { label: string; className?: string; onDown: () => void }) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      className={`w-16 h-16 rounded-full border-2 text-[11px] font-bold text-white/90 shadow-lg active:scale-95 transition-transform ${className}`}
    >
      {label}
    </button>
  );
}

function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const handle = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    setKnob({ x: dx, y: dy });
    onMove(dx, dy);
  };

  return (
    <div
      ref={ref}
      className="relative h-32 w-32 rounded-full border-2 border-white/25 bg-white/10 backdrop-blur-sm touch-none"
      onPointerDown={(e) => {
        active.current = e.pointerId;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        handle(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (active.current === e.pointerId) handle(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        active.current = null;
        setKnob({ x: 0, y: 0 });
        onMove(0, 0);
      }}
      onPointerCancel={() => {
        active.current = null;
        setKnob({ x: 0, y: 0 });
        onMove(0, 0);
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-300/60 bg-yellow-500/30"
        style={{ transform: `translate(calc(-50% + ${knob.x * 34}px), calc(-50% + ${knob.y * 34}px))` }}
      />
    </div>
  );
}
