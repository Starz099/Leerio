import { NextResponse, type NextRequest } from "next/server";

import { getChatHistory } from "@/server/chatHistory";
import connectDB from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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
    const messages = await getChatHistory(owner, projectId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 },
    );
  }
}
