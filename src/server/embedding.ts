import { GoogleGenAI } from "@google/genai";
import { Embeddings } from "@langchain/core/embeddings";
import { getGoogleApiKey } from "./config/constants";

class GoogleGenAIEmbeddings extends Embeddings {
  private client: GoogleGenAI;
  private model: string;
  private outputDimensionality: number;

  constructor(model = "gemini-embedding-001", outputDimensionality = 768) {
    super({});
    this.client = new GoogleGenAI({ apiKey: getGoogleApiKey() });
    this.model = model;
    this.outputDimensionality = outputDimensionality;
  }

  async embedQuery(text: string): Promise<number[]> {
    const response = await this.client.models.embedContent({
      model: this.model,
      contents: [text],
      config: {
        outputDimensionality: this.outputDimensionality,
      },
    });
    return response.embeddings?.[0]?.values ?? [];
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const response = await this.client.models.embedContent({
      model: this.model,
      contents: documents,
      config: {
        outputDimensionality: this.outputDimensionality,
      },
    });

    return documents.map(
      (_, index) => response.embeddings?.[index]?.values ?? [],
    );
  }
}

let googleEmbeddings: GoogleGenAIEmbeddings | null = null;

export const getGoogleEmbeddings = () => {
  if (!googleEmbeddings) {
    googleEmbeddings = new GoogleGenAIEmbeddings("gemini-embedding-001", 768);
  }
  return googleEmbeddings;
};

export default getGoogleEmbeddings;
