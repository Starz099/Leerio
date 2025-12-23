import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import { chatWithLLMwithContext, rephraseQuery } from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export const chat = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;
  const q = req.query.query as string;

  console.log("Username:", username);
  console.log("Project ID:", projectId);
  console.log("Request Body:", JSON.parse(q));
  const query: { chatHistory: ChatMessage[]; query: string } = JSON.parse(q);

  try {
    const project = await Project.find({
      owner: username,
      projectId: projectId,
    });
    if (!project || project.length === 0) {
      res.status(404).send("Project not found");
      return;
    }
    // generate a chat message with gemini with context of the chat history.
    const rephrasedQuery = await rephraseQuery(query.chatHistory, query.query);
    console.log("Rephrased Query: ", rephrasedQuery);

    // get embedded query vector for the rephrased query.
    const queryVector = await getGoogleEmbeddings().embedQuery(
      rephrasedQuery as string
    );

    // get chunked data from vector db.
    const searchResults = await getPineconeIndex().query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
      filter: {
        projectId: projectId,
      },
    });

    console.log("Search Results: ", searchResults);

    // send the generated message and chunked data to the llm to get a response.
    const llmResponse = await chatWithLLMwithContext(
      rephrasedQuery as string,
      searchResults
    );

    console.log("LLM Response: ", llmResponse);

    res.json({ response: llmResponse });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
