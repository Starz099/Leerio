import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  projectId: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  owner: { type: String, required: true },
  publicId: { type: String, required: true },
});

export const Project = mongoose.model("Project", ProjectSchema);
