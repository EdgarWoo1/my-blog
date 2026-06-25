import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { isSupabaseConfigured } from '../config'

function formatWhen(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

export default function CommentBox({ slug }) {
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const configured = isSupabaseConfigured()

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_slug', slug)
      .order('lastdatetime', { ascending: true })

    if (error) setError('댓글을 불러오지 못했어요: ' + error.message)
    else setComments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (configured) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !body.trim()) return
    setSubmitting(true)
    setError('')

    const { error } = await supabase.from('comments').insert({
      post_slug: slug,
      name: name.trim(),
      body: body.trim(),
    })

    if (error) {
      setError('댓글 등록에 실패했어요: ' + error.message)
    } else {
      setBody('')
      await load()
    }
    setSubmitting(false)
  }

  return (
    <section className="comments">
      <h2 className="comments-title">
        댓글{comments.length > 0 && ` ${comments.length}`}
      </h2>

      {!configured ? (
        <div className="comments-setup">
          <p>
            💬 댓글 기능을 사용하려면 <code>src/config.js</code>의{' '}
            <code>supabaseConfig</code>에 Supabase 주소와 키를 넣어 주세요.
          </p>
        </div>
      ) : (
        <>
          <form className="comment-form" onSubmit={handleSubmit}>
            <input
              className="comment-name"
              type="text"
              placeholder="이름"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="comment-body"
              placeholder="따뜻한 댓글을 남겨 주세요 :)"
              rows={3}
              maxLength={1000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button
              className="comment-submit"
              type="submit"
              disabled={submitting || !name.trim() || !body.trim()}
            >
              {submitting ? '등록 중…' : '댓글 남기기'}
            </button>
          </form>

          {error && <p className="comment-error">{error}</p>}

          {loading ? (
            <p className="comment-loading">댓글을 불러오는 중…</p>
          ) : comments.length === 0 ? (
            <p className="comment-empty">
              아직 댓글이 없어요. 첫 댓글을 남겨 보세요!
            </p>
          ) : (
            <ul className="comment-list">
              {comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">{c.name}</span>
                    <time className="comment-when">
                      {formatWhen(c.lastdatetime)}
                    </time>
                  </div>
                  <p className="comment-text">{c.body}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
