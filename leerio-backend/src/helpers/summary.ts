import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import { chatWithLLMwithContext, rephraseQuery } from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";


export const summary = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;
  

  console.log("Username:", username);
  console.log("Project ID:", projectId);

  try {
    const project = await Project.find({
      owner: username,
      projectId: projectId,
    });

    if (!project || project.length === 0) {
      res.status(404).send("Project not found");
      return;
    }

    res.json({ response: "placeholder" });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
