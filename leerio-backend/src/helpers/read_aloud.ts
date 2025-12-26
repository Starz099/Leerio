import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import { chatWithLLMwithContext, rephraseQuery } from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";
import { PDFParse } from "pdf-parse";

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

    const pdfData = new PDFParse({ url: project.fileUrl as string });
    const textResult = await pdfData.getText();
    // console.log("Extracted PDF text for read aloud.", textResult);

    // Combine all page text into a single string
    const combinedText = textResult.pages
      .map((page: { text: string; num: number }) => page.text)
      .join("\n\n");

    res.json({ response: combinedText });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
