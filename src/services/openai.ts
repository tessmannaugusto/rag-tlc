import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { config } from '../config.js';

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: config.openai.apiKey,
  model: 'text-embedding-3-small',
  maxRetries: 2,
  timeout: 10000
})

export const llm = new ChatOpenAI({
  openAIApiKey: config.openai.apiKey,
  model: 'gpt-4o-mini',
  temperature: 0, // para RAG faz sentido deixar sempre 0 pra que ele sempre traga respostas mais exatas
  maxRetries: 2,
  timeout: 20000,
})