import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config.js";


export const qdrantClient = new QdrantClient({
  url: config.qdrant.url,
  apiKey: config.qdrant.apiKey,
})

export async function initQdrantCollection() {
  const collections = await qdrantClient.getCollections();

  const exists = collections.collections.find(c => c.name === config.qdrant.collectionName)

  if (!exists) {
    await qdrantClient.createCollection(config.qdrant.collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine"
      }
    })
    console.log(`Collection ${config.qdrant.collectionName} created on qdrant!`)
  } else {
    console.log("Collection already exists on qdrant.")
  }
}