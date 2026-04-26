import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.js";
import { processDocument } from "../services/document.js";
import fs from "node:fs/promises"

export const documentRouter = Router();

documentRouter.post('/upload', uploadMiddleware.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file found." })
    }

    const result = await processDocument(file.path, file.originalname);
    await fs.unlink(file.path);
    res.json(result);
  } catch (error) {
    console.error("Error when processing document", error);
    res.status(500).json({ error: "Error when processing document."})
  }
})