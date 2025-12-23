import { Pinecone } from "@pinecone-database/pinecone";
import { getPineconeIndexName, getPineconeKey } from "./constants.js";

let pineconeIndex: ReturnType<Pinecone["index"]> | null = null;

export const getPineconeIndex = () => {
  if (!pineconeIndex) {
    const pc = new Pinecone({
      apiKey: getPineconeKey(),
    });
    pineconeIndex = pc.index(getPineconeIndexName());
  }
  return pineconeIndex;
};
