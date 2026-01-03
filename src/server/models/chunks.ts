import mongoose, { type Document, type Model } from "mongoose";

export interface ChunksDocument extends Document {
  createdAt: Date;
  chunks: string[];
  projectId: string;
  owner: string;
  summaries: string[];
}

const ChunksSchema = new mongoose.Schema<ChunksDocument>({
  createdAt: { type: Date, default: Date.now },
  chunks: { type: [String], required: true },
  projectId: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  summaries: { type: [String], required: true, default: [] },
});

export const Chunks: Model<ChunksDocument> =
  (mongoose.models.Chunks as Model<ChunksDocument>) ||
  mongoose.model<ChunksDocument>("Chunks", ChunksSchema);

export default Chunks;
