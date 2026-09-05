import io
import re
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel
from pypdf import PdfReader

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    )
}
TIMEOUT_SECONDS = 15

class PaperResult(BaseModel):
    title: str
    url: str
    abstract: Optional[str] = None
    status: str

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def normalize_arxiv_pdf_to_abs(url: str) -> Optional[str]:
    match = re.search(r"arxiv\.org/pdf/([^\s/]+?)(\.pdf)?$", url, re.IGNORECASE)
    if match:
        return f"https://arxiv.org/abs/{match.group(1)}"
    return None

def extract_abstract_from_html(html_bytes: bytes) -> Optional[str]:
    soup = BeautifulSoup(html_bytes, "html.parser")
    for meta_name in ["citation_abstract", "dc.description", "og:description", "description"]:
        tag = soup.find("meta", attrs={"name": meta_name}) or soup.find(
            "meta", attrs={"property": meta_name}
        )
        if tag and tag.get("content"):
            content = tag["content"].strip()
            if len(content) > 50:
                return clean_text(content)
    
    abs_block = soup.find("blockquote", class_="abstract")
    if abs_block:
        text = abs_block.get_text(" ", strip=True)
        text = re.sub(r"^Abstract:?\s*", "", text, flags=re.IGNORECASE)
        if len(text) > 30:
            return clean_text(text)

    candidates = soup.find_all(attrs={"id": re.compile("abstract", re.I)})
    candidates += soup.find_all(attrs={"class": re.compile("abstract", re.I)})
    for candidate in candidates:
        text = candidate.get_text(" ", strip=True)
        text = re.sub(r"^Abstract:?\s*", "", text, flags=re.IGNORECASE)
        if len(text) > 100:
            return clean_text(text)
    return None

def extract_abstract_from_pdf_text(text: str) -> Optional[str]:
    match = re.search(
        r"Abstract\s*[:\-]?\s*(.*?)(?:\n\s*(?:1\.?\s*Introduction|Introduction|Keywords|Index Terms)\b)",
        text,
        re.IGNORECASE | re.DOTALL,
    )
    if match:
        abstract = match.group(1).strip()
        if len(abstract) > 50:
            return clean_text(abstract)

    match = re.search(r"Abstract\s*[:\-]?\s*(.*)", text, re.IGNORECASE | re.DOTALL)
    if match:
        abstract = match.group(1)[:2000].split("\n\n")[0]
        if len(abstract) > 50:
            return clean_text(abstract)
    return None

def fetch(url: str):
    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT_SECONDS, allow_redirects=True)
    except requests.exceptions.Timeout:
        return None, "timeout"
    except requests.exceptions.RequestException:
        return None, "url_unreachable"
    if response.status_code != 200:
        return None, "url_unreachable"
    return response, None

def process_paper(title: str, url: str) -> dict:
    url = url.strip()
    if not url or not (url.startswith("http://") or url.startswith("https://")):
        return {"title": title, "url": url, "abstract": None, "status": "invalid_url"}

    arxiv_abs_url = normalize_arxiv_pdf_to_abs(url)
    urls_to_try = [arxiv_abs_url, url] if arxiv_abs_url else [url]

    last_status = "abstract_not_found"
    for candidate_url in urls_to_try:
        if not candidate_url:
            continue
        response, error_status = fetch(candidate_url)
        if error_status:
            last_status = error_status
            continue

        content_type = response.headers.get("Content-Type", "").lower()
        is_pdf = "application/pdf" in content_type or candidate_url.lower().endswith(".pdf")

        if is_pdf:
            try:
                reader = PdfReader(io.BytesIO(response.content))
                text = ""
                for page in reader.pages[:3]:
                    text += page.extract_text() or ""
                abstract = extract_abstract_from_pdf_text(text)
                if abstract:
                    return {"title": title, "url": url, "abstract": abstract, "status": "success"}
                last_status = "abstract_not_found"
            except Exception:
                last_status = "pdf_read_error"
        else:
            try:
                abstract = extract_abstract_from_html(response.content)
                if abstract:
                    return {"title": title, "url": url, "abstract": abstract, "status": "success"}
                last_status = "abstract_not_found"
            except Exception:
                last_status = "html_parse_error"

    return {"title": title, "url": url, "abstract": None, "status": last_status}
