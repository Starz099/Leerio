import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import { chatWithLLMwithContext, rephraseQuery } from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";
// pdf-parse will be dynamically imported when needed

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export const getTextOfPdf = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;

  try {
    const project = await Project.findOne({
      owner: username,
      projectId: projectId,
    });
    if (!project) {
      res.status(404).send("Project not found");
      return;
    }

    const mod: any = await import("pdf-parse");
    const pdfParse: any = mod.default ?? mod;
    const resp = await fetch(project.fileUrl as string);
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const textResult = await pdfParse(buffer);
    // Combine all text into a single string
    const combinedText = textResult.text;

    res.json({ response: combinedText });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
