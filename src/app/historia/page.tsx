import Link from "next/link";
import StoryReader from "@/components/StoryReader";

export const metadata = {
  title: "Modo lectura · Hojas en la Bruma",
};

export default function HistoriaPage() {
  return (
    <div className="relative">
      <div className="fixed top-3 left-3 z-50">
        <Link
          href="/"
          className="inline-block rounded-lg border border-yellow-700/60 bg-black/80 px-3 py-1.5 text-xs text-yellow-200 font-sans hover:bg-yellow-950/60"
        >
          ← Volver al juego
        </Link>
      </div>
      <StoryReader />
    </div>
  );
}
