import { NextResponse } from "next/server";

import getGoogleEmbeddings from "@/server/embedding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const vector = await getGoogleEmbeddings().embedQuery("health-check");
    const size = Array.isArray(vector) ? vector.length : 0;

    if (!size) {
      return NextResponse.json(
        { ok: false, error: "Embedding vector is empty" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, vectorSize: size });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Embedding health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "Embedding health check failed", message },
      { status: 500 },
    );
  }
}
