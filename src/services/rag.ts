import { llm } from "./openai.js";
import { searchDocuments } from "./query.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { Response } from 'express'
import type { QueryRequest, RagResponse } from "../types.js";

const PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
  ["system", //System Prompt
    `You are an AI assistant that answer questions based on documents. Use the information retrieved from these documents to generate the most suitable answer.
    Rules:
    - Use only the information present in the documents.
    - If the information is not present answer: "Sorry, I did not found relevant information to properly answer your question"
    - Your answers must be direct and concise.
    - Always mention the sources of the answers in the following format: [1], [2]...
    - Always answer in english.`
  ],
  ["user", //User prompt template
    `
    CONTEXT: 
    {ragContext}
    QUESTION:
    {question}
    ANSWER:
    `]
])

export async function generateRAGResponse({ question, topK = 3 }: QueryRequest): Promise<RagResponse> {
  const searchResults = await searchDocuments({ question, topK });

  if (searchResults.answers.length === 0) {
    return {
      question,
      answer: "Sorry, I wasnt able to find relevant information about your question."
    }
  }

  const ragContext = searchResults.answers.map((item, index) => `[${index + 1}]: ${item.text}`).join('\n\n')

  const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser());

  const answer = await chains.invoke({
    ragContext,
    question
  })

  const sources = searchResults.answers.map((item, index) => ({
    fileName: item.metadata.fileName,
    page: item.metadata.page,
    score: item.score
  }))

  return {
    question,
    answer,
    sources,
  }
}

export async function generateRAGStreamingResponse({ question, topK = 3, res }: QueryRequest & { res: Response }): Promise<void> {
  const searchResults = await searchDocuments({ question, topK });

  if (searchResults.answers.length === 0) {
    res.write(`data: ${JSON.stringify({ answer: "Sorry, I wasnt able to find relevant information about your question." })}\n\n`);
    res.write('data: [DONE]');
    res.end();
    return;
  }

  const sources = searchResults.answers.map((item, index) => ({
    fileName: item.metadata.fileName,
    page: item.metadata.page,
    score: item.score
  }))

  res.write(`data: ${JSON.stringify({ type: "sources", content: sources })}\n\n`);

  const ragContext = searchResults.answers.map((item, index) => `[${index + 1}]: ${item.text}`).join('\n\n')

  const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser());

  const stream = await chains.stream({
    ragContext,
    question
  });

  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ type: "token", content: chunk })} \n\n`)
  }
  res.write('data: [DONE]');
  res.end();
}