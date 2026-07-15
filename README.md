# 🧠 DocuMind — Multimodal RAG Document Intelligence Platform
**Built by Tanusha Chopra**

---

## What is DocuMind?

DocuMind is a full-stack AI-powered document intelligence platform
that goes far beyond a simple PDF chatbot. Instead of treating every
document the same, DocuMind automatically detects what type of
document you uploaded and switches into the appropriate intelligent
analysis mode — a resume becomes a career advisor, a contract becomes
a legal analyst, an invoice becomes a financial analyzer.

---

## 🌐 Live Demo

**Frontend:** https://documind-delta-sage.vercel.app

**Backend API:** https://documind-production.up.railway.app

---

## The Problem It Solves

People work with dozens of different document types daily — resumes,
contracts, research papers, invoices, lecture notes — but existing
tools treat them all identically. DocuMind understands WHAT the
document is and adapts its entire behavior accordingly.

---

## Core Features

### 🎯 Adaptive Document Intelligence
Auto-detects document type from 13+ categories and switches analysis
mode automatically. Zero manual selection needed.

### 👁️ Multimodal Understanding
Uses Gemini Vision to read scanned PDFs, charts, tables, diagrams and
handwritten content — not just extractable text.

### 🔍 RAG-Powered Chat
Documents are chunked into 500-token segments, embedded using
Sentence-BERT (all-MiniLM-L6-v2), stored in ChromaDB. Every question
retrieves the most semantically relevant chunks before Llama 3
generates a grounded answer.

### 📊 Type-Specific Analysis
Every document gets a completely different structured analysis:
- Resume → ATS score, strengths, missing keywords, career advice
- Contract → risk score, risky clauses, obligations, recommendations
- Research Paper → methodology, contributions, limitations, gaps
- Invoice → vendor details, due dates, payment terms, warnings
- And 9 more document types

### 🔒 Secure Multi-User Architecture
Supabase Auth with email/password and Google OAuth. Row-level security
ensures each user sees only their own documents.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + Tailwind CSS |
| Backend | FastAPI (Python) |
| LLM | Groq API (Llama 3.3 70B) |
| Vision AI | Google Gemini 1.5 Flash |
| Embeddings | Sentence-BERT (all-MiniLM-L6-v2) |
| Vector DB | ChromaDB |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Architecture
Document Upload
↓
Multimodal Parser
PyMuPDF → text extraction
Gemini Vision → scanned/image pages
↓
Document Type Classifier (Groq/Llama 3)
↓
RAG Pipeline
Sentence-BERT → chunk embeddings
ChromaDB → vector storage
↓
Adaptive Analysis Engine (Groq/Llama 3)
Type-specific structured analysis
↓
AI Chat Interface
RAG retrieval → Llama 3 generation

---

## Project Structure
documind/
├── frontend/                 ← Next.js app
│   ├── app/
│   │   ├── page.tsx          ← Landing page
│   │   ├── login/            ← Auth pages
│   │   ├── signup/
│   │   ├── dashboard/        ← Document management
│   │   └── workspace/[id]/   ← Document workspace
│   └── lib/
│       └── supabase.ts
│
└── backend/                  ← FastAPI
├── main.py
├── routes/
│   ├── upload.py
│   ├── analyze.py
│   └── chat.py
└── services/
├── parser.py         ← Multimodal extraction
├── classifier.py     ← Document type detection
├── analyzer.py       ← Type-specific analysis
├── chat_engine.py    ← AI chat
└── rag_engine.py     ← RAG pipeline

---

## Supported Document Types

Resume · Research Paper · Legal Contract · Invoice ·
Meeting Notes · Lecture Notes · Financial Report ·
Company Policy · Technical Manual · Project Report ·
Medical Report · Email · General Documents

---

## What I Learned Building This

- How RAG works in production (chunking strategies,
  embedding models, vector similarity search)
- Why multimodal AI matters for real documents
  (most PDFs have tables, charts, scanned content)
- How to architect a full-stack AI product with
  proper separation of concerns
- Supabase row-level security for multi-user data isolation
- Deploying ML-heavy backends with large model dependencies

---

*DocuMind — Built with 🧠 by Tanusha Chopra*