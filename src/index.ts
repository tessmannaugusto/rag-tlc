// import { config } from './config.js';
// import express from 'express';

import { searchDocuments } from "./services/query.js";

// const app = express();
// const port = config.server.port;

// app.get('/', (_, res) => res.send("RAG TLC is running!"));

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`)
// });

async function main(){
  console.log("Starting the application...");

  try {
    console.log("searching the documents...");
    const result = await searchDocuments({
      question: "qual a receita liquida da nike em 2022?",
      topK: 3
    })

    console.log("Search result:", result)
  } catch (error) {
    process.exit(1)
  }
};

main();