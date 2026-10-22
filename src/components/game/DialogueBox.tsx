"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { Dialogue } from "@/game/engine";

export type DialogueHandle = {
  /** Devuelve true si consumió la pulsación (estaba revelando texto). */
  advance: () => boolean;
  typing: () => boolean;
};

type Props = {
  dialogue: Dialogue;
  onChoose: (index: number) => void;
};

const DialogueBox = forwardRef<DialogueHandle, Props>(function DialogueBox({ dialogue, onChoose }, ref) {
  const line = dialogue.lines[Math.min(dialogue.index, dialogue.lines.length - 1)];
  const fullText = line?.text ?? "";
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (!fullText) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setShown(i);
      if (i >= fullText.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [fullText, dialogue.index, dialogue.nodeId]);

  useImperativeHandle(ref, () => ({
    advance: () => {
      if (shown < fullText.length) {
        setShown(fullText.length);
        return true;
      }
      return false;
    },
    typing: () => shown < fullText.length,
  }));

  const atEnd = shown >= fullText.length;
  const lastLine = dialogue.index >= dialogue.lines.length - 1;

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 p-2 md:p-3 font-sans">
      <div className="mx-auto max-w-3xl rounded-xl border-2 border-[#d4af37]/80 bg-[#101426]/95 shadow-[0_0_0_2px_#05070f,0_10px_30px_rgba(0,0,0,0.7)] p-3 md:p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-[#1c2440] border border-[#2d416e] flex items-center justify-center text-2xl">
            {line?.portrait || "📜"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm font-bold ${line?.color ?? "text-amber-200"}`}>{line?.speaker}</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 truncate">{dialogue.origin}</span>
            </div>
            <p className="mt-1 text-sm md:text-base leading-relaxed text-slate-100 min-h-[3.5rem]">
              {fullText.slice(0, shown)}
              {!atEnd && <span className="inline-block w-2 h-4 ml-0.5 bg-[#ffd700] align-middle animate-pulse" />}
            </p>
          </div>
        </div>

        {atEnd && dialogue.showChoices && dialogue.choices ? (
          <div className="mt-2 flex flex-col gap-2 border-t border-slate-700/70 pt-3">
            <span className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold">Elige (teclas 1-{dialogue.choices.length})</span>
            {dialogue.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => onChoose(i)}
                className="text-left px-3 py-2 rounded-lg border border-yellow-700/40 bg-yellow-950/20 hover:bg-yellow-900/40 hover:border-yellow-400 text-yellow-100 text-sm transition-colors cursor-pointer"
              >
                <span className="text-yellow-500 mr-2">{i + 1}.</span>
                {c.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-1 flex justify-end text-yellow-300 text-xs">
            {atEnd && lastLine ? (
              <span className="animate-bounce">▼ continuar</span>
            ) : !atEnd ? (
              <span className="text-slate-500">▼ saltar texto</span>
            ) : (
              <span className="animate-bounce">▼</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default DialogueBox;
