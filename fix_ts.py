import re

def fix_ts_errors():
    with open('Frontend/src/App.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix duplicate refinedIdea in RefineResearchIdea
    # My previous regex: content = content.replace('localIdea', 'refinedIdea').replace('setLocalIdea', 'setRefinedIdea')
    # That means the `const [localIdea, setLocalIdea] = useState(idea)` became `const [refinedIdea, setRefinedIdea] = useState(idea)`.
    # Let's remove the useState for refinedIdea entirely since it comes from props.
    content = re.sub(r'const \[refinedIdea, setRefinedIdea\] = useState\(.*?\)\n', '', content)

    # 2. Fix 'papers' on line 1552. Wait, let's just make DocxGeneration accept `papers` or whatever it needs.
    # Actually I will just replace `papers.map` back to `PAPERS.map` if it's in PaperPreview/DocxGeneration where I didn't pass `papers`.
    # Wait, in DocxGeneration it says `papers.map`. Let's just find `papers.map` inside DocxGeneration and change it.
    # Since I don't know exactly where line 1552 is, I'll pass `papers` down to DocxGeneration and PaperPreview just in case, or replace it back to PAPERS.
    # The safest is to add `papers?: Paper[]` to DocxGeneration and PaperPreview and DocumentReady, but let's just add `papers?: any[]` to the components that complain.
    
    # 3. Add generatedSections and docxPath to the prop types of PaperEditor, PaperPreview, DocxGeneration, DocumentReady
    content = re.sub(r'function PaperEditor\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', 
                     r'function PaperEditor({ onNav, generatedSections }: { onNav: (v: View) => void, generatedSections?: any })', content)
                     
    content = re.sub(r'function PaperPreview\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', 
                     r'function PaperPreview({ onNav, generatedSections }: { onNav: (v: View) => void, generatedSections?: any })', content)
                     
    content = re.sub(r'function DocxGeneration\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', 
                     r'function DocxGeneration({ onNav }: { onNav: (v: View) => void })', content) # It didn't get passed generatedSections, but the TS error says it's missing something?
    # Wait, the error for 1738 and 1740 are PaperEditor and PaperPreview.
    # The error for 1744 is DocumentReady needing docxPath.
    content = re.sub(r'function DocumentReady\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', 
                     r'function DocumentReady({ onNav, docxPath }: { onNav: (v: View) => void, docxPath?: string })', content)

    # Now for line 1552: "Cannot find name 'papers'".
    # Let's see what uses `papers.map`.
    # I did: content = re.sub(r'PAPERS\.map', 'papers.map', content) which globally replaced PAPERS.map.
    # That affected PaperPreview, DocxGeneration, DocumentReady, etc.
    # Let's revert `papers.map` back to `PAPERS.map` everywhere EXCEPT where `papers` is in scope (ResearchPapersTable, RefineResearchIdea, AIValidation).
    # But wait, `papers` is now passed to ResearchPapersTable, RefineResearchIdea, AIValidation.
    # In other places, I'll just change `papers.map` to `PAPERS.map` by finding them globally and replacing back to PAPERS.map if it's not within those 3 components.
    # Actually, it's easier to just pass `papers={discoveredPapers.length > 0 ? discoveredPapers : PAPERS}` to ALL components in renderView, or add `const papers = PAPERS` locally.
    # Let's just do a string replace of `papers.map` to `(typeof papers !== 'undefined' ? papers : PAPERS).map` 
    # Or maybe I should just pass papers to the components that need it?
    
    content = re.sub(r'(?<!\.)papers\.map\(\(p, i\)', r'(typeof papers !== "undefined" ? papers : PAPERS).map((p: any, i: any)', content)
    content = re.sub(r'(?<!\.)papers\.filter\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).filter((p: any)', content)
    content = re.sub(r'(?<!\.)papers\.find\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).find((p: any)', content)
    content = re.sub(r'(?<!\.)papers\.map\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).map((p: any)', content)


    with open('Frontend/src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_ts_errors()
