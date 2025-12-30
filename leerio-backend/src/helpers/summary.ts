import { type Request, type Response } from "express";
import { summariseChunks, summariseFile } from "../utils/ai.js";
import { Chunks } from "../schema/chunks.js";

/**
 * Utility function to delay execution (for rate limiting)
 * @param ms - milliseconds to wait
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process chunks with rate limiting to avoid API limits
 * @param chunks - array of chunk groups to process
 * @param groq_api_key - API key for Groq
 * @param delayMs - delay between requests in milliseconds (default: 1000ms)
 * @returns array of summaries
 */
async function processSummariesWithRateLimit(
  chunks: string[][],
  groq_api_key: string | undefined,
  delayMs: number = 1000
): Promise<string[]> {
  const summaries: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkGroup = chunks[i];

    try {
      console.log(`Processing chunk group ${i + 1}/${chunks.length}...`);
      const summary = await summariseChunks(
        chunkGroup as string[],
        groq_api_key
      );
      summaries.push(summary as string);

      // Add delay between requests to respect rate limits (except for the last one)
      if (i < chunks.length - 1) {
        console.log(`Waiting ${delayMs}ms before next request...`);
        await delay(delayMs);
      }
    } catch (error) {
      console.error(`Error processing chunk group ${i + 1}:`, error);
      // Continue processing remaining chunks even if one fails
      summaries.push(`[Error summarizing chunk group ${i + 1}]`);

      // Wait a bit longer after an error (exponential backoff)
      if (i < chunks.length - 1) {
        const backoffDelay = delayMs * 2;
        console.log(
          `Error occurred. Waiting ${backoffDelay}ms before retry...`
        );
        await delay(backoffDelay);
      }
    }
  }

  return summaries;
}

export const summary = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;
  const groq_api_key =
    (typeof req.query.api_key === "string" ? req.query.api_key : undefined) ||
    (req.headers["x-api-key"] as string | undefined);

  console.log("Username:", username);
  console.log("Project ID:", projectId);

  try {
    const chunks = await Chunks.findOne({
      projectId: projectId,
    });

    if (!chunks) {
      res.status(404).send("Chunks not found");
      return;
    }

    if (chunks.summaries && chunks.summaries.length == 0) {
      console.log("Generating summaries for chunks...");

      // Group chunks into batches of 4
      const chunkGroups: string[][] = [];
      for (let i = 0; i < chunks.chunks.length; i += 4) {
        chunkGroups.push(chunks.chunks.slice(i, i + 4));
      }

      console.log(`Total chunk groups to process: ${chunkGroups.length}`);

      // Process with rate limiting (1000ms delay between requests)
      const summaries = await processSummariesWithRateLimit(
        chunkGroups,
        groq_api_key,
        5000 // 5 second delay between requests
      );

      console.log("Summaries:", summaries);
      if (summaries.length === 0) {
        res.status(500).send("No summaries generated");
        return;
      }

      chunks.summaries = summaries;
      await chunks.save();
      console.log("Saved summaries to database");
    }

    if (!chunks.summaries || chunks.summaries.length === 0) {
      res.status(500).send("No summaries available");
      return;
    }

    const finalSummary = await summariseFile(chunks.summaries, groq_api_key);
    console.log("Final Summary:", finalSummary);
    res.json({ response: finalSummary });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
