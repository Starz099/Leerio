import { NextResponse, type NextRequest } from "next/server";

import { clearChatHistory } from "@/server/chatHistory";
import connectDB from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("username");
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!owner || !projectId) {
    return NextResponse.json(
      { error: "username and projectId are required" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    await clearChatHistory(owner, projectId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 },
    );
  }
}
