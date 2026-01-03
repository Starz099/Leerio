import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { Readable } from "stream";
import PDFParser from "pdf2json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import type { UploadApiResponse } from "cloudinary";

import connectDB from "@/server/db";
import getCloudinary from "@/server/cloudinary";
import getGoogleEmbeddings from "@/server/embedding";
import { Chunks } from "@/server/models/chunks";
import Project from "@/server/models/project";
import getPineconeIndex from "@/server/pinecone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const parsePdfBufferToText = async (buffer: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!process.env.PDF2JSON_DISABLE_LOGS) {
      process.env.PDF2JSON_DISABLE_LOGS = "1";
    }

    const parser = new PDFParser(undefined, true);

    parser.on("pdfParser_dataError", (err: any) => {
      const error = err?.parserError ?? err ?? new Error("Failed to parse PDF");
      reject(error);
    });

    const decodeTextRun = (val?: string) => {
      if (!val) return "";
      try {
        return decodeURIComponent(val);
      } catch (err) {
        console.warn("decodeURIComponent failed for text run", err);
        return val;
      }
    };

    const extractTextFromPdfData = (data: any) => {
      const pages = Array.isArray(data?.Pages) ? data.Pages : [];
      const pageTexts = pages.map((page: any) => {
        const texts = Array.isArray(page?.Texts) ? page.Texts : [];
        return texts
          .map((t: any) => {
            const runs = Array.isArray(t?.R) ? t.R : [];
            return runs.map((r: any) => decodeTextRun(r?.T)).join("");
          })
          .join(" ");
      });
      return pageTexts.join("\n\n");
    };

    parser.on("pdfParser_dataReady", (data: any) => {
      const text = extractTextFromPdfData(data);
      resolve(text || "");
    });

    parser.parseBuffer(buffer);
  });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf");
  const username = formData.get("username")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await connectDB();
    const cloudinary = getCloudinary();

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: file.name.split(".")[0] ?? undefined,
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve(result as UploadApiResponse);
          },
        );

        Readable.from(buffer).pipe(uploadStream);
      },
    );

    const projectId = new mongoose.Types.ObjectId().toHexString();
    await Project.create({
      projectId,
      fileUrl: uploadResult.secure_url as string,
      publicId: `${file.name}`,
      owner: username,
    });

    const parsedText = await parsePdfBufferToText(buffer);

    if (!parsedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 422 },
      );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const rawChunks = await splitter.splitText(parsedText);
    const chunks = rawChunks.map((chunk) => chunk.trim()).filter(Boolean);

    await Chunks.create({
      chunks,
      projectId,
      owner: username,
    });

    const chunkMetadata = chunks.map((chunk) => ({ projectId, text: chunk }));

    await PineconeStore.fromTexts(
      chunks,
      chunkMetadata,
      getGoogleEmbeddings(),
      {
        pineconeIndex: getPineconeIndex(),
      },
    );

    return NextResponse.json({
      message: "File uploaded successfully",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
