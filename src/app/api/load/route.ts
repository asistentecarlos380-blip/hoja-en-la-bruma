import { NextResponse } from "next/server";
import { gameSaves } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ save: null });
    const { db } = await import("@/db");
    const saves = await db.select().from(gameSaves).orderBy(desc(gameSaves.updatedAt)).limit(1);
    if (saves.length === 0) {
      return NextResponse.json({ save: null });
    }
    return NextResponse.json({ save: saves[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
