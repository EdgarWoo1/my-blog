// 관리자 로그인 상태를 앱 전체에서 공유하기 위한 인증 컨텍스트.
// Supabase Auth(이메일/비밀번호)를 사용한다.

import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from './supabase'

const AuthContext = createContext({ session: null, loading: true })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // 새로고침 후에도 로그인 상태를 복원한다.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 로그인/로그아웃 시 상태를 따라간다.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    loading,
    // 로그인했는지 여부
    isAuthed: Boolean(session),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// 로그인한 사용자만 통과시키는 라우트 가드.
// 로그인 안 했으면 /login 으로 보내고, 로그인 후 원래 가려던 곳으로 돌려보낸다.
export function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="post">
        <p className="comment-loading">확인 중…</p>
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
