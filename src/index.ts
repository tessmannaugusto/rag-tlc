import { config } from './config.js';
import express from 'express';

const app = express();
const port = config.server.port;

app.get('/', (_, res) => res.send("RAG TLC is running!"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
});