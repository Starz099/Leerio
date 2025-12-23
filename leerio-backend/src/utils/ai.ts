import { ChatGroq } from "@langchain/groq";
import type {
  QueryResponse,
  RecordMetadata,
} from "@pinecone-database/pinecone";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export async function rephraseQuery(chatHistory: ChatMessage[], query: string) {
  const rephraseModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    maxRetries: 2,
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
  console.log("Rephrased message:", result);
  return result;
}

export async function chatWithLLMwithContext(
  rephrasedQuery: string,
  contextChunks: QueryResponse<RecordMetadata>
) {
  const rephraseModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    maxRetries: 2,
  });

  const systemPrompt = `You are a helpful assistant that answers user questions based on provided context chunks from documents.
Your task is to use the context chunks to provide accurate and relevant answers to the user's questions.

Guidelines:
1. Use only the information provided in the context chunks to answer the question
2. If the context does not contain enough information, respond with "I don't know"
3. Make your answers clear, concise, and relevant to the question

Context Chunks:
${contextChunks.matches
  .map(
    (match, index) =>
      `Chunk ${index + 1} (ID: ${match.id}): ${match.metadata?.text || ""}`
  )
  .join("\n\n")}

Now answer the following question using the above context:`;

  const aiMsg = await rephraseModel.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: rephrasedQuery },
  ]);

  const result = aiMsg.content;
  return result;
}
