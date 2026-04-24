import dotenv from 'dotenv'

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },
  qdrant: {
    url: process.env.QDRANT_URL || "",
    collectionName: process.env.QDRANT_COLLECTION || "",
    apiKey: process.env.QDRANT_API_KEY || ""
  },
  server: {
    port: process.env.PORT || "3000",
  },
  uploads: {
    directory: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: FILE_SIZE_LIMIT_20MB
  }
}