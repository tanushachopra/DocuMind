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