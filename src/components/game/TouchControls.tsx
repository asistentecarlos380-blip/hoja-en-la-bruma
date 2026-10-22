"use client";

import type { Facing } from "@/game/engine";

type Props = {
  onPress: (dir: Facing) => void;
  onRelease: () => void;
  onA: () => void;
  onB: () => void;
  disabled?: boolean;
};

const DIRS: { dir: Facing; label: string; className: string }[] = [
  { dir: "up", label: "▲", className: "col-start-2 row-start-1" },
  { dir: "left", label: "◀", className: "col-start-1 row-start-2" },
  { dir: "right", label: "▶", className: "col-start-3 row-start-2" },
  { dir: "down", label: "▼", className: "col-start-2 row-start-3" },
];

export default function TouchControls({ onPress, onRelease, onA, onB, disabled }: Props) {
  return (
    <div className="mt-3 flex items-end justify-between gap-6 select-none md:hidden" style={{ touchAction: "none" }}>
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
        {DIRS.map((d) => (
          <button
            key={d.dir}
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(d.dir);
            }}
            onPointerUp={onRelease}
            onPointerLeave={onRelease}
            onPointerCancel={onRelease}
            className={`${d.className} w-14 h-14 rounded-lg border-2 border-[#d4af37]/70 bg-[#24345a] active:bg-[#3a548c] text-yellow-200 text-xl font-bold shadow-[0_3px_0_#05070f] disabled:opacity-40`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pb-2">
        <button
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            onB();
          }}
          className="w-14 h-14 rounded-full border-2 border-red-700/70 bg-[#3a1414] active:bg-[#5a1e1e] text-red-100 text-sm font-bold shadow-[0_3px_0_#05070f] disabled:opacity-40"
        >
          B
        </button>
        <button
          disabled={disabled}
          onPointerDown={(e) => {
            e.preventDefault();
            onA();
          }}
          className="w-16 h-16 rounded-full border-2 border-[#d4af37] bg-[#24345a] active:bg-[#3a548c] text-yellow-200 text-base font-bold shadow-[0_3px_0_#05070f] disabled:opacity-40"
        >
          A
        </button>
      </div>
    </div>
  );
}
