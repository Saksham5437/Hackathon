# Mini NotebookLM 🗒️

A lightweight, production-ready **RAG (Retrieval-Augmented Generation)** backend — a simplified take on Google NotebookLM. Upload documents, chat with them, get summaries.

---

## ⚡ Quick Start

### 1. Clone & enter the directory
```bash
cd mini-notebooklm
```

### 2. Create a virtual environment (recommended)
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up your API key
```bash
# Copy the example env file
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Edit .env and add your Gemini or OpenAI API key
```

### 5. Run the server
```bash
python main.py
```

Server starts at: **http://localhost:5000**
Interactive API docs: **http://localhost:5000/docs**

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server status check |
| `POST` | `/upload` | Upload a document (PDF/TXT/DOCX) |
| `POST` | `/ask` | Ask a question about your docs |
| `POST` | `/summarize` | Summarize uploaded document(s) |
| `GET` | `/files` | List all uploaded files |
| `DELETE` | `/files/{name}` | Delete an uploaded file |
| `GET` | `/session/{id}` | Get chat history for a session |
| `DELETE` | `/session/{id}` | Clear session history |

---

## 📁 Project Structure

```
mini-notebooklm/
├── main.py              # Entire backend (single file)
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variable template
├── .env                 # Your local config (not committed)
├── uploads/             # Auto-created: uploaded files
└── chroma_db/           # Auto-created: vector database
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `gemini` | `gemini` or `openai` |
| `GEMINI_API_KEY` | — | Your Google Gemini API key |
| `OPENAI_API_KEY` | — | Your OpenAI API key |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | HuggingFace embedding model |
| `CHUNK_SIZE` | `800` | Characters per text chunk |
| `CHUNK_OVERLAP` | `100` | Overlap between chunks |
| `TOP_K_CHUNKS` | `5` | Chunks retrieved per query |
| `MAX_HISTORY` | `10` | Max messages kept per session |
| `PORT` | `5000` | Server port |
