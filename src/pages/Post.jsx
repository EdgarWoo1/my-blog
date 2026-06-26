import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../data/postsApi'
import CommentBox from '../components/CommentBox'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getPost(slug).then((p) => {
      if (!active) return
      setPost(p)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [slug])

  async function handleDelete() {
    if (!window.confirm('이 글을 정말 삭제할까요? 되돌릴 수 없어요.')) return
    setDeleting(true)
    try {
      await deletePost(slug)
      navigate('/')
    } catch (err) {
      window.alert('삭제에 실패했어요: ' + err.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="post">
        <p className="comment-loading">글을 불러오는 중…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="not-found">
        <h1>글을 찾을 수 없어요</h1>
        <p>찾으시는 글이 없거나 주소가 잘못되었습니다.</p>
        <Link to="/" className="back-link">
          ← 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const paragraphs = post.body.split(/\n\s*\n/)

  return (
    <article className="post">
      <Link to="/" className="back-link">
        ← 목록으로
      </Link>

      <header className="post-header">
        <time className="post-date">{formatDate(post.date)}</time>
        <h1>{post.title}</h1>
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="post-body">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="post-actions">
        <Link to={`/write/${post.slug}/edit`} className="post-action">
          ✏️ 수정
        </Link>
        <button
          type="button"
          className="post-action danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          🗑 {deleting ? '삭제 중…' : '삭제'}
        </button>
      </div>

      <CommentBox slug={post.slug} />
    </article>
  )
}
