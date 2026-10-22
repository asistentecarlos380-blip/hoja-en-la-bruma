"use client";

import { useEffect, useMemo, useState } from "react";
import { WHAT_IF_STORY, findNodeById, type StoryChapter, type StoryChoice } from "@/lib/storyData";
import NameEntry from "@/components/NameEntry";

type PlayerName = { first: string; last: string };
type SavedProgress = { currentNodeId?: string; visitedNodeIds?: string[] };

export default function StoryReader() {
  const [currentNodeId, setCurrentNodeId] = useState("p0_1");
  const [history, setHistory] = useState<string[]>([]);
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>(["p0_1"]);
  const [playerName, setPlayerName] = useState<PlayerName | null>(null);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem("kd_player_name");
      if (savedName) setPlayerName(JSON.parse(savedName) as PlayerName);

      const savedProgress = localStorage.getItem("kd_story_progress_v2");
      if (savedProgress) {
        const progress = JSON.parse(savedProgress) as SavedProgress;
        const validNode = progress.currentNodeId && findNodeById(progress.currentNodeId);
        if (validNode && progress.currentNodeId) {
          setCurrentNodeId(progress.currentNodeId);
          const visited = Array.isArray(progress.visitedNodeIds) ? progress.visitedNodeIds : [];
          setVisitedNodeIds(Array.from(new Set(["p0_1", ...visited, progress.currentNodeId])));
        }
      }
    } catch {
      // Un dato local inválido no debe impedir iniciar una historia nueva.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        "kd_story_progress_v2",
        JSON.stringify({ currentNodeId, visitedNodeIds } satisfies SavedProgress),
      );
    } catch {
      // La lectura de la historia también funciona si el navegador bloquea el almacenamiento.
    }
  }, [currentNodeId, visitedNodeIds, ready]);

  const currentResult = findNodeById(currentNodeId) ?? findNodeById("p0_1");
  const currentChapter = currentResult?.chapter ?? WHAT_IF_STORY[0];
  const currentNode = currentResult?.node ?? WHAT_IF_STORY[0].nodes[0];
  const currentChapterIndex = Math.max(0, WHAT_IF_STORY.findIndex((chapter) => chapter.id === currentChapter.id));

  const replaceName = (text: string): string => {
    if (!playerName) return text;
    return text
      .replaceAll("{firstName}", playerName.first)
      .replaceAll("{lastName}", playerName.last)
      .replaceAll("{fullName}", `${playerName.first} ${playerName.last}`);
  };

  const chapterComplete = (chapter: StoryChapter) =>
    chapter.mission.objectives.every((objective) =>
      objective.completeOnNodeIds.some((nodeId) => visitedNodeIds.includes(nodeId)),
    );

  const chapterUnlocked = (index: number) =>
    index === 0 || WHAT_IF_STORY.slice(0, index).every((chapter) => chapterComplete(chapter));

  const missionStats = useMemo(() => {
    const done = currentChapter.mission.objectives.filter((objective) =>
      objective.completeOnNodeIds.some((nodeId) => visitedNodeIds.includes(nodeId)),
    ).length;
    return { done, total: currentChapter.mission.objectives.length };
  }, [currentChapter, visitedNodeIds]);

  const goToNode = (nextNodeId: string) => {
    const destination = findNodeById(nextNodeId);
    if (!destination) return;
    const destinationIndex = WHAT_IF_STORY.findIndex((chapter) => chapter.id === destination.chapter.id);
    if (destinationIndex < 0 || !chapterUnlocked(destinationIndex)) return;

    setHistory((previous) => [...previous, currentNodeId]);
    setCurrentNodeId(nextNodeId);
    setVisitedNodeIds((previous) => previous.includes(nextNodeId) ? previous : [...previous, nextNodeId]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNameConfirm = (first: string, last: string) => {
    const name = { first, last };
    setPlayerName(name);
    setShowNameEntry(false);
    try {
      localStorage.setItem("kd_player_name", JSON.stringify(name));
    } catch {
      // El nombre continúa activo durante esta sesión.
    }
  };

  const handleBack = () => {
    if (!history.length) return;
    const previousNodeId = history[history.length - 1];
    setHistory((previous) => previous.slice(0, -1));
    setCurrentNodeId(previousNodeId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToChapter = (chapter: StoryChapter, index: number) => {
    if (!chapterUnlocked(index)) return;
    goToNode(chapter.nodes[0].id);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-yellow-200 font-serif">
        La bruma se disipa...
      </div>
    );
  }

  if (!playerName || showNameEntry) {
    return <NameEntry onConfirm={handleNameConfirm} />;
  }

  const progressPercent = missionStats.total ? (missionStats.done / missionStats.total) * 100 : 0;
  const nextChapter = WHAT_IF_STORY[currentChapterIndex + 1];
  const nextChapterLocked = !!nextChapter && !chapterUnlocked(currentChapterIndex + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-serif">
      <header className="w-full max-w-6xl mb-5 pb-4 border-b border-slate-800 text-center">
        <div className="inline-block px-3 py-1 bg-yellow-950/40 border border-yellow-700/50 rounded-full text-xs text-yellow-400 font-sans tracking-widest uppercase mb-2">
          What If · Campaña narrativa
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-yellow-100">
          Kimetsu no Yaiba: Hojas en la Bruma
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          La crónica de <span className="text-yellow-300 font-semibold">{playerName.first} {playerName.last}</span> (19) y su prometida, Nezuko Kamado (19)
        </p>
      </header>

      <nav className="w-full max-w-6xl mb-5 flex flex-wrap gap-2 justify-center" aria-label="Capítulos">
        {WHAT_IF_STORY.map((chapter, index) => {
          const isSelected = chapter.id === currentChapter.id;
          const unlocked = chapterUnlocked(index);
          const completed = chapterComplete(chapter);
          return (
            <button
              key={chapter.id}
              onClick={() => handleJumpToChapter(chapter, index)}
              disabled={!unlocked}
              title={!unlocked ? `Completa la misión anterior para desbloquear: ${chapter.title}` : chapter.title}
              className={`px-3 py-1.5 text-xs font-sans rounded border transition-colors ${
                isSelected
                  ? "bg-yellow-600/30 border-yellow-500 text-yellow-200 font-bold"
                  : !unlocked
                    ? "bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed"
                    : completed
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:border-emerald-500 cursor-pointer"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:border-yellow-600 hover:text-yellow-200 cursor-pointer"
              }`}
            >
              {!unlocked ? "🔒" : completed ? "✓" : ""} Cap. {chapter.number}
            </button>
          );
        })}
        <button
          onClick={() => setShowNameEntry(true)}
          className="px-3 py-1.5 text-xs font-sans rounded border border-slate-700 bg-slate-900 text-slate-400 hover:border-yellow-600 hover:text-yellow-300 transition-colors cursor-pointer"
        >
          ✏️ Cambiar nombre
        </button>
      </nav>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">
        <main className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-1 pb-4 border-b border-slate-800/80 font-sans">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 text-xs text-slate-400">
              <span>{replaceName(currentChapter.title)}</span>
              <span className="text-yellow-500/80">📍 {replaceName(currentChapter.location)}</span>
            </div>
            <p className="text-xs text-slate-500 italic mt-0.5">{replaceName(currentChapter.synopsis)}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner select-none">
              {currentNode.portraitEmoji || "📜"}
            </div>
            <div>
              <h2 className={`font-sans font-bold text-lg leading-tight ${currentNode.speakerColor || "text-yellow-400"}`}>
                {currentNode.speaker}
              </h2>
              {currentNode.title && (
                <span className="text-xs text-slate-400 uppercase tracking-wider">{replaceName(currentNode.title)}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 text-base md:text-lg leading-relaxed text-slate-200">
            {currentNode.paragraphs.map((paragraph, index) => (
              <p key={`${currentNode.id}-${index}`} className="tracking-wide">{replaceName(paragraph)}</p>
            ))}
          </div>

          <div className="mt-1 pt-4 border-t border-slate-800/80 flex flex-col gap-3 font-sans">
            {currentNode.choices && currentNode.choices.length > 0 ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-yellow-500/80 uppercase tracking-widest font-bold">Decisión:</span>
                {currentNode.choices.map((choice: StoryChoice, index: number) => (
                  <button
                    key={`${currentNode.id}-choice-${index}`}
                    onClick={() => goToNode(choice.nextNodeId)}
                    className="w-full text-left p-3.5 rounded-lg border border-yellow-700/40 bg-yellow-950/20 hover:bg-yellow-900/40 hover:border-yellow-500 text-yellow-100 transition-all flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{replaceName(choice.text)}</span>
                    {choice.consequence && <span className="text-xs text-yellow-400/70 italic">↳ {replaceName(choice.consequence)}</span>}
                  </button>
                ))}
              </div>
            ) : currentNode.nextNodeId ? (
              <button
                onClick={() => goToNode(currentNode.nextNodeId!)}
                className="w-full py-3.5 px-4 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Continuar misión</span><span>→</span>
              </button>
            ) : (
              <div className="text-center py-2 text-yellow-400 text-sm italic">Fin de este fragmento de historia.</div>
            )}
            {history.length > 0 && (
              <button onClick={handleBack} className="self-start text-xs text-slate-500 hover:text-slate-300 transition-colors mt-2 underline cursor-pointer">
                ← Volver a la escena anterior
              </button>
            )}
          </div>
        </main>

        <aside className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl font-sans lg:sticky lg:top-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold">Cuervo Kasugai</div>
              <h2 className="text-lg font-bold text-yellow-100 mt-1">{currentChapter.mission.title}</h2>
            </div>
            <span className="text-2xl" aria-hidden="true">🐦‍⬛</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-3">{replaceName(currentChapter.mission.briefing)}</p>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Objetivos</span>
              <span className="text-yellow-300">{missionStats.done}/{missionStats.total}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-300 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <ol className="mt-4 flex flex-col gap-3">
            {currentChapter.mission.objectives.map((objective, index) => {
              const complete = objective.completeOnNodeIds.some((nodeId) => visitedNodeIds.includes(nodeId));
              return (
                <li key={objective.id} className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] ${complete ? "bg-emerald-900/60 border-emerald-500 text-emerald-300" : "bg-slate-950 border-slate-700 text-slate-500"}`}>
                    {complete ? "✓" : index + 1}
                  </span>
                  <span className={complete ? "text-emerald-200/80 line-through decoration-emerald-800" : "text-slate-300"}>{replaceName(objective.label)}</span>
                </li>
              );
            })}
          </ol>

          {chapterComplete(currentChapter) ? (
            <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3 text-xs text-emerald-200">
              ✅ Misión completada. La siguiente orden está disponible.
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-xs text-slate-400">
              Completa todos los objetivos para desbloquear el próximo capítulo.
            </div>
          )}
          {nextChapter && nextChapterLocked && (
            <div className="mt-3 text-[11px] text-slate-500">Siguiente: {nextChapter.title}</div>
          )}
        </aside>
      </div>

      <footer className="mt-6 text-center text-xs text-slate-600 font-sans">
        Progreso y nombre guardados en este navegador · {visitedNodeIds.length} escenas descubiertas
      </footer>
    </div>
  );
}
