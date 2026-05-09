# RAG-TLC (Retrieval-Augmented Generation)

RAG-TLC is a simple Retrieval-Augmented Generation (RAG) system built with Node.js and TypeScript. It enables users to upload PDF documents, index them into a vector database, and perform context-aware queries using Large Language Models (LLMs).

## 🚀 Features

- **PDF Processing**: Automatic document loading, text splitting, and metadata enrichment.
- **Vector Search**: Efficient document retrieval using **Qdrant** as the vector database.
- **AI-Powered Queries**: Contextualized answers generated using **LangChain** and **OpenAI**.
- **Source Citations**: Every answer includes references to the specific documents and pages used.
- **Streaming Responses**: Real-time answer generation using Server-Sent Events (SSE).
- **Type Safety**: Fully implemented in TypeScript with validation powered by **Zod**.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- A running Qdrant instance
- OpenAI API Key (or Gemini API Key)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rag-tlc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create a `.env` file):
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_key
   QDRANT_URL=your_qdrant_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

- `POST /documents/upload`: Upload and index a PDF file.
- `POST /query`: Query the indexed documents.
- `GET /query/stream`: Query with streaming output (SSE).

## 📄 License

This project is licensed under the [ISC License](LICENSE).
