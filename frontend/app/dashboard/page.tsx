'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadStep, setUploadStep] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
    loadDocuments(user.id)
  }

  const loadDocuments = async (userId: string) => {
    const { data } = await supabase
      .from('documents').select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setDocuments(data)
  }

  const handleFileUpload = async (file: File) => {
    if (!user) return
    setUploading(true)
    setUploadStep('Uploading to storage...')

    try {
      // Step 1: Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const { error: storageError } = await supabase.storage
        .from('documents').upload(fileName, file)
      if (storageError) throw new Error(`Storage: ${storageError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('documents').getPublicUrl(fileName)

      // Step 2: Extract + classify via backend
      setUploadStep('Extracting and classifying document...')
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      })
      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.detail || 'Backend upload failed')
      }
      const uploadData = await uploadRes.json()
      console.log('[DocuMind] Upload:', uploadData)

      // Step 3: Analyze
      setUploadStep('AI is analyzing your document...')
      setAnalyzing(true)

      const analyzeRes = await fetch("http://localhost:8000/api/analyze/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: uploadData.full_text,
          document_type: uploadData.document_type,
        }),
      })
      const analysisData = await analyzeRes.json()
      console.log('[DocuMind] Analysis:', analysisData)

      // Step 4: Save to database
      setUploadStep('Saving to database...')
      const { data: docData, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          document_type: uploadData.document_type || 'general',
          file_id: uploadData.file_id || '',
          estimated_tokens: uploadData.estimated_tokens || 0,
          total_pages: uploadData.total_pages || 1,
          used_vision: uploadData.used_vision || false,
          chunks_indexed: uploadData.chunks_indexed || 0,
          analysis: {
            ...analysisData,
            full_text: uploadData.full_text || '',
            word_count: uploadData.word_count || 0,
            estimated_tokens: uploadData.estimated_tokens || 0,
            file_id: uploadData.file_id || '',
          },
        })
        .select('id')
        .single()

      console.log('[DocuMind] DB insert:', docData, insertError)

      if (insertError) throw new Error(`DB: ${insertError.message}`)
      if (!docData?.id) throw new Error('No document ID returned')

      // Step 5: Redirect
      console.log('[DocuMind] Redirecting to /workspace/' + docData.id)
      router.push(`/workspace/${docData.id}`)

    } catch (err: any) {
      console.error('[DocuMind] Error:', err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setAnalyzing(false)
      setUploadStep('')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const docIcon: Record<string, string> = {
    resume: '📄', research_paper: '🔬', legal_contract: '⚖️',
    invoice: '🧾', meeting_notes: '📝', lecture_notes: '📚',
    financial_report: '💰', company_policy: '🏢',
    technical_manual: '🔧', project_report: '📋',
    medical_report: '🏥', email: '📧', general: '📁',
  }

  const isLoading = uploading || analyzing

  return (
    <div style={{
      background: '#05050f', minHeight: '100vh',
      color: 'white', fontFamily: 'Inter, -apple-system, sans-serif',
    }}>

      {/* NAV */}
      <nav style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5,5,15,0.95)',
        backdropFilter: 'blur(20px)',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center',
          gap: 8, textDecoration: 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800,
            fontSize: 14, color: 'white',
          }}>D</div>
          <span style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>
            DocuMind
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            {user?.email}
          </span>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: 13,
            padding: '6px 14px', borderRadius: 8,
            cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 900,
            letterSpacing: '-0.02em', marginBottom: 6,
            background: 'linear-gradient(135deg,white,rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Your Documents
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>
            Upload any document for instant AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver
              ? '#6366f1'
              : isLoading
                ? 'rgba(99,102,241,0.4)'
                : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20,
            padding: '60px 40px',
            textAlign: 'center',
            cursor: isLoading ? 'default' : 'pointer',
            background: dragOver
              ? 'rgba(99,102,241,0.07)'
              : 'rgba(255,255,255,0.01)',
            transition: 'all 0.2s',
            marginBottom: 48,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = ''
            }}
          />

          {isLoading ? (
            <div>
              <div style={{
                width: 44, height: 44,
                border: '3px solid rgba(99,102,241,0.2)',
                borderTop: '3px solid #6366f1',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{
                color: 'white', fontWeight: 600,
                fontSize: 16, marginBottom: 8,
              }}>
                {uploadStep}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                Please wait — this takes 15-30 seconds
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📤</div>
              <p style={{
                color: 'white', fontWeight: 700,
                fontSize: 18, marginBottom: 8,
              }}>
                Drop your document here
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: 14, marginBottom: 20,
              }}>
                or click to browse files
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 100, padding: '6px 16px',
                fontSize: 13, color: '#a5b4fc',
              }}>
                PDF · DOCX · TXT · JPG · PNG
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
              No documents yet — upload one above to get started
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20,
            }}>
              <h2 style={{
                fontSize: 18, fontWeight: 700,
                color: 'rgba(255,255,255,0.8)',
              }}>
                Recent Documents
              </h2>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                {documents.length} file{documents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
              gap: 16,
            }}>
              {documents.map(doc => (
                <Link key={doc.id}
                  href={`/workspace/${doc.id}`}
                  style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16, padding: 20,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                      e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 14,
                    }}>
                      <div style={{ fontSize: 32 }}>
                        {docIcon[doc.document_type] || '📁'}
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: '#a5b4fc', borderRadius: 100,
                        padding: '3px 10px',
                        textTransform: 'capitalize' as const,
                      }}>
                        {doc.document_type?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 style={{
                      color: 'white', fontWeight: 600,
                      fontSize: 14, marginBottom: 6,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap' as const,
                    }}>
                      {doc.file_name}
                    </h3>

                    <p style={{
                      color: 'rgba(255,255,255,0.25)',
                      fontSize: 12, marginBottom: 10,
                    }}>
                      {new Date(doc.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>

                    {doc.analysis?.summary && (
                      <p style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 12, lineHeight: 1.6,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as any,
                      }}>
                        {doc.analysis.summary}
                      </p>
                    )}

                    <div style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.2)',
                      }}>
                        {doc.total_pages ? `${doc.total_pages}p` : ''}
                        {doc.chunks_indexed ? ` · ${doc.chunks_indexed} chunks` : ''}
                      </span>
                      <span style={{
                        fontSize: 12, color: '#6366f1', fontWeight: 600,
                      }}>
                        Open →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}