import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'
import About from './pages/About'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
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
