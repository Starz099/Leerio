import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatHistorySchema = new mongoose.Schema({
  owner: { type: String, required: true },
  projectId: { type: String, required: true },
  messages: { type: [ChatMessageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

ChatHistorySchema.index({ owner: 1, projectId: 1 }, { unique: true });

export const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
