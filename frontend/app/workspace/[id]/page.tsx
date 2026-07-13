'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadDocument() }, [params.id])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadDocument = async () => {
    const { data } = await supabase
      .from('documents').select('*')
      .eq('id', params.id).single()
    if (!data) { router.push('/dashboard'); return }
    setDoc(data)
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setChatLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: doc.analysis?.file_id || params.id,
          document_text: doc.analysis?.full_text || '',
          document_type: doc.document_type,
          estimated_tokens: doc.analysis?.estimated_tokens || 0,
          message: input,
          chat_history: messages,
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant', content: data.response
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error — make sure the backend is running.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const docIcon: Record<string, string> = {
    resume: '📄', research_paper: '🔬', legal_contract: '⚖️',
    invoice: '🧾', meeting_notes: '📝', lecture_notes: '📚',
    financial_report: '💰', general: '📁',
  }

  const suggestedPrompts: Record<string, string[]> = {
    resume: ['What are the main strengths?', 'What keywords am I missing?', 'How can I improve this resume?'],
    research_paper: ['What is the main contribution?', 'What methodology was used?', 'What are the limitations?'],
    legal_contract: ['What are the risky clauses?', 'What are my obligations?', 'When does this expire?'],
    invoice: ['What is the total amount due?', 'When is the deadline?', 'Who is the vendor?'],
    general: ['Summarize this document', 'What are the key points?', 'What action items are mentioned?'],
  }

  const prompts = suggestedPrompts[doc?.document_type as keyof typeof suggestedPrompts]
    || suggestedPrompts.general

  if (loading) return (
    <div style={{
      background: '#05050f', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const analysis = doc?.analysis || {}

  return (
    <div style={{
      background: '#05050f', height: '100vh',
      color: 'white', fontFamily: 'Inter, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* NAV */}
      <nav style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: 'rgba(5,5,15,0.98)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 13,
            textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}>
            ← Dashboard
          </Link>
          <div style={{
            width: 1, height: 16,
            background: 'rgba(255,255,255,0.1)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>
              {docIcon[doc?.document_type] || '📁'}
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.8)', fontSize: 14,
              fontWeight: 600, maxWidth: 300,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {doc?.file_name}
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc', borderRadius: 100,
            padding: '3px 10px', textTransform: 'capitalize',
          }}>
            {doc?.document_type?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: 4,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: 4,
        }}>
          {[
            { key: 'analysis', label: '📊 Analysis' },
            { key: 'chat', label: '💬 Chat' },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '6px 16px', borderRadius: 7,
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg,#6366f1,#06b6d4)'
                  : 'transparent',
                color: activeTab === tab.key
                  ? 'white'
                  : 'rgba(255,255,255,0.4)',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'hidden' }}>

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div style={{
            height: '100%', overflowY: 'auto',
            padding: '32px 24px',
          }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

              {/* Summary */}
              {analysis.summary && (
                <div style={{
                  background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.06))',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 16, padding: 24, marginBottom: 24,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: 10,
                  }}>
                    📋 Summary
                  </div>
                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.7, fontSize: 15,
                  }}>
                    {analysis.summary}
                  </p>
                </div>
              )}

              {/* Score cards */}
              {(analysis.ats_score !== undefined ||
                analysis.quality_score !== undefined ||
                analysis.risk_score !== undefined) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
                  gap: 12, marginBottom: 24,
                }}>
                  {analysis.ats_score !== undefined && (
                    <ScoreCard
                      label="ATS Score"
                      value={analysis.ats_score}
                      color="#6366f1"
                      bg="rgba(99,102,241,0.08)"
                      border="rgba(99,102,241,0.2)"
                    />
                  )}
                  {analysis.quality_score !== undefined && (
                    <ScoreCard
                      label="Quality Score"
                      value={analysis.quality_score}
                      color="#06b6d4"
                      bg="rgba(6,182,212,0.08)"
                      border="rgba(6,182,212,0.2)"
                    />
                  )}
                  {analysis.risk_score !== undefined && (
                    <ScoreCard
                      label="Risk Score"
                      value={analysis.risk_score}
                      color="#f87171"
                      bg="rgba(248,113,113,0.08)"
                      border="rgba(248,113,113,0.2)"
                    />
                  )}
                  {analysis.word_count !== undefined && (
                    <ScoreCard
                      label="Word Count"
                      value={analysis.word_count}
                      color="#a78bfa"
                      bg="rgba(167,139,250,0.08)"
                      border="rgba(167,139,250,0.2)"
                      suffix=""
                    />
                  )}
                </div>
              )}

              {/* Dynamic fields */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
                gap: 14,
              }}>
                {Object.entries(analysis).map(([key, value]) => {
                  const skip = [
                    'summary', 'ats_score', 'quality_score',
                    'risk_score', 'document_type', 'full_text',
                    'word_count', 'error', 'estimated_tokens', 'file_id'
                  ]
                  if (skip.includes(key)) return null
                  if (!value) return null
                  return (
                    <AnalysisCard key={key} label={key} value={value} />
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div style={{
            height: '100%', display: 'flex',
            flexDirection: 'column',
          }}>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '24px',
            }}>
              <div style={{ maxWidth: 760, margin: '0 auto' }}>

                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: 60 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
                    <h3 style={{
                      color: 'white', fontWeight: 700,
                      fontSize: 18, marginBottom: 8,
                    }}>
                      Ask anything about this document
                    </h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: 14, marginBottom: 32,
                    }}>
                      Powered by RAG + Llama 3
                    </p>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap',
                      justifyContent: 'center', gap: 8,
                    }}>
                      {prompts.map((prompt, i) => (
                        <button key={i}
                          onClick={() => setInput(prompt)}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 12,
                            padding: '10px 16px',
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                            e.currentTarget.style.color = 'white'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}>
                  {messages.map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user'
                        ? 'flex-end' : 'flex-start',
                    }}>
                      <div style={{
                        maxWidth: '75%',
                        borderRadius: msg.role === 'user'
                          ? '16px 16px 4px 16px'
                          : '16px 16px 16px 4px',
                        padding: '12px 16px',
                        fontSize: 14, lineHeight: 1.65,
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg,#6366f1,#06b6d4)'
                          : 'rgba(255,255,255,0.05)',
                        border: msg.role === 'user'
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.08)',
                        color: msg.role === 'user'
                          ? 'white'
                          : 'rgba(255,255,255,0.8)',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '12px 16px',
                      display: 'flex', gap: 6, alignItems: 'center',
                    }}>
                      {[0, 150, 300].map(delay => (
                        <div key={delay} style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: '#6366f1',
                          animation: 'bounce 1s infinite',
                          animationDelay: `${delay}ms`,
                        }} />
                      ))}
                      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '16px 24px',
              background: 'rgba(5,5,15,0.95)',
            }}>
              <div style={{
                maxWidth: 760, margin: '0 auto',
                display: 'flex', gap: 12,
              }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask anything about this document..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '12px 16px',
                    color: 'white', fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || !input.trim()}
                  style={{
                    background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
                    border: 'none', borderRadius: 12,
                    padding: '12px 20px', color: 'white',
                    fontSize: 14, fontWeight: 700,
                    cursor: chatLoading || !input.trim()
                      ? 'not-allowed' : 'pointer',
                    opacity: chatLoading || !input.trim() ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                  Send →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Helper Components ────────────────────────────────────

function ScoreCard({ label, value, color, bg, border, suffix = '/100' }: any) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 14, padding: '16px 20px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{ color: 'white', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
        {value}
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
          {suffix}
        </span>
      </div>
    </div>
  )
}

function AnalysisCard({ label, value }: any) {
  const renderValue = (val: any): any => {
    if (Array.isArray(val)) {
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {val.map((item: any, i: number) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'flex-start',
              gap: 8, marginBottom: 6,
              color: 'rgba(255,255,255,0.65)', fontSize: 13,
            }}>
              <span style={{ color: '#6366f1', marginTop: 2, flexShrink: 0 }}>•</span>
              <span>{typeof item === 'object' ? JSON.stringify(item) : item}</span>
            </li>
          ))}
        </ul>
      )
    }
    if (typeof val === 'object' && val !== null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(val).map(([k, v]) => (
            <div key={k} style={{ fontSize: 13 }}>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>{k}: </span>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{String(v)}</span>
            </div>
          ))}
        </div>
      )
    }
    return (
      <p style={{
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13, lineHeight: 1.65, margin: 0,
      }}>
        {String(val)}
      </p>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '18px 20px',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
        e.currentTarget.style.background = 'rgba(99,102,241,0.04)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700,
        color: '#6366f1',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: 12,
      }}>
        {label.replace(/_/g, ' ')}
      </div>
      {renderValue(value)}
    </div>
  )
}