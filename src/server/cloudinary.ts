import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "./config/constants";

let initialized = false;

export const getCloudinary = () => {
  if (!initialized) {
    cloudinary.config(getCloudinaryConfig());
    initialized = true;
  }
  return cloudinary;
};

export default getCloudinary;
