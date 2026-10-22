"use client";

import { useGame } from "@/lib/game/context";
import { LOCATIONS } from "@/lib/game/data";
import { getStoryNode } from "@/lib/game/story";
import { useMemo } from "react";

export default function LocationScreen() {
  const { state, dispatch } = useGame();
  const g = state.game;
  const loc = LOCATIONS[g.currentLocation];

  const nextStoryNode = useMemo(() => {
    for (const eventId of loc.storyEvents) {
      const node = getStoryNode(eventId);
      if (!node) continue;
      if (node.chapter > g.storyChapter) {
        // Check if previous chapter flags are met
        return node;
      }
    }
    return null;
  }, [loc, g.storyChapter, g.storyFlags]);

  // Unread story that matches current chapter
  const availableStory = loc.storyEvents.find((eid) => {
    const n = getStoryNode(eid);
    if (!n) return false;
    if (n.chapter !== g.storyChapter) return false;
    if (state.game.storyFlags[`done_${n.id}`]) return false;
    return true;
  });

  const startNodeId = availableStory ?? nextStoryNode?.id;

  return (
    <div className="ebf-frame relative overflow-hidden" style={{ minHeight: "calc(100vh - 120px)" }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${loc.banner} opacity-80`} />
      <div className="mist-overlay" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="title-font text-4xl text-[#ffd700] drop-shadow-[0_2px_0_#000]">{loc.name}</h2>
            <div className="text-slate-200 italic text-sm max-w-3xl mt-1">{loc.ambiance}</div>
          </div>
          <button className="ebf-btn" onClick={() => dispatch({ type: "SET_PHASE", phase: "worldmap" })}>
            🗺 Mapa
          </button>
        </div>

        <div className="ebf-frame my-4 max-w-4xl">
          <p className="text-slate-200 leading-relaxed">{loc.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
          {startNodeId && (
            <button
              className="ebf-btn glow-pulse !text-base !py-4 !min-w-0 col-span-full"
              onClick={() => {
                const node = getStoryNode(startNodeId);
                if (node?.bossFight) {
                  dispatch({
                    type: "START_COMBAT",
                    demonId: node.bossFight === "akaza_escena" ? "akaza" : node.bossFight,
                    afterNode: startNodeId,
                    isBoss: true,
                  });
                } else {
                  dispatch({ type: "START_STORY", nodeId: startNodeId });
                }
              }}
            >
              📜 {nextStoryNode?.chapter === g.storyChapter ? "Continuar la historia" : "Avanzar la historia"}
              <div className="text-xs font-normal text-slate-300 mt-1">
                {getStoryNode(startNodeId)?.speaker ? `Siguiente: ${getStoryNode(startNodeId)?.speaker}` : "Escena narrativa"}
              </div>
            </button>
          )}

          {loc.demonPool.length > 0 && (
            <button
              className="ebf-btn ebf-btn-danger !text-base !py-4 !min-w-0"
              onClick={() => {
                const pick = loc.demonPool[Math.floor(Math.random() * loc.demonPool.length)];
                dispatch({ type: "START_COMBAT", demonId: pick });
              }}
            >
              ⚔ Patrullar / Cazar demonios
              <div className="text-xs font-normal text-slate-300 mt-1">Encuentra un demonio al azar.</div>
            </button>
          )}

          {loc.shrineAvailable && (
            <button
              className="ebf-btn !text-base !py-4 !min-w-0"
              style={{ borderColor: "#c084fc" }}
              onClick={() => dispatch({ type: "SET_PHASE", phase: "shrine" })}
            >
              ✨ Santuario de la Bruma (Invocaciones)
              <div className="text-xs font-normal text-slate-300 mt-1">Usa orobras para invocar aliados legendarios.</div>
            </button>
          )}

          {loc.shopAvailable && (
            <button
              className="ebf-btn !text-base !py-4 !min-w-0"
              onClick={() => {
                // Simple "shop" - restore HP for free (like an inn) plus small heal
                dispatch({ type: "REST_AT_INN" });
              }}
            >
              🍵 Posada · Descansar
              <div className="text-xs font-normal text-slate-300 mt-1">Restaura HP y O2 al máximo.</div>
            </button>
          )}

          {loc.hashiraPresent && loc.hashiraPresent.length > 0 && (
            <div className="ebf-frame !shadow-none col-span-full">
              <div className="text-xs text-slate-400">Personajes presentes:</div>
              <div className="text-sm text-cyan-200">{loc.hashiraPresent.join(", ")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
