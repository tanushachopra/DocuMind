import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

ANALYSIS_PROMPTS = {
    "resume": """You are an expert career advisor and ATS specialist.
Analyze this resume and return ONLY valid JSON with exactly these keys:
{
  "summary": "2-3 sentence executive summary",
  "ats_score": 85,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "skill_gaps": ["gap1", "gap2"],
  "improvements": ["improvement1", "improvement2"],
  "certifications": ["cert1", "cert2"],
  "observations": ["observation1", "observation2"],
  "career_recommendation": "one paragraph of career advice"
}""",

    "research_paper": """You are an expert research analyst.
Analyze this research paper and return ONLY valid JSON with exactly these keys:
{
  "summary": "2-3 sentence executive summary",
  "research_objective": "what problem does this solve",
  "methodology": "how did they do it",
  "key_results": ["result1", "result2"],
  "novel_contributions": ["contribution1", "contribution2"],
  "limitations": ["limitation1", "limitation2"],
  "future_scope": ["future1", "future2"],
  "quality_score": 80,
  "observations": ["observation1"],
  "simplified_explanation": "explain to a non-expert in 2 sentences"
}""",

    "legal_contract": """You are an expert legal document analyst.
Analyze this legal document and return ONLY valid JSON with exactly these keys:
{
  "summary": "plain English summary in 2-3 sentences",
  "document_type": "what kind of legal document",
  "key_clauses": ["clause1", "clause2"],
  "risky_clauses": ["risk1", "risk2"],
  "obligations": ["obligation1", "obligation2"],
  "termination_conditions": ["condition1"],
  "important_dates": ["date1"],
  "risk_score": 50,
  "observations": ["observation1", "observation2"],
  "recommendation": "should they sign this - one paragraph"
}""",

    "invoice": """You are an expert financial document analyst.
Analyze this invoice and return ONLY valid JSON with exactly these keys:
{
  "summary": "brief invoice summary",
  "vendor_name": "name of vendor",
  "invoice_number": "invoice number",
  "invoice_date": "date of invoice",
  "due_date": "payment due date",
  "total_amount": "total amount due",
  "line_items": ["item1", "item2"],
  "payment_terms": "payment terms",
  "observations": ["warning1", "warning2"],
  "financial_highlights": ["highlight1"]
}""",

    "meeting_notes": """You are an expert meeting analyst.
Analyze these meeting notes and return ONLY valid JSON with exactly these keys:
{
  "summary": "brief meeting summary",
  "date": "meeting date if mentioned",
  "attendees": ["person1", "person2"],
  "decisions": ["decision1", "decision2"],
  "action_items": ["action1", "action2"],
  "pending_items": ["pending1"],
  "important_deadlines": ["deadline1"],
  "observations": ["observation1"],
  "next_steps": ["step1", "step2"]
}""",

    "lecture_notes": """You are an expert educational content analyst.
Analyze these lecture notes and return ONLY valid JSON with exactly these keys:
{
  "summary": "brief chapter summary",
  "main_topics": ["topic1", "topic2"],
  "key_concepts": ["concept1", "concept2"],
  "definitions": {"term1": "definition1"},
  "important_formulas": ["formula1"],
  "revision_notes": ["note1", "note2"],
  "exam_questions": ["question1", "question2"],
  "observations": ["observation1"],
  "difficulty_level": "easy/medium/hard"
}""",

    "financial_report": """You are an expert financial analyst.
Analyze this financial report and return ONLY valid JSON with exactly these keys:
{
  "summary": "executive financial summary",
  "period": "time period covered",
  "revenue": "total revenue if mentioned",
  "profit_loss": "profit or loss figure",
  "key_metrics": ["metric1", "metric2"],
  "trends": ["trend1", "trend2"],
  "risks": ["risk1", "risk2"],
  "opportunities": ["opportunity1"],
  "observations": ["observation1"],
  "recommendation": "financial health assessment"
}""",

    "general": """You are an expert document analyst.
Analyze this document and return ONLY valid JSON with exactly these keys:
{
  "summary": "2-3 sentence summary",
  "document_purpose": "what is this document for",
  "key_points": ["point1", "point2", "point3"],
  "important_information": ["info1", "info2"],
  "action_items": ["action1"],
  "observations": ["observation1", "observation2"],
  "recommendation": "what should the reader do with this"
}"""
}

def analyze_document(text: str, document_type: str) -> dict:
    prompt_template = ANALYSIS_PROMPTS.get(
        document_type, ANALYSIS_PROMPTS["general"]
    )

    full_prompt = f"""{prompt_template}

Return ONLY valid JSON. No markdown. No explanation. No extra text.

Document:
{text[:8000]}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a JSON-only document analyst. "
                               "Always return valid JSON and nothing else."
                },
                {"role": "user", "content": full_prompt}
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"```json|```", "", raw).strip()

        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            result = json.loads(match.group(0))
            result["document_type"] = document_type
            return result

        return {
            "document_type": document_type,
            "summary": "Analysis complete but could not parse response",
            "error": "JSON parse failed"
        }

    except Exception as e:
        print(f"[Analyzer] Error: {e}")
        return {
            "document_type": document_type,
            "summary": "Analysis failed",
            "error": str(e)
        }