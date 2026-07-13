from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.analyzer import analyze_document

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
    document_type: str

@router.post("/")
async def analyze(request: AnalyzeRequest):
    """
    Analyze a document based on its type.
    """
    if not request.text:
        raise HTTPException(
            status_code=400,
            detail="Document text is required."
        )

    result = analyze_document(request.text, request.document_type)
    return result