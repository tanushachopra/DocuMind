from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_engine import rag_chat

router = APIRouter()

class ChatRequest(BaseModel):
    doc_id: str
    document_text: str
    document_type: str
    message: str
    estimated_tokens: int = 0
    chat_history: list = []

@router.post("/")
async def chat(request: ChatRequest):
    """
    Chat with document using RAG pipeline.
    Automatically decides between direct context
    and RAG retrieval based on document size.
    """
    if not request.message:
        raise HTTPException(
            status_code=400,
            detail="Message is required."
        )

    response = rag_chat(
        doc_id=request.doc_id,
        query=request.message,
        document_type=request.document_type,
        chat_history=request.chat_history,
        full_text=request.document_text,
        estimated_tokens=request.estimated_tokens
    )

    return {"response": response}