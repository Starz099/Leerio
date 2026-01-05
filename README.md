<div align="center">

# Leerio

AI workspace for talking to your PDFs: upload once, then chat, summarize, and listen to the document with voice controls.

[Live demo](https://leerio.vercel.app)

</div>

## Features

- Upload PDFs to Cloudinary, auto-chunk with LangChain, embed via Google Gemini, and index in Pinecone for fast retrieval.
- Ask questions with context-aware Groq responses; chat history persists per document.
- One-click document summarization with rate-limited batching to avoid provider throttling.
- Read-aloud mode using browser Speech Synthesis with voice selection and progress tracking.
- Clerk-authenticated dashboard with recent uploads, search, and per-document workspace that pairs preview + tools.

## How It Works

1. **Upload**: Users upload a PDF; it is stored on Cloudinary and registered as a project in MongoDB.
2. **Chunk + Embed**: Text is extracted with pdf2json, chunked (1000 chars, 200 overlap), and embedded (Gemini `text-embedding-004`) before being saved to Pinecone with project metadata.
3. **Chat**: Queries are rephrased for clarity, embedded, matched against Pinecone, and answered by Groq Llama 3.1 using only retrieved context; chat history is persisted in MongoDB.
4. **Summarize**: Chunks are processed in small groups with delays to respect rate limits, summarized via Groq, then merged into a final summary.
5. **Read Aloud**: The original PDF text is fetched, sanitized, split into short sentences, and streamed through browser Speech Synthesis with selectable voices.

## Stack

- Next.js 16 (App Router) with React 19, TypeScript, Tailwind.
- Clerk for authentication.
- LangChain (Groq, Google Generative AI embeddings, Pinecone vector store).
- MongoDB via Mongoose for projects, chunks, and chat history.
- Cloudinary for raw PDF storage; pdf2json for extraction.

## Project Layout

```
src/
	app/
		(marketing)/page.tsx        # Landing page with CTA, FAQ, hero
		(app)/[username]/           # Authenticated area (dashboard, projects, settings)
		api/                        # Upload, chat, summary, read-aloud, projects endpoints
	features/
		dashboard/                  # Upload and listings
		workspace/                  # Chat, summary, read-aloud, preview panels
	server/                       # DB models, embeddings, Pinecone, Groq orchestration
```

## Installation

```bash
bun install
```

## Running

```bash
# Dev server
bun run dev

# Production build
bun run build
bun run start

# Lint and format
bun run lint
bun run format
```

By default the app runs at http://localhost:3000.

## API Endpoints (App Router)

- POST `/api/upload` — upload and index a PDF for a user.
- GET `/api/projects?username=` — list projects for the user.
- POST `/api/chat?username=&projectId=&query=` — ask a question with chat history.
- GET `/api/chat/history?username=&projectId=` — fetch chat history.
- POST `/api/chat/clear?username=&projectId=` — clear chat history.
- POST `/api/summary?username=&projectId=` — generate and cache summaries.
- POST `/api/read-aloud?username=&projectId=` — return raw PDF text for TTS.

## Using the App

1. Sign in with Clerk; the landing page redirects signed-in users to their dashboard.
2. Upload a PDF from the dashboard. After processing, it appears in Recent Documents and Projects.
3. Open a document workspace to see the PDF preview alongside Chat, Summarize, and Read Aloud tabs.
4. (Optional) Add a Groq API key in Settings to keep requests client-owned.
5. Clear chat history per document when you need a fresh context.

## Notes

- Pinecone metadata includes `projectId` so queries stay scoped to the active document.
- Summarization batches requests with delays to avoid rate limits while persisting intermediate summaries.
