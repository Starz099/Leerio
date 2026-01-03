import mongoose, { type Document, type Model } from "mongoose";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  message: string;
  createdAt: Date;
}

export interface ChatHistoryDocument extends Document {
  owner: string;
  projectId: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

const ChatMessageSchema = new mongoose.Schema<ChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ChatHistorySchema = new mongoose.Schema<ChatHistoryDocument>({
  owner: { type: String, required: true },
  projectId: { type: String, required: true },
  messages: { type: [ChatMessageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

ChatHistorySchema.index({ owner: 1, projectId: 1 }, { unique: true });

export const ChatHistory: Model<ChatHistoryDocument> =
  (mongoose.models.ChatHistory as Model<ChatHistoryDocument>) ||
  mongoose.model<ChatHistoryDocument>("ChatHistory", ChatHistorySchema);

export default ChatHistory;
