PAPER_DISCOVERY_PROMPT = """
You are an expert academic researcher. 
Based on the following idea, keywords, and preferences, generate a list of 10 highly relevant research papers that would be good sources. 
Output a JSON array of objects, where each object has:
- "title": string (the title of the paper)
- "url": string (a valid URL to the paper, prefer arxiv, IEEE, or similar open access where possible)
- "year": string
- "authors": list of strings
- "relevance_score": integer 1-10

User Idea: {idea}
Keywords: {keywords}
Preferences: {preferences}
"""

PAPER_ANALYSIS_PROMPT = """
You are an expert research analyst. Analyze the following paper title and abstract. 
Identify the key limitations or gaps in the research, and summarize the methodology.

Paper Title: {title}
Abstract: {abstract}

Return a JSON object with:
- "keywords": list of strings
- "gaps": list of strings
- "methodology_summary": string
"""

GAP_SCORING_PROMPT = """
Score how well these identified gaps align with the user's research idea.

User Idea: {idea}
Gaps: {gaps}

Return a JSON object with:
- "gap_score": integer 1-10 (10 being perfect alignment)
- "reasoning": string
"""

ABSTRACT_GENERATION_PROMPT = """
You are an expert academic writer. Generate a comprehensive abstract for a new research paper based on the following:

User's Refined Idea: {refined_idea}
Methodology Details: {methodology_details}
Selected Gaps Addressed: {selected_gaps}

The abstract should be around 150-250 words and follow standard IEEE format structure (Background, Problem, Methodology, Results/Expected Results, Conclusion).
"""

INTRODUCTION_PROMPT = """
Generate the Introduction section for the research paper. 
Use the following context (the Abstract and previous sections):
{context}

Also draw upon the selected research papers as background literature:
{research_papers_context}
"""

LITERATURE_REVIEW_PROMPT = """
Generate the Literature Review section for the research paper.
Synthesize the following papers, highlighting the gaps they have and how our proposed methodology addresses them.

Selected Papers and Gaps:
{research_papers_context}

Overall Context:
{context}
"""

METHODOLOGY_PROMPT = """
Generate the Methodology section for the research paper.
Detail the approach, tools, and processes used.

User's Methodology Details:
{methodology_details}

Overall Context:
{context}
"""

RESULTS_PROMPT = """
Generate the Results and Discussion section for the research paper.
Since this might be a theoretical or proposed work, describe the expected results or theoretical validation.

Overall Context:
{context}
"""

CONCLUSION_PROMPT = """
Generate the Conclusion and Future Work section for the research paper.

Overall Context:
{context}
"""

REFERENCES_PROMPT = '''
Generate the References section in standard IEEE citation format for the following selected papers.

Papers:
{research_papers_context}
'''
