import { config } from './config.js';
import express from 'express';
import { queryRouter } from './routes/queryRouter.js';
import { documentRouter } from './routes/documentRouter.js';
import { initQdrantCollection } from './services/qdrant.js';
import { existsSync, mkdirSync } from 'fs';

const app = express();
const port = config.server.port;

app.use(express.json())
app.get('/', (_, res) => res.send("RAG TLC is running!"));
app.use('/query', queryRouter);
app.use('/documents', documentRouter);

if(!existsSync(config.uploads.directory)){
  mkdirSync(config.uploads.directory);
  console.log('Upload directory created on: ', config.uploads.directory)
}

async function start() {
  try {
    await initQdrantCollection();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    });
  } catch (error) {
    console.error('Error when initiating server: ', error);
    process.exit(1)
  }
}

start();
