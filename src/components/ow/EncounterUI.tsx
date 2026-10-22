"use client";

import { useEffect } from "react";
import type { EncounterView, TrainingView } from "@/game3d/ow/engine";

const TONE_STYLE: Record<string, string> = {
  calm: "border-sky-300/60 bg-sky-950/50 hover:bg-sky-900/70 text-sky-50",
  neutral: "border-stone-400/50 bg-stone-900/60 hover:bg-stone-800/70 text-stone-100",
  rage: "border-rose-400/60 bg-rose-950/50 hover:bg-rose-900/70 text-rose-50",
};

const EFFECT_STYLE = (text: string) =>
  /NEGATIVO/.test(text) ? "border-rose-400/60 bg-rose-950/80 text-rose-100" : /DECISIVO/.test(text) ? "border-amber-300/70 bg-amber-950/80 text-amber-50" : /POSITIVO/.test(text) ? "border-sky-300/60 bg-sky-950/80 text-sky-50" : "border-stone-400/50 bg-stone-900/80 text-stone-100";

type Props = {
  enc: EncounterView;
  /** 0-2 opciones del QTE · -10 combo · -11 entorno · -12 relevo · -20/-21 selección inicial. */
  onSpeak: (i: number) => void;
  onRetry: () => void;
  onGuard: (on: boolean) => void;
  onAttack: () => void;
  onDodge: () => void;
};

export function EncounterHUD({ enc, onSpeak, onRetry, onGuard, onAttack, onDodge }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!enc.chosen) {
        if (e.code === "Digit1" || e.code === "Enter") { e.preventDefault(); onSpeak(-20); }
        if (e.code === "Digit2") { e.preventDefault(); onSpeak(-21); }
        return;
      }
      if (enc.words && /^Digit[1-3]$/.test(e.code)) {
        e.preventDefault();
        onSpeak(Number(e.code.slice(5)) - 1);
      } else if (enc.dead && (e.code === "Enter" || e.code === "KeyR")) {
        e.preventDefault();
        onRetry();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enc.words, enc.dead, enc.chosen, onSpeak, onRetry]);

  const meterPct = Math.min(100, (enc.meter / enc.goal) * 100);
  const activeName = enc.fighter === "tanjiro" ? "Tanjiro (21)" : enc.playerName;
  const benchName = enc.fighter === "tanjiro" ? enc.playerName : "Tanjiro (21)";
  const benchHp = enc.fighter === "tanjiro" ? enc.hp : enc.tanjiroHp;
  const activeHp = enc.fighter === "tanjiro" ? enc.tanjiroHp : enc.hp;
  const effectBanner = enc.reply && enc.reply.includes(" — EFECTO") ? enc.reply.split(" — ") : null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[60] font-sans"
      data-testid="encounter"
      data-id={enc.id}
      data-telegraph={enc.telegraph > 0}
      data-lunging={enc.lunging}
      data-holding={enc.holding}
      data-parry={enc.parry.toFixed(2)}
      data-focus={Math.round(enc.focus)}
      data-guard={enc.guard}
      data-meter={Math.round(enc.meter)}
      data-words={enc.words ? "open" : "closed"}
      data-dead={enc.dead}
      data-won={enc.won}
      data-fighter={enc.fighter}
      data-chosen={enc.chosen}
      data-combo={enc.comboStep}
    >
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.75)" }} />

      {/* ---------- Selector inicial de personaje ---------- */}
      {!enc.chosen && !enc.dead && (
        <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-[#07060a]/85 p-5" data-testid="fighter-select">
          <div className="w-full max-w-2xl rounded-xl border border-amber-200/40 bg-[#14121a] p-6 shadow-2xl">
            <span className="text-[10px] uppercase tracking-[0.35em] text-amber-300/70">Modo Arena · elige quién entra primero</span>
            <h2 className="mt-2 font-serif text-2xl text-[#f4e7ce]">{enc.title}</h2>
            <p className="mt-2 text-sm text-stone-300">{enc.hint}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => onSpeak(-20)} className="rounded-lg border border-sky-300/60 bg-sky-950/50 p-4 text-left hover:bg-sky-900/60" data-testid="pick-player">
                <div className="text-[10px] uppercase tracking-[0.25em] text-sky-300">1 · Protagonista (20)</div>
                <div className="mt-1 text-lg font-semibold text-sky-50">{enc.playerName}</div>
                <div className="mt-1 text-xs text-stone-300">Combos: {enc.comboNames.length} movimientos · habla desde el vínculo de prometido.</div>
              </button>
              <button onClick={() => onSpeak(-21)} className="rounded-lg border border-emerald-300/60 bg-emerald-950/50 p-4 text-left hover:bg-emerald-900/60" data-testid="pick-tanjiro">
                <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-300">2 · Tanjiro (21)</div>
                <div className="mt-1 text-lg font-semibold text-emerald-50">Tanjiro Kamado</div>
                <div className="mt-1 text-xs text-stone-300">Combos propios del hermano mayor · respuestas desde la familia.</div>
              </button>
            </div>
            <div className="mt-4 text-[11px] text-stone-500">Durante el combate puedes relevar con <b className="text-stone-300">Tab / C</b>. El relevo repone 1 de guardia y +25 de concentración.</div>
          </div>
        </div>
      )}

      {enc.telegraph > 0 && !enc.words && enc.chosen && (
        <div className="absolute inset-0 animate-[pulse_0.6s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle, transparent 52%, rgba(255,40,70,0.34) 100%)" }} />
      )}
      {enc.telegraph > 0 && !enc.words && enc.chosen && (
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full border border-rose-300/70 bg-rose-950/80 px-5 py-1.5 text-sm font-bold tracking-[0.35em] text-rose-100" data-testid="telegraph">¡AHORA!</div>
      )}
      {enc.flash && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" data-testid="combat-flash" data-flash={enc.flash}>
          <span className={`font-serif tracking-[0.25em] drop-shadow-[0_0_22px_currentColor] ${enc.flash === "parry" ? "text-amber-100 text-5xl" : enc.flash === "perfect" ? "text-sky-100 text-5xl" : enc.flash === "counter" ? "text-emerald-100 text-4xl" : enc.flash === "break" ? "text-rose-200 text-3xl" : "text-rose-300 text-3xl"}`}>
            {enc.flash === "parry" ? "¡PARADA!" : enc.flash === "perfect" ? "¡ESQUIVA!" : enc.flash === "counter" ? "¡CONTRAATAQUE!" : enc.flash === "break" ? "¡GUARDIA ROTA!" : "¡GOLPE!"}
          </span>
          {(enc.flash === "parry" || enc.flash === "perfect") && <span className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-300">pulsa J para contraatacar</span>}
        </div>
      )}
      {enc.lastMove && (
        <div className="absolute left-1/2 top-[27%] -translate-x-1/2 rounded border border-amber-200/50 bg-black/70 px-4 py-1.5 font-serif text-lg tracking-wide text-amber-100" data-testid="combo-move">{enc.lastMove}</div>
      )}

      {/* ---------- Barra superior: oponente ---------- */}
      <div className="absolute left-1/2 top-4 w-[min(92vw,640px)] -translate-x-1/2">
        <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.25em]" style={{ color: enc.color }}>
          <span className="font-bold">{enc.name}</span>
          <span className="normal-case tracking-normal text-stone-300">{enc.title}</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-white/20 bg-black/70">
          <div className="h-full transition-all duration-300" style={{ width: `${meterPct}%`, background: `linear-gradient(90deg, ${enc.color}99, ${enc.color})` }} />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-stone-300">
          <span>{enc.meterLabel}: {Math.round(enc.meter)} / {enc.goal}</span>
          {enc.enemyHp !== null && <span>Guardia de {enc.name.split(" ")[0]}: {"▮".repeat(enc.enemyHp)}{"▯".repeat(Math.max(0, (enc.enemyMaxHp ?? 0) - enc.enemyHp))}</span>}
        </div>
      </div>

      {/* ---------- Panel del equipo (activo + banquillo) ---------- */}
      {enc.chosen && (
        <div className="absolute bottom-6 left-6 w-60 rounded-lg border border-white/15 bg-black/65 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase tracking-[0.25em] ${enc.fighter === "tanjiro" ? "text-emerald-300" : "text-sky-300"}`}>{enc.fighter === "tanjiro" ? "Tanjiro al frente" : "Tú al frente"}</span>
            <span className="text-[10px] text-stone-400">{activeName}</span>
          </div>
          <div className="mt-1 flex gap-1 text-xl leading-none">
            {Array.from({ length: enc.maxHp }).map((_, i) => <span key={i} className={i < activeHp ? "text-red-500" : "text-stone-700"}>♥</span>)}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone-400"><span>Concentración</span><span>{Math.round(enc.focus)}</span></div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-stone-800"><div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 transition-all" style={{ width: `${(enc.focus / enc.maxFocus) * 100}%` }} /></div>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex gap-0.5">{Array.from({ length: enc.guardMax }).map((_, i) => <span key={i} className={`h-3 w-3 rotate-45 border ${i < enc.guard ? "border-sky-200 bg-sky-300/80" : "border-stone-600 bg-stone-800"}`} />)}</div>
            <span className={`text-[10px] uppercase tracking-[0.2em] ${enc.guardCharged ? "text-sky-200" : "text-stone-500"}`}>guardia</span>
          </div>
          {/* Cadena de combos */}
          <div className="mt-2 border-t border-stone-700/60 pt-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80">Combo · J</div>
            <ol className="mt-1 space-y-0.5">
              {enc.comboNames.map((n, i) => (
                <li key={i} className={`truncate text-[10px] ${i === enc.comboStep ? "text-amber-100" : i < enc.comboStep ? "text-emerald-300/80" : "text-stone-500"}`}>{i === enc.comboStep ? "▶ " : i < enc.comboStep ? "✓ " : "· "}{n}</li>
              ))}
            </ol>
          </div>
          {/* Banquillo */}
          <div className="mt-2 flex items-center justify-between border-t border-stone-700/60 pt-2 text-[10px]">
            <span className="text-stone-400">Relevo · Tab/C: <span className="text-stone-200">{benchName}</span> {"♥".repeat(benchHp)}</span>
            <span className={enc.tagReady ? "text-emerald-300" : "text-stone-500"}>{enc.tagReady ? "listo" : `${Math.ceil(enc.tagCd)} s`}</span>
          </div>
          <div className="mt-1.5 text-[10px] leading-4 text-stone-300">
            <b className="text-sky-200">Mayús/K</b> esquivar · <b className="text-sky-200">F</b> guardia · <b className="text-cyan-200">E</b> entorno{enc.envReady ? "" : " (…)"}
          </div>
        </div>
      )}

      {enc.vulnerable && !enc.words && !enc.dead && enc.chosen && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 rounded border border-emerald-300/50 bg-emerald-950/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-200" data-testid="vulnerable">abierto · contraataca</div>
      )}

      {/* ---------- Banner de efecto de la respuesta / respuesta narrativa ---------- */}
      {enc.reply && !enc.words && !enc.dead && (
        effectBanner ? (
          <div className="absolute bottom-28 left-1/2 w-[min(90vw,620px)] -translate-x-1/2 space-y-1.5" data-testid="effect-banner">
            <div className="rounded-lg border border-white/15 bg-black/75 px-4 py-2 text-center text-sm italic text-stone-100">{effectBanner[0]}</div>
            <div className={`rounded-lg border px-4 py-2 text-center text-xs font-semibold tracking-wide ${EFFECT_STYLE(effectBanner[1])}`}>{effectBanner[1]}</div>
          </div>
        ) : (
          <div className="absolute bottom-28 left-1/2 w-[min(90vw,560px)] -translate-x-1/2 rounded-lg border border-white/15 bg-black/75 px-4 py-2.5 text-center text-sm italic text-stone-100">{enc.reply}</div>
        )
      )}

      {/* ---------- Ventana de palabras (QTE por fase) ---------- */}
      {enc.words && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex justify-center p-4" data-testid="word-window">
          <div className="w-full max-w-2xl rounded-xl border border-amber-200/40 bg-[#0e0d12]/92 p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/80">{enc.fighter === "tanjiro" ? "Tanjiro habla" : "Un instante para hablar"}</span>
              <span className="text-[11px] tabular-nums text-stone-400">{enc.words.timeLeft.toFixed(1)} s</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-stone-800">
              <div className="h-full bg-amber-300 transition-[width] duration-100" style={{ width: `${(enc.words.timeLeft / enc.words.total) * 100}%` }} />
            </div>
            <p className="mt-3 text-sm italic text-stone-200">{enc.words.prompt}</p>
            <div className="mt-3 grid gap-2">
              {enc.words.options.map((o, i) => (
                <button key={i} onClick={() => onSpeak(i)} className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${TONE_STYLE[o.tone] ?? TONE_STYLE.neutral}`}>
                  <span className="mr-2 text-xs opacity-70">{i + 1}.</span>{o.text}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-stone-500">Teclas 1-3 · si no eliges, el momento pasa.</div>
          </div>
        </div>
      )}

      {/* ---------- Botones de acción (táctil / ratón) ---------- */}
      {enc.chosen && !enc.words && !enc.dead && !enc.won && (
        <div className="pointer-events-auto absolute bottom-6 right-6 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button onPointerDown={(e) => { e.preventDefault(); onSpeak(-12); }} disabled={!enc.tagReady} className={`h-12 rounded-full border-2 px-4 text-[11px] font-bold ${enc.tagReady ? "border-emerald-300/70 bg-emerald-900/80 text-emerald-50" : "border-stone-600 bg-stone-900/70 text-stone-500"}`} data-testid="btn-tag">RELEVO {enc.fighter === "tanjiro" ? "→ Tú" : "→ Tanjiro"}</button>
            <button onPointerDown={(e) => { e.preventDefault(); onSpeak(-11); }} disabled={!enc.envReady} className={`h-12 rounded-full border-2 px-4 text-[11px] font-bold ${enc.envReady ? "border-cyan-300/70 bg-cyan-900/80 text-cyan-50" : "border-stone-600 bg-stone-900/70 text-stone-500"}`} data-testid="btn-env" title={enc.envLabel}>ENTORNO</button>
          </div>
          <div className="flex items-end gap-2">
            <button
              onPointerDown={(e) => { e.preventDefault(); onGuard(true); }}
              onPointerUp={(e) => { e.preventDefault(); onGuard(false); }}
              onPointerLeave={() => onGuard(false)}
              className={`h-16 w-16 rounded-full border-2 text-[11px] font-bold ${enc.guardCharged ? "border-sky-200 bg-sky-500/40 text-sky-50" : "border-sky-400/70 bg-sky-900/80 text-sky-100"}`}
            >
              GUARDIA
            </button>
            <button onPointerDown={(e) => { e.preventDefault(); onSpeak(-10); }} className="h-16 w-16 rounded-full border-2 border-amber-300/70 bg-amber-900/80 text-[11px] font-bold text-amber-50" data-testid="btn-combo">COMBO</button>
            <button onPointerDown={(e) => { e.preventDefault(); onAttack(); }} className="h-16 w-16 rounded-full border-2 border-orange-300/70 bg-orange-900/80 text-[11px] font-bold text-orange-50">GOLPE</button>
            <button onPointerDown={(e) => { e.preventDefault(); onDodge(); }} className="h-20 w-20 rounded-full border-2 border-cyan-300/80 bg-cyan-900/80 text-xs font-bold text-cyan-50">ESQUIVA</button>
          </div>
        </div>
      )}

      {/* ---------- Muerte / victoria ---------- */}
      {enc.dead && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center bg-[#120507]/88 p-6" data-testid="encounter-dead">
          <span className="text-[10px] uppercase tracking-[0.4em] text-rose-300/70">Has caído</span>
          <h2 className="mt-3 font-serif text-3xl text-rose-100">{enc.id === "nezuko" ? "No llegaste a sus recuerdos" : enc.id === "giyu" ? "La hoja fue más rápida" : "Sabito te derriba"}</h2>
          <p className="mt-4 max-w-md text-center text-sm leading-7 text-stone-300">{enc.hint}</p>
          <button onClick={onRetry} className="mt-7 rounded border border-rose-200/50 bg-rose-200 px-8 py-3 text-sm font-semibold text-[#2a0a10] hover:bg-rose-100">Volver a intentarlo (Enter)</button>
        </div>
      )}
      {enc.won && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-3xl tracking-[0.2em] text-amber-100 drop-shadow-[0_0_20px_rgba(255,220,150,0.8)]">{enc.id === "nezuko" ? "TE HA RECONOCIDO" : enc.id === "giyu" ? "LA HOJA SE DETIENE" : "GOLPE LIMPIO"}</span>
        </div>
      )}
    </div>
  );
}

export function TrainingHUD({ tr, onRetry, onAgile, onJump, onParry, onAttack, onEnvironment, onTag, onFocusHold }: {
  tr: TrainingView;
  onRetry: () => void;
  onAgile: () => void;
  onJump: () => void;
  onParry: () => void;
  onAttack: () => void;
  onEnvironment: () => void;
  onTag: () => void;
  onFocusHold: (held: boolean) => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (tr.failed && (e.code === "Enter" || e.code === "KeyR")) { e.preventDefault(); onRetry(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [tr.failed, onRetry]);
  const progress = Math.round(tr.progress * 100);
  const charging = tr.kind === "boulder";
  const phaseTitle = ["I · RESPIRACIÓN TOTAL", "II · CUATRO CORTES AL PULSO", "III · HILO DE APERTURA"][tr.rockPhase];
  const actionBtn = (name: string, click: () => void, classes: string, id: string, disabled = false) => (
    <button type="button" key={id} data-testid={id} onPointerDown={(e) => { e.preventDefault(); click(); }} disabled={disabled}
      className={`pointer-events-auto touch-none rounded-lg border px-3 py-2.5 text-xs font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-40 ${classes}`}>{name}</button>
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[60] font-sans" data-testid="training" data-kind={tr.kind} data-station={tr.station} data-phase={tr.rockPhase} data-hits={tr.hits} data-done={tr.done} data-failed={tr.failed} data-progress={progress} data-focus={tr.rockCharge.toFixed(0)} data-resistance={tr.rockResistance} data-parries={tr.rockParries} data-thread={tr.threadTime.toFixed(2)} data-beat={tr.marker.toFixed(2)} data-wave={tr.waveTelegraph.toFixed(2)} data-hazard={tr.hazardTelegraph.toFixed(2)} data-distance={tr.stationDistance.toFixed(1)} data-agile={tr.agileCount}>
      <div className="pointer-events-auto absolute left-1/2 top-3 w-[min(95vw,620px)] -translate-x-1/2 rounded-xl border border-sky-200/40 bg-[#07111d]/90 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-200">
          <span>{charging ? "La roca sagrada · concentración total" : "Sendero de trampas · Monte Sagiri"}</span>
          {tr.timeLeft !== null ? <span className="tabular-nums">{Math.ceil(tr.timeLeft)} s</span> : <span>Urokodaki vigila</span>}
        </div>
        {!charging ? (
          <>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {["1 · Esquiva", "2 · Parada", "3 · Combo", "4 · Relevo"].map((label, index) => <div key={label} className={`rounded border px-1 py-1.5 text-center text-[10px] ${index === tr.station ? "border-sky-300 bg-sky-800/70 text-white" : index < tr.station ? "border-emerald-400/40 bg-emerald-950/50 text-emerald-300" : "border-slate-600 bg-black/40 text-slate-400"}`}>{index < tr.station ? "✓ " : ""}{label}</div>)}
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2"><h2 className="font-serif text-lg text-white" data-testid="station-name">{tr.stationName}</h2><span className="text-xs text-sky-200">{tr.station < 4 ? `${tr.stationCount}/${tr.stationRequired}` : "¡Meta!"}</span></div>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">{tr.stationTask}</p>
            {tr.station < 4 && <div className="mt-1 flex justify-between text-[11px] text-sky-200"><span>{tr.stationKey}</span><span>Marcador a {Math.ceil(tr.stationDistance)} m</span></div>}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-gradient-to-r from-sky-700 to-sky-300 transition-all" style={{ width: `${progress}%` }} /></div>
            <div className="mt-1.5 flex justify-between text-[11px] text-stone-200"><span>Camino {progress}% · Sigue los haces celestes</span><span>{"♥".repeat(tr.hp)}{"♡".repeat(Math.max(0, tr.maxHp - tr.hp))}</span></div>
            {tr.station !== 2 && tr.station < 4 && tr.hazardTelegraph > 0 && <div className="mt-2" data-testid="station-telegraph"><div className="flex justify-between text-[10px] font-bold tracking-[0.14em] text-rose-200"><span>¡ATAQUE INMINENTE! {tr.stationKey}</span><span>{tr.hazardTelegraph.toFixed(1)} s</span></div><div className="mt-0.5 h-2 overflow-hidden rounded bg-rose-950"><div className="h-full bg-rose-400" style={{ width: `${tr.hazardMax ? (tr.hazardTelegraph / tr.hazardMax) * 100 : 0}%` }} /></div></div>}
            {tr.station === 2 && <div className="mt-2 rounded border border-amber-300/40 bg-amber-950/30 px-2 py-1.5 text-xs text-amber-100" data-testid="station-combo">Golpea J × 4: {tr.stationCount}/4 · {tr.stationCount >= 4 ? "¡Ahora E para rematar!" : tr.rockComboTime > 0 ? `${tr.rockComboTime.toFixed(1)} s para continuar` : "mantén la cadena"}</div>}
          </>
        ) : (
          <>
            <div className="mt-2 flex items-center justify-between gap-2"><h2 className="font-serif text-lg text-white">{phaseTitle}</h2><span className="text-xs text-sky-200">{tr.rockResistance}/100</span></div>
            <p className="mt-1 text-xs text-slate-200">{tr.rockPhase === 0 ? "Mantén E para cargar el foco. La roca emite ondas; desvía al menos una con F." : tr.rockPhase === 1 ? "Cuatro J al pulso dorado. Para la onda azul con F antes de buscar el hilo." : "¡Hilo de Apertura! Pulsa E y J juntos (o E seguido de J) antes de 0,8 s."}</p>
            <div className="mt-2 flex justify-between text-[11px] text-stone-300"><span>Resistencia Pétrea</span><span>{tr.rockResistance}%</span></div>
            <div className="mt-0.5 h-2 overflow-hidden rounded bg-slate-800"><div className="h-full bg-gradient-to-r from-stone-500 to-sky-300 transition-all" style={{ width: `${tr.rockResistance}%` }} /></div>
            <div className="mt-2 flex justify-between text-[11px] text-sky-200"><span>Respiración Total {Math.round(tr.rockCharge)}/100{tr.focusHeld ? " · cargando" : ""}</span><span>F: {tr.rockParries} parada{tr.rockParries === 1 ? "" : "s"}</span></div>
            <div className="mt-0.5 h-2 overflow-hidden rounded bg-slate-800"><div className="h-full bg-sky-300 transition-all" style={{ width: `${tr.rockCharge}%` }} /></div>
            {tr.rockPhase === 1 && <div className="mt-2" data-testid="boulder-timing"><div className="relative h-5 overflow-hidden rounded-full border border-amber-200/40 bg-stone-900"><div className={`absolute inset-y-0 ${tr.focusTime > 0 ? "bg-sky-300/80" : "bg-amber-300/75"}`} style={{ left: `${tr.zoneStart * 100}%`, width: `${(tr.zoneEnd - tr.zoneStart) * 100}%` }} /><div className="absolute inset-y-0 w-1 bg-white shadow-[0_0_9px_#fff]" style={{ left: `calc(${tr.marker * 100}% - 2px)` }} /></div><div className="mt-1 flex justify-between text-[10px] text-amber-100"><span>J en la luz</span><span>Cadena {tr.rockCombo}/4 · {tr.rockComboTime > 0 ? `${tr.rockComboTime.toFixed(1)} s` : "esperando"}</span></div></div>}
            {tr.waveTelegraph > 0 && <div className="mt-2 rounded border border-sky-300/50 bg-sky-900/40 px-2 py-1 text-center text-xs font-bold text-sky-100" data-testid="rock-wave">ONDA DE PRESIÓN · ¡F! {tr.waveTelegraph.toFixed(1)} s</div>}
            {tr.rockPhase === 2 && tr.done ? <div className="mt-2 rounded border border-cyan-200 bg-sky-900/70 px-3 py-2 text-center font-serif text-lg text-white shadow-[0_0_18px_rgba(125,220,255,.6)]" data-testid="rock-success">✦ ¡ROCA PARTIDA! · Tajo Definitivo ✦</div> : tr.rockPhase === 2 && <div className="mt-2 rounded border border-cyan-200 bg-sky-900/70 px-3 py-2 text-center font-serif text-lg text-white shadow-[0_0_18px_rgba(125,220,255,.6)]" data-testid="rock-thread">HILO DE APERTURA · E + J · {tr.threadTime.toFixed(1)} s</div>}
            <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>Resistencia física {"♥".repeat(tr.hp)}{"♡".repeat(Math.max(0, tr.maxHp - tr.hp))}</span><span>Aliento {Math.round(tr.breath)}%</span></div>
          </>
        )}
      </div>
      {tr.agileFlash > 0 && !tr.failed && <div data-testid="agile-flash" className="absolute left-1/2 top-[28%] -translate-x-1/2 font-serif text-3xl tracking-widest text-sky-100 drop-shadow-[0_0_18px_#7ce2ff]">¡Esquiva Ágil!</div>}
      {tr.message && !tr.failed && <div className="absolute bottom-24 left-1/2 w-[min(90vw,520px)] -translate-x-1/2 rounded-lg border border-white/15 bg-black/75 px-4 py-2.5 text-center text-sm text-stone-100">{tr.message}</div>}
      {!tr.failed && !tr.done && <div className="pointer-events-auto absolute bottom-5 right-3 flex max-w-[72%] flex-wrap justify-end gap-1.5 md:hidden">
        {charging ? <>
          <button type="button" data-testid="focus-hold" onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onFocusHold(true); }} onPointerUp={() => onFocusHold(false)} onPointerCancel={() => onFocusHold(false)} className="touch-none rounded-lg border border-sky-300 bg-sky-900/90 px-3 py-2.5 text-xs font-bold text-white">E · MANTENER</button>
          {actionBtn("F · PARAR", onParry, "border-sky-300 bg-sky-950/90 text-white", "training-parry")}
          {actionBtn("J · CORTAR", onAttack, "border-amber-300 bg-amber-950/90 text-white", "training-attack")}
        </> : <>
          {tr.station === 0 && actionBtn("K · ESQUIVA", onAgile, "border-sky-300 bg-sky-950/90 text-white", "training-dodge")}
          {tr.station === 1 && actionBtn("F · PARADA", onParry, "border-sky-300 bg-sky-950/90 text-white", "training-parry")}
          {tr.station === 2 && <>{actionBtn("J · COMBO", onAttack, "border-amber-300 bg-amber-950/90 text-white", "training-attack")}{actionBtn("E · REMATE", onEnvironment, "border-emerald-300 bg-emerald-950/90 text-white", "training-env")}</>}
          {tr.station === 3 && actionBtn("Tab · RELEVO", onTag, "border-cyan-300 bg-cyan-950/90 text-white", "training-tag")}
          {tr.station === 0 && actionBtn("SALTAR", onJump, "border-stone-400 bg-stone-900/90 text-white", "training-jump")}
        </>}
      </div>}
      {tr.failed && <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center bg-[#07090f]/88 p-6" data-testid="training-failed"><h2 className="font-serif text-3xl text-sky-50">«Otra vez.»</h2><p className="mt-4 max-w-md text-center text-sm leading-7 text-stone-300">{tr.kind === "descent" ? "Identifica cada señal de las cuatro estaciones y pulsa la tecla indicada en el último instante." : "Mantén E para cargar tu aliento, para con F, encadena J × 4 y corta el hilo azul con E + J."}</p><button onClick={onRetry} className="mt-7 rounded border border-sky-200/50 bg-sky-200 px-8 py-3 text-sm font-semibold text-[#071a2a] hover:bg-sky-100">Repetir (Enter)</button></div>}
    </div>
  );
}
