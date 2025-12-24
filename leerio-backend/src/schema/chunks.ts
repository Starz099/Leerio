import mongoose from "mongoose";

const ChunksSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  chunks: { type: [String], required: true },
  projectId: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  summaries: { type: [String], required: true, default: [] },
});

export const Chunks = mongoose.model("Chunks", ChunksSchema);
