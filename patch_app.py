import re

def patch_app_tsx():
    with open('frontend_new/Frontend/src/App.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    app_pattern = r'export default function App\(\) \{\n\s*const \[view, setView\] = useState<View>\(.*?\)\n\s*const \[dark, setDark\] = useState\(.*?\)'
    app_replacement = """export default function App() {
  const [view, setView] = useState<View>('research-input')
  const [dark, setDark] = useState(false)
  
  const [globalIdea, setGlobalIdea] = useState('')
  const [discoveredPapers, setDiscoveredPapers] = useState<Paper[]>([])
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([])
  const [refinedIdea, setRefinedIdea] = useState('')
  const [selectedGaps, setSelectedGaps] = useState<string[]>([])
  const [generatedSections, setGeneratedSections] = useState<any>(null)
  const [docxPath, setDocxPath] = useState<string>('')
"""
    content = re.sub(app_pattern, app_replacement, content)

    render_view_pattern = r'const renderView = \(\) => \{\n\s*switch \(view\) \{.*?\n\s*\}\n\s*\}'
    render_view_replacement = """const renderView = () => {
    switch (view) {
      case 'research-input':
        return <ResearchInput onNav={setView} idea={globalIdea} setIdea={setGlobalIdea} />
      case 'ai-analysis':
        return <AIAnalysis onNav={setView} idea={globalIdea} setDiscoveredPapers={setDiscoveredPapers} />
      case 'research-papers':
        return <ResearchPapersTable onNav={setView} papers={discoveredPapers.length > 0 ? discoveredPapers : PAPERS} selectedPaperIds={selectedPaperIds} setSelectedPaperIds={setSelectedPaperIds} />
      case 'research-direction':
        return <RefineResearchIdea onNav={setView} papers={discoveredPapers.length > 0 ? discoveredPapers : PAPERS} selectedPaperIds={selectedPaperIds} refinedIdea={refinedIdea} setRefinedIdea={setRefinedIdea} selectedGaps={selectedGaps} setSelectedGaps={setSelectedGaps} />
      case 'ai-validation':
        return <AIValidation onNav={setView} papers={discoveredPapers.length > 0 ? discoveredPapers : PAPERS} selectedPaperIds={selectedPaperIds} refinedIdea={refinedIdea} selectedGaps={selectedGaps} setGeneratedSections={setGeneratedSections} setDocxPath={setDocxPath} />
      case 'paper-generation':
        return <PaperGeneration onNav={setView} />
      case 'paper-editor':
        return <PaperEditor onNav={setView} generatedSections={generatedSections} />
      case 'paper-preview':
        return <PaperPreview onNav={setView} generatedSections={generatedSections} />
      case 'docx-generation':
        return <DocxGeneration onNav={setView} />
      case 'document-ready':
        return <DocumentReady onNav={setView} docxPath={docxPath} />
      default:
        return <ResearchInput onNav={setView} idea={globalIdea} setIdea={setGlobalIdea} />
    }
  }"""
    content = re.sub(render_view_pattern, render_view_replacement, content, flags=re.DOTALL)

    ri_pattern = r'function ResearchInput\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{\n\s*const \[idea, setIdea\] = useState\([\s\S]*?\)'
    ri_replacement = r"""function ResearchInput({ onNav, idea, setIdea }: { onNav: (v: View) => void, idea: string, setIdea: (s: string) => void }) {"""
    content = re.sub(ri_pattern, ri_replacement, content)

    ai_replacement = """function AIAnalysis({ onNav, idea, setDiscoveredPapers }: { onNav: (v: View) => void, idea: string, setDiscoveredPapers: (p: any[]) => void }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    let isMounted = true;
    const fetchDiscovery = async () => {
      try {
        setStep(2);
        const res = await fetch('/api/discovery', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, keywords: "", preferences: "" })
        });
        const data = await res.json();
        if (data.papers && isMounted) {
          const mappedPapers = data.papers.map((p: any, i: number) => ({
            id: i + 1, rank: i + 1, relevance: p.relevance_score ? p.relevance_score * 10 : 80,
            title: p.title || 'Untitled', authors: Array.isArray(p.authors) ? p.authors.join(', ') : p.authors,
            year: p.year || 2024, venue: 'Unknown', source: 'Gemini', doi: p.url || '', abstract: p.abstract || '',
            whyMatters: '', keywords: [], methodology: '', dataset: '', findings: '', gaps: [], limitations: [],
            scores: { keyword: 80, gapRelevance: 80, semantic: 80, recency: 80 }
          }));
          setDiscoveredPapers(mappedPapers);
          setStep(8);
          setTimeout(() => onNav('research-papers'), 1000);
        }
      } catch (err) {
        setStep(8);
        setTimeout(() => onNav('research-papers'), 1000);
      }
    };
    fetchDiscovery();
    return () => { isMounted = false };
  }, [idea, onNav, setDiscoveredPapers])"""
    content = re.sub(r'function AIAnalysis\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{[\s\S]*?const pipeline = \[', ai_replacement + "\n  const pipeline = [", content)

    rpt_pattern = r'function ResearchPapersTable\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    rpt_replacement = """function ResearchPapersTable({ onNav, papers, selectedPaperIds, setSelectedPaperIds }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], setSelectedPaperIds: any }) {"""
    content = re.sub(rpt_pattern, rpt_replacement, content)
    content = content.replace('const [selectedPapers, setSelectedPapers] = useState<number[]>([])', '')
    content = content.replace('selectedPapers', 'selectedPaperIds')
    content = content.replace('setSelectedPapers', 'setSelectedPaperIds')

    rri_pattern = r'function RefineResearchIdea\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    rri_replacement = """function RefineResearchIdea({ onNav, papers, selectedPaperIds, refinedIdea, setRefinedIdea, selectedGaps, setSelectedGaps }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, setRefinedIdea: any, selectedGaps: string[], setSelectedGaps: any }) {"""
    content = re.sub(rri_pattern, rri_replacement, content)
    content = re.sub(r'const \[selectedGaps, setSelectedGaps\] = useState.*?;\n', '', content)
    content = re.sub(r'const \[localIdea, setLocalIdea\] = useState\(.*?\)\n', '', content)
    content = re.sub(r'const \[refinedIdea, setRefinedIdea\] = useState\(.*?\)\n', '', content)
    content = content.replace('localIdea', 'refinedIdea').replace('setLocalIdea', 'setRefinedIdea')
    
    aiv_pattern = r'function AIValidation\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    aiv_replacement = """function AIValidation({ onNav, papers, selectedPaperIds, refinedIdea, selectedGaps, setGeneratedSections, setDocxPath }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, selectedGaps: string[], setGeneratedSections: any, setDocxPath: any }) {"""
    content = re.sub(aiv_pattern, aiv_replacement, content)
    
    aiv_effect_replacement = """useEffect(() => {
    let isMounted = true;
    const runBackend = async () => {
      try {
        setValidationStep(1);
        const selPapers = papers.filter((p: any) => selectedPaperIds.includes(p.id));
        const ragRes = await fetch('/api/rag', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ papers: selPapers.map((p: any) => ({ title: p.title, url: p.doi || p.url })) })
        });
        const ragData = await ragRes.json();
        
        const updatedPapers = selPapers.map((p: any, i: any) => {
           if (ragData.results && ragData.results[i] && ragData.results[i].abstract) {
             return { ...p, abstract: ragData.results[i].abstract };
           }
           return p;
        });

        setValidationStep(4);
        const genRes = await fetch('/api/generate', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            refined_idea: refinedIdea, methodology_details: "Auto-generated methodology",
            selected_papers: updatedPapers.map((p: any) => ({ title: p.title, year: String(p.year), abstract: p.abstract, gaps: p.gaps?.map((g: any) => g.text) || [] })),
            selected_gaps: selectedGaps, title: "My Research Paper", author: "User"
          })
        });
        const genData = await genRes.json();
        
        if (isMounted && genData.sections) {
           setGeneratedSections(genData.sections);
           if (genData.docx_path) setDocxPath(genData.docx_path);
           setValidationStep(6);
           setTimeout(() => onNav('paper-generation'), 1000);
        }
      } catch (err) {
        setTimeout(() => onNav('paper-generation'), 1000);
      }
    };
    runBackend();
    return () => { isMounted = false };
  }, [papers, selectedPaperIds, onNav])"""
    content = re.sub(r'useEffect\(\(\) => \{[\s\S]*?\[validationStep, onNav\]\)', aiv_effect_replacement, content)

    content = re.sub(r'function PaperEditor\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', r'function PaperEditor({ onNav, generatedSections }: { onNav: (v: View) => void, generatedSections?: any })', content)
    content = re.sub(r'function PaperPreview\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', r'function PaperPreview({ onNav, generatedSections }: { onNav: (v: View) => void, generatedSections?: any })', content)
    content = re.sub(r'function DocxGeneration\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', r'function DocxGeneration({ onNav }: { onNav: (v: View) => void })', content)
    content = re.sub(r'function DocumentReady\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\)', r'function DocumentReady({ onNav, docxPath }: { onNav: (v: View) => void, docxPath?: string })', content)

    content = re.sub(r'(?<!\.)papers\.map\(\(p, i\)', r'(typeof papers !== "undefined" ? papers : PAPERS).map((p: any, i: any)', content)
    content = re.sub(r'(?<!\.)papers\.filter\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).filter((p: any)', content)
    content = re.sub(r'(?<!\.)papers\.find\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).find((p: any)', content)
    content = re.sub(r'(?<!\.)papers\.map\(\(p\)', r'(typeof papers !== "undefined" ? papers : PAPERS).map((p: any)', content)

    with open('frontend_new/Frontend/src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_app_tsx()
