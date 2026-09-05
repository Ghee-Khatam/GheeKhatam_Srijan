Modify the existing ResearchAI prototype according to the following requirements. Do NOT rebuild the entire application from scratch. Preserve the existing visual quality, components, navigation style, typography, spacing, research-oriented UX, and overall structure wherever possible. Make the following workflow changes throughout the prototype.

IMPORTANT PRODUCT CHANGE:
ResearchAI is NOT a user-history or research-management platform. It is a single-session AI research discovery and paper-generation tool. We are NOT storing user research projects, previous searches, generated papers, saved papers, or user history.

1. REMOVE THE DASHBOARD AND USER HISTORY CONCEPT

Completely remove the Dashboard screen and any functionality that implies persistent user history or stored research.

Remove:

* Dashboard
* Recent Research Projects
* My Research
* Saved Papers
* Generated Papers history
* Continue Research
* Recent searches
* Previous research projects
* Any project-history cards
* Any persistent research statistics such as “47 papers discovered” from previous sessions
* Any UI implying that user data is permanently stored

The application should instead start directly with the research workflow.

NEW STARTING EXPERIENCE:

The landing/start screen should be a clean “ResearchAI” research input interface.

Header:
ResearchAI

Main heading:
“Turn Your Research Idea Into a Stronger Research Direction”

Supporting text:
“Analyze your idea, discover relevant research, identify research gaps, and generate an IEEE-format research paper.”

Primary CTA:
“Start Research”

The user should immediately be able to enter their research idea.

The primary workflow should now be:

Research Idea
→ AI Analysis
→ Research Papers
→ Research Idea Refinement
→ AI Validation
→ Paper Generation
→ Paper Editor
→ Paper Preview
→ Download IEEE Word Document

There should be NO dashboard between these stages.

2. RESEARCH INPUT SCREEN

Keep the existing research-input functionality, but make it the first major screen of the application.

The user should be able to provide:

* Complete Research Idea
* Research Topic
* Problem Statement
* Technologies
* Target Domain
* Known Methodology
* Additional Preferences
* Research Area
* Publication Type
* Preferred Year Range
* Maximum Number of Papers

Allow the user to enter their research idea in their own words.

Primary CTA:

“Analyze My Research Idea →”

After clicking it, show the existing AI analysis/progress interface.

AI analysis should display stages such as:

✓ Research idea received
✓ Understanding research topic
✓ Extracting keywords
✓ Identifying related concepts
● Finding relevant research papers
○ Processing papers
○ Identifying research gaps
○ Calculating relevance
○ Preparing research landscape

3. CHANGE THE RESEARCH PAPER RESULTS INTO A TABLE

This is a VERY IMPORTANT change.

The discovered research papers must NOT primarily be displayed as individual large cards.

Instead, create a clean, professional academic table.

Section heading:

“Relevant Research Papers”

Supporting text:

“Review the most relevant research papers and their identified research gaps before refining your research direction.”

The table must contain EXACTLY THREE PRIMARY COLUMNS:

COLUMN 1:
“Paper Name”

COLUMN 2:
“Abstract”

COLUMN 3:
“Research Gaps”

Do not add additional primary columns.

Each row represents one research paper.

Example structure:

| Paper Name                                        | Abstract                         | Research Gaps                      |
| ------------------------------------------------- | -------------------------------- | ---------------------------------- |
| Fake Product Review Detection Using Deep Learning | Concise abstract of the paper... | The authors identify...            |
| Transformer-Based Review Classification           | Concise abstract...              | Limited multilingual evaluation... |
| Explainable Fake Review Detection                 | Concise abstract...              | Lack of real-world datasets...     |

TABLE DESIGN:

* Paper Name should be visually prominent.
* Abstract should display a readable but condensed version of the abstract.
* Research Gaps should clearly communicate the identified gaps.
* Keep row heights reasonable while allowing enough text to remain readable.
* Use expandable rows or “View Analysis” interaction if the content is too long.
* The table should remain easy to scan.
* Use sticky table headers when appropriate.
* Allow horizontal scrolling on smaller screens if necessary.
* On mobile, transform each row into a stacked research-paper block while preserving the same three pieces of information.

Each paper row should also include a checkbox for selection.

IMPORTANT:
The checkbox is an interaction control and should NOT become an additional table column.

The user must be able to select multiple papers.

Add:

“Select Papers”

and show:

“3 papers selected”

or dynamically update the number.

Add a primary action:

“Continue →”

4. RESEARCH GAP PRESENTATION

Research gaps must remain clearly distinguishable from the abstract.

Inside the Research Gaps column, clearly differentiate:

SOURCE-IDENTIFIED GAP

and

AI-INFERRED GAP

For example:

SOURCE-IDENTIFIED GAP
Limited evaluation across multilingual datasets.

AI-INFERRED GAP
The existing approach may benefit from testing across larger real-world datasets.

AI-inferred gaps must ALWAYS be visually labeled as AI-inferred.

Do not present AI-inferred information as if it were directly stated by the research paper.

Where possible, provide a small “View Evidence” interaction that opens the relevant evidence or explanation.

Maintain the trust labels:

SOURCE EVIDENCE
AI-INFERRED GAP
USER PROVIDED
AI GENERATED
SOURCE VERIFIED

5. ADD A SECOND COMPLETE RESEARCH IDEA TEXTBOX AFTER THE PAPERS

This is another VERY IMPORTANT workflow change.

After the user reviews/selects the research papers, DO NOT immediately send them to methodology validation.

Instead, create a dedicated screen/section:

“Refine Your Research Idea”

The purpose of this screen is to allow the user to submit their COMPLETE research idea again after seeing the discovered literature and research gaps.

Heading:

“Now Refine Your Research Idea”

Supporting text:

“Based on the research papers and identified gaps above, describe your complete refined research idea in your own words.”

Provide a LARGE TEXTAREA.

Label:

“Your Refined Research Idea”

Placeholder:

“Describe your complete research idea, including the problem you want to solve, your proposed approach, technologies, dataset, expected contribution, and any other important details...”

This textbox must be large enough for the user to write a complete research proposal.

Do NOT make this a short keyword field.

The user should be able to rewrite their entire idea.

Also show a compact summary of the selected research papers on the same screen.

For example:

Selected Sources
3 papers selected

Research Gaps You May Address

* Gap 1
* Gap 2
* Gap 3

Then provide optional supporting fields:

Proposed Methodology
Dataset
Technologies
Expected Contribution
Additional Information

Primary CTA:

“Submit Research Direction →”

6. AI VALIDATION

After the user submits the refined research idea, show the AI validation stage.

The AI should evaluate whether the research direction is sufficiently defined.

Display a checklist:

Research Problem
✓ Defined

Research Methodology
✓ Defined

Dataset
⚠ Needs clarification

Baseline Models
⚠ Needs clarification

Evaluation Metrics
⚠ Needs clarification

Expected Contribution
✓ Defined

If clarification is required, ask only important questions.

Example:

“Which dataset will you use?”

“What evaluation metrics will you use?”

“Which baseline models will you compare against?”

Avoid turning this into a generic chatbot.

The interaction should feel like an academic research validation workflow.

After completion:

“Research Plan Validated ✓”

Primary CTA:

“Generate Research Paper →”

7. PAPER GENERATION

Show a clear generation progress screen.

Stages:

✓ Research sources reviewed
✓ Research gaps analyzed
✓ Research methodology validated
✓ Paper structure prepared
● Generating academic sections
○ Preparing references
○ Preparing document

Include a visible academic integrity/safety notice:

“ResearchAI does not fabricate research papers, authors, citations, datasets, experimental results, or accuracy values.”

If information is unavailable, use clearly visible placeholders such as:

[RESULTS TO BE ADDED AFTER EXPERIMENTATION]

[DATASET INFORMATION REQUIRED]

[EXPERIMENTAL RESULTS REQUIRED]

8. PAPER EDITOR

After generation, display the complete research paper in an academic editor.

Use the existing three-column editor concept:

LEFT:
Paper Outline

CENTER:
Actual Paper Content

RIGHT:
AI Assistant / Sources

Paper outline:

1. Title
2. Abstract
3. Keywords
4. Introduction
5. Related Work
6. Problem Statement
7. Proposed Methodology
8. System Architecture
9. Dataset
10. Experimental Setup
11. Results
12. Discussion
13. Limitations
14. Future Work
15. Conclusion
16. References

Keep the editor professional and document-focused.

The AI assistant should provide actions such as:

Improve Section
Rewrite
Expand
Shorten
Check Citation
Explain
Regenerate Section

Citation/source panel should clearly distinguish verified sources from generated content.

9. ADD A DEDICATED PAPER PREVIEW BEFORE DOWNLOAD

This is a REQUIRED final workflow stage.

The user MUST be able to preview the generated research paper before downloading it.

The final workflow must NOT jump directly from paper generation to download.

Create a dedicated screen:

“Paper Preview”

Supporting text:

“Review your complete research paper before generating the final IEEE Word document.”

The preview should look like an actual academic research paper, NOT like a generic web page.

Use an IEEE-inspired document layout.

Show:

* Paper title
* Authors / author placeholders
* Abstract
* Keywords
* Numbered sections
* Subsections
* Tables
* Figures / figure placeholders
* Citations
* References
* Page structure
* Two-column academic layout where appropriate

The preview should visually resemble the final document that the user will download.

Provide a top toolbar with:

Edit Paper
Check Citations
References
Preview
Export

The user should be able to return to editing before downloading.

10. FINAL DOWNLOAD SCREEN

After the preview, provide the final export action.

Heading:

“Your IEEE Research Paper Is Ready”

Show a document preview/card containing:

Fake_Product_Review_Detection_IEEE.docx

DOCX
IEEE Format
16 Sections
23 References

Primary CTA:

“Download Word Document”

Secondary actions:

“Open Paper”
“Continue Editing”

The download option must be clearly visible and should be the FINAL action in the workflow.

Final user journey:

START
↓
Research Idea Input
↓
AI Analysis
↓
Relevant Research Papers TABLE
↓
Select Research Papers
↓
SECOND COMPLETE RESEARCH IDEA TEXTBOX
↓
AI Research Validation
↓
Generate Research Paper
↓
Academic Paper Editor
↓
PAPER PREVIEW
↓
DOWNLOAD IEEE WORD DOCUMENT

11. NAVIGATION CHANGES

Because there is no persistent user history, simplify the navigation.

Do NOT use:

Dashboard
My Research
Saved Papers
Generated Papers

Instead, use a focused research workflow navigation such as:

ResearchAI
Research Input
Research Papers
Research Direction
Paper Editor
Paper Preview

Include a progress indicator showing the user's current stage.

For example:

01 Idea
→ 02 Discovery
→ 03 Research Direction
→ 04 Validation
→ 05 Paper
→ 06 Preview
→ 07 Download

The progress indicator should make it obvious where the user currently is.

12. IMPORTANT PRODUCT PRINCIPLE

ResearchAI is a research discovery and paper-generation workflow, NOT a project-management application.

Do not introduce:

* User history
* Saved projects
* Persistent dashboards
* Social features
* Chat history
* Research feeds
* Unnecessary profile functionality

Keep the experience focused on one research task from beginning to end.

13. VISUAL AND UX REQUIREMENTS

Preserve the existing ResearchAI visual language.

The interface should feel:

* Academic
* Professional
* Modern
* AI-powered
* Trustworthy
* Research-oriented
* Clean
* Structured

It should NOT look like:

* A generic chatbot
* A social media application
* A finance dashboard
* A generic AI essay writer

Prioritize readability because the application handles large amounts of academic information.

The Research Paper Table, Research Gap presentation, Refined Research Idea textbox, Paper Editor, and IEEE Paper Preview are the most important screens.

14. DO NOT APPLY THE FINAL COLOR THEME YET

Keep the current visual styling while implementing these structural changes.

Do NOT make major color changes in this modification.

The final Golden Summer Fields light/dark theme will be applied separately after the workflow and information architecture are finalized.

FINAL REQUIREMENT:

Update the existing prototype so that the complete experience follows:

Research Idea
→ AI Understanding
→ Research Paper Discovery
→ Three-Column Research Paper Table
→ Paper Selection
→ Complete Refined Research Idea
→ AI Validation
→ Paper Generation
→ Academic Editor
→ Paper Preview
→ IEEE Word Document Download

Preserve existing components where they still make sense, remove obsolete dashboard/history functionality, and ensure every screen is connected through a coherent clickable prototype.
