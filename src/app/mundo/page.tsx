"use client";

import Link from "next/link";
import GameRoot from "@/components/game/GameRoot";

export default function MundoPage() {
  return (
    <div className="relative">
      <div className="fixed top-3 left-3 z-50 flex gap-2">
        <Link
          href="/"
          className="rounded-lg border border-yellow-700/60 bg-black/80 px-3 py-1.5 text-xs text-yellow-200 font-sans hover:bg-yellow-950/60"
        >
          🌍 Mundo abierto 3D
        </Link>
        <Link
          href="/plataformas"
          className="rounded-lg border border-slate-700 bg-black/80 px-3 py-1.5 text-xs text-slate-200 font-sans hover:bg-slate-800"
        >
          🎮 Plataformero 3D
        </Link>
        <Link
          href="/historia"
          className="rounded-lg border border-slate-700 bg-black/80 px-3 py-1.5 text-xs text-slate-200 font-sans hover:bg-slate-800"
        >
          📖 Modo lectura
        </Link>
      </div>
      <GameRoot />
    </div>
  );
}
