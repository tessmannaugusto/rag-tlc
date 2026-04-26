import { Router } from "express";
import { generateRAGResponse } from "../services/rag.js";

export const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  try {
    const { question, topK } = req.body;
    const response = await generateRAGResponse({ question, topK });
    res.status(200).json(response);
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Error when processing query."})
  }
})