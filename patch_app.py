import re

def patch_app_tsx():
    with open('Frontend/src/App.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add new state to App
    app_pattern = r'export default function App\(\) \{\n\s*const \[view, setView\] = useState<View>\(.*?\)\n\s*const \[dark, setDark\] = useState\(.*?\)'
    app_replacement = """export default function App() {
  const [view, setView] = useState<View>('research-input')
  const [dark, setDark] = useState(false)
  
  // Lifted State
  const [globalIdea, setGlobalIdea] = useState('')
  const [discoveredPapers, setDiscoveredPapers] = useState<Paper[]>([])
  const [selectedPaperIds, setSelectedPaperIds] = useState<number[]>([])
  const [refinedIdea, setRefinedIdea] = useState('')
  const [selectedGaps, setSelectedGaps] = useState<string[]>([])
  const [generatedSections, setGeneratedSections] = useState<any>(null)
  const [docxPath, setDocxPath] = useState<string>('')
"""
    content = re.sub(app_pattern, app_replacement, content)

    # 2. Update renderView in App
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

    # 3. Update ResearchInput
    ri_pattern = r'function ResearchInput\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{\n\s*const \[idea, setIdea\] = useState\([\s\S]*?\)'
    ri_replacement = r"""function ResearchInput({ onNav, idea, setIdea }: { onNav: (v: View) => void, idea: string, setIdea: (s: string) => void }) {"""
    content = re.sub(ri_pattern, ri_replacement, content)

    # 4. Update AIAnalysis
    ai_pattern = r'function AIAnalysis\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{.*?\n\s*\}\)'
    
    ai_replacement = """function AIAnalysis({ onNav, idea, setDiscoveredPapers }: { onNav: (v: View) => void, idea: string, setDiscoveredPapers: (p: any[]) => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    let isMounted = true;
    const fetchDiscovery = async () => {
      try {
        setStep(2);
        const res = await fetch('http://127.0.0.1:5000/api/discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea, keywords: "", preferences: "" })
        });
        const data = await res.json();
        if (data.papers && isMounted) {
          // Map backend response to frontend Paper format
          const mappedPapers = data.papers.map((p: any, i: number) => ({
            id: i + 1,
            rank: i + 1,
            relevance: p.relevance_score ? p.relevance_score * 10 : 80,
            title: p.title || 'Untitled',
            authors: Array.isArray(p.authors) ? p.authors.join(', ') : p.authors,
            year: p.year || 2024,
            venue: 'Unknown',
            source: 'Gemini',
            doi: p.url || '',
            abstract: p.abstract || '',
            whyMatters: '',
            keywords: [],
            methodology: '',
            dataset: '',
            findings: '',
            gaps: [],
            limitations: [],
            scores: { keyword: 80, gapRelevance: 80, semantic: 80, recency: 80 }
          }));
          setDiscoveredPapers(mappedPapers);
          setStep(8);
          setTimeout(() => onNav('research-papers'), 1000);
        }
      } catch (err) {
        console.error("Discovery error", err);
        setStep(8);
        setTimeout(() => onNav('research-papers'), 1000);
      }
    };
    fetchDiscovery();
    return () => { isMounted = false };
  }, [idea, onNav, setDiscoveredPapers])"""
    content = re.sub(r'function AIAnalysis\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{[\s\S]*?const pipeline = \[', ai_replacement + "\n  const pipeline = [", content)

    # 5. Update ResearchPapersTable
    rpt_pattern = r'function ResearchPapersTable\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    rpt_replacement = """function ResearchPapersTable({ onNav, papers, selectedPaperIds, setSelectedPaperIds }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], setSelectedPaperIds: any }) {"""
    content = re.sub(rpt_pattern, rpt_replacement, content)
    content = content.replace('const [selectedPapers, setSelectedPapers] = useState<number[]>([])', '')
    content = content.replace('selectedPapers', 'selectedPaperIds')
    content = content.replace('setSelectedPapers', 'setSelectedPaperIds')
    # Use papers instead of PAPERS in table rendering
    content = re.sub(r'PAPERS\.filter', 'papers.filter', content)
    content = re.sub(r'PAPERS\.map', 'papers.map', content)

    # 6. Update RefineResearchIdea
    rri_pattern = r'function RefineResearchIdea\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    rri_replacement = """function RefineResearchIdea({ onNav, papers, selectedPaperIds, refinedIdea, setRefinedIdea, selectedGaps, setSelectedGaps }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, setRefinedIdea: any, selectedGaps: string[], setSelectedGaps: any }) {"""
    content = re.sub(rri_pattern, rri_replacement, content)
    # Remove local states
    content = re.sub(r'const \[selectedGaps, setSelectedGaps\] = useState.*?;\n', '', content)
    content = re.sub(r'const \[localIdea, setLocalIdea\] = useState\(.*?\)\n', '', content)
    # Map localIdea to refinedIdea
    content = content.replace('localIdea', 'refinedIdea').replace('setLocalIdea', 'setRefinedIdea')
    
    # Update AIValidation (handles rag and generation)
    aiv_pattern = r'function AIValidation\(\{ onNav \}: \{ onNav: \(v: View\) => void \}\) \{'
    aiv_replacement = """function AIValidation({ onNav, papers, selectedPaperIds, refinedIdea, selectedGaps, setGeneratedSections, setDocxPath }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, selectedGaps: string[], setGeneratedSections: any, setDocxPath: any }) {"""
    content = re.sub(aiv_pattern, aiv_replacement, content)
    
    aiv_effect_pattern = r'useEffect\(\(\) => \{[\s\S]*?setValidationStep\(s => s \+ 1\)[\s\S]*?\}\)'
    aiv_effect_replacement = """useEffect(() => {
    let isMounted = true;
    const runBackend = async () => {
      try {
        // 1. Run RAG to get abstracts
        setValidationStep(1);
        const selPapers = papers.filter(p => selectedPaperIds.includes(p.id));
        const ragPayload = {
          papers: selPapers.map(p => ({ title: p.title, url: p.doi || p.url }))
        };
        const ragRes = await fetch('http://127.0.0.1:5000/api/rag', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(ragPayload)
        });
        const ragData = await ragRes.json();
        
        // merge abstracts back
        const updatedPapers = selPapers.map((p, i) => {
           if (ragData.results && ragData.results[i] && ragData.results[i].abstract) {
             return { ...p, abstract: ragData.results[i].abstract };
           }
           return p;
        });

        // 2. Run Generate
        setValidationStep(4);
        const genPayload = {
          refined_idea: refinedIdea,
          methodology_details: "Auto-generated methodology",
          selected_papers: updatedPapers.map(p => ({ title: p.title, year: String(p.year), abstract: p.abstract, gaps: p.gaps?.map(g => g.text) || [] })),
          selected_gaps: selectedGaps,
          title: "My Research Paper",
          author: "User"
        };
        const genRes = await fetch('http://127.0.0.1:5000/api/generate', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(genPayload)
        });
        const genData = await genRes.json();
        
        if (isMounted && genData.sections) {
           setGeneratedSections(genData.sections);
           if (genData.docx_path) setDocxPath(genData.docx_path);
           setValidationStep(6);
           setTimeout(() => onNav('paper-generation'), 1000);
        }
      } catch (err) {
        console.error(err);
        setTimeout(() => onNav('paper-generation'), 1000);
      }
    };
    runBackend();
    return () => { isMounted = false };
  }, [papers, selectedPaperIds, onNav])"""
    content = re.sub(r'useEffect\(\(\) => \{[\s\S]*?\[validationStep, onNav\]\)', aiv_effect_replacement, content)


    # Write back
    with open('Frontend/src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_app_tsx()
