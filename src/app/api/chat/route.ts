import { NextResponse, type NextRequest } from "next/server";

import { appendChatMessages } from "@/server/chatHistory";
import connectDB from "@/server/db";
import { chatWithLLMwithContext, rephraseQuery } from "@/server/ai";
import getGoogleEmbeddings from "@/server/embedding";
import Project from "@/server/models/project";
import getPineconeIndex from "@/server/pinecone";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  const projectId = searchParams.get("projectId");
  const queryPayload = searchParams.get("query");
  const groq_api_key =
    searchParams.get("api_key") ?? req.headers.get("x-api-key") ?? undefined;

  if (!username || !projectId || !queryPayload) {
    return NextResponse.json(
      { error: "username, projectId, and query are required" },
      { status: 400 },
    );
  }

  let parsedQuery: { chatHistory: ChatMessage[]; query: string };
  try {
    parsedQuery = JSON.parse(queryPayload) as {
      chatHistory: ChatMessage[];
      query: string;
    };
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid query payload" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const project = await Project.findOne({ owner: username, projectId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const rephrasedQuery = await rephraseQuery(
      parsedQuery.chatHistory ?? [],
      parsedQuery.query,
      groq_api_key ?? undefined,
    );

    const queryVector = await getGoogleEmbeddings().embedQuery(
      rephrasedQuery as string,
    );

    const searchResults = await getPineconeIndex().query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
      filter: {
        projectId,
      },
    });

    const llmResponse = await chatWithLLMwithContext(
      rephrasedQuery as string,
      searchResults,
      groq_api_key ?? undefined,
    );

    const llmText =
      typeof llmResponse === "string"
        ? llmResponse
        : Array.isArray(llmResponse)
          ? JSON.stringify(llmResponse)
          : String(llmResponse);

    const messagesToSave: ChatMessage[] = [
      { role: "user", message: parsedQuery.query },
      { role: "assistant", message: llmText },
    ];

    const history = await appendChatMessages(
      username,
      projectId,
      messagesToSave,
    );

    return NextResponse.json({ response: llmText, history });
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 },
    );
  }
}
