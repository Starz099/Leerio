import { type Request, type Response } from "express";
import { ChatHistory } from "../schema/chatHistory.js";

export const getChatHistoryHandler = async (req: Request, res: Response) => {
  const owner = req.query.username as string;
  const projectId = req.query.projectId as string;

  if (!owner || !projectId) {
    res.status(400).json({ error: "username and projectId are required" });
    return;
  }

  try {
    const history = await ChatHistory.findOne({ owner, projectId });
    res.json({ messages: history?.messages ?? [] });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

export const clearChatHistoryHandler = async (req: Request, res: Response) => {
  const owner = req.query.username as string;
  const projectId = req.query.projectId as string;

  if (!owner || !projectId) {
    res.status(400).json({ error: "username and projectId are required" });
    return;
  }

  try {
    await ChatHistory.findOneAndUpdate(
      { owner, projectId },
      { messages: [], updatedAt: new Date() },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};

export const appendChatMessages = async (
  owner: string,
  projectId: string,
  messages: { role: "user" | "assistant"; message: string }[]
) => {
  const history = await ChatHistory.findOneAndUpdate(
    { owner, projectId },
    {
      $push: { messages: { $each: messages } },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true }
  );

  return history?.messages ?? [];
};
