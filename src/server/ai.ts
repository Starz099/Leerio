import { ChatGroq } from "@langchain/groq";
import type {
  QueryResponse,
  RecordMetadata,
} from "@pinecone-database/pinecone";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

const resolveGroqApiKey = (candidate?: string): string | undefined => {
  const v = candidate?.trim();
  if (!v || v.toLowerCase() === "null" || v.toLowerCase() === "undefined") {
    const envKey = process.env.GROQ_API_KEY?.trim();
    return envKey && envKey.length > 0 ? envKey : undefined;
  }
  return v;
};

export async function rephraseQuery(
  chatHistory: ChatMessage[],
  query: string,
  groq_api_key?: string,
) {
  const api_key = resolveGroqApiKey(groq_api_key);
  const rephraseModel = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    maxRetries: 2,
    ...(api_key ? { apiKey: api_key } : {}),
  });

  const conversationContext = chatHistory
    .map((msg) => `${msg.role}: ${msg.message}`)
    .join("\n");

  const systemPrompt = `You are a helpful assistant that rephrases user questions to be more clear and contextually complete.
Your task is to take a user's question and rephrase it to include relevant context from the conversation history.

Guidelines:
1. Preserve the original intent and meaning of the question
2. Include necessary context from previous messages to make the question self-contained
3. Make the rephrased question clear, concise, and unambiguous
4. If the question already has enough context, keep it mostly unchanged
5. Only output the rephrased question, nothing else

Conversation History:
${conversationContext}

Now rephrase the following question to be more clear and contextually complete:`;

  const aiMsg = await rephraseModel.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: query },
  ]);

  const result = aiMsg.content;
  return result;
}

export async function chatWithLLMwithContext(
  rephrasedQuery: string,
  contextChunks: QueryResponse<RecordMetadata>,
  groq_api_key?: string,
) {
  const api_key = resolveGroqApiKey(groq_api_key);

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    maxRetries: 2,
    ...(api_key ? { apiKey: api_key } : {}),
  });

  const systemPrompt = `You are a helpful assistant that answers user questions based on provided context chunks from the pdf uploaded by the user.
  Also if the user asks for the summary, just tell them to check out the summary section.
Your task is to use the context chunks to provide accurate and relevant answers to the user's questions.

Guidelines:
1. Use only the information provided in the context chunks to answer the question
2. If the context does not contain enough information, respond with "I don't know"
3. Make your answers clear, concise, and relevant to the question
4. Also never mention any source or chunk ids in your answer.

Context Chunks:
${contextChunks.matches
  .map(
    (match, index) =>
      `Chunk ${index + 1} (ID: ${match.id}): ${match.metadata?.text || ""}`,
  )
  .join("\n\n")}

Now answer the following question using the above context:`;

  const aiMsg = await model.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: rephrasedQuery },
  ]);

  const result = aiMsg.content;
  return result;
}

export async function summariseChunks(chunks: string[], groq_api_key?: string) {
  const api_key = resolveGroqApiKey(groq_api_key);

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    maxRetries: 2,
    ...(api_key ? { apiKey: api_key } : {}),
  });

  const systemPrompt = `You are a helpful assistant that summarizes text chunks into concise summaries.
Your task is to read the provided text chunks and generate a brief summary that captures the main points.
give back only 2 bullet points.

Guidelines:
1. Provide a concise summary of the key information from the chunks
2. Do not hallucinate or add information not present in the chunks
3. Keep the summary clear and to the point

Format: - Bullet Point 1
- Bullet Point 2
- Bullet Point 3
`;

  const aiMsg = await model.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Here are the text chunks to summarize:\n\n${chunks
        .map((chunk, index) => `Chunk ${index + 1}:\n${chunk}`)
        .join("\n\n")}`,
    },
  ]);

  const result = aiMsg.content;
  return result;
}

export async function summariseFile(
  summaries: string[],
  groq_api_key?: string,
) {
  const api_key = resolveGroqApiKey(groq_api_key);

  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    maxRetries: 2,
    ...(api_key ? { apiKey: api_key } : {}),
  });

  const systemPrompt = `You are a helpful assistant that summarizes multiple summaries into a concise overall summary.
Your task is to read the provided summaries and generate a brief overall summary that captures the main points.
output only summary generated.
Guidelines:
1. Provide a concise overall summary of the key information from the summaries
2. Do not hallucinate or add information not present in the summaries
3. Keep the summary clear and to the point
`;

  const aiMsg = await model.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Here are the summaries to summarize:\n\n${summaries
        .map((summary, index) => `Summary ${index + 1}:\n${summary}`)
        .join("\n\n")}`,
    },
  ]);

  const result = aiMsg.content;
  return result;
}
