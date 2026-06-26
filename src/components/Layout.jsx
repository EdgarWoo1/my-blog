import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../auth'

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return { theme, toggle }
}

export default function Layout({ children }) {
  const { theme, toggle } = useTheme()
  const { isAuthed } = useAuth()

  async function handleLogout() {
    if (supabase) await supabase.auth.signOut()
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            오늘의 기록
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              글
            </NavLink>
            {isAuthed && <NavLink to="/write">글쓰기</NavLink>}
            <NavLink to="/about">소개</NavLink>
            {isAuthed ? (
              <button className="nav-link-button" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <NavLink to="/login">로그인</NavLink>
            )}
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label="테마 전환"
              title="라이트/다크 모드 전환"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} 오늘의 기록 · 일상과 생각의 조각들</p>
        </div>
      </footer>
    </div>
  )
}
