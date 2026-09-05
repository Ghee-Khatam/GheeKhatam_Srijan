import json
import os
from src.gemini_client import gemini_client
from src.prompts import (
    ABSTRACT_GENERATION_PROMPT,
    INTRODUCTION_PROMPT,
    LITERATURE_REVIEW_PROMPT,
    METHODOLOGY_PROMPT,
    RESULTS_PROMPT,
    CONCLUSION_PROMPT,
    REFERENCES_PROMPT
)

def generate_paper(refined_idea: str, methodology_details: str, selected_papers: list, selected_gaps: list):
    # Prepare the research papers context
    research_context = "Selected Research Papers:\n"
    for paper in selected_papers:
        research_context += f"- {paper.get('title')} ({paper.get('year')})\n  Abstract: {paper.get('abstract')}\n  Gaps: {', '.join(paper.get('gaps', []))}\n\n"

    gaps_text = ", ".join(selected_gaps)

    # 1. Abstract (acts as initial context)
    abstract_prompt = ABSTRACT_GENERATION_PROMPT.format(
        refined_idea=refined_idea,
        methodology_details=methodology_details,
        selected_gaps=gaps_text
    )
    abstract = gemini_client.generate(abstract_prompt)
    
    context = f"## Abstract\n{abstract}\n\n"

    # 2. Introduction
    intro_prompt = INTRODUCTION_PROMPT.format(
        context=context,
        research_papers_context=research_context
    )
    introduction = gemini_client.generate(intro_prompt)
    context += f"## Introduction\n{introduction}\n\n"

    # 3. Literature Review
    lit_prompt = LITERATURE_REVIEW_PROMPT.format(
        context=context,
        research_papers_context=research_context
    )
    literature_review = gemini_client.generate(lit_prompt)
    context += f"## Literature Review\n{literature_review}\n\n"

    # 4. Methodology
    meth_prompt = METHODOLOGY_PROMPT.format(
        methodology_details=methodology_details,
        context=context
    )
    methodology = gemini_client.generate(meth_prompt)
    context += f"## Methodology\n{methodology}\n\n"

    # 5. Results
    results_prompt = RESULTS_PROMPT.format(
        context=context
    )
    results = gemini_client.generate(results_prompt)
    context += f"## Results and Discussion\n{results}\n\n"

    # 6. Conclusion
    conc_prompt = CONCLUSION_PROMPT.format(
        context=context
    )
    conclusion = gemini_client.generate(conc_prompt)
    context += f"## Conclusion\n{conclusion}\n\n"

    # 7. References
    ref_prompt = REFERENCES_PROMPT.format(
        research_papers_context=research_context
    )
    references = gemini_client.generate(ref_prompt)
    
    return {
        "abstract": abstract,
        "introduction": introduction,
        "literature_review": literature_review,
        "methodology": methodology,
        "results": results,
        "conclusion": conclusion,
        "references": references,
        "full_context": context
    }
