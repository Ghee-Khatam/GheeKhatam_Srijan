import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from src.gemini_client import gemini_client
from src.prompts import PAPER_DISCOVERY_PROMPT
from src.rag_extractor import process_paper
from src.generator import generate_paper
from src.exporter import export_docx

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Frontend', 'dist'), static_url_path='')
CORS(app)

@app.route("/")
def serve():
    return app.send_static_file('index.html')

@app.route("/api/discovery", methods=["POST"])
def discovery():
    data = request.json
    idea = data.get("idea", "")
    keywords = data.get("keywords", "")
    preferences = data.get("preferences", "")

    prompt = PAPER_DISCOVERY_PROMPT.format(
        idea=idea,
        keywords=keywords,
        preferences=preferences
    )

    schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "url": {"type": "string"},
                "year": {"type": "string"},
                "authors": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "relevance_score": {"type": "integer"}
            }
        }
    }

    try:
        response_text = gemini_client.generate(prompt, schema=schema)
        papers = json.loads(response_text)
        return jsonify({"status": "success", "papers": papers})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/rag", methods=["POST"])
def run_rag():
    data = request.json
    papers = data.get("papers", [])
    if not papers:
        return jsonify({"status": "error", "message": "No papers provided"}), 400

    results = []
    for paper in papers:
        title = paper.get("title", "")
        url = paper.get("url", "")
        if title and url:
            res = process_paper(title, url)
            results.append(res)
    return jsonify({"status": "success", "results": results})


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.json
    refined_idea = data.get("refined_idea", "")
    methodology_details = data.get("methodology_details", "")
    selected_papers = data.get("selected_papers", [])
    selected_gaps = data.get("selected_gaps", [])

    if not selected_papers:
        return jsonify({"status": "error", "message": "No papers selected"}), 400

    try:
        # Generate the paper sections
        sections = generate_paper(
            refined_idea=refined_idea,
            methodology_details=methodology_details,
            selected_papers=selected_papers,
            selected_gaps=selected_gaps
        )

        # Merge with other fields if needed for template
        sections['title'] = data.get("title", "Generated Research Paper")
        sections['author'] = data.get("author", "Author Name")

        # Export to docx
        template_path = os.path.join(os.path.dirname(__file__), "conference-template-a4.docx")
        output_path = os.path.join(os.path.dirname(__file__), "output", "research_paper.docx")
        export_docx(sections, template_path, output_path)

        return jsonify({
            "status": "success",
            "message": "Paper generated and exported to docx",
            "sections": sections,
            "docx_path": output_path
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
