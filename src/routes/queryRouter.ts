import { Router } from "express";
import { generateRAGResponse, generateRAGStreamingResponse } from "../services/rag.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { querySchema } from "../schemas/querySchema.js";

export const queryRouter = Router();

queryRouter.post("/", validate(querySchema), async (req, res) => {
  try {
    const { question, topK } = req.body;
    const response = await generateRAGResponse({ question, topK });
    res.status(200).json(response);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error when processing query." })
  }
})

queryRouter.post("/stream", validate(querySchema), async (req, res) => {
  const { question, topK } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  await generateRAGStreamingResponse({ question, topK, res })

})