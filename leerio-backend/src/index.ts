import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { upload } from "./utils/multer.js";
import { handleFileUpload } from "./helpers/upload_file.js";
import connectDB from "./utils/db.js";
import { getPort } from "./utils/constants.js";
import { initializeCloudinary } from "./utils/cloudinary.js";
import { getProjects } from "./helpers/getProjects.js";
import { chat } from "./helpers/chat.js";
import { summary } from "./helpers/summary.js";
import { getTextOfPdf } from "./helpers/read_aloud.js";
import {
  clearChatHistoryHandler,
  getChatHistoryHandler,
} from "./helpers/chat_history.js";

// Initialize Cloudinary with environment variables
initializeCloudinary();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/upload", upload.single("pdf"), handleFileUpload);

app.get("/projects", getProjects);
app.post("/chat", chat);
app.get("/chat/history", getChatHistoryHandler);
app.post("/chat/clear", clearChatHistoryHandler);
app.post("/read-aloud", getTextOfPdf);
app.post("/summary", summary);

if (await connectDB()) {
  const PORT = getPort();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
