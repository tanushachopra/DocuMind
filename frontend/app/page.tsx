'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!mounted) return null

  const S = {
    page: {
      background: '#05050f',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, -apple-system, sans-serif',
      overflowX: 'hidden' as const,
    },
    nav: {
      position: 'fixed' as const,
      top: 0, left: 0, right: 0, zIndex: 1000,
      height: 64,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      background: scrolled ? 'rgba(5,5,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none',
      transition: 'all 0.3s',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: 10,
      textDecoration: 'none', color: 'white',
    },
    logoIcon: {
      width: 34, height: 34, borderRadius: 10,
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 16, color: 'white',
    },
    logoText: {
      fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em',
    },
    navLinks: {
      display: 'flex', gap: 32, alignItems: 'center',
    },
    navLink: {
      color: 'rgba(255,255,255,0.5)', fontSize: 14,
      fontWeight: 500, textDecoration: 'none',
    },
    navBtns: {
      display: 'flex', gap: 10, alignItems: 'center',
    },
    signIn: {
      color: 'rgba(255,255,255,0.6)', fontSize: 14,
      fontWeight: 500, padding: '8px 16px', textDecoration: 'none',
    },
    getStarted: {
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      color: 'white', fontSize: 14, fontWeight: 600,
      padding: '9px 22px', borderRadius: 10, textDecoration: 'none',
    },
    hero: {
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      paddingTop: 100, paddingBottom: 80,
    },
    heroInner: {
      position: 'relative' as const, zIndex: 1,
      textAlign: 'center' as const,
      maxWidth: 920, padding: '0 24px', margin: '0 auto',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: 100, padding: '6px 18px',
      fontSize: 13, fontWeight: 600,
      color: '#a5b4fc', marginBottom: 32,
    },
    dot: {
      width: 7, height: 7, borderRadius: '50%',
      background: '#6366f1', display: 'inline-block',
      boxShadow: '0 0 10px #6366f1',
    },
    h1: {
      fontSize: 'clamp(44px, 7vw, 84px)',
      fontWeight: 900, lineHeight: 1.05,
      letterSpacing: '-0.03em', margin: '0 0 24px',
    },
    gradient: {
      background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 60%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text' as const,
      WebkitTextFillColor: 'transparent' as const,
      backgroundClip: 'text' as const,
    },
    sub: {
      fontSize: 18, color: 'rgba(255,255,255,0.45)',
      lineHeight: 1.75, maxWidth: 560,
      margin: '0 auto 40px', fontWeight: 400,
    },
    ctaRow: {
      display: 'flex', gap: 14,
      justifyContent: 'center', flexWrap: 'wrap' as const,
      marginBottom: 16,
    },
    ctaPrimary: {
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      color: 'white', fontWeight: 700, fontSize: 16,
      padding: '14px 34px', borderRadius: 12,
      textDecoration: 'none',
      boxShadow: '0 0 40px rgba(99,102,241,0.35)',
      display: 'inline-block',
    },
    ctaSecondary: {
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.7)', fontWeight: 600,
      fontSize: 16, padding: '14px 34px',
      borderRadius: 12, textDecoration: 'none',
      display: 'inline-block',
    },
    finePrint: {
      color: 'rgba(255,255,255,0.2)', fontSize: 13,
      marginBottom: 60,
    },
    mockup: {
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20, padding: 24,
      maxWidth: 740, margin: '0 auto',
    },
    winBar: {
      display: 'flex', alignItems: 'center',
      gap: 6, marginBottom: 20,
    },
    statsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12, marginBottom: 12,
    },
    aiInsight: {
      background: 'rgba(99,102,241,0.07)',
      border: '1px solid rgba(99,102,241,0.18)',
      borderRadius: 12, padding: '14px 16px', textAlign: 'left' as const,
    },
    section: {
      padding: '100px 24px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    },
    sectionAlt: {
      padding: '100px 24px',
      background: 'rgba(255,255,255,0.01)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    sectionInner: { maxWidth: 1200, margin: '0 auto' },
    sectionCenter: { textAlign: 'center' as const, marginBottom: 56 },
    sectionBadge: (color: string) => ({
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: `rgba(${color},0.08)`,
      border: `1px solid rgba(${color},0.2)`,
      borderRadius: 100, padding: '5px 16px',
      fontSize: 12, fontWeight: 700,
      color: `rgb(${color})`,
      marginBottom: 20, textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
    }),
    h2: {
      fontSize: 'clamp(32px,4vw,52px)',
      fontWeight: 900, letterSpacing: '-0.02em',
      lineHeight: 1.1, marginBottom: 14,
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
      gap: 16,
    },
    card: {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16, padding: 26,
      transition: 'all 0.25s',
    },
    tagsRow: {
      display: 'flex', flexWrap: 'wrap' as const,
      gap: 10, justifyContent: 'center',
    },
    tag: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 100, padding: '8px 18px',
      fontSize: 13, color: 'rgba(255,255,255,0.6)',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 24,
    },
    stepNum: {
      width: 54, height: 54, borderRadius: 16,
      background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 20,
      fontWeight: 800, margin: '0 auto 18px',
      boxShadow: '0 0 30px rgba(99,102,241,0.3)',
    },
    faqItem: (open: boolean) => ({
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${open ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 14, overflow: 'hidden' as const,
      marginBottom: 8, transition: 'border-color 0.2s',
    }),
    faqBtn: {
      width: '100%', padding: '18px 22px',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', background: 'none',
      border: 'none', cursor: 'pointer',
      color: 'white', textAlign: 'left' as const,
    },
    footer: {
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '32px 40px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap' as const, gap: 16,
    },
  }

  return (
    <div style={S.page}>

      {/* NAV */}
      <nav style={S.nav}>
        <Link href="/" style={S.logo}>
          <div style={S.logoIcon}>D</div>
          <span style={S.logoText}>DocuMind</span>
        </Link>
        <div style={S.navLinks}>
          {['Features','How it works','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={S.navLink}>{l}</a>
          ))}
        </div>
        <div style={S.navBtns}>
          <Link href="/login" style={S.signIn}>Sign in</Link>
          <Link href="/signup" style={S.getStarted}>Get started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        {/* Glow */}
        <div style={{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:800,height:800,background:'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',top:'40%',left:'10%',width:400,height:400,background:'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)',pointerEvents:'none'}} />

        <div style={S.heroInner}>
          <div style={S.badge}>
            <span style={S.dot} />
            Multimodal RAG · Document Intelligence
          </div>

          <h1 style={S.h1}>
            <span style={{color:'white'}}>Every document.</span><br />
            <span style={S.gradient}>Instantly understood.</span>
          </h1>

          <p style={S.sub}>
            Upload any document — DocuMind auto-detects its type,
            uses Gemini Vision for multimodal understanding,
            and answers your questions via a semantic RAG pipeline.
          </p>

          <div style={S.ctaRow}>
            <Link href="/signup" style={S.ctaPrimary}>Start analyzing free →</Link>
            <a href="#how-it-works" style={S.ctaSecondary}>See how it works</a>
          </div>

          <p style={S.finePrint}>Free · No credit card · PDF, DOCX, Images, Scanned docs</p>

          {/* Mockup */}
          <div style={S.mockup}>
            <div style={S.winBar}>
              {['#ff5f57','#febc2e','#28c840'].map((c,i)=>(
                <div key={i} style={{width:12,height:12,borderRadius:'50%',background:c,opacity:0.8}} />
              ))}
              <span style={{color:'rgba(255,255,255,0.2)',fontSize:12,marginLeft:8}}>DocuMind — Resume Analysis</span>
            </div>
            <div style={S.statsGrid}>
              {[
                {label:'ATS Score',value:'87',sub:'out of 100',c:'#6366f1',bg:'rgba(99,102,241,0.08)',br:'rgba(99,102,241,0.2)'},
                {label:'Missing Keywords',value:'12',sub:'to add',c:'#06b6d4',bg:'rgba(6,182,212,0.08)',br:'rgba(6,182,212,0.2)'},
                {label:'Improvements',value:'8',sub:'suggested',c:'#a78bfa',bg:'rgba(167,139,250,0.08)',br:'rgba(167,139,250,0.2)'},
              ].map((s,i)=>(
                <div key={i} style={{background:s.bg,border:`1px solid ${s.br}`,borderRadius:12,padding:'14px 16px',textAlign:'left'}}>
                  <div style={{fontSize:11,fontWeight:700,color:s.c,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>{s.label}</div>
                  <div style={{fontSize:30,fontWeight:800,color:'white',lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={S.aiInsight}>
              <div style={{fontSize:11,color:'#6366f1',fontWeight:700,marginBottom:6}}>🧠 RAG-POWERED INSIGHT</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.65}}>
                Your experience section lacks measurable achievements. Adding metrics like "reduced load time by 40%" would increase your ATS score by ~15 points.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionCenter}>
            <div style={S.sectionBadge('6,182,212')}>✦ Features</div>
            <h2 style={S.h2}>
              Not just a PDF chatbot.<br />
              <span style={S.gradient}>A real intelligence platform.</span>
            </h2>
            <p style={{color:'rgba(255,255,255,0.35)',fontSize:16,maxWidth:480,margin:'0 auto'}}>
              Built on multimodal AI and RAG — not a ChatGPT wrapper.
            </p>
          </div>
          <div style={S.grid3}>
            {[
              {icon:'🧠',title:'Adaptive Intelligence',desc:'Auto-detects document type and switches analysis mode — resume becomes career advisor, contract becomes legal analyst. Zero manual selection.'},
              {icon:'👁️',title:'Multimodal Vision',desc:'Gemini Vision understands charts, tables, diagrams, handwriting and scanned PDFs — not just extractable text.'},
              {icon:'🔍',title:'Semantic RAG',desc:'Sentence-BERT embeds chunks into ChromaDB. Semantic retrieval finds exact relevant sections before Gemini generates answers.'},
              {icon:'💬',title:'Deep AI Chat',desc:'Ask anything — summarize page 5, find all dates, explain clause 4.2. Full LLM reasoning grounded in your document.'},
              {icon:'📊',title:'Smart Analysis',desc:'ATS scores for resumes, risk scores for contracts, key metrics for invoices — tailored dashboards per document type.'},
              {icon:'🔒',title:'Private & Secure',desc:'Row-level security ensures you only see your own documents. Enterprise-grade auth via Supabase.'},
            ].map((f,i)=>(
              <div key={i} style={S.card}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(99,102,241,0.35)';e.currentTarget.style.background='rgba(99,102,241,0.05)';e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{fontSize:30,marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontWeight:700,fontSize:16,color:'white',marginBottom:8}}>{f.title}</h3>
                <p style={{color:'rgba(255,255,255,0.42)',fontSize:14,lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOC TYPES */}
      <section style={S.sectionAlt}>
        <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
          <h2 style={S.h2}>Works with <span style={S.gradient}>any document</span></h2>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:15,marginBottom:40}}>Auto-detected. No manual selection needed.</p>
          <div style={S.tagsRow}>
            {[
              {icon:'📄',label:'Resume'},{icon:'🔬',label:'Research Paper'},
              {icon:'⚖️',label:'Legal Contract'},{icon:'🧾',label:'Invoice'},
              {icon:'📝',label:'Meeting Notes'},{icon:'📚',label:'Lecture Notes'},
              {icon:'💰',label:'Financial Report'},{icon:'🏢',label:'Company Policy'},
              {icon:'🔧',label:'Technical Manual'},{icon:'📋',label:'Project Report'},
              {icon:'🏥',label:'Medical Report'},{icon:'📧',label:'Email'},
              {icon:'🖼️',label:'Scanned Doc'},{icon:'📁',label:'Any Document'},
            ].map((t,i)=>(
              <div key={i} style={S.tag}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(99,102,241,0.4)';e.currentTarget.style.color='white'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='rgba(255,255,255,0.6)'}}>
                <span>{t.icon}</span><span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={S.section}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={S.sectionCenter}>
            <div style={S.sectionBadge('99,102,241')}>✦ How it works</div>
            <h2 style={S.h2}>Upload to insight in <span style={S.gradient}>seconds</span></h2>
          </div>
          <div style={S.stepsGrid}>
            {[
              {title:'Upload your document',desc:'Drop any PDF, Word doc, image or scanned file. All formats supported.'},
              {title:'AI understands everything',desc:'Gemini Vision reads visual content. Sentence-BERT indexes chunks in ChromaDB. Type auto-detected.'},
              {title:'Instant analysis',desc:'Type-specific structured analysis with scores, insights and recommendations generated automatically.'},
              {title:'Chat and explore',desc:'RAG retrieves exact sections. Gemini generates precise, grounded answers to anything you ask.'},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <div style={S.stepNum}>{i+1}</div>
                <h3 style={{fontWeight:700,fontSize:16,color:'white',marginBottom:10}}>{s.title}</h3>
                <p style={{color:'rgba(255,255,255,0.38)',fontSize:14,lineHeight:1.65}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={S.sectionAlt}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{...S.h2,textAlign:'center',marginBottom:48}}>
            Loved by <span style={S.gradient}>everyone who works with documents</span>
          </h2>
          <div style={S.grid3}>
            {[
              {text:'I uploaded my resume and DocuMind gave me an ATS score, missing keywords and specific rewrites. Got 3 interview calls the next week.',name:'Priya Sharma',role:'Software Engineer, Delhi'},
              {text:'Reviewing contracts used to take hours. DocuMind highlights risky clauses and explains everything in plain English in seconds.',name:'Arjun Mehta',role:'Law Student, Mumbai'},
              {text:'The RAG chat is incredible. I asked about a finding from page 34 of a 90-page paper and got the exact answer with context.',name:'Dr. Neha Gupta',role:'PhD Researcher, IIT Delhi'},
            ].map((t,i)=>(
              <div key={i} style={{...S.card,padding:24}}>
                <div style={{display:'flex',gap:2,marginBottom:14}}>
                  {[...Array(5)].map((_,j)=><span key={j} style={{color:'#fbbf24',fontSize:15}}>★</span>)}
                </div>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:14,lineHeight:1.7,marginBottom:18}}>"{t.text}"</p>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14}}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,color:'white'}}>{t.name}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={S.section}>
        <div style={{maxWidth:680,margin:'0 auto'}}>
          <h2 style={{...S.h2,textAlign:'center',marginBottom:48}}>
            Questions? <span style={S.gradient}>Answered.</span>
          </h2>
          {[
            {q:"What makes DocuMind different from ChatPDF?",a:"DocuMind uses multimodal RAG — Gemini Vision understands charts and scanned content, Sentence-BERT + ChromaDB enables semantic retrieval, and the system adapts its entire analysis mode based on document type."},
            {q:"What formats are supported?",a:"PDF (text and scanned), DOCX, TXT, JPG, PNG. Auto-classifies into 13+ document types including resume, research paper, legal contract, invoice, lecture notes and more."},
            {q:"How does the RAG pipeline work?",a:"Documents are chunked into 500-token segments, embedded using Sentence-BERT, stored in ChromaDB. Your question is embedded and the 5 most relevant chunks are retrieved and sent to Gemini for grounded answers."},
            {q:"Can it read scanned PDFs and handwriting?",a:"Yes. Pages with little extractable text are sent to Gemini 1.5 Flash Vision which understands scanned content, handwriting, charts and tables natively."},
            {q:"Is my data private?",a:"Yes. Supabase row-level security ensures each user can only access their own documents."},
          ].map((faq,i)=>(
            <div key={i} style={S.faqItem(openFaq===i)}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={S.faqBtn}>
                <span style={{fontWeight:600,fontSize:15}}>{faq.q}</span>
                <span style={{color:'#6366f1',fontSize:22,fontWeight:300,transform:openFaq===i?'rotate(45deg)':'none',transition:'transform 0.2s',flexShrink:0,marginLeft:16}}>+</span>
              </button>
              {openFaq===i&&(
                <div style={{padding:'0 22px 18px',color:'rgba(255,255,255,0.45)',fontSize:14,lineHeight:1.7}}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px 120px'}}>
        <div style={{maxWidth:680,margin:'0 auto',textAlign:'center'}}>
          <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.07))',border:'1px solid rgba(99,102,241,0.2)',borderRadius:24,padding:'60px 40px'}}>
            <h2 style={{fontSize:38,fontWeight:900,letterSpacing:'-0.02em',marginBottom:16}}>
              Ready to understand<br />your documents?
            </h2>
            <p style={{color:'rgba(255,255,255,0.38)',fontSize:16,marginBottom:32}}>
              Start analyzing smarter with DocuMind.
            </p>
            <Link href="/signup" style={S.ctaPrimary}>Get started for free →</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.logo}>
          <div style={{...S.logoIcon,width:26,height:26,borderRadius:7,fontSize:12}}>D</div>
          <span style={{fontWeight:700,fontSize:15}}>DocuMind</span>
        </div>
        <p style={{color:'rgba(255,255,255,0.2)',fontSize:13}}>
          © 2025 DocuMind · Built with ♥ by Tanusha Chopra
        </p>
        <div style={{display:'flex',gap:24}}>
          {['Privacy','Terms','Contact'].map(item=>(
            <a key={item} href="#" style={{color:'rgba(255,255,255,0.3)',fontSize:13,textDecoration:'none'}}>{item}</a>
          ))}
        </div>
      </footer>

    </div>
  )
}