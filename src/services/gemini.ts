import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { config } from "../config.js";

export const geminiLlm = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  apiKey: config.gemini.apiKey,
  maxOutputTokens: 2048,
});

export const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.gemini.apiKey,
  modelName: "text-embedding-004",
})