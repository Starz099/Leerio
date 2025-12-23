import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "./constants.js";

export const initializeCloudinary = () => {
  cloudinary.config(getCloudinaryConfig());
  return cloudinary;
};

export default cloudinary;
