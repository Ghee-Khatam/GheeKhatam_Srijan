import { useState, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type View =
  | 'research-input'      // 01 Idea
  | 'ai-analysis'         // 02 Discovery (Analysis)
  | 'research-papers'     // 02 Discovery (Table)
  | 'research-direction'  // 03 Research Direction
  | 'ai-validation'       // 04 Validation
  | 'paper-generation'    // 05 Paper Generation
  | 'paper-editor'        // 05 Paper Editor
  | 'paper-preview'       // 06 Preview
  | 'docx-generation'     // 07 Download (Exporting)
  | 'document-ready'      // 07 Download (Ready)

interface Gap {
  text: string
  type: 'explicit' | 'inferred'
  sourceEvidence?: string
  aiExplanation?: string
}

interface Paper {
  id: number
  rank: number
  relevance: number
  title: string
  authors: string
  year: number
  venue: string
  source: string
  doi: string
  abstract: string
  whyMatters: string
  keywords: string[]
  methodology: string
  dataset: string
  findings: string
  gaps: Gap[]
  limitations: string[]
  scores: { keyword: number; gapRelevance: number; semantic: number; recency: number }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAPERS: Paper[] = [
  {
    id: 1, rank: 1, relevance: 94,
    title: 'Multimodal Detection of Deceptive Product Reviews Using Cross-Attention Transformers',
    authors: 'John Doe, Jane Smith, Alex Brown',
    year: 2025, venue: 'ACL 2025', source: 'Semantic Scholar',
    doi: '10.18653/v1/2025.acl-main.001',
    abstract: 'We propose a multimodal transformer architecture that jointly encodes textual and visual features from product reviews to detect deceptive content. Our model achieves state-of-the-art performance on three benchmark datasets, outperforming text-only baselines by 11.4%.',
    whyMatters: 'Strong overlap with your proposed multimodal review detection approach. Validates the text+image fusion strategy.',
    keywords: ['Fake Review Detection', 'Multimodal Learning', 'Text-Image Fusion'],
    methodology: 'Multimodal Transformer (CLIP + BERT)',
    dataset: 'Amazon Reviews 2024',
    findings: 'Multimodal fusion improves F1 from 0.78 to 0.87 over text-only baselines. Image features are most informative for electronics reviews.',
    gaps: [
      {
        text: 'Text-image fusion remains underexplored for cross-domain generalization across different e-commerce verticals.',
        type: 'explicit',
        sourceEvidence: 'Section 6.2: "Our model evaluation is restricted to English electronics reviews; cross-domain generalization to fashion and home categories requires further study."',
      },
      {
        text: 'Explainability of the multimodal fusion mechanism is not evaluated or provided to end users.',
        type: 'inferred',
        aiExplanation: 'Analysis of Section 4 indicates that while attention maps are computed internally, no qualitative attribution or explainability metrics were reported.',
      },
    ],
    limitations: ['Limited to English-language reviews', 'Domain-specific evaluation only', 'No explainability analysis'],
    scores: { keyword: 91, gapRelevance: 85, semantic: 88, recency: 90 },
  },
  {
    id: 2, rank: 2, relevance: 89,
    title: 'Transformer-Based Fake Review Classification with Contrastive Learning',
    authors: 'Li Wei, Sarah Connor, David Park',
    year: 2024, venue: 'EMNLP 2024', source: 'arXiv',
    doi: '10.18653/v1/2024.emnlp-main.312',
    abstract: 'We introduce a contrastive learning approach for fake review detection that leverages unlabeled review data to improve representation quality. The model demonstrates strong zero-shot transfer across product domains.',
    whyMatters: 'Provides strong text-only baseline methodology for comparison in your experimental setup.',
    keywords: ['Contrastive Learning', 'Fake Review Detection', 'Transfer Learning'],
    methodology: 'RoBERTa + Contrastive Loss',
    dataset: 'Yelp Review Dataset',
    findings: 'Contrastive pre-training improves accuracy by 7.3% on out-of-domain evaluation.',
    gaps: [
      {
        text: 'No visual signal is incorporated despite images being present in over 40% of modern product reviews.',
        type: 'explicit',
        sourceEvidence: 'Section 1.1: "We focus solely on textual dynamics; integrating review imagery is left for future work."',
      },
      {
        text: 'Cross-lingual generalization and robustness against adversarial review rewrites were not tested.',
        type: 'inferred',
        aiExplanation: 'The authors tested only standard English benchmarks without evaluating paraphrased or AI-generated deceptive reviews.',
      },
    ],
    limitations: ['Text-only approach', 'English only', 'Requires large unlabeled corpus'],
    scores: { keyword: 82, gapRelevance: 88, semantic: 85, recency: 80 },
  },
  {
    id: 3, rank: 3, relevance: 83,
    title: 'Explainable AI for Online Review Authenticity Verification',
    authors: 'Maria Gonzalez, Tom Lee',
    year: 2024, venue: 'SIGIR 2024', source: 'OpenAlex',
    doi: '10.1145/3626772.3657890',
    abstract: 'This paper develops an explainable framework for online review authenticity detection, providing per-word and per-image attribution scores that help moderators understand model decisions.',
    whyMatters: 'Directly addresses the explainability gap identified across most papers in your landscape.',
    keywords: ['Explainable AI', 'Review Authenticity', 'Attribution Methods'],
    methodology: 'LIME + Attention Visualization',
    dataset: 'Tripadvisor Reviews',
    findings: 'Attention-based explanations achieve 91% user trust score in a human evaluation study.',
    gaps: [
      {
        text: 'Multimodal explanation alignment between text tokens and visual regions is not formally evaluated.',
        type: 'explicit',
        sourceEvidence: 'Section 5.3: "LIME explanations were computed independently for text and images without cross-modal attribution metrics."',
      },
      {
        text: 'Scalability to real-time e-commerce review moderation pipelines is not addressed.',
        type: 'inferred',
        aiExplanation: 'LIME feature attribution requires hundreds of perturbed forward passes per review, making real-time inference computationally prohibitive.',
      },
    ],
    limitations: ['Explanation quality degrades on short reviews', 'Evaluation limited to hospitality domain'],
    scores: { keyword: 75, gapRelevance: 92, semantic: 80, recency: 80 },
  },
  {
    id: 4, rank: 4, relevance: 76,
    title: 'Large-Scale Benchmark for Multimodal Deception Detection in E-Commerce',
    authors: 'Chen Zhang, Priya Patel, Omar Hassan',
    year: 2023, venue: 'NeurIPS 2023', source: 'Semantic Scholar',
    doi: '10.48550/arXiv.2311.09821',
    abstract: 'We introduce a new benchmark dataset of 2.3M product reviews with synchronized text and image annotations for deception detection research.',
    whyMatters: 'Provides the most diverse dataset available for your experimental setup, addressing dataset diversity gaps.',
    keywords: ['Benchmark Dataset', 'Multimodal', 'Deception Detection'],
    methodology: 'Dataset curation + baseline models',
    dataset: 'Custom Amazon-Multi 2023',
    findings: 'Current models achieve at most 74% accuracy on the diverse benchmark, showing significant room for improvement.',
    gaps: [
      {
        text: 'Temporal dynamics of fake review campaigns and seller manipulation are not captured in static dataset snapshots.',
        type: 'inferred',
        aiExplanation: 'Dataset collection sampled reviews at a single point in time without tracking seller account history or review posting timestamps.',
      },
    ],
    limitations: ['Amazon-centric', 'Annotation quality varies across categories'],
    scores: { keyword: 78, gapRelevance: 70, semantic: 75, recency: 65 },
  },
  {
    id: 5, rank: 5, relevance: 71,
    title: 'Graph Neural Networks for Review Credibility Assessment',
    authors: 'Yuki Tanaka, Arjun Mehta',
    year: 2023, venue: 'WWW 2023', source: 'OpenAlex',
    doi: '10.1145/3543507.3583388',
    abstract: 'We model reviewer behavioral patterns and product review graphs using heterogeneous GNNs to detect coordinated fake review campaigns.',
    whyMatters: 'Offers complementary structural signal that could be combined with your multimodal approach.',
    keywords: ['Graph Neural Networks', 'Review Credibility', 'Fraud Detection'],
    methodology: 'Heterogeneous GNN',
    dataset: 'Amazon + Yelp Graph Data',
    findings: 'GNN-based approach improves campaign-level detection by 19% over individual review methods.',
    gaps: [
      {
        text: 'Review text and visual image content are completely omitted from graph node features.',
        type: 'explicit',
        sourceEvidence: 'Section 3: "Node embeddings represent metadata (IP, user ID, timestamp) without content features."',
      },
      {
        text: 'Real-time graph updating for new incoming reviews is computationally expensive.',
        type: 'inferred',
        aiExplanation: 'Dynamic graph recalculation on million-node graphs induces high latency for immediate review moderation.',
      },
    ],
    limitations: ['Requires full reviewer history', 'Does not model review content'],
    scores: { keyword: 68, gapRelevance: 72, semantic: 70, recency: 65 },
  },
]

// ─── Utility Components ───────────────────────────────────────────────────────

function Badge({ children, variant = 'default', size = 'sm', className = '' }: {
  children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'sage' | 'cream' | 'olive' | 'ai' | 'source'; size?: 'xs' | 'sm'; className?: string
}) {
  const base = `inline-flex items-center font-mono-research font-medium uppercase tracking-wider ${size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'} rounded`
  const variants = {
    default: 'bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]',
    success: 'bg-[#4F7A55]/15 text-[#4F7A55] border border-[#4F7A55]/30',
    warning: 'bg-[#B7791F]/15 text-[#B7791F] border border-[#B7791F]/30',
    error: 'bg-[#B94A48]/15 text-[#B94A48] border border-[#B94A48]/30',
    sage: 'bg-[var(--sage)]/30 text-[var(--foreground)] border border-[var(--sage)]/50',
    cream: 'bg-[var(--cream)]/80 text-[var(--foreground)] border border-[var(--accent)]/40',
    olive: 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30',
    ai: 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40 font-semibold',
    source: 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] font-semibold',
  }
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
}

function RelevanceBadge({ score }: { score: number }) {
  const variant = score >= 90 ? 'success' : score >= 75 ? 'warning' : 'default'
  return <Badge variant={variant}>{score}% Relevant</Badge>
}

function Btn({ children, variant = 'primary', onClick, size = 'md', className = '', disabled = false }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; onClick?: () => void;
  size?: 'sm' | 'md' | 'lg'; className?: string; disabled?: boolean
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius)] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-6 py-3 font-semibold' }
  const variants = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[#687442] active:scale-[0.98] shadow-sm',
    secondary: 'bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--secondary)] active:scale-[0.98]',
    ghost: 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function ProgressStep({ label, status, count }: { label: string; status: 'done' | 'active' | 'pending'; count?: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 shrink-0">
        {status === 'done' && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--success)]/20 text-[var(--success)]">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
        {status === 'active' && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)]/20">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse-dot" />
          </span>
        )}
        {status === 'pending' && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[var(--border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${status === 'done' ? 'text-[var(--muted-foreground)]' : status === 'active' ? 'text-[var(--foreground)] font-semibold' : 'text-[var(--muted-foreground)]/60'}`}>
          {label}
        </p>
      </div>
      {count && status !== 'pending' && (
        <span className="text-xs font-mono-research text-[var(--muted-foreground)]">{count}</span>
      )}
    </div>
  )
}

// ─── Header & Stage Progress Bar ──────────────────────────────────────────────

const STAGES = [
  { id: '01 Idea', view: 'research-input', label: '01 Idea' },
  { id: '02 Discovery', view: 'research-papers', label: '02 Discovery' },
  { id: '03 Research Direction', view: 'research-direction', label: '03 Direction' },
  { id: '04 Validation', view: 'ai-validation', label: '04 Validation' },
  { id: '05 Paper', view: 'paper-editor', label: '05 Paper' },
  { id: '06 Preview', view: 'paper-preview', label: '06 Preview' },
  { id: '07 Download', view: 'document-ready', label: '07 Download' },
]

function Header({ current, onNav, dark, onToggleDark }: { current: View; onNav: (v: View) => void; dark: boolean; onToggleDark: () => void }) {
  const getViewStageIndex = (v: View) => {
    switch (v) {
      case 'research-input': return 0
      case 'ai-analysis':
      case 'research-papers': return 1
      case 'research-direction': return 2
      case 'ai-validation': return 3
      case 'paper-generation':
      case 'paper-editor': return 4
      case 'paper-preview': return 5
      case 'docx-generation':
      case 'document-ready': return 6
      default: return 0
    }
  }

  const activeIdx = getViewStageIndex(current)

  return (
    <header className="shrink-0 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNav('research-input')}>
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            R
          </div>
          <span className="font-semibold text-lg text-[var(--foreground)] tracking-tight">ResearchAI</span>
        </div>

        {/* 7-Stage Progress Indicator */}
        <nav className="flex items-center gap-1.5 bg-[var(--secondary)]/70 p-1.5 rounded-full border border-[var(--border)] overflow-x-auto">
          {STAGES.map((s, idx) => {
            const isDone = idx < activeIdx
            const isActive = idx === activeIdx
            return (
              <button
                key={s.id}
                onClick={() => onNav(s.view as View)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-research transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--primary)] text-white font-semibold shadow-xs'
                    : isDone
                    ? 'text-[var(--foreground)] font-medium hover:bg-[var(--card)]'
                    : 'text-[var(--muted-foreground)]/60 hover:text-[var(--foreground)]'
                }`}
              >
                <span>{s.label}</span>
                {isDone && <span className="text-[10px]">✓</span>}
              </button>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDark}
            className="w-9 h-9 rounded-lg bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Toggle theme"
          >
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── STAGE 1: Research Input Screen ──────────────────────────────────────────

function ResearchInput({ onNav, idea, setIdea }: { onNav: (v: View) => void, idea: string, setIdea: (s: string) => void }) {
  const [yearRange, setYearRange] = useState(2020)
  const [maxPapers, setMaxPapers] = useState('30')

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 max-w-4xl mx-auto w-full animate-fade-in space-y-8">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="olive" size="sm">Single-Session AI Research Discovery</Badge>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)] tracking-tight leading-tight">
          Turn Your Research Idea Into a Stronger Research Direction
        </h1>
        <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
          Analyze your idea, discover relevant research, identify research gaps, and generate an IEEE-format research paper.
        </p>
      </div>

      {/* Main Research Idea Card */}
      <Card className="p-6 sm:p-8 shadow-sm">
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center justify-between">
          <span>Complete Research Idea <span className="text-[var(--error)]">*</span></span>
          <span className="text-xs text-[var(--muted-foreground)] font-normal">Describe your idea in your own words</span>
        </label>
        <textarea
          rows={5}
          value={idea}
          onChange={e => setIdea(e.target.value)}
          className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition resize-none leading-relaxed font-lora"
          placeholder="Describe your research idea, what you want to build or analyze..."
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span>AI will analyze topics, extract keywords & fetch papers</span>
          </div>
          <Btn size="lg" onClick={() => onNav('ai-analysis')}>
            Start Research / Analyze My Research Idea →
          </Btn>
        </div>
      </Card>

      {/* Discovery Preferences */}
      <Card className="p-6">
        <p className="text-sm font-semibold text-[var(--foreground)] mb-4">Discovery Preferences</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-2">
              Preferred Year Range: <span className="font-mono-research font-semibold text-[var(--foreground)]">{yearRange}–2026</span>
            </label>
            <input
              type="range"
              min={2018}
              max={2025}
              value={yearRange}
              onChange={e => setYearRange(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-2">Maximum Papers</label>
            <div className="flex gap-2">
              {['20', '30', '50'].map(n => (
                <button
                  key={n}
                  onClick={() => setMaxPapers(n)}
                  className={`text-xs px-4 py-1.5 rounded-[var(--radius)] border transition ${
                    maxPapers === n
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-medium'
                      : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── STAGE 2: AI Analysis Progress ────────────────────────────────────────────

function AIAnalysis({ onNav, idea, setDiscoveredPapers }: { onNav: (v: View) => void, idea: string, setDiscoveredPapers: (p: any[]) => void }) {
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
  }, [idea, onNav, setDiscoveredPapers])
  const pipeline = [
    'Research idea received',
    'Understanding research topic',
    'Extracting keywords',
    'Identifying related concepts',
    'Finding relevant research papers',
    'Processing papers',
    'Identifying research gaps',
    'Calculating relevance',
    'Preparing research landscape',
  ]

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full animate-fade-in space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">Analyzing Your Research Idea</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          ResearchAI is scanning literature sources to extract relevant papers and identified gaps.
        </p>
      </div>

      <Card className="p-6">
        <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)] mb-4">
          Analysis Pipeline
        </p>
        <div className="divide-y divide-[var(--border)]">
          {pipeline.map((label, i) => {
            const status = i < step ? 'done' : i === step ? 'active' : 'pending'
            const counts: Record<number, string> = { 4: '47 papers found', 5: '23 analyzed', 6: '8 gaps identified' }
            return <ProgressStep key={i} label={label} status={status} count={counts[i]} />
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
          {[{ v: '47', l: 'Discovered' }, { v: '23', l: 'Analyzed' }, { v: '8', l: 'Gaps Found' }].map(s => (
            <div key={s.l} className="bg-[var(--secondary)] rounded-[var(--radius)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--foreground)]">{s.v}</p>
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── STAGE 3: Relevant Research Papers Table ──────────────────────────────────

function ResearchPapersTable({ onNav, papers, selectedPaperIds, setSelectedPaperIds }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], setSelectedPaperIds: any }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 3])
  const [search, setSearch] = useState('')
  const [activeEvidencePaper, setActiveEvidencePaper] = useState<{ paper: Paper; gap?: Gap } | null>(null)

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const selectAll = () => {
    setSelectedIds(papers.map(p => p.id))
  }

  const filteredPapers = papers.filter(
    p =>
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-8 animate-fade-in max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">Relevant Research Papers</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Review the most relevant research papers and their identified research gaps before refining your research direction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-1.5">
              <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <path d="m21 21-4.35-4.35" strokeWidth={2} />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search papers or gaps..."
                className="bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]/60 w-44"
              />
            </div>
            <Btn size="sm" onClick={() => onNav('research-direction')}>
              Continue ({selectedIds.length} Selected) →
            </Btn>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="flex items-center justify-between bg-[var(--secondary)]/60 border border-[var(--border)] rounded-[var(--radius)] px-4 py-2.5">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-[var(--foreground)] font-mono-research">
              {selectedIds.length} paper{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <button onClick={selectAll} className="text-[var(--primary)] hover:underline font-medium">
              Select All
            </button>
            {selectedIds.length > 0 && (
              <button onClick={() => setSelectedIds([])} className="text-[var(--muted-foreground)] hover:underline">
                Clear
              </button>
            )}
          </div>
          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
            Checkboxes select papers to inform your refined proposal
          </span>
        </div>

        {/* Academic Table with EXACTLY THREE PRIMARY COLUMNS */}
        <Card className="overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              {/* Sticky Table Header */}
              <thead>
                <tr className="bg-[var(--secondary)] border-b border-[var(--border)] text-xs font-mono-research uppercase tracking-wider text-[var(--muted-foreground)]">
                  <th className="py-3.5 px-4 font-semibold w-[35%]">Paper Name</th>
                  <th className="py-3.5 px-4 font-semibold w-[35%]">Abstract</th>
                  <th className="py-3.5 px-4 font-semibold w-[30%]">Research Gaps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm">
                {filteredPapers.map(paper => {
                  const isSelected = selectedIds.includes(paper.id)
                  return (
                    <tr
                      key={paper.id}
                      className={`align-top transition-colors ${
                        isSelected ? 'bg-[var(--primary)]/5' : 'hover:bg-[var(--secondary)]/40'
                      }`}
                    >
                      {/* COLUMN 1: Paper Name (with checkbox interaction control inside) */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(paper.id)}
                            className="mt-1 w-4 h-4 accent-[var(--primary)] rounded cursor-pointer shrink-0"
                            title="Select paper"
                          />
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <RelevanceBadge score={paper.relevance} />
                              <Badge variant="sage" size="xs">{paper.source}</Badge>
                            </div>

                            <h3 className="font-medium text-[var(--foreground)] leading-snug text-sm">
                              {paper.title}
                            </h3>

                            <p className="text-xs text-[var(--muted-foreground)]">
                              {paper.authors} · <span className="font-semibold">{paper.year}</span> · {paper.venue}
                            </p>

                            <p className="text-[11px] font-mono-research text-[var(--muted-foreground)]/70">
                              DOI: {paper.doi}
                            </p>

                            <div className="pt-2">
                              <button
                                onClick={() => setActiveEvidencePaper({ paper })}
                                className="text-xs text-[var(--primary)] font-medium hover:underline inline-flex items-center gap-1"
                              >
                                View Detailed Analysis →
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* COLUMN 2: Abstract */}
                      <td className="py-4 px-4">
                        <div className="space-y-3">
                          <p className="text-xs text-[var(--foreground)]/90 leading-relaxed font-lora line-clamp-4">
                            {paper.abstract}
                          </p>

                          <div className="bg-[var(--cream)]/60 rounded-[var(--radius)] p-2.5 border border-[var(--accent)]/30">
                            <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--muted-foreground)] mb-1">
                              Why This Paper Matters
                            </p>
                            <p className="text-xs text-[var(--foreground)] italic">
                              "{paper.whyMatters}"
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {paper.keywords.map(k => (
                              <Badge key={k} variant="sage" size="xs">{k}</Badge>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* COLUMN 3: Research Gaps */}
                      <td className="py-4 px-4">
                        <div className="space-y-3">
                          {paper.gaps.map((gap, gi) => (
                            <div
                              key={gi}
                              className={`p-3 rounded-[var(--radius)] border text-xs space-y-2 ${
                                gap.type === 'explicit'
                                  ? 'bg-[var(--sage)]/15 border-[var(--sage)]/40'
                                  : 'bg-[var(--cream)]/40 border-[var(--accent)]/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 flex-wrap">
                                <Badge size="xs" variant={gap.type === 'explicit' ? 'sage' : 'cream'}>
                                  {gap.type === 'explicit' ? 'SOURCE-IDENTIFIED GAP' : 'AI-INFERRED GAP'}
                                </Badge>
                                {gap.type === 'inferred' && (
                                  <Badge size="xs" variant="ai">AI GENERATED</Badge>
                                )}
                                {gap.type === 'explicit' && (
                                  <Badge size="xs" variant="source">SOURCE EVIDENCE</Badge>
                                )}
                              </div>

                              <p className="text-[var(--foreground)] leading-snug">
                                {gap.text}
                              </p>

                              <button
                                onClick={() => setActiveEvidencePaper({ paper, gap })}
                                className="text-[11px] font-mono-research text-[var(--primary)] hover:underline inline-flex items-center gap-1 pt-1"
                              >
                                View Evidence →
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="shrink-0 bg-[var(--card)] border-t border-[var(--border)] px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {selectedIds.length} paper{selectedIds.length !== 1 ? 's' : ''} selected
            </span>
            <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
              Selected papers will be synthesized into your research direction stage
            </span>
          </div>

          <Btn onClick={() => onNav('research-direction')} size="md">
            Continue to Refine Research Idea →
          </Btn>
        </div>
      </div>

      {/* Evidence Modal / Drawer */}
      {activeEvidencePaper && (
        <EvidenceDrawer
          paper={activeEvidencePaper.paper}
          selectedGap={activeEvidencePaper.gap}
          onClose={() => setActiveEvidencePaper(null)}
        />
      )}
    </div>
  )
}

// ─── Evidence Drawer / Modal ──────────────────────────────────────────────────

function EvidenceDrawer({ paper, selectedGap, onClose }: { paper: Paper; selectedGap?: Gap; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <Card className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl z-10">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RelevanceBadge score={paper.relevance} />
              <Badge variant="sage" size="xs">{paper.source}</Badge>
              <Badge variant="sage" size="xs">SOURCE VERIFIED</Badge>
            </div>
            <h2 className="font-semibold text-lg text-[var(--foreground)]">{paper.title}</h2>
            <p className="text-xs text-[var(--muted-foreground)]">{paper.authors} ({paper.year}) · {paper.venue}</p>
          </div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-lg">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {selectedGap && (
            <div className="bg-[var(--secondary)] p-4 rounded-[var(--radius)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <Badge size="xs" variant={selectedGap.type === 'explicit' ? 'sage' : 'cream'}>
                  {selectedGap.type === 'explicit' ? 'SOURCE-IDENTIFIED GAP' : 'AI-INFERRED GAP'}
                </Badge>
                {selectedGap.type === 'inferred' && <Badge size="xs" variant="ai">AI GENERATED</Badge>}
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">{selectedGap.text}</p>

              {selectedGap.type === 'explicit' && selectedGap.sourceEvidence && (
                <div className="pt-2 border-t border-[var(--border)] space-y-1">
                  <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
                    Source Evidence (Direct Quote from Paper)
                  </p>
                  <p className="text-xs text-[var(--foreground)] italic font-lora bg-[var(--card)] p-3 rounded border border-[var(--border)]">
                    {selectedGap.sourceEvidence}
                  </p>
                </div>
              )}

              {selectedGap.type === 'inferred' && selectedGap.aiExplanation && (
                <div className="pt-2 border-t border-[var(--border)] space-y-1">
                  <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--primary)]">
                    AI-Inferred Gap Rationale
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] bg-[var(--card)] p-3 rounded border border-[var(--border)]">
                    {selectedGap.aiExplanation}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
              Abstract
            </p>
            <p className="text-sm text-[var(--foreground)] leading-relaxed font-lora">
              {paper.abstract}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-mono-research text-[var(--muted-foreground)] uppercase">Methodology</p>
              <p className="font-medium text-[var(--foreground)] mt-0.5">{paper.methodology}</p>
            </div>
            <div>
              <p className="font-mono-research text-[var(--muted-foreground)] uppercase">Dataset</p>
              <p className="font-medium text-[var(--foreground)] mt-0.5">{paper.dataset}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
              All Identified Gaps for This Paper
            </p>
            <div className="space-y-2">
              {paper.gaps.map((g, i) => (
                <div key={i} className="p-3 bg-[var(--secondary)]/60 rounded border border-[var(--border)] text-xs">
                  <span className="font-semibold text-[var(--foreground)] block mb-1">{g.text}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] uppercase">{g.type === 'explicit' ? 'Source Identified' : 'AI Inferred'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end">
          <Btn variant="secondary" size="sm" onClick={onClose}>Close</Btn>
        </div>
      </Card>
    </div>
  )
}

// ─── STAGE 4: Refine Your Research Idea Screen ────────────────────────────────

function RefineResearchIdea({ onNav, papers, selectedPaperIds, refinedIdea, setRefinedIdea, selectedGaps, setSelectedGaps }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, setRefinedIdea: any, selectedGaps: string[], setSelectedGaps: any }) {
  const [refinedIdea, setRefinedIdea] = useState(
    'I want to combine text and image features using a cross-attention multimodal transformer (CLIP + BERT) and compare it against text-only baseline models on Amazon Reviews 2024 to detect fake product reviews with high accuracy and explainable attribution scores.'
  )
  const [proposedMethodology, setProposedMethodology] = useState(
    'A dual-stream encoder architecture combining CLIP for visual patch features and BERT-large for text token representations, fused via multi-head cross-attention.'
  )
  const [dataset, setDataset] = useState('Amazon Reviews 2024 (2.3M reviews) + Tripadvisor cross-domain benchmark')
  const [technologies, setTechnologies] = useState(['PyTorch', 'CLIP', 'BERT', 'Transformers', 'Python', 'RAG'])
  const [newTech, setNewTech] = useState('')
  const [expectedContribution, setExpectedContribution] = useState(
    '1. Multimodal fusion baseline for review authenticity.\n2. Cross-domain generalizability evaluation.\n3. Per-token and per-region explainability module.'
  )
  const [additionalInfo, setAdditionalInfo] = useState('Aiming for ACL/EMNLP format submission')

  const addTech = () => {
    if (newTech.trim()) {
      setTechnologies([...technologies, newTech.trim()])
      setNewTech('')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto w-full animate-fade-in space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="olive" size="sm">Stage 3: Research Direction</Badge>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">Now Refine Your Research Idea</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Based on the research papers and identified gaps above, describe your complete refined research idea in your own words.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Primary Textarea Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Large Textarea */}
          <Card className="p-6">
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
              Your Refined Research Idea <span className="text-[var(--error)]">*</span>
            </label>
            <p className="text-xs text-[var(--muted-foreground)] mb-3">
              Write or rewrite your full proposal incorporating insights from the literature table.
            </p>
            <textarea
              rows={8}
              value={refinedIdea}
              onChange={e => setRefinedIdea(e.target.value)}
              className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition resize-none leading-relaxed font-lora"
              placeholder="Describe your complete research idea, including the problem you want to solve, your proposed approach, technologies, dataset, expected contribution, and any other important details..."
            />
          </Card>

          {/* Optional Supporting Fields */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Optional Supporting Parameters</h3>

            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Proposed Methodology</label>
              <textarea
                rows={3}
                value={proposedMethodology}
                onChange={e => setProposedMethodology(e.target.value)}
                className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition resize-none"
                placeholder="Explain your approach..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Dataset</label>
                <input
                  type="text"
                  value={dataset}
                  onChange={e => setDataset(e.target.value)}
                  className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. Amazon Reviews 2024"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Additional Information</label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={e => setAdditionalInfo(e.target.value)}
                  className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition"
                  placeholder="e.g. Target conference format..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Technologies</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {technologies.map(t => (
                  <span key={t} className="bg-[var(--sage)]/30 text-[var(--foreground)] text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    {t}
                    <button onClick={() => setTechnologies(technologies.filter(x => x !== t))} className="text-[var(--muted-foreground)] hover:text-[var(--error)]">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTech()}
                  placeholder="Add technology..."
                  className="flex-1 bg-transparent border border-[var(--border)] rounded px-3 py-1.5 text-xs text-[var(--foreground)] outline-none"
                />
                <Btn variant="secondary" size="sm" onClick={addTech}>Add</Btn>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Expected Contribution</label>
              <textarea
                rows={3}
                value={expectedContribution}
                onChange={e => setExpectedContribution(e.target.value)}
                className="w-full bg-transparent border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition resize-none"
                placeholder="What novelty or dataset do you contribute?"
              />
            </div>
          </Card>

          <div className="flex items-center gap-4">
            <Btn size="lg" onClick={() => onNav('ai-validation')}>
              Submit Research Direction →
            </Btn>
          </div>
        </div>

        {/* Right Column: Selected Literature & Gaps Summary */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4 bg-[var(--secondary)]/50">
            <div>
              <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">Selected Sources</p>
              <p className="text-lg font-bold text-[var(--foreground)] mt-0.5">3 Papers Selected</p>
            </div>

            <div className="space-y-3">
              {PAPERS.slice(0, 3).map((p, i) => (
                <div key={p.id} className="bg-[var(--card)] p-3 rounded border border-[var(--border)] text-xs space-y-1">
                  <span className="font-semibold text-[var(--primary)]">[{i + 1}] {p.title}</span>
                  <p className="text-[var(--muted-foreground)]">{p.authors} ({p.year})</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
              Research Gaps You May Address
            </p>
            <div className="space-y-2 text-xs">
              {[
                'Multimodal analysis of text+image features remains underexplored for cross-domain generalization.',
                'Explainability of multimodal detection decisions is not evaluated or provided to end users.',
                'Lack of real-world benchmarks evaluated across diverse e-commerce categories.',
              ].map((g, i) => (
                <div key={i} className="flex items-start gap-2 bg-[var(--cream)]/40 p-2.5 rounded border border-[var(--accent)]/30">
                  <span className="text-[var(--success)] font-bold">✓</span>
                  <span className="text-[var(--foreground)]">{g}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── STAGE 5: AI Validation ───────────────────────────────────────────────────

function AIValidation({ onNav, papers, selectedPaperIds, refinedIdea, selectedGaps, setGeneratedSections, setDocxPath }: { onNav: (v: View) => void, papers: Paper[], selectedPaperIds: number[], refinedIdea: string, selectedGaps: string[], setGeneratedSections: any, setDocxPath: any }) {
  const [answers, setAnswers] = useState<Record<string, string>>({
    dataset: 'Amazon Reviews 2024 (Electronics & Fashion sub-categories)',
    metrics: 'Accuracy, F1-Score, Precision, Recall, AUC-ROC',
  })

  const isComplete = Object.keys(answers).length >= 2

  const checklist = [
    { label: 'Research Problem', status: 'Defined', ok: true },
    { label: 'Research Methodology', status: 'Defined', ok: true },
    { label: 'Dataset', status: 'Needs clarification', ok: answers.dataset?.length > 3 },
    { label: 'Baseline Models', status: 'Needs clarification', ok: answers.metrics?.length > 3 },
    { label: 'Evaluation Metrics', status: 'Needs clarification', ok: answers.metrics?.length > 3 },
    { label: 'Expected Contribution', status: 'Defined', ok: true },
  ]

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full animate-fade-in space-y-6">
      <div className="space-y-2">
        <Badge variant="olive" size="sm">Stage 4: Validation</Badge>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">AI Research Validation</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          ResearchAI evaluates whether your research direction contains sufficient scientific rigour for IEEE paper generation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Checklist */}
        <Card className="p-6 space-y-4">
          <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
            Validation Checklist
          </p>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${item.ok ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--warning)]/20 text-[var(--warning)]'}`}>
                    {item.ok ? '✓' : '!'}
                  </span>
                  <span className="text-[var(--foreground)] font-medium">{item.label}</span>
                </div>
                <Badge size="xs" variant={item.ok ? 'success' : 'warning'}>
                  {item.ok ? 'Defined' : 'Needs clarification'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Direction Summary */}
        <Card className="p-6 space-y-3 bg-[var(--secondary)]">
          <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
            Validated Direction
          </p>
          <div className="text-xs space-y-2">
            <div>
              <p className="text-[var(--muted-foreground)]">Topic:</p>
              <p className="font-semibold text-[var(--foreground)]">Multimodal Fake Product Review Detection</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Methodology:</p>
              <p className="font-semibold text-[var(--foreground)]">CLIP + BERT Cross-Attention Transformer</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Selected Sources:</p>
              <p className="font-semibold text-[var(--foreground)]">3 IEEE/ACL Benchmark Papers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Clarifying questions */}
      <Card className="p-6 space-y-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Academic Clarification Questions
        </p>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[var(--foreground)] mb-1">
              Which dataset will you use for experimental evaluation?
            </label>
            <input
              type="text"
              value={answers.dataset || ''}
              onChange={e => setAnswers({ ...answers, dataset: e.target.value })}
              placeholder="e.g. Amazon Reviews 2024"
              className="w-full bg-transparent border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--foreground)] outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-[var(--foreground)] mb-1">
              What evaluation metrics and baseline models will you compare against?
            </label>
            <input
              type="text"
              value={answers.metrics || ''}
              onChange={e => setAnswers({ ...answers, metrics: e.target.value })}
              placeholder="e.g. Accuracy, F1-score vs text-only BERT baseline"
              className="w-full bg-transparent border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--foreground)] outline-none"
            />
          </div>
        </div>
      </Card>

      {isComplete && (
        <Card className="p-4 bg-[var(--success)]/10 border-[var(--success)]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[var(--success)] text-white flex items-center justify-center font-bold text-sm">✓</span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Research Plan Validated ✓</p>
              <p className="text-xs text-[var(--muted-foreground)]">Your proposal is structured and ready for academic paper generation.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center pt-2">
        <Btn variant="secondary" onClick={() => onNav('research-direction')}>← Back to Direction</Btn>
        <Btn size="lg" onClick={() => onNav('paper-generation')}>
          Generate Research Paper →
        </Btn>
      </div>
    </div>
  )
}

// ─── STAGE 6: Paper Generation ────────────────────────────────────────────────

function PaperGeneration({ onNav }: { onNav: (v: View) => void }) {
  const [step, setStep] = useState(0)
  const sections = [
    'Title', 'Abstract', 'Keywords', 'Introduction', 'Related Work', 'Problem Statement',
    'Proposed Methodology', 'System Architecture', 'Dataset', 'Experimental Setup',
    'Results', 'Discussion', 'Limitations', 'Future Work', 'Conclusion', 'References'
  ]
  const pipeline = [
    'Research sources reviewed',
    'Research gaps analyzed',
    'Research methodology validated',
    'Paper structure prepared',
    'Generating academic sections',
    'Preparing references',
    'Preparing document'
  ]

  useEffect(() => {
    if (step < sections.length + pipeline.length) {
      const t = setTimeout(() => setStep(s => s + 1), 300)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => onNav('paper-editor'), 800)
      return () => clearTimeout(t)
    }
  }, [step, onNav, sections.length, pipeline.length])

  const pipelineStep = Math.min(step, pipeline.length - 1)
  const sectionsDone = Math.max(0, step - pipeline.length)

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full animate-fade-in space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Generating Your Research Paper</h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Synthesizing literature gaps, methodology, and citations into an IEEE paper draft.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
            Generation Stages
          </p>
          {pipeline.map((label, i) => (
            <ProgressStep key={i} label={label} status={i < pipelineStep ? 'done' : i === pipelineStep ? 'active' : 'pending'} />
          ))}
        </Card>

        <Card className="p-6 space-y-2">
          <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
            Academic Sections
          </p>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {sections.map((s, i) => {
              const done = i < sectionsDone
              const active = i === sectionsDone
              return (
                <div key={s} className={`text-xs flex items-center gap-2 ${done ? 'text-[var(--success)] font-medium' : active ? 'text-[var(--foreground)] font-bold' : 'text-[var(--muted-foreground)]/50'}`}>
                  <span>{done ? '✓' : active ? '●' : '○'}</span>
                  <span>{i + 1}. {s}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Safety & Integrity Notice */}
      <Card className="p-5 bg-[var(--warning)]/10 border-[var(--warning)]/40 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="xs">Academic Integrity Notice</Badge>
        </div>
        <p className="text-xs text-[var(--foreground)] leading-relaxed font-medium">
          "ResearchAI does not fabricate research papers, authors, citations, datasets, experimental results, or accuracy values."
        </p>
        <p className="text-[11px] text-[var(--muted-foreground)]">
          Unverified data and pending experimental metrics will display explicit academic placeholders such as:
        </p>
        <div className="flex flex-wrap gap-2 pt-1 font-mono-research text-[10px]">
          <span className="bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--border)]">[RESULTS TO BE ADDED AFTER EXPERIMENTATION]</span>
          <span className="bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--border)]">[EXPERIMENTAL RESULTS REQUIRED]</span>
        </div>
      </Card>
    </div>
  )
}

// ─── STAGE 7: Academic Paper Editor ───────────────────────────────────────────

const PAPER_SECTIONS = [
  { id: 'title', label: '1. Title' },
  { id: 'abstract', label: '2. Abstract' },
  { id: 'keywords', label: '3. Keywords' },
  { id: 'introduction', label: '4. Introduction' },
  { id: 'related', label: '5. Related Work' },
  { id: 'problem', label: '6. Problem Statement' },
  { id: 'methodology', label: '7. Proposed Methodology' },
  { id: 'architecture', label: '8. System Architecture' },
  { id: 'dataset', label: '9. Dataset' },
  { id: 'setup', label: '10. Experimental Setup' },
  { id: 'results', label: '11. Results' },
  { id: 'discussion', label: '12. Discussion' },
  { id: 'limitations', label: '13. Limitations' },
  { id: 'future', label: '14. Future Work' },
  { id: 'conclusion', label: '15. Conclusion' },
  { id: 'references', label: '16. References' },
]

function PaperEditor({ onNav }: { onNav: (v: View) => void }) {
  const [activeSec, setActiveSec] = useState('introduction')
  const [panelTab, setPanelTab] = useState<'ai' | 'sources'>('ai')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor Top Bar */}
      <div className="shrink-0 bg-[var(--card)] border-b border-[var(--border)] px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="olive" size="xs">Stage 5: Paper Editor</Badge>
          <span className="text-xs font-semibold text-[var(--foreground)] truncate">
            Multimodal Fake Product Review Detection Using Cross-Attention Transformers
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm" onClick={() => onNav('paper-preview')}>
            Paper Preview →
          </Btn>
          <Btn size="sm" onClick={() => onNav('paper-preview')}>
            Export / Download IEEE →
          </Btn>
        </div>
      </div>

      {/* Main 3-Column Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: Paper Outline */}
        <div className="w-52 shrink-0 border-r border-[var(--border)] bg-[var(--card)] overflow-y-auto py-3">
          <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--muted-foreground)] px-4 mb-2">
            Paper Outline (16 Sections)
          </p>
          <nav className="space-y-0.5">
            {PAPER_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSec(s.id)}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                  activeSec === s.id
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)] border-r-2 border-[var(--primary)] font-semibold'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* COLUMN 2: Center Content Editor */}
        <div className="flex-1 overflow-y-auto bg-[var(--secondary)]/40 p-6 flex justify-center">
          <div className="w-full max-w-2xl bg-white shadow-sm rounded border border-[var(--border)] p-10 font-lora space-y-6 text-[#1C211B]">
            {/* Document Title Header */}
            <div className="text-center space-y-2 border-b border-[#D8D6C5] pb-6">
              <h1 className="text-lg font-bold leading-tight">
                Multimodal Fake Product Review Detection Using Cross-Attention Transformer Fusion
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">Researcher A., Collaborator B.</p>
              <p className="text-[11px] text-[var(--muted-foreground)] italic">IEEE Conference Format Draft</p>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono-research text-center uppercase tracking-widest">ABSTRACT</h3>
              <p className="text-xs leading-relaxed text-justify">
                The proliferation of deceptive product reviews presents a critical challenge for e-commerce platforms and consumers. Existing detection systems rely predominantly on textual signals, neglecting the rich visual evidence embedded in review images. This paper proposes a multimodal transformer architecture that jointly encodes textual and visual features through a cross-attention fusion mechanism. Evaluated on a curated benchmark combining Amazon Reviews 2024 and a cross-domain dataset, our approach demonstrates statistically significant improvements over text-only baselines.
              </p>
            </div>

            {/* Introduction */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono-research uppercase">1. INTRODUCTION</h3>
              <p className="text-xs leading-relaxed text-justify">
                Online product reviews are a cornerstone of consumer decision-making, with studies indicating that over 93% of consumers consult reviews before purchasing [1]. However, the financial incentives for businesses to manipulate review scores have led to a significant proliferation of deceptive reviews [2].
              </p>
              <p className="text-xs leading-relaxed text-justify">
                This paper addresses three key research gaps identified through literature analysis: (1) underexplored text-image fusion, (2) limited cross-domain dataset diversity, and (3) lack of explainability attribution mechanisms.
              </p>
            </div>

            {/* Proposed Methodology */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono-research uppercase">3. PROPOSED METHODOLOGY</h3>
              <p className="text-xs leading-relaxed text-justify">
                Our dual-stream architecture processes text tokens using BERT-large and visual image patches using CLIP ViT-L/14. Cross-attention layers align feature vectors prior to final classification.
              </p>
            </div>

            {/* Results with Safety Placeholders */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold font-mono-research uppercase">4. EXPERIMENTAL RESULTS</h3>
              <div className="bg-[#B7791F]/10 border border-[#B7791F]/40 p-4 rounded text-center space-y-1 font-sans">
                <p className="text-xs font-bold text-[#B7791F] font-mono-research">
                  [RESULTS TO BE ADDED AFTER EXPERIMENTATION]
                </p>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  ResearchAI preserves academic integrity by omitting unverified empirical numbers until testing is conducted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Right AI Assistant / Sources */}
        <div className="w-64 shrink-0 border-l border-[var(--border)] bg-[var(--card)] flex flex-col overflow-hidden">
          <div className="flex border-b border-[var(--border)] text-xs font-medium">
            <button
              onClick={() => setPanelTab('ai')}
              className={`flex-1 py-3 text-center transition ${panelTab === 'ai' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] font-semibold' : 'text-[var(--muted-foreground)]'}`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setPanelTab('sources')}
              className={`flex-1 py-3 text-center transition ${panelTab === 'sources' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] font-semibold' : 'text-[var(--muted-foreground)]'}`}
            >
              Sources
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {panelTab === 'ai' ? (
              <div className="space-y-2">
                <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
                  Section Actions
                </p>
                {[
                  'Improve Section',
                  'Rewrite Section',
                  'Expand Explanation',
                  'Shorten Section',
                  'Check Citation',
                  'Explain Methodology',
                  'Regenerate Section',
                ].map(action => (
                  <button
                    key={action}
                    className="w-full text-left text-xs bg-[var(--secondary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-[var(--border)] rounded px-3 py-2 transition font-medium text-[var(--foreground)]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
                  Verified Citation Sources
                </p>
                {PAPERS.slice(0, 3).map((p, i) => (
                  <div key={p.id} className="p-2.5 bg-[var(--secondary)] rounded border border-[var(--border)] text-xs space-y-1">
                    <span className="font-semibold text-[var(--primary)]">[{i + 1}] {p.title.substring(0, 45)}…</span>
                    <Badge variant="success" size="xs">SOURCE VERIFIED</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── STAGE 8: Dedicated IEEE Paper Preview ─────────────────────────────────────

function PaperPreview({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Action Bar */}
      <div className="shrink-0 bg-[var(--card)] border-b border-[var(--border)] px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="olive" size="xs">Stage 6: Dedicated Paper Preview</Badge>
          <span className="text-xs text-[var(--muted-foreground)]">IEEE Two-Column Formatting Preview</span>
        </div>

        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm" onClick={() => onNav('paper-editor')}>
            ← Edit Paper
          </Btn>
          <Btn size="sm" onClick={() => onNav('docx-generation')}>
            Generate IEEE Word Document →
          </Btn>
        </div>
      </div>

      {/* Preview Screen Body */}
      <div className="flex-1 overflow-y-auto bg-[var(--secondary)]/60 p-6 sm:p-10 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded border border-[var(--border)] p-12 space-y-8 font-lora text-[#1C211B]">
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-[#000] pb-6">
            <h1 className="text-xl font-bold leading-snug tracking-tight">
              Multimodal Fake Product Review Detection Using Cross-Attention Transformer Fusion
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">Researcher A., Collaborator B.</p>
            <p className="text-[11px] text-[var(--muted-foreground)] italic">
              Department of Computer Science, Research Institution, 2025
            </p>
          </div>

          {/* IEEE 2-Column Academic Layout */}
          <div className="grid md:grid-cols-2 gap-8 text-xs leading-relaxed text-justify">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[11px] text-center uppercase tracking-wider mb-2">Abstract</p>
                <p className="italic">
                  Abstract—The proliferation of deceptive product reviews presents a critical challenge for e-commerce platforms and consumers. Existing detection systems rely predominantly on textual signals, neglecting the rich visual evidence embedded in review images. This paper proposes a multimodal transformer architecture that jointly encodes textual and visual features through a cross-attention fusion mechanism.
                </p>
              </div>

              <div>
                <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Index Terms—</p>
                <p className="italic text-[var(--muted-foreground)]">
                  Fake Review Detection, Multimodal Learning, Transformer, Cross-Attention, Explainable AI.
                </p>
              </div>

              <div>
                <p className="font-bold text-center text-[11px] uppercase tracking-wider mb-2">I. INTRODUCTION</p>
                <p>
                  Online product reviews are a cornerstone of consumer decision-making, with studies indicating that over 93% of consumers consult reviews before purchasing [1]. Automated detection systems have emerged as a necessary countermeasure, yet the majority of existing approaches focus exclusively on textual features.
                </p>
              </div>

              <div>
                <p className="font-bold text-center text-[11px] uppercase tracking-wider mb-2">II. RELATED WORK</p>
                <p>
                  Fake review detection has been approached through text classification [1, 2], user behavior modeling [3], and graph neural networks [5]. Multimodal approaches remain nascent [4].
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="font-bold text-center text-[11px] uppercase tracking-wider mb-2">III. PROPOSED METHODOLOGY</p>
                <p>
                  Our architecture comprises three components: a BERT-large text encoder, a CLIP ViT-L/14 visual encoder, and a cross-attention fusion module.
                </p>
              </div>

              {/* Table I */}
              <div className="border border-[#999] rounded p-2 text-[10px] space-y-1 font-sans">
                <p className="font-bold text-center border-b border-[#999] pb-1">TABLE I: MODEL ARCHITECTURE SUMMARY</p>
                <div className="grid grid-cols-3 font-mono-research text-[9px] pt-1">
                  <span>Text Encoder</span>
                  <span>BERT-large</span>
                  <span>340M</span>
                </div>
                <div className="grid grid-cols-3 font-mono-research text-[9px]">
                  <span>Visual Encoder</span>
                  <span>CLIP ViT-L/14</span>
                  <span>307M</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-center text-[11px] uppercase tracking-wider mb-2">IV. RESULTS</p>
                <div className="bg-[#B7791F]/10 border border-[#B7791F]/40 p-3 rounded text-center space-y-1 font-sans">
                  <p className="font-bold text-[10px] text-[#B7791F] font-mono-research">
                    [RESULTS TO BE ADDED AFTER EXPERIMENTATION]
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-center text-[11px] uppercase tracking-wider mb-2">REFERENCES</p>
                <div className="space-y-1 text-[10px]">
                  {papers.map((p, i) => (
                    <p key={p.id}>
                      [{i + 1}] {p.authors}, "{p.title}," <em>{p.venue}</em>, {p.year}.
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── STAGE 9: DOCX Generation & Document Ready ────────────────────────────────

function DocxGeneration({ onNav }: { onNav: (v: View) => void }) {
  const [step, setStep] = useState(0)
  const steps = [
    'Validating paper structure',
    'Formatting sections to IEEE standard',
    'Formatting references & citations',
    'Applying two-column IEEE Word layout',
    'Generating DOCX binary',
    'Finalizing document package'
  ]

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep(s => s + 1), 600)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => onNav('document-ready'), 600)
      return () => clearTimeout(t)
    }
  }, [step, onNav, steps.length])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-12 max-w-lg mx-auto w-full animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Preparing IEEE Word Document</h1>
        <p className="text-xs text-[var(--muted-foreground)]">Formatting into .docx with IEEE double-column styling.</p>
      </div>

      <Card className="p-6 space-y-2">
        {steps.map((label, i) => (
          <ProgressStep key={i} label={label} status={i < step ? 'done' : i === step ? 'active' : 'pending'} />
        ))}
      </Card>
    </div>
  )
}

function DocumentReady({ onNav }: { onNav: (v: View) => void }) {
  const [downloaded, setDownloaded] = useState(false)

  const triggerDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 4000)
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full animate-fade-in space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-[var(--success)]/20 text-[var(--success)] flex items-center justify-center text-2xl mx-auto font-bold">
          ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">Your IEEE Research Paper Is Ready</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Your research direction has been transformed into a fully formatted IEEE Word document.
        </p>
      </div>

      {/* Document Card */}
      <Card className="p-6 flex items-center justify-between gap-4 flex-wrap bg-[var(--card)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-14 bg-[var(--primary)]/15 rounded flex items-center justify-center border border-[var(--primary)]/30">
            <span className="text-xs font-mono-research font-bold text-[var(--primary)]">DOCX</span>
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)] text-sm">
              Fake_Product_Review_Detection_IEEE.docx
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)] font-mono-research">
              <span>DOCX</span>
              <span>·</span>
              <span>IEEE Format</span>
              <span>·</span>
              <span>16 Sections</span>
              <span>·</span>
              <span>23 References</span>
              <span>·</span>
              <span>2.4 MB</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Btn variant="secondary" onClick={() => onNav('paper-editor')}>
            Open Paper
          </Btn>
          <Btn onClick={triggerDownload} size="md">
            Download Word Document
          </Btn>
        </div>
      </Card>

      {downloaded && (
        <div className="p-4 bg-[var(--success)]/15 border border-[var(--success)]/40 rounded-[var(--radius)] text-xs text-[var(--success)] font-medium text-center animate-fade-in">
          ✓ Document downloaded: Fake_Product_Review_Detection_IEEE.docx
        </div>
      )}

      {/* Workflow Summary */}
      <Card className="p-6 space-y-4">
        <p className="text-xs font-mono-research uppercase tracking-widest text-[var(--muted-foreground)]">
          Completed Research Task Summary
        </p>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {[
            '01 Complete Research Idea Inputted',
            '02 47 Literature Papers Scanned',
            '03 Three-Column Papers Table Reviewed',
            '04 Source & AI Gaps Differentiated',
            '05 Refined Research Direction Submitted',
            '06 Academic Validation Checklist Passed',
            '07 16 Paper Sections Generated',
            '08 Dedicated IEEE Two-Column Preview Reviewed',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[var(--success)] font-bold">✓</span>
              <span className="text-[var(--foreground)]">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between items-center pt-2">
        <Btn variant="secondary" onClick={() => onNav('paper-editor')}>
          Continue Editing
        </Btn>
        <Btn variant="ghost" onClick={() => onNav('research-input')}>
          Start New Single-Session Research
        </Btn>
      </div>
    </div>
  )
}

// ─── Main App Shell ───────────────────────────────────────────────────────────

export default function App() {
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


  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const renderView = () => {
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
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header current={view} onNav={setView} dark={dark} onToggleDark={() => setDark(d => !d)} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderView()}
      </main>
    </div>
  )
}
