import { useEffect, useRef } from 'react'
import { giscusConfig, isGiscusConfigured } from '../config'

// 현재 사이트 테마(라이트/다크)에 맞춰 giscus 테마를 고른다.
function currentGiscusTheme() {
  return document.documentElement.dataset.theme === 'dark'
    ? 'dark_dimmed'
    : 'light'
}

export default function Comments() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isGiscusConfigured() || !containerRef.current) return

    // 페이지 이동 시 이전 댓글창이 남지 않도록 초기화
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', giscusConfig.repo)
    script.setAttribute('data-repo-id', giscusConfig.repoId)
    script.setAttribute('data-category', giscusConfig.category)
    script.setAttribute('data-category-id', giscusConfig.categoryId)
    script.setAttribute('data-mapping', giscusConfig.mapping)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', currentGiscusTheme())
    script.setAttribute('data-lang', giscusConfig.lang)

    containerRef.current.appendChild(script)
  }, [])

  return (
    <section className="comments">
      <h2 className="comments-title">댓글</h2>

      {isGiscusConfigured() ? (
        <div ref={containerRef} />
      ) : (
        <div className="comments-setup">
          <p>
            💬 댓글 기능을 사용하려면 한 번만 설정하면 됩니다.
            <br />
            <code>src/config.js</code> 파일을 열어 안내에 따라 GitHub 정보를
            채워 주세요.
          </p>
        </div>
      )}
    </section>
  )
}
