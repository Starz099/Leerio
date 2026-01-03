import { NextResponse, type NextRequest } from "next/server";

import { summariseChunks, summariseFile } from "@/server/ai";
import connectDB from "@/server/db";
import Chunks from "@/server/models/chunks";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const processSummariesWithRateLimit = async (
  chunks: string[][],
  groq_api_key: string | undefined,
  delayMs: number = 1000,
): Promise<string[]> => {
  const summaries: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkGroup = chunks[i];

    try {
      console.log(`Processing chunk group ${i + 1}/${chunks.length}...`);
      const summary = await summariseChunks(chunkGroup, groq_api_key);
      summaries.push(summary as string);

      if (i < chunks.length - 1) {
        console.log(`Waiting ${delayMs}ms before next request...`);
        await delay(delayMs);
      }
    } catch (error) {
      console.error(`Error processing chunk group ${i + 1}:`, error);
      summaries.push(`[Error summarizing chunk group ${i + 1}]`);

      if (i < chunks.length - 1) {
        const backoffDelay = delayMs * 2;
        console.log(
          `Error occurred. Waiting ${backoffDelay}ms before retry...`,
        );
        await delay(backoffDelay);
      }
    }
  }

  return summaries;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const projectId = req.nextUrl.searchParams.get("projectId");
  const groq_api_key =
    req.nextUrl.searchParams.get("api_key") ??
    req.headers.get("x-api-key") ??
    undefined;

  if (!username || !projectId) {
    return NextResponse.json(
      { error: "username and projectId are required" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const chunks = await Chunks.findOne({ projectId });

    if (!chunks) {
      return NextResponse.json({ error: "Chunks not found" }, { status: 404 });
    }

    if (chunks.summaries && chunks.summaries.length === 0) {
      console.log("Generating summaries for chunks...");

      const chunkGroups: string[][] = [];
      for (let i = 0; i < chunks.chunks.length; i += 4) {
        chunkGroups.push(chunks.chunks.slice(i, i + 4));
      }

      console.log(`Total chunk groups to process: ${chunkGroups.length}`);

      const summaries = await processSummariesWithRateLimit(
        chunkGroups,
        groq_api_key,
        5000,
      );

      console.log("Summaries:", summaries);
      if (summaries.length === 0) {
        return NextResponse.json(
          { error: "No summaries generated" },
          { status: 500 },
        );
      }

      chunks.summaries = summaries;
      await chunks.save();
      console.log("Saved summaries to database");
    }

    if (!chunks.summaries || chunks.summaries.length === 0) {
      return NextResponse.json(
        { error: "No summaries available" },
        { status: 500 },
      );
    }

    const finalSummary = await summariseFile(chunks.summaries, groq_api_key);
    console.log("Final Summary:", finalSummary);
    return NextResponse.json({ response: finalSummary });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
