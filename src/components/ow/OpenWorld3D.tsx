"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import NameEntry from "@/components/NameEntry";
import { OpenWorldGame, type OWHud, type OWSave } from "@/game3d/ow/engine";
import { ROADS, ZONES, ZONE_BY_ID, WORLD_HALF } from "@/game3d/ow/world";
import { PLAYER_START } from "@/game3d/ow/campaign";
import { normalizeSave, freshRefuge, PROLOGUE_VERSION } from "@/game3d/ow/prologue";
import { RefugeTransition, SleepDialog, CabinPlan } from "./RefugeUI";
import { FullscreenGuard, LookHint, useFullscreen } from "./ScreenGuard";
import { EncounterHUD, TrainingHUD } from "./EncounterUI";

const SAVE_KEY = "kd_ow3d_v3";
const DEV_PHASES = [
  { step: 0, label: "Llegada Urokodaki", hint: "Hablar con el maestro" },
  { step: 2, label: "Circuito de Trampas", hint: "Cuatro estaciones en el descenso" },
  { step: 3, label: "Entrenar con Makomo", hint: "Diálogo y práctica compartida" },
  { step: 4, label: "Duelo Sabito", hint: "Encuentro en el claro" },
  { step: 5, label: "Cortar la Roca", hint: "Respiración, parada y tajo final" },
] as const;
type Stored = { name: { first: string; last: string }; save: OWSave | null };
type Screen = "loading" | "name" | "title" | "playing" | "paused";

function readStored(): Stored | null {
  try {
    for (const key of [SAVE_KEY, "kd_ow3d_v2", "kd_ow3d_v1"]) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.name?.first !== "string" || typeof parsed?.name?.last !== "string") continue;
      return { name: parsed.name, save: normalizeSave(parsed.save) };
    }
  } catch { /* Un dato local inválido no impide empezar. */ }
  return null;
}

export default function OpenWorld3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<OpenWorldGame | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [stored, setStored] = useState<Stored | null>(null);
  const [hud, setHud] = useState<OWHud | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [brief, setBrief] = useState(false);
  const [panel, setPanel] = useState(false);
  const [victory, setVictory] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState("Guardado automático activado");
  const writer = useRef<number | null>(null);
  const playingRef = useRef(false);
  const remoteQueue = useRef<Promise<void>>(Promise.resolve());
  const [fsDeclined, setFsDeclined] = useState(false);
  const fullscreen = useFullscreen();

  const hudRef = useRef<OWHud | null>(null);
  const shownRef = useRef(0);
  const briefRef = useRef(false);
  const panelRef = useRef(false);
  const nameRef = useRef<Stored["name"] | null>(null);
  hudRef.current = hud;
  shownRef.current = shown;
  briefRef.current = brief;
  panelRef.current = panel;

  const pushToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const persist = useCallback(() => {
    const g = gameRef.current;
    const name = nameRef.current;
    if (!g || !name || !playingRef.current) return;
    const data: Stored = { name, save: g.serialize() };
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* El servidor conserva una segunda copia. */ }
    remoteQueue.current = remoteQueue.current.catch(() => undefined).then(async () => {
      try {
        const response = await fetch("/api/ow-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(6000) });
        if (!response.ok) throw new Error("save");
        setSaveNotice("Guardado en este navegador y en el servidor");
      } catch { setSaveNotice("Copia local guardada · servidor no disponible"); }
    });
  }, []);

  /* ---------------- arranque del motor ---------------- */
  useEffect(() => {
    if (!canvasRef.current) return;
    let game: OpenWorldGame;
    try {
    game = new OpenWorldGame(canvasRef.current, setHud, (ev, payload) => {
      if (ev === "toast" && payload) pushToast(payload);
      else if (ev === "missionDone" && payload) pushToast(`✅ Misión completada: ${payload}`);
      else if (ev === "mission") {
        setBrief(true);
        game.setOverlay(true);
      } else if (ev === "victory") setVictory(true);
      else if (ev === "save") persist();
      else if (ev === "pause") setScreen("paused");
      else if (ev === "resume") setScreen("playing");
    });
    } catch {
      setError("No se pudo iniciar el escenario 3D. Prueba con la aceleración gráfica activada o abre el modo lectura.");
      return;
    }
    gameRef.current = game;
    let cancelled = false;
    const restore = (s: Stored | null) => {
      if (cancelled) return;
      setStored(s);
      if (s?.name) {
        nameRef.current = s.name;
        game.setName(s.name.first, s.name.last);
        if (s.save) game.load(s.save);
        setScreen("title");
      } else setScreen("name");
    };
    const local = readStored();
    if (local) restore(local);
    else {
      fetch("/api/ow-progress", { signal: AbortSignal.timeout(5000) }).then((r) => r.ok ? r.json() : null).then((data) => {
        const p = data?.progress;
        const saved = normalizeSave(p?.save);
        restore(saved && typeof p?.name?.first === "string" && typeof p?.name?.last === "string" ? { name: p.name, save: saved } : null);
      }).catch(() => restore(null));
    }
    const autosave = window.setInterval(persist, 8000);
    window.addEventListener("beforeunload", persist);
    return () => {
      cancelled = true;
      playingRef.current = false;
      window.clearInterval(autosave);
      window.removeEventListener("beforeunload", persist);
      game.dispose();
      gameRef.current = null;
    };
  }, [persist, pushToast]);

  /* ---------------- efecto de escritura del diálogo ---------------- */
  const dlg = hud?.dialogue ?? null;
  const dlgKey = dlg?.key ?? "";
  const dlgLen = dlg?.text.length ?? 0;
  useEffect(() => {
    setShown(0);
    if (!dlgKey) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setShown(i);
      if (i >= dlgLen) window.clearInterval(id);
    }, 14);
    writer.current = id;
    return () => { window.clearInterval(id); writer.current = null; };
  }, [dlgKey, dlgLen]);

  const dismissBrief = useCallback(() => {
    setBrief(false);
    gameRef.current?.setOverlay(false);
  }, []);

  const dialoguePrimary = useCallback(() => {
    const d = hudRef.current?.dialogue;
    if (!d) return;
    if (shownRef.current < d.text.length) {
      if (writer.current !== null) window.clearInterval(writer.current);
      shownRef.current = d.text.length;
      setShown(d.text.length);
      return;
    }
    if (d.choices) return;
    gameRef.current?.advance();
  }, []);

  useEffect(() => {
    gameRef.current?.setOverlay(brief || panel || devOpen);
  }, [brief, panel, devOpen]);

  const needFullscreen = screen === "playing" && !!hud?.important && !fullscreen.active && !fsDeclined;
  useEffect(() => {
    gameRef.current?.setHold(needFullscreen);
  }, [needFullscreen]);

  /* ---------------- teclado de la interfaz ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.repeat) return;
      if (!playingRef.current || hudRef.current?.transition) return;
      if (hudRef.current?.sleepPrompt) {
        if (e.code === "Enter") { e.preventDefault(); gameRef.current?.confirmSleep(true); }
        if (e.code === "Escape") { e.preventDefault(); gameRef.current?.confirmSleep(false); }
        return;
      }
      if (briefRef.current) {
        if (["Enter", "Space", "KeyE"].includes(e.code)) {
          e.preventDefault();
          dismissBrief();
        }
        return;
      }
      const d = hudRef.current?.dialogue;
      if (d) {
        if (e.code === "KeyX" && !d.choices) { e.preventDefault(); gameRef.current?.skipDialogue(); return; }
        if (["Enter", "Space", "KeyE"].includes(e.code)) {
          e.preventDefault();
          dialoguePrimary();
        } else if (/^Digit[1-9]$/.test(e.code) && d.choices && shownRef.current >= d.text.length) {
          const idx = Number(e.code.slice(5)) - 1;
          if (idx < d.choices.length) gameRef.current?.choose(idx);
        }
        return;
      }
      if (e.code === "KeyF" && !hudRef.current?.training && !hudRef.current?.encounter) {
        e.preventDefault();
        void fullscreen.toggle();
        return;
      }
      if (e.code === "KeyM" || (e.code === "Tab" && !hudRef.current?.training && !hudRef.current?.encounter)) {
        e.preventDefault();
        setPanel((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialoguePrimary, dismissBrief, fullscreen]);

  const selectDevPhase = (step: number) => {
    const game = gameRef.current;
    if (!game || !nameRef.current) return;
    playingRef.current = true;
    game.start(false);
    game.skipToUrokodakiTraining(step);
    setBrief(false);
    setPanel(false);
    setDevOpen(false);
    setVictory(false);
    setScreen("playing");
    persist();
  };

  const begin = (fresh: boolean) => {
    const g = gameRef.current;
    if (!g) return;
    playingRef.current = true;
    setBrief(false); setPanel(false);
    if (fresh) {
      const name = nameRef.current ?? { first: "Ren", last: "Shinjo" };
      g.load({ version: PROLOGUE_VERSION, refuge: freshRefuge(), missionIdx: 0, stepIdx: 0, queued: null, visited: [], introPlayed: false, x: PLAYER_START.x, z: PLAYER_START.z, yaw: PLAYER_START.yaw, finished: false });
      g.setName(name.first, name.last);
      setVictory(false);
    }
    g.start(fresh);
    setScreen("playing");
    void fullscreen.enter().then(() => window.setTimeout(() => g.requestLook(), 180));
    persist();
  };

  const playing = screen === "playing" || screen === "paused";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05070f] select-none" data-testid="open-world" data-scene={hud?.interior ? "saburo" : "outdoors"} data-clock={hud?.clock} data-can-fight={hud?.canFight} data-practice-sword={hud?.practiceSword} data-step={hud?.steps.findIndex((s) => s.current)} data-x={hud?.player.x.toFixed(2)} data-z={hud?.player.z.toFixed(2)} data-camera={hud?.player.cameraYaw.toFixed(4)} data-actors={hud?.actors.join(",")} data-important={hud?.important} data-basket={hud?.basketVisible} data-resting={hud?.sleepingNpcVisible} data-nezu-follower={hud?.nezukoFollowing} data-cinematic-nezuko={hud?.cinematicNezukoVisible} data-cinematic-seal={hud?.cinematicSealVisible}>
      {playing && hud?.cinematicBanner && (
        <div role="status" aria-live="polite" data-testid="bamboo-cinematic" className="pointer-events-none absolute left-1/2 top-[18%] z-[35] w-[min(95vw,660px)] -translate-x-1/2 rounded-lg border border-amber-200/60 bg-emerald-950/90 px-5 py-3 text-center font-serif text-sm tracking-wide text-amber-100 shadow-[0_0_35px_rgba(165,219,132,0.24)] md:text-base">
          ✦ {hud.cinematicBanner} ✦
        </div>
      )}
      {error && <Overlay><h2 className="text-xl text-amber-100">El refugio necesita WebGL</h2><p className="max-w-md mt-4 text-sm text-slate-300">{error}</p><NavLinks /></Overlay>}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 160px rgba(0,0,0,0.7)" }} />
      {hud && hud.hitFlash > 0 && (
        <div className="pointer-events-none absolute inset-0" style={{ opacity: hud.hitFlash * 0.5, background: "radial-gradient(circle, transparent 40%, rgba(255,20,60,0.85) 100%)" }} />
      )}
      {hud && hud.blizzard > 0.04 && (
        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              opacity: Math.min(0.72, hud.blizzard * 0.78),
              background: "radial-gradient(circle at 50% 40%, rgba(210,225,240,0.15) 0%, rgba(180,200,220,0.45) 55%, rgba(230,240,255,0.7) 100%)",
            }}
          />
          <div
            className="absolute inset-0 blizzard-streaks"
            style={{ opacity: Math.min(1, hud.blizzard * 1.1) }}
          />
        </div>
      )}

      {playing && hud && !hud.encounter && <Hud hud={hud} onPanel={() => setPanel((p) => !p)} onPause={() => gameRef.current?.togglePause()} onFullscreen={() => void fullscreen.toggle()} onDev={() => setDevOpen(true)} onSideQuest={(id) => gameRef.current?.selectSideQuest(id)} />}

      {/* Avisos */}
      <div className="pointer-events-none absolute left-1/2 top-28 z-20 flex -translate-x-1/2 flex-col items-center gap-2 font-sans">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-lg border border-[#d4af37]/70 bg-black/85 px-4 py-2 text-sm text-yellow-100 shadow-lg animate-fade-in-up">
            {t.text}
          </div>
        ))}
      </div>

      {/* Diálogo */}
      {playing && dlg && !hud?.transition && (
        <div className="absolute inset-x-0 bottom-0 z-30 p-3 font-sans" onClick={dialoguePrimary}>
          <div className="relative mx-auto max-w-3xl rounded-xl border-2 border-[#d4af37]/80 bg-[#0d1224]/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#2d416e] bg-[#1c2440] text-3xl">{dlg.portrait}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className={`text-base font-bold ${dlg.color}`}>{dlg.speaker}</span>
                    {dlg.title && <span className="ml-2 text-[10px] uppercase tracking-widest text-slate-400">{dlg.title}</span>}
                  </div>
                  <span className="truncate text-[10px] uppercase tracking-widest text-slate-500">{dlg.origin}</span>
                </div>
                <p data-testid="dialogue-text" className="mt-1 min-h-[4.5rem] text-[15px] leading-relaxed text-slate-100 md:text-base">
                  {dlg.text.slice(0, shown)}
                  {shown < dlg.text.length && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[#ffd700] align-middle" />}
                </p>
              </div>
            </div>
            {hud?.skippable && !dlg.choices && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); gameRef.current?.skipDialogue(); }}
                className="absolute right-3 top-3 rounded border border-stone-500/60 bg-black/60 px-2.5 py-1 text-[11px] text-stone-200 hover:border-amber-300/70 hover:text-amber-100"
                data-testid="skip-dialogue"
              >
                Saltar cinemática ⏭
              </button>
            )}
            {dlg.choices && shown >= dlg.text.length ? (
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-700/70 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">Decisión · teclas 1-{dlg.choices.length}</span>
                {dlg.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      gameRef.current?.choose(i);
                    }}
                    className="rounded-lg border border-yellow-700/40 bg-yellow-950/25 px-3 py-2 text-left text-sm text-yellow-100 transition-colors hover:border-yellow-400 hover:bg-yellow-900/40"
                  >
                    <span className="mr-2 text-yellow-500">{i + 1}.</span>
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-1 flex justify-between text-[11px]">
                <span className="text-slate-500">
                  {dlg.index + 1}/{dlg.total}
                </span>
                <button type="button" className="text-yellow-300 hover:text-yellow-100" aria-label="Continuar diálogo">{shown < dlg.text.length ? "Mostrar texto completo" : "Continuar"} · E / espacio</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informe del Cuervo: nueva misión */}
      {playing && brief && hud && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 font-sans" onClick={dismissBrief}>
          <div className="w-full max-w-md rounded-xl border-2 border-[#d4af37] bg-gradient-to-b from-[#1c2440] to-[#0d1224] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{hud.missionIndex < 2 ? "🏮" : "🐦‍⬛"}</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-500">
                  {hud.missionIndex < 2 ? "Diario de viaje" : "Cuervo Kasugai"} · Etapa {hud.missionIndex + 1}/{hud.missionTotal}
                </div>
                <h2 className="text-xl font-bold text-yellow-100">{hud.missionTitle}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm italic leading-relaxed text-slate-300">«{hud.missionBriefing}»</p>
            <div className="mt-3 inline-block rounded-full border px-3 py-1 text-[11px] font-bold" style={{ borderColor: hud.missionCombat ? "#e05a6a" : "#5ad1a0", color: hud.missionCombat ? "#ff9aa6" : "#8ff0c8" }}>
              {hud.missionCombat ? "⚔️ Misión con combate" : "🕊️ Misión sin combate"}
            </div>
            <ol className="mt-3 space-y-1.5">
              {hud.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-600 text-[10px] text-slate-400">{i + 1}</span>
                  {s.label}
                </li>
              ))}
            </ol>
            <button onClick={dismissBrief} className="mt-5 w-full rounded-lg bg-yellow-600 py-2.5 font-bold text-slate-950 hover:bg-yellow-500">
              {hud.missionIndex === 0 ? "Salir a la nieve (Enter)" : "En marcha (Enter)"}
            </button>
          </div>
        </div>
      )}

      {/* Diario de misiones */}
      {playing && panel && hud && !dlg && !hud.transition && !hud.sleepPrompt && <MissionPanel hud={hud} onClose={() => setPanel(false)} />}
      {devOpen && <DevPhasePanel onSelect={selectDevPhase} onClose={() => setDevOpen(false)} />}
      {playing && hud?.sleepPrompt && <SleepDialog onAnswer={(answer) => gameRef.current?.confirmSleep(answer)} />}
      {playing && hud?.transition && <RefugeTransition hud={hud} />}
      {playing && hud?.encounter && !dlg && <EncounterHUD enc={hud.encounter} onSpeak={(i) => gameRef.current?.speak(i)} onRetry={() => gameRef.current?.retry()} onGuard={(on) => gameRef.current?.setGuard(on)} onAttack={() => gameRef.current?.pressAttack()} onDodge={() => gameRef.current?.pressDodge()} />}
      {playing && hud?.training && !dlg && <TrainingHUD tr={hud.training}
        onRetry={() => gameRef.current?.retry()}
        onAgile={() => gameRef.current?.pressAgile()}
        onJump={() => gameRef.current?.setTouch({ jump: true })}
        onParry={() => gameRef.current?.pressTrainingParry()}
        onAttack={() => gameRef.current?.pressTrainingAttack()}
        onEnvironment={() => gameRef.current?.pressTrainingEnvironment()}
        onTag={() => gameRef.current?.pressTrainingTag()}
        onFocusHold={(held) => gameRef.current?.setTrainingFocus(held)} />}
      {screen === "playing" && hud && !hud.pointerLocked && !hud.interior && !dlg && !brief && !panel && !hud.transition && !hud.sleepPrompt && !needFullscreen && !hud.encounter && !hud.training && (
        <LookHint onClick={() => gameRef.current?.requestLook()} />
      )}
      {needFullscreen && (
        <FullscreenGuard
          onEnter={() => void fullscreen.enter().then(() => window.setTimeout(() => gameRef.current?.requestLook(), 180))}
          onDecline={() => setFsDeclined(true)}
        />
      )}

      {/* Controles táctiles */}
      {screen === "playing" && hud && !brief && !panel && !dlg && !hud.transition && !hud.sleepPrompt && (
        <TouchControls
          dialogue={false}
          armed={hud.canFight || !!hud.encounter?.canAttack || hud.training?.kind === "boulder"}
          dodge={!!hud.encounter}
          interior={hud.interior}
          training={!!hud.training}
          onMove={(x, y) => gameRef.current?.setTouch({ x, y })}
          onSprint={(v) => gameRef.current?.setTouch({ sprint: v })}
          onJump={() => gameRef.current?.setTouch({ jump: true })}
          onAttack={() => gameRef.current?.setTouch({ attack: true })}
          onDash={() => gameRef.current?.setTouch({ dash: true })}
          onTalk={() => (dlg ? dialoguePrimary() : gameRef.current?.setTouch({ interact: true }))}
        />
      )}

      {/* ---------------- pantallas ---------------- */}
      {screen === "loading" && !error && <Overlay><div className="font-serif text-yellow-200">La bruma se está formando…</div></Overlay>}

      {screen === "name" && (
        <div className="absolute inset-0 z-50">
          <NameEntry
            onConfirm={(first, last) => {
              nameRef.current = { first, last };
              gameRef.current?.setName(first, last);
              setStored((old) => ({ name: { first, last }, save: old?.save ?? null }));
              setScreen("title");
            }}
          />
        </div>
      )}

      {screen === "title" && (
        <Overlay>
          <div className="mb-2 text-6xl">🌙</div>
          <h1 className="text-center font-serif text-3xl font-bold tracking-wide text-yellow-200 md:text-5xl">Kimetsu no Yaiba</h1>
          <div className="mb-1 font-serif text-xl text-slate-200 md:text-2xl">Hojas en la Bruma · Mundo Abierto 3D</div>
          <p className="mb-5 max-w-lg text-center text-sm italic text-slate-400">
            Recorre Japón en la era Taishō como {nameRef.current?.first ?? "Ren"} {nameRef.current?.last ?? "Shinjo"}, prometido de Nezuko.
            La historia empieza sin espada ni rango, durante una noche de nieve. Un viaje con Tanjiro, una caída y un refugio hasta el amanecer.
          </p>
          <div className="flex w-64 flex-col gap-2">
            {stored?.save && (stored.save.missionIdx > 0 || stored.save.stepIdx > 0) && (
              <button onClick={() => begin(false)} className="rounded-lg bg-yellow-600 py-3 text-lg font-bold text-slate-950 hover:bg-yellow-500">
                ▶ Continuar
              </button>
            )}
            <button
              onClick={() => begin(true)}
              className={`rounded-lg py-3 font-bold ${stored?.save && (stored.save.missionIdx > 0 || stored.save.stepIdx > 0) ? "border border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-yellow-600 text-lg text-slate-950 hover:bg-yellow-500"}`}
            >
              Nueva partida · noche de nieve
            </button>
            <button onClick={() => setDevOpen(true)} className="rounded-lg border border-amber-300/50 bg-amber-950/70 px-2 py-2.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-900/70" data-testid="dev-title">⚡ DEV: Ir a Entrenamiento de Urokodaki</button>
            <button onClick={() => setScreen("name")} className="text-xs text-slate-400 underline hover:text-yellow-200">
              Cambiar nombre
            </button>
          </div>
          <Controls armed={false} />
          <NavLinks />
        </Overlay>
      )}

      {screen === "paused" && (
        <Overlay>
          <h2 className="mb-4 font-serif text-3xl text-yellow-200">Pausa</h2>
          <div className="flex w-60 flex-col gap-2">
            <button onClick={() => setDevOpen(true)} className="rounded-lg border border-amber-300/50 bg-amber-950/70 px-2 py-2.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-900/70" data-testid="dev-pause">⚡ DEV: Ir a Entrenamiento de Urokodaki</button>
            <button onClick={() => gameRef.current?.togglePause()} className="rounded-lg bg-yellow-600 py-2.5 font-bold text-slate-950 hover:bg-yellow-500">
              Continuar
            </button>
            <button
              onClick={() => void fullscreen.toggle()}
              className="rounded-lg border border-slate-600 bg-slate-900 py-2.5 text-slate-200 hover:bg-slate-800"
            >
              ⛶ {fullscreen.active ? "Salir de pantalla completa" : "Pantalla completa"}
            </button>
            <button
              onClick={() => {
                persist();
                pushToast("💾 Partida guardada");
              }}
              className="rounded-lg border border-slate-600 bg-slate-900 py-2.5 text-slate-200 hover:bg-slate-800"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => {
                if (window.confirm("¿Empezar la historia desde el prólogo?")) {
                  gameRef.current?.togglePause();
                  begin(true);
                }
              }}
              className="rounded-lg border border-red-900 bg-red-950/60 py-2.5 text-red-200 hover:bg-red-900/60"
            >
              ↺ Reiniciar historia
            </button>
          </div>
          <p className="mt-4 text-xs text-stone-400">{saveNotice}</p>
          <Controls armed={hud?.canFight ?? false} />
          <NavLinks />
        </Overlay>
      )}

      {victory && playing && (
        <Overlay>
          <div className="mb-2 text-5xl">🌸</div>
          <h2 className="mb-2 font-serif text-4xl text-yellow-200">La promesa de los cerezos</h2>
          <p className="mb-4 max-w-md text-center text-sm text-slate-300">
            Muzan ha caído, Nezuko vuelve a ser humana y la boda bajo los cerezos por fin se celebra. Todas las misiones completadas.
          </p>
          <button onClick={() => setVictory(false)} className="rounded-lg bg-yellow-600 px-8 py-3 font-bold text-slate-950 hover:bg-yellow-500">
            Seguir explorando
          </button>
          <NavLinks />
        </Overlay>
      )}
    </div>
  );
}

/* ====================================================================== */

function DevPhasePanel({ onSelect, onClose }: { onSelect: (step: number) => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[125] flex items-center justify-center bg-black/90 p-4 font-sans" role="dialog" aria-modal="true" aria-label="Selector DEV de entrenamiento" data-testid="dev-panel">
      <div className="w-full max-w-md rounded-xl border border-amber-200/50 bg-[#151923] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3"><div><span className="text-[10px] uppercase tracking-[0.3em] text-amber-300">Modo desarrollador · Monte Sagiri</span><h2 className="mt-2 font-serif text-2xl text-amber-100">Probar una fase</h2></div><button className="rounded border border-stone-600 px-2 py-1 text-sm text-stone-300 hover:text-white" onClick={onClose} aria-label="Cerrar selector DEV">✕</button></div>
        <p className="my-4 text-xs leading-relaxed text-stone-400">Salta solo a una etapa de prueba. El progreso anterior se prepara automáticamente y esta posición se guardará como la partida actual.</p>
        <div className="space-y-2">
          {DEV_PHASES.map((phase) => (
            <button key={phase.step} onClick={() => onSelect(phase.step)} className="flex w-full items-center justify-between gap-2 rounded-lg border border-amber-200/20 bg-[#222a39] px-3 py-3 text-left text-sm text-amber-100 transition-colors hover:border-amber-300/70 hover:bg-amber-900/30" data-testid={`dev-phase-${phase.step}`}>
              <span>[{phase.label}]</span><span className="text-right text-[10px] text-stone-400">{phase.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hud({ hud, onPanel, onPause, onFullscreen, onDev, onSideQuest }: { hud: OWHud; onPanel: () => void; onPause: () => void; onFullscreen: () => void; onDev: () => void; onSideQuest: (id: string) => void }) {
  const current = hud.steps.find((s) => s.current);
  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3 font-sans">
      <button onClick={onDev} className="pointer-events-auto absolute right-3 top-40 z-20 max-w-[160px] rounded border border-amber-200/50 bg-[#23190d]/90 px-2 py-1.5 text-center text-[10px] font-bold leading-tight text-amber-100 shadow-lg hover:bg-amber-900/80 sm:top-3 sm:max-w-none" data-testid="dev-hud">⚡ DEV: Ir a Entrenamiento de Urokodaki</button>
      <div className="flex items-start justify-between gap-3">
        {/* Vida y respiración */}
        <div className="max-w-[46%] sm:max-w-none rounded-lg border border-[#d4af37]/50 bg-black/60 px-3 py-2 backdrop-blur-sm">
          <div className="flex flex-wrap gap-0.5 text-base leading-none" style={{ maxWidth: 170 }}>
            {Array.from({ length: hud.maxHp }).map((_, i) => (
              <span key={i} className={i < hud.hp ? "text-red-500" : "text-slate-700"}>♥</span>
            ))}
          </div>
          <div className="mt-1.5 h-2 w-28 sm:w-40 overflow-hidden rounded-full border border-cyan-900 bg-slate-900">
            <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300" style={{ width: `${hud.breath}%` }} />
          </div>
          <div data-testid="status" className="mt-1 text-[11px] text-amber-100/85">{hud.status}</div>
          <div className="mt-1 text-[10px] text-stone-400">{hud.practiceSword ? "Espada de madera · entrenamiento" : hud.canFight ? "Respiración del Agua · mantén B para recargar" : "Sin espada · aún no perteneces al Cuerpo"}</div>
          <div data-testid="clock" className="mt-2 border-t border-stone-600/40 pt-1.5 text-xs text-stone-200 tabular-nums">{hud.morning ? "☀" : "☾"} {hud.clock} <span className="text-stone-400">· {hud.interior ? "Bajo techo" : hud.morning ? "Cielo despejado" : hud.snowfall > 0.3 ? "Nieve intensa" : "Noche"}</span></div>
          <div className="mt-0.5 max-w-[11rem] truncate text-[10px] text-slate-400">📍 {hud.zone}</div>
        </div>

        {hud.sideQuest && <div className="pointer-events-auto max-w-xs rounded-lg border border-cyan-700/70 bg-black/70 px-3 py-2 text-xs text-cyan-100">
          <div className="font-bold">Nivel {hud.sideQuest.level} · {hud.sideQuest.xp}/{hud.sideQuest.nextXp} XP</div>
          <div className="mt-1">{hud.sideQuest.active ? `Encargo activo: ${hud.sideQuest.active}` : "Encargos opcionales"}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {hud.sideQuest.available.map(q => <button key={q.id} type="button" title={q.detail} disabled={q.done || hud.sideQuest!.level < q.requiredLevel || !!hud.dialogue || !!hud.training || !!hud.encounter} onClick={() => onSideQuest(q.id)} className="rounded border border-cyan-600 px-1.5 py-1 disabled:opacity-40">{q.giver} {q.done ? "✓" : `(Nv.${q.requiredLevel})`}</button>)}
          </div>
          <div className="mt-1 text-[10px] text-cyan-300">{hud.sideQuest.unlocked.join(" · ")}</div>
        </div>}

        {/* Seguimiento de misión */}
        <div className="pointer-events-auto min-w-0 flex-1 sm:flex-initial max-w-sm rounded-lg border border-[#d4af37]/50 bg-black/65 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">
              Misión {hud.missionIndex + 1}/{hud.missionTotal} {hud.missionCombat ? "⚔️" : "🕊️"}
            </span>
            <div className="flex gap-1">
              <button onClick={onPanel} className="rounded border border-slate-600 px-1.5 text-[10px] text-slate-300 hover:text-yellow-200">M</button>
              <button onClick={onFullscreen} className="rounded border border-slate-600 px-1.5 text-[10px] text-slate-300 hover:text-yellow-200" title="Pantalla completa (F)">⛶</button>
              <button onClick={onPause} className="rounded border border-slate-600 px-1.5 text-[10px] text-slate-300 hover:text-yellow-200">Esc</button>
            </div>
          </div>
          <div className="truncate text-sm font-bold text-yellow-100">{hud.missionTitle}</div>
          <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-200">
            <span className="text-yellow-400">▶</span>
            <span>{current?.label ?? hud.stepLabel}</span>
          </div>
          {hud.kills && (
            <div className="mt-1 text-[11px] font-bold text-rose-300">
              Demonios: {hud.kills.done}/{hud.kills.total}
            </div>
          )}
          {hud.target && !hud.dialogue && (
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-300">
              <span className="inline-block text-lg text-yellow-300 transition-transform" style={{ transform: `rotate(${-hud.target.angle}rad)` }}>
                ⬆
              </span>
              <span>{Math.round(hud.target.dist)} m · {hud.interior ? "dentro de la cabaña" : "sigue el sendero"}</span>
            </div>
          )}
        </div>

        {hud.interior ? <CabinPlan hud={hud} /> : <Minimap hud={hud} />}
      </div>

      {hud.boss && (
        <div className="mx-auto mt-3 w-full max-w-md">
          <div className="text-center text-[11px] uppercase tracking-[0.25em] text-rose-300">
            {hud.boss.name} · {hud.boss.title}
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full border border-rose-800 bg-black/70">
            <div className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-fuchsia-400 transition-all" style={{ width: `${(hud.boss.hp / hud.boss.maxHp) * 100}%` }} />
          </div>
        </div>
      )}

      {hud.prompt && !hud.dialogue && !hud.sleepPrompt && !hud.transition && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-lg border border-[#d4af37]/70 bg-black/80 px-4 py-2 text-sm text-yellow-100 md:bottom-12">
          <span data-testid="interaction-prompt">{hud.prompt}</span>
        </div>
      )}
      {!hud.dialogue && !hud.transition && (
        <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[11px] text-stone-300/80 whitespace-nowrap md:block">
          {hud.interior ? "WASD caminar · E examinar / descansar · M diario · Esc pausa" : hud.canFight ? "WASD mover · ratón cámara · Espacio saltar · E hablar · J tajar · K dash · F pantalla completa" : "WASD caminar · Mayús correr · ratón cámara · rueda zoom · E hablar · F pantalla completa"}
        </div>
      )}
    </div>
  );
}

function Minimap({ hud }: { hud: OWHud }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const bg = useRef<HTMLCanvasElement | null>(null);
  const SIZE = 150;

  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = SIZE;
    const ctx = c.getContext("2d")!;
    const k = SIZE / (WORLD_HALF * 2);
    const px = (x: number) => (x + WORLD_HALF) * k;
    ctx.fillStyle = "#16261c";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "#8a6d48";
    ctx.lineWidth = 2;
    for (const [a, b] of ROADS) {
      const za = ZONE_BY_ID[a];
      const zb = ZONE_BY_ID[b];
      ctx.beginPath();
      ctx.moveTo(px(za.x), px(za.z));
      ctx.lineTo(px(zb.x), px(zb.z));
      ctx.stroke();
    }
    const colors: Record<string, string> = { snow: "#dfe7f2", forest: "#3b7a46", wisteria: "#8a6ad0", gravel: "#b8b3a2", swamp: "#3a5a40", city: "#8a7a9a", spider: "#5a5a5a", rail: "#8a7a5a", castle: "#7a2a9a" };
    for (const z of ZONES) {
      ctx.fillStyle = colors[z.biome] ?? "#555";
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(px(z.x), px(z.z), Math.max(3, z.r * k), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    bg.current = c;
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c || !bg.current) return;
    const ctx = c.getContext("2d")!;
    const k = SIZE / (WORLD_HALF * 2);
    const px = (x: number) => (x + WORLD_HALF) * k;
    ctx.drawImage(bg.current, 0, 0);
    if (hud.targetPos) {
      ctx.fillStyle = "#ffd23f";
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.arc(px(hud.targetPos.x), px(hud.targetPos.z), 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    const x = px(hud.player.x);
    const y = px(hud.player.z);
    const a = hud.player.yaw;
    ctx.fillStyle = "#7fe3ff";
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(a) * 6, y + Math.cos(a) * 6);
    ctx.lineTo(x + Math.sin(a + 2.4) * 4, y + Math.cos(a + 2.4) * 4);
    ctx.lineTo(x + Math.sin(a - 2.4) * 4, y + Math.cos(a - 2.4) * 4);
    ctx.closePath();
    ctx.fill();
  }, [hud.player.x, hud.player.z, hud.player.yaw, hud.targetPos]);

  return (
    <div className="mt-8 hidden rounded-lg border border-[#d4af37]/50 bg-black/60 p-1 sm:block">
      <canvas ref={ref} width={SIZE} height={SIZE} className="block rounded" />
    </div>
  );
}

function MissionPanel({ hud, onClose }: { hud: OWHud; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-4 font-sans" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border-2 border-[#d4af37]/80 bg-[#0d1224] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">{hud.canFight ? "Diario del cazador" : "Diario de viaje"}</div>
            <h2 className="text-lg font-bold text-yellow-100">{hud.missionTitle}</h2>
          </div>
          <button onClick={onClose} className="rounded border border-slate-600 px-2 text-xs text-slate-300">✕</button>
        </div>
        <p className="mt-2 text-xs italic text-slate-400">{hud.missionBriefing}</p>
        <ol className="mt-3 space-y-2">
          {hud.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${s.done ? "border-emerald-500 bg-emerald-900/60 text-emerald-300" : s.current ? "border-yellow-500 text-yellow-300" : "border-slate-700 text-slate-500"}`}>
                {s.done ? "✓" : i + 1}
              </span>
              <span className={s.done ? "text-emerald-200/70 line-through" : s.current ? "font-bold text-yellow-100" : "text-slate-400"}>{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-300" style={{ width: `${((hud.finished ? hud.missionTotal : hud.missionIndex) / hud.missionTotal) * 100}%` }} />
        </div>
        <div className="mt-1 text-right text-[10px] text-slate-500">
          Historia: {hud.finished ? hud.missionTotal : hud.missionIndex}/{hud.missionTotal} misiones
        </div>
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-black/78 px-4 font-sans backdrop-blur-[3px]">{children}</div>;
}

function Controls({ armed }: { armed: boolean }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-400">
      <span>WASD / flechas — caminar</span>
      <span>Mayús — correr</span>
      <span>Espacio — {armed ? "salto y doble salto" : "salto corto"}</span>
      <span>E — hablar / interactuar</span>
      {armed && <span>J / clic — tajar</span>}
      {armed && <span>K — dash del trueno</span>}
      {!armed && <span>Todavía sin espada ni técnicas</span>}
      <span>Ratón — cámara libre · rueda para acercar</span>
      <span>M — diario · Esc — pausa</span>
    </div>
  );
}

function NavLinks() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px]">
      <Link href="/plataformas" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">🎮 Plataformero 3D</Link>
      <Link href="/mundo" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">🗺 RPG 2D</Link>
      <Link href="/historia" className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-yellow-600 hover:text-yellow-200">📖 Modo lectura</Link>
    </div>
  );
}

function TouchControls(props: {
  dialogue: boolean;
  armed: boolean;
  interior: boolean;
  dodge?: boolean;
  training?: boolean;
  onMove: (x: number, y: number) => void;
  onSprint: (v: boolean) => void;
  onJump: () => void;
  onAttack: () => void;
  onDash: () => void;
  onTalk: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const handle = (cx: number, cy: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = (cx - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (cy - (r.top + r.height / 2)) / (r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    setKnob({ x: dx, y: dy });
    props.onMove(dx, dy);
    props.onSprint(len > 0.92);
  };
  const release = () => {
    active.current = null;
    setKnob({ x: 0, y: 0 });
    props.onMove(0, 0);
    props.onSprint(false);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex items-end justify-between p-4 md:hidden">
      {!props.dialogue ? (
        <div
          ref={ref}
          className="relative h-32 w-32 touch-none rounded-full border-2 border-white/25 bg-white/10 backdrop-blur-sm"
          onPointerDown={(e) => {
            active.current = e.pointerId;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            handle(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => active.current === e.pointerId && handle(e.clientX, e.clientY)}
          onPointerUp={release}
          onPointerCancel={release}
        >
          <div className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full border border-yellow-300/60 bg-yellow-500/30" style={{ transform: `translate(calc(-50% + ${knob.x * 34}px), calc(-50% + ${knob.y * 34}px))` }} />
        </div>
      ) : (
        <div />
      )}
      {!props.training && <div className="flex items-end gap-2">
        {!props.dialogue && (props.armed || props.dodge) && !props.interior && <TouchActionButton label={props.dodge ? "ESQUIVA" : "DASH"} onDown={props.onDash} className="border-cyan-400/70 bg-cyan-900/80" />}
        {!props.dialogue && props.armed && !props.interior && <TouchActionButton label="TAJAR" onDown={props.onAttack} className="border-rose-400/70 bg-rose-900/80" />}
        <TouchActionButton label={props.interior ? "USAR" : "HABLAR"} onDown={props.onTalk} className="border-yellow-300/70 bg-yellow-900/80" />
        {!props.dialogue && !props.interior && <TouchActionButton label="SALTO" onDown={props.onJump} className="h-20 w-20 border-amber-300/70 bg-amber-900/80 text-base" />}
      </div>}
    </div>
  );
}

// Componente estable: no se desmonta cada vez que el motor actualiza el HUD.
function TouchActionButton({ label, onDown, className }: { label: string; onDown: () => void; className: string }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onDown(); }}
      className={`h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 text-[10px] font-bold text-white/90 shadow-lg active:scale-95 touch-none ${className}`}
    >
      {label}
    </button>
  );
}
