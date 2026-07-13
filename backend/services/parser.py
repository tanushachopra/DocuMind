import fitz  # PyMuPDF
import pdfplumber
import docx
import os
from dotenv import load_dotenv
import base64
import google.generativeai as genai
load_dotenv()
from PIL import Image
import io

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def pdf_page_to_image_base64(page) -> str:
    """Convert a PDF page to base64 image for Gemini Vision."""
    mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better quality
    pix = page.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    return base64.b64encode(img_bytes).decode("utf-8")


def extract_text_with_gemini_vision(page, page_num: int) -> str:
    """
    Use Gemini Vision to understand a PDF page as an image.
    This handles scanned PDFs, handwriting, charts, tables, diagrams.
    """
    try:
        img_b64 = pdf_page_to_image_base64(page)

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([
            {
                "inline_data": {
                    "mime_type": "image/png",
                    "data": img_b64
                }
            },
            f"""You are analyzing page {page_num + 1} of a document.
Extract ALL content from this page including:
- All text (exactly as written)
- Table contents (preserve structure)
- Chart/graph descriptions (what data is shown)
- Diagram descriptions (what is depicted)
- Handwritten text (if any)
- Headers, footers, page numbers
- Any visual information that conveys meaning

Format: Return the content naturally, preserving structure.
Prefix tables with [TABLE], charts with [CHART], diagrams with [DIAGRAM]."""
        ])

        return f"\n--- Page {page_num + 1} ---\n{response.text}"

    except Exception as e:
        print(f"Vision extraction error page {page_num}: {e}")
        return ""


def extract_text_from_pdf_multimodal(file_path: str) -> dict:
    """
    Full multimodal PDF extraction:
    1. Try text extraction first (fast)
    2. For pages with no/little text, use Gemini Vision
    3. Always use Vision for pages with tables/charts
    """
    doc = fitz.open(file_path)
    pages_content = []
    used_vision = False
    total_pages = len(doc)

    for page_num in range(total_pages):
        page = doc[page_num]
        text = page.get_text().strip()

        # Detect if page needs vision
        needs_vision = (
            len(text) < 100 or  # Very little text = likely scanned
            "table" in text.lower() or
            len(page.get_images()) > 0  # Page has images
        )

        if needs_vision:
            # Use Gemini Vision for this page
            vision_content = extract_text_with_gemini_vision(page, page_num)
            pages_content.append(vision_content)
            used_vision = True
        else:
            pages_content.append(f"\n--- Page {page_num + 1} ---\n{text}")

    doc.close()

    full_text = "\n".join(pages_content)

    return {
        "text": full_text,
        "total_pages": total_pages,
        "used_vision": used_vision
    }


def extract_text_from_image(file_path: str) -> str:
    """Extract content from image files using Gemini Vision."""
    try:
        with open(file_path, "rb") as f:
            img_bytes = f.read()
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")

        ext = os.path.splitext(file_path)[1].lower()
        mime_types = {
            ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            ".png": "image/png", ".webp": "image/webp"
        }
        mime_type = mime_types.get(ext, "image/png")

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([
            {
                "inline_data": {
                    "mime_type": mime_type,
                    "data": img_b64
                }
            },
            """Extract ALL content from this image including text,
tables, charts, diagrams, and any visual information.
Preserve the structure and meaning of all content."""
        ])

        return response.text

    except Exception as e:
        print(f"Image extraction error: {e}")
        return ""


def extract_text_from_docx(file_path: str) -> str:
    """Extract text from Word documents."""
    try:
        doc = docx.Document(file_path)
        sections = []
        for para in doc.paragraphs:
            if para.text.strip():
                sections.append(para.text)
        # Also extract tables
        for table in doc.tables:
            table_text = "[TABLE]\n"
            for row in table.rows:
                row_text = " | ".join(
                    cell.text.strip() for cell in row.cells
                )
                table_text += row_text + "\n"
            sections.append(table_text)
        return "\n".join(sections)
    except Exception as e:
        print(f"DOCX error: {e}")
        return ""


def extract_text(file_path: str) -> dict:
    """
    Main extraction function.
    Auto-detects file type and uses appropriate method.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        result = extract_text_from_pdf_multimodal(file_path)
        return result

    elif ext in [".jpg", ".jpeg", ".png", ".webp"]:
        text = extract_text_from_image(file_path)
        return {
            "text": text,
            "total_pages": 1,
            "used_vision": True
        }

    elif ext in [".docx", ".doc"]:
        text = extract_text_from_docx(file_path)
        return {
            "text": text,
            "total_pages": 1,
            "used_vision": False
        }

    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        return {
            "text": text,
            "total_pages": 1,
            "used_vision": False
        }

    return {"text": "", "total_pages": 0, "used_vision": False}


def get_document_metadata(file_path: str) -> dict:
    """Get full document metadata including extracted text."""
    result = extract_text(file_path)
    text = result.get("text", "")
    word_count = len(text.split())
    estimated_tokens = int(word_count / 0.75)

    return {
        "text": text,
        "word_count": word_count,
        "char_count": len(text),
        "estimated_tokens": estimated_tokens,
        "total_pages": result.get("total_pages", 1),
        "used_vision": result.get("used_vision", False),
        "needs_rag": estimated_tokens > 100000
    }