import ChatHistory, { type ChatMessage } from "./models/chatHistory";

export const getChatHistory = async (owner: string, projectId: string) => {
  const history = await ChatHistory.findOne({ owner, projectId });
  return history?.messages ?? [];
};

export const clearChatHistory = async (owner: string, projectId: string) => {
  await ChatHistory.findOneAndUpdate(
    { owner, projectId },
    { messages: [], updatedAt: new Date() },
    { upsert: true },
  );
  return true;
};

export const appendChatMessages = async (
  owner: string,
  projectId: string,
  messages: { role: ChatMessage["role"]; message: string }[],
) => {
  const history = await ChatHistory.findOneAndUpdate(
    { owner, projectId },
    {
      $push: { messages: { $each: messages } },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true },
  );

  return history?.messages ?? [];
};
