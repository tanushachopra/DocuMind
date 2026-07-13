from fastapi import APIRouter, UploadFile, File, HTTPException
from services.parser import get_document_metadata
from services.classifier import classify_document
from services.rag_engine import index_document
import os
import shutil
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = [".pdf", ".docx", ".doc", ".txt",
                 ".jpg", ".jpeg", ".png", ".webp"]

@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload document → extract text (multimodal) →
    classify → index in ChromaDB (RAG) → return results
    """
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {ext} not supported."
        )

    # Save file
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text (multimodal)
    print(f"[Upload] Extracting text from {file.filename}")
    metadata = get_document_metadata(file_path)

    if not metadata["text"]:
        raise HTTPException(
            status_code=400,
            detail="Could not extract content from document."
        )

    # Classify document type
    print(f"[Upload] Classifying document")
    classification = classify_document(metadata["text"])

    # Index in ChromaDB for RAG
    print(f"[Upload] Indexing in ChromaDB for RAG")
    rag_result = index_document(file_id, metadata["text"])

    return {
        "file_id": file_id,
        "file_name": file.filename,
        "document_type": classification["document_type"],
        "confidence": classification["confidence"],
        "reason": classification["reason"],
        "word_count": metadata["word_count"],
        "estimated_tokens": metadata["estimated_tokens"],
        "total_pages": metadata["total_pages"],
        "used_vision": metadata["used_vision"],
        "needs_rag": metadata["needs_rag"],
        "rag_indexed": rag_result.get("success", False),
        "chunks_indexed": rag_result.get("chunks_indexed", 0),
        "full_text": metadata["text"]
    }