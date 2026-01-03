import mongoose from "mongoose";
import { getMongoUri } from "./config/constants";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

const connectDB = async (): Promise<typeof mongoose> => {
  if (global._mongooseConnection) {
    return global._mongooseConnection;
  }

  const uri = getMongoUri();
  global._mongooseConnection = mongoose.connect(uri).catch((error) => {
    global._mongooseConnection = undefined;
    throw error;
  });

  return global._mongooseConnection;
};

export default connectDB;
