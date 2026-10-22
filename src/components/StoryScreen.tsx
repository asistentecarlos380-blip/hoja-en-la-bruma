"use client";

import { useGame } from "@/lib/game/context";
import { getStoryNode, STARTING_NODE } from "@/lib/game/story";
import { useMemo, useState, useEffect } from "react";

export default function StoryScreen() {
  const { state, dispatch } = useGame();
  const nodeId = state.currentStoryNodeId ?? STARTING_NODE;
  const node = getStoryNode(nodeId);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    setLineIndex(0);
    setDisplayed("");
    setTyping(true);
  }, [nodeId]);

  const currentLine = node?.text[lineIndex] ?? "";

  useEffect(() => {
    if (!node) return;
    if (lineIndex >= node.text.length) return;
    const text = node.text[lineIndex];
    if (!text) return;
    setDisplayed("");
    setTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [lineIndex, node]);

  const atEnd = node && lineIndex >= node.text.length - 1 && !typing && displayed === currentLine;

  const advance = () => {
    if (!node) return;
    if (typing) {
      setDisplayed(currentLine);
      setTyping(false);
      return;
    }
    if (lineIndex < node.text.length - 1) {
      setLineIndex(lineIndex + 1);
    }
  };

  const handleChoice = (choice: { next: string; flag?: string; flagValue?: any; bossFight?: string }) => {
    if (choice.bossFight) {
      dispatch({
        type: "START_COMBAT",
        demonId: choice.bossFight === "akaza_escena" ? "akaza" : choice.bossFight,
        afterNode: choice.next,
        isBoss: true,
      });
      return;
    }
    dispatch({
      type: "ADVANCE_STORY",
      nextNode: choice.next,
      flagSet: choice.flag ? { key: choice.flag, value: choice.flagValue ?? true } : undefined,
    });
  };

  const handleContinue = () => {
    if (!node) return;
    if (node.isEnding) {
      dispatch({ type: "SET_PHASE", phase: "victory" });
      return;
    }
    if (node.bossFight) {
      dispatch({
        type: "START_COMBAT",
        demonId: node.bossFight,
        afterNode: node.next,
        isBoss: true,
      });
      return;
    }
    dispatch({
      type: "ADVANCE_STORY",
      nextNode: node.next,
      reward: node.reward,
      flagSet: { key: `done_${node.id}`, value: true },
    });
  };

  if (!node) {
    return (
      <div className="ebf-frame">
        <p className="text-red-400">Nodo de historia no encontrado.</p>
        <button className="ebf-btn mt-4" onClick={() => dispatch({ type: "SET_PHASE", phase: "worldmap" })}>
          Volver al mapa
        </button>
      </div>
    );
  }

  const speakerColor = node.speakerColor || "text-slate-200";
  const locBanner = node.location ? (require("@/lib/game/data") as typeof import("@/lib/game/data")).LOCATIONS[node.location]?.banner : null;

  return (
    <div
      className="relative w-full max-w-5xl mx-auto flex flex-col justify-end"
      style={{ minHeight: "calc(100vh - 120px)" }}
      onClick={!node.choices || !atEnd ? advance : undefined}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${locBanner ?? "from-slate-900 to-slate-950"} rounded-lg`} />
      <div className="mist-overlay" />

      {/* Character / title plate */}
      {node.speaker && atEnd === false ? null : null}

      <div className="relative z-10 mt-auto">
        <div className="ebf-frame !border-l-[6px] min-h-[220px] flex flex-col">
          {node.speaker && (
            <div className={`title-font text-2xl mb-2 ${speakerColor}`}>{node.speaker}</div>
          )}
          <div className="text-lg leading-relaxed text-slate-100 flex-1">
            {displayed}
            {typing && <span className="inline-block w-2 h-5 bg-[#ffd700] ml-1 animate-pulse align-middle" />}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            {atEnd && node.choices && node.choices.length > 0 ? (
              node.choices.map((c, i) => (
                <button key={i} className="ebf-btn" onClick={() => handleChoice(c)}>
                  {c.text}
                </button>
              ))
            ) : atEnd ? (
              <button className="ebf-btn glow-pulse" onClick={handleContinue}>
                {node.isEnding ? "✦ Final ✦" : node.bossFight ? "⚔ ¡Entrar en combate!" : "Continuar ▶"}
              </button>
            ) : (
              <div className="text-xs text-slate-400 self-end animate-pulse">Click para continuar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
