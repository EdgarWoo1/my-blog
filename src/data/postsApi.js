// 블로그 글의 읽기/쓰기를 담당하는 데이터 계층.
// 댓글과 동일하게 Supabase에 글을 저장한다(테이블 이름: posts).
//
// Supabase가 설정되어 있지 않거나, 아직 posts 테이블을 만들지 않아
// 오류가 나는 경우에는 src/data/posts.js의 기본 글을 보여 주어
// 사이트가 깨지지 않도록 한다.

import { supabase } from '../supabase'
import { isSupabaseConfigured } from '../config'
import { posts as seedPosts } from './posts'

const TABLE = '_TdaPost'

// DB의 한 행(PascalCase 컬럼)을 화면에서 쓰는 형태(소문자 키)로 정리한다.
function normalize(row) {
  return {
    slug: row.Slug,
    title: row.Title,
    date: row.Date,
    tags: row.Tags || [],
    excerpt: row.Excerpt || '',
    body: row.Body || '',
  }
}

function ensureReady() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      'Supabase가 설정되어 있지 않아 글을 저장할 수 없어요. src/config.js의 supabaseConfig를 확인해 주세요.',
    )
  }
}

// 글 목록 (최신순)
export async function listPosts() {
  if (!isSupabaseConfigured() || !supabase) return seedPosts

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('Date', { ascending: false })

  if (error || !data) {
    console.warn(
      'Supabase에서 글을 불러오지 못해 기본 글을 표시합니다. posts 테이블을 만들었는지 확인해 주세요.',
      error,
    )
    return seedPosts
  }
  return data.map(normalize)
}

// 글 하나 (slug 기준). 없으면 null
export async function getPost(slug) {
  if (!isSupabaseConfigured() || !supabase) {
    return seedPosts.find((p) => p.slug === slug) || null
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('Slug', slug)
    .maybeSingle()

  if (error) {
    console.warn('Supabase에서 글을 불러오지 못했습니다.', error)
    return seedPosts.find((p) => p.slug === slug) || null
  }
  return data ? normalize(data) : null
}

// 새 글 작성
export async function createPost(input) {
  ensureReady()
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      Slug: input.slug,
      Title: input.title,
      Date: input.date,
      Tags: input.tags,
      Excerpt: input.excerpt,
      Body: input.body,
    })
    .select()
    .single()

  if (error) throw error
  return normalize(data)
}

// 기존 글 수정 (slug는 그대로 두고 내용만 바꾼다)
export async function updatePost(slug, input) {
  ensureReady()
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      Title: input.title,
      Tags: input.tags,
      Excerpt: input.excerpt,
      Body: input.body,
    })
    .eq('Slug', slug)
    .select()
    .single()

  if (error) throw error
  return normalize(data)
}

// 글 삭제
export async function deletePost(slug) {
  ensureReady()
  const { error } = await supabase.from(TABLE).delete().eq('Slug', slug)
  if (error) throw error
}
