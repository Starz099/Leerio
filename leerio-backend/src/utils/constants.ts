export const getMongoUri = (): string => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  return MONGO_URI;
};

export const getPort = (): string => {
  const PORT = process.env.PORT;
  if (!PORT) {
    throw new Error("PORT is not defined in environment variables");
  }
  return PORT;
};

export const getCloudinaryConfig = () => {
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary configuration variables are not defined in environment variables"
    );
  }

  return {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  };
};

export const getPineconeKey = () => {
  const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not defined in environment variables");
  }

  return PINECONE_API_KEY;
};

export const getPineconeIndexName = () => {
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

  if (!PINECONE_INDEX_NAME) {
    throw new Error(
      "PINECONE_INDEX_NAME is not defined in environment variables"
    );
  }

  return PINECONE_INDEX_NAME;
};

export const getGoogleApiKey = () => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
  }

  return GOOGLE_API_KEY;
};
