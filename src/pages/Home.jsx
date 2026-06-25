import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function Home() {
  const [query, setQuery] = useState('')

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
  }, [query])

  return (
    <div className="home">
      <section className="intro">
        <h1>오늘의 기록</h1>
        <p>매일의 작은 순간과 흩어진 생각들을 천천히 적어 둡니다.</p>
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

      {filtered.length === 0 ? (
        <p className="search-empty">
          '{query}'에 해당하는 글을 찾지 못했어요.
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
