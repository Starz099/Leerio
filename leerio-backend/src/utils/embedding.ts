import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { getGoogleApiKey } from "./constants.js";

let googleEmbeddings: GoogleGenerativeAIEmbeddings | null = null;

export const getGoogleEmbeddings = () => {
  if (!googleEmbeddings) {
    googleEmbeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: getGoogleApiKey(),
      model: "text-embedding-004",
    });
  }
  return googleEmbeddings;
};
