import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'
import Write from './pages/Write'
import Login from './pages/Login'
import About from './pages/About'
import { RequireAuth } from './auth'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/write"
          element={
            <RequireAuth>
              <Write />
            </RequireAuth>
          }
        />
        <Route
          path="/write/:slug/edit"
          element={
            <RequireAuth>
              <Write />
            </RequireAuth>
          }
        />
        <Route path="/posts/:slug" element={<Post />} />
        <Route path="/about" element={<About />} />
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>페이지를 찾을 수 없어요</h1>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
