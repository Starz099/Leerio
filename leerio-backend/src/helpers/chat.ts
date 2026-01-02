import { type Request, type Response } from "express";
import { Project } from "../schema/projects.js";
import { chatWithLLMwithContext, rephraseQuery } from "../utils/ai.js";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";
import { appendChatMessages } from "./chat_history.js";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export const chat = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  const projectId = req.query.projectId as string;
  const q = req.query.query as string;
  const groq_api_key =
    (typeof req.query.api_key === "string" ? req.query.api_key : undefined) ||
    (req.headers["x-api-key"] as string | undefined);

  if (!username || !projectId) {
    res.status(400).json({ error: "username and projectId are required" });
    return;
  }

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
    const rephrasedQuery = await rephraseQuery(
      query.chatHistory,
      query.query,
      groq_api_key
    );

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

    // send the generated message and chunked data to the llm to get a response.
    const llmResponse = await chatWithLLMwithContext(
      rephrasedQuery as string,
      searchResults,
      groq_api_key
    );

    const llmText =
      typeof llmResponse === "string"
        ? llmResponse
        : Array.isArray(llmResponse)
        ? JSON.stringify(llmResponse)
        : String(llmResponse);

    const messagesToSave: ChatMessage[] = [
      { role: "user", message: query.query },
      { role: "assistant", message: llmText },
    ];

    const history = await appendChatMessages(
      username,
      projectId,
      messagesToSave
    );

    res.json({ response: llmText, history });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};
