import mongoose from "mongoose";
import { getMongoUri } from "./constants.js";

const connectDB = async (): Promise<boolean> => {
  try {
    const MONGO_URI = getMongoUri();
    await mongoose.connect(MONGO_URI);
    console.log("connected to db");
    return true;
  } catch (error) {
    console.error("Error connecting to the database", error);
    return false;
  }
};

export default connectDB;
