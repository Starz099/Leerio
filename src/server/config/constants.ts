const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined in environment variables`);
  }
  return value;
};

export const getMongoUri = (): string => requireEnv("MONGO_URI");

export const getCloudinaryConfig = () => ({
  cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET"),
});

export const getPineconeKey = () => requireEnv("PINECONE_API_KEY");

export const getPineconeIndexName = () => requireEnv("PINECONE_INDEX_NAME");

export const getGoogleApiKey = () => requireEnv("GOOGLE_API_KEY");
