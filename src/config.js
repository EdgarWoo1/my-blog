// ============================================================
//  댓글(Giscus) 설정
// ============================================================
// 아래 값을 채우면 모든 글 하단에 댓글창이 자동으로 켜집니다.
// 값이 비어 있으면 댓글 영역에 설정 안내가 표시됩니다.
//
// 📌 설정 방법 (한 번만 하면 됩니다)
//   1) 블로그 코드를 공개(public) GitHub 저장소에 올립니다.
//   2) 그 저장소 Settings → General → Features 에서
//      "Discussions" 체크박스를 켭니다.
//   3) https://github.com/apps/giscus 에서 "Install"을 눌러
//      해당 저장소에 giscus 앱을 설치합니다.
//   4) https://giscus.app 에 접속해 저장소 주소를 입력하면
//      아래에 넣을 repo / repoId / category / categoryId 값을
//      자동으로 만들어 줍니다. 그 값을 그대로 복사해 넣으세요.
// ============================================================

export const giscusConfig = {
  repo: 'EdgarWoo1/my-blog',
  repoId: 'R_kgDOTFDpig',
  category: 'Announcements',
  categoryId: 'DIC_kwDOTFDpis4C_39W',
  mapping: 'pathname', // 글 주소 기준으로 댓글 스레드 구분 (그대로 두세요)
  lang: 'ko',
}

export function isGiscusConfigured() {
  return Boolean(
    giscusConfig.repo &&
      giscusConfig.repoId &&
      giscusConfig.category &&
      giscusConfig.categoryId,
  )
}

// ============================================================
//  댓글(Supabase) 설정 — GitHub 로그인 없이 누구나 댓글
// ============================================================
// Supabase 프로젝트의 두 값을 채우면 댓글창이 켜집니다.
//   Supabase 대시보드 → Project Settings → API 에서:
//     - Project URL  → supabaseUrl
//     - anon public 키 → supabaseAnonKey
// ※ anon 키는 브라우저에 공개되도록 설계된 키라 노출되어도
//   안전합니다(데이터는 RLS 정책으로 보호됨).
// ============================================================

export const supabaseConfig = {
  supabaseUrl: 'https://achqovvywvsgmcqewkng.supabase.co',
  supabaseAnonKey: 'sb_publishable_BNY_2MxWDfKpMgVj4oJkVQ_OTEg5Uci',
}

export function isSupabaseConfigured() {
  return Boolean(supabaseConfig.supabaseUrl && supabaseConfig.supabaseAnonKey)
}
