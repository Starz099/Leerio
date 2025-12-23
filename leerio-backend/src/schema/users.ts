import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  projects: { type: [mongoose.Types.ObjectId], default: [] },
});

export const User = mongoose.model("User", userSchema);
