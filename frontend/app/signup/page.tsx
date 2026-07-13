'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  if (success) return (
    <div style={{
      background: '#05050f', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      fontFamily: 'Inter, -apple-system, sans-serif',
      color: 'white', textAlign: 'center',
    }}>
      <div>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'rgba(6,182,212,0.12)',
          border: '1px solid rgba(6,182,212,0.25)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 28,
          margin: '0 auto 24px',
        }}>✉️</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
          Check your email
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 24, maxWidth: 340 }}>
          We sent a confirmation link to{' '}
          <span style={{ color: '#06b6d4' }}>{email}</span>.
          Click it to activate your account.
        </p>
        <Link href="/login" style={{
          color: '#6366f1', textDecoration: 'none',
          fontWeight: 600, fontSize: 14,
        }}>
          ← Back to login
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{
      background: '#05050f', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white',
            }}>D</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-0.02em' }}>
              DocuMind
            </span>
          </Link>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 36,
        }}>
          <h1 style={{
            fontSize: 24, fontWeight: 800,
            color: 'white', marginBottom: 6,
            letterSpacing: '-0.02em',
          }}>
            Create your account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
            Start analyzing documents intelligently
          </p>

          <button onClick={handleGoogle} style={{
            width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '12px 16px',
            color: 'rgba(255,255,255,0.8)', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
            marginBottom: 24, transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={handleSignup}>
            {[
              { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Tanusha Chopra' },
              { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: 'Min 6 characters' },
            ].map((field, i) => (
              <div key={i} style={{ marginBottom: i === 2 ? 20 : 16 }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  minLength={field.type === 'password' ? 6 : undefined}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '12px 14px',
                    color: 'white', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box' as const,
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            ))}

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '10px 14px',
                color: '#f87171', fontSize: 13, marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: 'linear-gradient(135deg,#6366f1,#06b6d4)',
              border: 'none', borderRadius: 10,
              padding: '12px 16px', color: 'white',
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', color: 'rgba(255,255,255,0.35)',
            fontSize: 13, marginTop: 24,
          }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}