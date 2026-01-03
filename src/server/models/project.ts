import mongoose, { type Document, type Model } from "mongoose";

export interface ProjectDocument extends Document {
  createdAt: Date;
  projectId: string;
  fileUrl: string;
  owner: string;
  publicId: string;
}

const ProjectSchema = new mongoose.Schema<ProjectDocument>({
  createdAt: { type: Date, default: Date.now },
  projectId: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  owner: { type: String, required: true },
  publicId: { type: String, required: true },
});

export const Project: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument>) ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
