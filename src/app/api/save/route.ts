import { NextResponse } from "next/server";
import { gameSaves } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Sin base de datos: usa el guardado local del navegador." }, { status: 503 });
    const { db } = await import("@/db");
    const body = await request.json();
    const { id, ...rest } = body;

    if (id) {
      const updated = await db
        .update(gameSaves)
        .set({
          ...rest,
          updatedAt: new Date(),
        })
        .where(eq(gameSaves.id, id))
        .returning();
      return NextResponse.json({ save: updated[0] });
    } else {
      const created = await db.insert(gameSaves).values(rest).returning();
      return NextResponse.json({ save: created[0] });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
