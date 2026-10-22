import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Kimetsu no Yaiba: Hojas en la Bruma — What If RPG",
  description: "RPG de mundo abierto en un universo alternativo de Demon Slayer. Eres Shinjo Ren, portador de la Respiración de la Bruma Plateada. Cambia el destino de los Pilares.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0a0c18] text-slate-100">
        {children}
      </body>
    </html>
  );
}
