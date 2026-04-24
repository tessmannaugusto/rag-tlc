// import { config } from './config.js';
// import express from 'express';

import { initQdrantCollection } from "./services/qdrant.js";
import { processDocument } from "./services/document.js";
import path from "node:path"

// const app = express();
// const port = config.server.port;

// app.get('/', (_, res) => res.send("RAG TLC is running!"));

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`)
// });

async function main(){
  console.log("Starting the application...");

  try {
    console.log("starting qdrant collection...");
    await initQdrantCollection();
    const pdfPath = path.resolve("./uploads/NIKE10K2023.pdf");
    const fileName = "NIKE10K2023.pdf";
    console.log(`processing doc: ${fileName}`);

    const startTime = Date.now();
    const result = await processDocument(pdfPath, fileName)
    const duration = Date.now() - startTime;

    console.log(`Process finished in ${duration} ms`);
    console.log(`Document id: ${result.documentId}`);
    console.log(`Number of chunks ${result.chunksCount}`);
  } catch (error) {
    console.error(`Error when processing document. Error ${error}`);
    process.exit(1)
  }
};

// main();