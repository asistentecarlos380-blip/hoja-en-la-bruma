import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { openWorldSaves } from "@/db/schema";
import { normalizeSave } from "@/game3d/ow/prologue";

export const dynamic = "force-dynamic";
const COOKIE = "kny_ow_session";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const id = (await cookies()).get(COOKIE)?.value;
    if (!id || !uuid.test(id)) return NextResponse.json({ progress: null }, { headers });
    if (!process.env.DATABASE_URL) return NextResponse.json({ progress: null }, { headers });
    const { db } = await import("@/db");
    const [row] = await db.select({ snapshot: openWorldSaves.snapshot }).from(openWorldSaves).where(eq(openWorldSaves.id, id)).limit(1);
    return NextResponse.json({ progress: row?.snapshot ?? null }, { headers });
  } catch {
    return NextResponse.json({ error: "No se pudo recuperar la partida. Tu copia local sigue disponible." }, { status: 503, headers });
  }
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 64000) return NextResponse.json({ error: "Partida demasiado grande." }, { status: 413 });
    const text = await request.text();
    if (text.length > 64000) return NextResponse.json({ error: "Partida demasiado grande." }, { status: 413 });
    let body: { name?: { first?: unknown; last?: unknown }; save?: unknown };
    try { body = JSON.parse(text); } catch { return NextResponse.json({ error: "JSON no válido." }, { status: 400 }); }
    const first = typeof body?.name?.first === "string" ? body.name.first.trim() : "";
    const last = typeof body?.name?.last === "string" ? body.name.last.trim() : "";
    const save = normalizeSave(body?.save);
    if (first.length < 2 || first.length > 30 || last.length < 2 || last.length > 30 || !save) {
      return NextResponse.json({ error: "Datos de partida no válidos." }, { status: 400 });
    }
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Guardado en servidor no configurado. Se conserva la partida local." }, { status: 503, headers });
    const { db } = await import("@/db");
    const oldId = (await cookies()).get(COOKIE)?.value;
    const id = oldId && uuid.test(oldId) ? oldId : randomUUID();
    const snapshot = { name: { first, last }, save };
    await db.insert(openWorldSaves).values({ id, snapshot }).onConflictDoUpdate({ target: openWorldSaves.id, set: { snapshot, updatedAt: new Date() } });
    const response = NextResponse.json({ saved: true }, { headers });
    response.cookies.set(COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365, secure: request.url.startsWith("https:") });
    return response;
  } catch {
    return NextResponse.json({ error: "No se pudo guardar en el servidor. Conserva tu copia local." }, { status: 503, headers });
  }
}
