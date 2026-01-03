import mongoose, { type Document, type Model } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  projects: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  projects: { type: [mongoose.Types.ObjectId], default: [] },
});

export const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
