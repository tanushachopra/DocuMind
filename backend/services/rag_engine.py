import os
import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

_embedding_model = None
_chroma_client = None


def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        print("[RAG] Loading Sentence-BERT...")
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path="./chroma_db")
    return _chroma_client


def chunk_text(text: str, chunk_size: int = 500,
               overlap: int = 50) -> list:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def index_document(doc_id: str, text: str) -> dict:
    try:
        chunks = chunk_text(text)
        if not chunks:
            return {"success": False, "error": "No chunks"}

        print(f"[RAG] Indexing {len(chunks)} chunks for doc {doc_id}")
        model = get_embedding_model()
        embeddings = model.encode(chunks, show_progress_bar=False)

        client_db = get_chroma_client()
        collection_name = f"doc_{doc_id.replace('-', '_')}"

        try:
            client_db.delete_collection(collection_name)
        except Exception:
            pass

        collection = client_db.create_collection(name=collection_name)
        collection.add(
            documents=chunks,
            embeddings=embeddings.tolist(),
            ids=[f"chunk_{i}" for i in range(len(chunks))],
            metadatas=[{"chunk_index": i} for i in range(len(chunks))]
        )

        print(f"[RAG] Successfully indexed {len(chunks)} chunks")
        return {"success": True, "chunks_indexed": len(chunks)}

    except Exception as e:
        print(f"[RAG] Indexing error: {e}")
        return {"success": False, "error": str(e)}


def retrieve_relevant_chunks(doc_id: str, query: str,
                              top_k: int = 5) -> list:
    try:
        collection_name = f"doc_{doc_id.replace('-', '_')}"
        client_db = get_chroma_client()
        collection = client_db.get_collection(collection_name)

        model = get_embedding_model()
        query_embedding = model.encode([query])[0].tolist()

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, collection.count())
        )

        chunks = results["documents"][0] if results["documents"] else []
        print(f"[RAG] Retrieved {len(chunks)} chunks")
        return chunks

    except Exception as e:
        print(f"[RAG] Retrieval error: {e}")
        return []


SYSTEM_PROMPTS = {
    "resume": "You are an expert career advisor. Answer based on the resume provided.",
    "research_paper": "You are an expert research analyst. Answer with academic precision.",
    "legal_contract": "You are an expert legal analyst. Always recommend consulting a lawyer.",
    "invoice": "You are an expert financial analyst. Answer accurately.",
    "lecture_notes": "You are an expert study assistant. Help the student learn.",
    "general": "You are an expert document analyst. Answer helpfully."
}


def rag_chat(
    doc_id: str,
    query: str,
    document_type: str,
    chat_history: list = [],
    full_text: str = "",
    estimated_tokens: int = 0
) -> str:
    use_rag = estimated_tokens > 100000

    if use_rag:
        print(f"[RAG] Using RAG pipeline")
        relevant_chunks = retrieve_relevant_chunks(doc_id, query, top_k=5)
        if relevant_chunks:
            context = "\n\n---\n\n".join(relevant_chunks)
        else:
            context = full_text[:8000]
    else:
        print(f"[RAG] Using direct context")
        context = full_text[:8000]

    system = SYSTEM_PROMPTS.get(document_type, SYSTEM_PROMPTS["general"])

    history_text = ""
    for msg in chat_history[-8:]:
        role = "User" if msg["role"] == "user" else "Assistant"
        history_text += f"{role}: {msg['content']}\n"

    prompt = f"""Document content:
---
{context}
---

{f'Previous conversation:{chr(10)}{history_text}' if history_text else ''}

User: {query}

Answer based on the document. Be specific and helpful."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[RAG] Generation error: {e}")
        return f"Error: {str(e)}"