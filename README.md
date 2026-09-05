# ReSearch Backend

This is the Python (Flask) backend for the ReSearch application. It integrates the Gemini API (using a fallback chain of models) with an integrated RAG extractor and a DOCX generation module.

## Setup

1. **Environment:**
   Ensure you have Python 3.10+ installed.
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. **API Keys:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

3. **Run the Server:**
   ```bash
   python app.py
   ```
   The server will run on `http://127.0.0.1:5000`.

## Directory Structure
- `app.py`: Flask application with API endpoints.
- `src/gemini_client.py`: Wrapper for `google-genai` SDK that implements the model fallback chain (3.8-flash -> 3.7-flash -> 3.6-flash -> 2.5-pro -> 2.5-flash).
- `src/prompts.py`: Centralized location for all the system prompts.
- `src/rag_extractor.py`: Integrated RAG module (converted from the uploaded FastAPI code) for fetching and parsing PDFs/HTML for abstracts.
- `src/generator.py`: Sequentially prompts Gemini for all required sections of the IEEE paper.
- `src/exporter.py`: Uses `docxtpl` to insert the generated sections into `conference-template-a4.docx`.

## API Endpoints

### 1. Paper Discovery
`POST /api/discovery`
Generates a JSON list of relevant papers using direct Gemini prompting.
**Body:**
```json
{
  "idea": "Using AI for...",
  "keywords": "AI, ML, Research",
  "preferences": "Recent papers only"
}
```

### 2. RAG Extraction
`POST /api/rag`
Fetches abstracts for the discovered papers from URLs/PDFs.
**Body:**
```json
{
  "papers": [
    {"title": "Paper 1", "url": "https://arxiv.org/abs/..."}
  ]
}
```

### 3. Generate Paper
`POST /api/generate`
Uses the selected papers and gaps to generate the full paper and export it as an IEEE formatted Word Document.
**Body:**
```json
{
  "refined_idea": "My refined approach...",
  "methodology_details": "Using a CNN with...",
  "selected_papers": [
      {
        "title": "Paper 1", 
        "year": "2024", 
        "abstract": "...", 
        "gaps": ["Lacks scalability"]
      }
  ],
  "selected_gaps": ["Lacks scalability"],
  "title": "My Final Paper Title",
  "author": "My Name"
}
```
**Response:**
Returns the generated sections and saves the final file to `output/research_paper.docx`.
