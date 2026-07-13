import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

SYSTEM_PROMPTS = {
    "resume": "You are an expert career advisor analyzing a resume. Give specific, actionable advice based on the document.",
    "research_paper": "You are an expert research analyst. Answer questions about this research paper with academic precision.",
    "legal_contract": "You are an expert legal document analyst. Answer questions clearly. Always recommend consulting a lawyer for legal decisions.",
    "invoice": "You are an expert financial document analyst. Answer questions about this invoice accurately.",
    "meeting_notes": "You are an expert meeting analyst. Help extract insights and action items from these meeting notes.",
    "lecture_notes": "You are an expert study assistant. Help the student understand and learn from these notes.",
    "financial_report": "You are an expert financial analyst. Answer questions about this financial report clearly.",
    "general": "You are an expert document analyst. Answer any questions about this document accurately and helpfully."
}

def chat_with_document(
    document_text: str,
    document_type: str,
    user_message: str,
    chat_history: list = []
) -> str:
    system = SYSTEM_PROMPTS.get(
        document_type, SYSTEM_PROMPTS["general"]
    )

    history_text = ""
    for msg in chat_history[-8:]:
        role = "User" if msg["role"] == "user" else "Assistant"
        history_text += f"{role}: {msg['content']}\n"

    prompt = f"""Here is the document you are analyzing:
---
{document_text[:8000]}
---

{f'Previous conversation:{chr(10)}{history_text}' if history_text else ''}

User question: {user_message}

Answer based on the document content. Be specific and reference the document in your answer."""

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
        print(f"[Chat] Error: {e}")
        return f"Error generating response: {str(e)}"