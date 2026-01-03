import { NextResponse, type NextRequest } from "next/server";
import PDFParser from "pdf2json";

import connectDB from "@/server/db";
import Project from "@/server/models/project";

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
  const username = req.nextUrl.searchParams.get("username");
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!username || !projectId) {
    return NextResponse.json(
      { error: "username and projectId are required" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const project = await Project.findOne({ owner: username, projectId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const pdfResponse = await fetch(project.fileUrl as string);

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download PDF" },
        { status: 502 },
      );
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsedText = await parsePdfBufferToText(buffer);

    if (!parsedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 422 },
      );
    }

    return NextResponse.json({ response: parsedText });
  } catch (error) {
    console.error("Error reading PDF:", error);
    return NextResponse.json(
      { error: "Failed to read document" },
      { status: 500 },
    );
  }
}
