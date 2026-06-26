import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPosts } from '../data/postsApi'
import { useAuth } from '../auth'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function Home() {
  const { isAuthed } = useAuth()
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    listPosts().then((data) => {
      if (!active) return
      setPosts(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.excerpt,
        post.body,
        post.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query, posts])

  return (
    <div className="home">
      <section className="intro">
        <h1>오늘의 기록</h1>
        <p>매일의 작은 순간과 흩어진 생각들을 천천히 적어 둡니다.</p>
        {isAuthed && (
          <Link to="/write" className="write-button">
            ✏️ 새 글 쓰기
          </Link>
        )}
      </section>

      <div className="search">
        <input
          type="search"
          className="search-input"
          placeholder="🔍  제목, 내용, 태그로 검색…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="글 검색"
        />
      </div>

      {loading ? (
        <p className="search-empty">글을 불러오는 중…</p>
      ) : filtered.length === 0 ? (
        <p className="search-empty">
          {query
            ? `'${query}'에 해당하는 글을 찾지 못했어요.`
            : '아직 글이 없어요. 첫 글을 써 보세요!'}
        </p>
      ) : (
        <ul className="post-list">
          {filtered.map((post) => (
            <li key={post.slug} className="post-card">
              <Link to={`/posts/${post.slug}`} className="post-card-link">
                <time className="post-date">{formatDate(post.date)}</time>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
