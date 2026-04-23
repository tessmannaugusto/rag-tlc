import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { v4 as uuidv4 } from "uuid";
import { embeddings } from "./openai.js";
import { qdrantClient } from "./qdrant.js";
import { config } from "../config.js";

interface UploadResponse {
  sucess: boolean;
  documentId: string;
  chunksCount: number;
  message?: string;
}

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
})


export async function processDocument(filePath: string, fileName: string): Promise<UploadResponse> {
  //load document
  const loader = new PDFLoader(filePath);

  const documents = await loader.load();
  if (documents.length === 0) {
    throw new Error("No document found.")
  }


  //split document into chunks
  const chunks = await textSplitter.splitDocuments(documents);
  if (chunks.length === 0) {
    throw new Error("No chunk generated from document.")
  }

  //add metadata to chunks
  const documentId = uuidv4();

  const documentChunksWithMetadata = chunks.map((chunk, index) => ({
    id: uuidv4(),
    text: chunk.pageContent,
    metadata: {
      documentId,
      chunkIndex: index,
      fileName,
      uploadedAt: new Date().toISOString(),
      page: chunk.metadata.loc?.pageNumber
    }

  }))

  //chunk embedding
  const texts = documentChunksWithMetadata.map(chunks => chunks.text);
  const vectors = await embeddings.embedDocuments(texts);

  //store embeddings in vector db

  const data = documentChunksWithMetadata.map((chunk, index) => {
    const vector = vectors[index];
    if (!vector || Array.isArray(vector)) {
      throw new Error("Invalid vector.")
    }
    return {
      id: chunk.id,
      vector,
      payload: {
        text: chunk.text,
        ...chunk.metadata
      }
    }
  })

  await qdrantClient.upsert(config.qdrant.collectionName, {
    points: data,
    wait: true
  })


  //return document result
  return {
    sucess: true,
    documentId: documentId,
    chunksCount: documentChunksWithMetadata.length,
    message: "Success when processing document."
  }
}