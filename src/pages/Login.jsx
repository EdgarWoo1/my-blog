import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { isSupabaseConfigured } from '../config'
import { useAuth } from '../auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthed } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 로그인 후 돌아갈 곳 (없으면 글쓰기로)
  const from = location.state?.from || '/write'

  // 이미 로그인돼 있으면 바로 이동
  if (isAuthed) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setSubmitting(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError('로그인에 실패했어요: ' + error.message)
      setSubmitting(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="post">
      <Link to="/" className="back-link">
        ← 목록으로
      </Link>

      <header className="post-header">
        <h1>관리자 로그인</h1>
      </header>

      {!isSupabaseConfigured() ? (
        <div className="comments-setup">
          <p>
            로그인 기능을 쓰려면 <code>src/config.js</code>의{' '}
            <code>supabaseConfig</code> 설정이 필요해요.
          </p>
        </div>
      ) : (
        <form className="editor" onSubmit={handleSubmit}>
          <div className="editor-field">
            <label className="editor-label" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              className="editor-input"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="editor-field">
            <label className="editor-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              className="editor-input"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="editor-error">{error}</p>}

          <div className="editor-actions">
            <button
              className="editor-submit"
              type="submit"
              disabled={submitting || !email.trim() || !password}
            >
              {submitting ? '로그인 중…' : '로그인'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
