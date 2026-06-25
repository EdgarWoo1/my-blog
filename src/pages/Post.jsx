import { Link, useParams } from 'react-router-dom'
import { getPost } from '../data/posts'
import CommentBox from '../components/CommentBox'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function Post() {
  const { slug } = useParams()
  const post = getPost(slug)

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

      <CommentBox slug={post.slug} />
    </article>
  )
}
