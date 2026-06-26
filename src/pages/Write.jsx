import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost } from '../data/postsApi'

// 제목으로 URL 주소(slug)를 만든다.
// 영문/숫자만 남기고, 한글뿐이라 남는 글자가 없으면 임의의 짧은 id를 쓴다.
// 어떤 경우든 끝에 시간 기반 id를 붙여 주소가 겹치지 않게 한다.
function makeSlug(title) {
  const ascii = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const id = Date.now().toString(36)
  return ascii ? `${ascii}-${id}` : `post-${id}`
}

export default function Write() {
  const { slug } = useParams() // 수정 모드일 때만 존재
  const editing = Boolean(slug)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')

  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  // 수정 모드면 기존 글 내용을 불러와 폼을 채운다.
  useEffect(() => {
    if (!editing) return
    let active = true
    getPost(slug).then((post) => {
      if (!active) return
      if (!post) {
        setNotFound(true)
      } else {
        setTitle(post.title)
        setTags(post.tags.join(', '))
        setExcerpt(post.excerpt)
        setBody(post.body)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [slug, editing])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    setSaving(true)
    setError('')

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    // 요약을 비워 두면 본문 앞부분으로 자동 생성한다.
    const excerptValue =
      excerpt.trim() ||
      body.trim().replace(/\s+/g, ' ').slice(0, 80) +
        (body.trim().length > 80 ? '…' : '')

    try {
      if (editing) {
        await updatePost(slug, {
          title: title.trim(),
          tags: tagList,
          excerpt: excerptValue,
          body: body.trim(),
        })
        navigate(`/posts/${slug}`)
      } else {
        const newSlug = makeSlug(title)
        const today = new Date().toISOString().slice(0, 10)
        await createPost({
          slug: newSlug,
          title: title.trim(),
          date: today,
          tags: tagList,
          excerpt: excerptValue,
          body: body.trim(),
        })
        navigate(`/posts/${newSlug}`)
      }
    } catch (err) {
      setError(
        (editing ? '수정' : '저장') + '에 실패했어요: ' + err.message,
      )
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="post">
        <p className="comment-loading">글을 불러오는 중…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="not-found">
        <h1>수정할 글을 찾을 수 없어요</h1>
        <Link to="/" className="back-link">
          ← 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const canSubmit = title.trim() && body.trim() && !saving

  return (
    <div className="post">
      <Link to={editing ? `/posts/${slug}` : '/'} className="back-link">
        ← 돌아가기
      </Link>

      <header className="post-header">
        <h1>{editing ? '글 수정' : '새 글 쓰기'}</h1>
      </header>

      <form className="editor" onSubmit={handleSubmit}>
        <div className="editor-field">
          <label className="editor-label" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            className="editor-input"
            type="text"
            placeholder="제목을 입력하세요"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="editor-field">
          <label className="editor-label" htmlFor="tags">
            태그 <span className="editor-hint">(쉼표로 구분, 선택)</span>
          </label>
          <input
            id="tags"
            className="editor-input"
            type="text"
            placeholder="예: 일상, 겨울"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="editor-field">
          <label className="editor-label" htmlFor="excerpt">
            요약 <span className="editor-hint">(비우면 본문 앞부분 사용)</span>
          </label>
          <input
            id="excerpt"
            className="editor-input"
            type="text"
            placeholder="목록에 보일 짧은 소개"
            maxLength={200}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div className="editor-field">
          <label className="editor-label" htmlFor="body">
            본문 <span className="editor-hint">(빈 줄로 문단을 나눠요)</span>
          </label>
          <textarea
            id="body"
            className="editor-textarea"
            placeholder="이곳에 글을 적어 주세요…"
            rows={14}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {error && <p className="editor-error">{error}</p>}

        <div className="editor-actions">
          <Link
            to={editing ? `/posts/${slug}` : '/'}
            className="editor-cancel"
          >
            취소
          </Link>
          <button className="editor-submit" type="submit" disabled={!canSubmit}>
            {saving
              ? '저장 중…'
              : editing
                ? '수정 완료'
                : '글 발행'}
          </button>
        </div>
      </form>
    </div>
  )
}
