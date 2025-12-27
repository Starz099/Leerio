import { type Request, type Response } from "express";
import { Readable } from "stream";
import cloudinary from "../utils/cloudinary.js";
import { Project } from "../schema/projects.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// pdf-parse will be dynamically imported when needed
import { PineconeStore } from "@langchain/pinecone";
import { getGoogleEmbeddings } from "../utils/embedding.js";
import { getPineconeIndex } from "../utils/pinecone.js";
import mongoose from "mongoose";
import { Chunks } from "../schema/chunks.js";

export const handleFileUpload = async (req: Request, res: Response) => {
  const file = req.file;
  const username = req.body.username;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);

  try {
    console.log("Uploading file to Cloudinary...");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: file.originalname.split(".")[0] as string,
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }

        console.log("Cloudinary upload complete url: ", result?.url);
        console.log(
          `publicId : ${Date.now()}_${username}_${file.originalname}`
        );
        const projectId = new mongoose.Types.ObjectId().toHexString();
        const createdProject = await Project.create({
          projectId,
          fileUrl: result?.secure_url as string,
          publicId: `${file.originalname}`,
          owner: username,
        });

        console.log("Project created in mongo DB:", createdProject.id);

        // Extract text from PDF via pdf-parse (Node)
        const mod: any = await import("pdf-parse");
        const pdfParse: any = mod.default ?? mod;
        const resp = await fetch(result?.secure_url as string);
        const arrayBuffer = await resp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const extracted = await pdfParse(buffer);

        console.log("Extracted PDF text.");

        // Now split text
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const chunks = await splitter.splitText(extracted.text);
        console.log("Text splitted into chunks:", chunks.length);
        // console.log("Chunks are:");
        // for (const chunk of chunks) {
        //   console.log("Chunk: ", chunk);
        //   console.log(" ");
        // }

        await Chunks.create({
          chunks,
          projectId,
          owner: username,
        });

        console.log("Storing chunks in Pinecone vector DB...");
        const chunkMetadata = chunks.map(() => ({ projectId }));

        await PineconeStore.fromTexts(
          chunks,
          chunkMetadata,
          getGoogleEmbeddings(),
          {
            pineconeIndex: getPineconeIndex(),
          }
        );

        console.log("Chunks stored in Pinecone vector DB.");

        return res.json({
          message: "File uploaded successfully",
          url: result?.secure_url,
          public_id: result?.public_id,
          format: result?.format,
          bytes: result?.bytes,
          width: result?.width,
          height: result?.height,
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  } finally {
    file.buffer = Buffer.alloc(0);
  }
};
