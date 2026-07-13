import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

DOCUMENT_TYPES = [
    "resume", "research_paper", "legal_contract", "invoice",
    "meeting_notes", "lecture_notes", "financial_report",
    "company_policy", "technical_manual", "project_report",
    "medical_report", "email", "general"
]

def classify_document(text: str) -> dict:
    sample = text[:2000]
    prompt = f"""You are a document classification expert.
Analyze this document and classify it.
Return ONLY a JSON object, no markdown, no explanation:
{{"document_type": "one of the types below", "confidence": "high/medium/low", "reason": "one sentence"}}

Valid types: {', '.join(DOCUMENT_TYPES)}

Document:
{sample}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a JSON-only document classifier. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=200,
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        if result.get("document_type") not in DOCUMENT_TYPES:
            result["document_type"] = "general"
        return result
    except Exception as e:
        print(f"[Classifier] Error: {e}")
        return {
            "document_type": "general",
            "confidence": "low",
            "reason": "Could not classify"
        }