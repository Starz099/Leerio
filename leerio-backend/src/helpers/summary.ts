import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import {
  chatWithLLMwithContext,
  rephraseQuery,
  summariseChunks,
  summariseFile,
} from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";
import { Chunks } from "../schema/chunks.js";

export const summary = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;

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
      console.log("Returning cached summaries");
      const summaries: string[] = [];

      for (let i = 0; i < chunks.chunks.length; i += 3) {
        const chunkGroup = chunks.chunks.slice(i, i + 3);

        const res = await summariseChunks(chunkGroup);
        summaries.push(res as string);
      }

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

    const finalSummary = await summariseFile(chunks.summaries);
    console.log("Final Summary:", finalSummary);
    res.json({ response: finalSummary });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
