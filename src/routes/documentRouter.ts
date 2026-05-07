import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.js";
import { processDocument } from "../services/document.js";
import fs from "node:fs/promises"
import { validate } from "../middlewares/validationMiddleware.js";
import { documentSchema } from "../schemas/documentSchema.js";

export const documentRouter = Router();

documentRouter.post('/upload', uploadMiddleware.single("file"), validate(documentSchema), async (req, res) => {
  try {
    const file = req.file!;
    const result = await processDocument(file.path, file.originalname);
    await fs.unlink(file.path);
    res.json(result);
  } catch (error) {
    console.error("Error when processing document", error);
    res.status(500).json({ error: "Error when processing document."})
  }
})