-- ============================================================
--  글 테이블  _TdaPost  만들기  ―  한 번만 실행하면 됩니다.
-- ============================================================
--  실행 방법
--    1) Supabase 대시보드에 접속
--    2) 왼쪽 메뉴 → SQL Editor → New query
--    3) 이 파일 내용을 통째로 붙여넣고 "Run" 클릭
--
--  명명 규칙
--    · 테이블명 : 앞에 _ 를 붙이고 PascalCase  (예: _TdaPost)
--    · 컬럼명   : PascalCase  (예: No, Slug, Title)
--    · 대문자가 섞인 이름은 PostgreSQL에서 "큰따옴표"로 감싸야
--      대소문자가 그대로 유지됩니다.
--
--  ※ 로그인 없이 누구나 글을 쓰고/고치고/지울 수 있도록 열어 둔 정책입니다.
--    (나중에 작성자 로그인 기능을 붙이면 정책을 더 좁게 바꾸는 것을 권장)
-- ============================================================

create table if not exists public."_TdaPost" (
  "No"        bigint generated always as identity primary key,
  "Slug"      text unique not null,
  "Title"     text not null,
  "Date"      date not null default current_date,
  "Tags"      text[] not null default '{}',
  "Excerpt"   text not null default '',
  "Body"      text not null,
  "CreatedAt" timestamptz not null default now()
);

-- 최신순 정렬을 빠르게
create index if not exists "_TdaPost_Date_idx" on public."_TdaPost" ("Date" desc);

-- RLS(행 수준 보안) 켜기
alter table public."_TdaPost" enable row level security;

-- 정책: 누구나 읽기/쓰기/수정/삭제 가능
drop policy if exists "_TdaPost read"   on public."_TdaPost";
drop policy if exists "_TdaPost insert" on public."_TdaPost";
drop policy if exists "_TdaPost update" on public."_TdaPost";
drop policy if exists "_TdaPost delete" on public."_TdaPost";

create policy "_TdaPost read"   on public."_TdaPost" for select using (true);
create policy "_TdaPost insert" on public."_TdaPost" for insert with check (true);
create policy "_TdaPost update" on public."_TdaPost" for update using (true) with check (true);
create policy "_TdaPost delete" on public."_TdaPost" for delete using (true);

-- ============================================================
--  기존에 있던 글 3개를 옮겨 담기 (시드)
--  이미 있으면 건너뜁니다(Slug 중복 무시).
-- ============================================================
insert into public."_TdaPost" ("Slug", "Title", "Date", "Tags", "Excerpt", "Body") values
(
  'first-snow',
  '첫눈이 내리던 밤',
  '2026-06-20',
  array['일상','겨울'],
  '창밖으로 소리 없이 쌓이는 눈을 바라보다가, 문득 올 한 해를 돌아보게 되었다.',
  '늦은 밤, 잠이 오지 않아 창문을 열었다. 차가운 공기 사이로 첫눈이 내리고 있었다. 소리도 없이, 서두르지도 않고, 그저 천천히.

올해는 유난히 빠르게 지나갔다. 봄에 세웠던 계획들은 절반쯤 이루어졌고, 절반쯤은 그대로 마음 한구석에 남아 있다. 그래도 후회는 들지 않았다. 이루지 못한 것들도 결국 나를 이루는 일부니까.

눈은 모든 것을 잠시 덮어 준다. 복잡했던 거리도, 어지러웠던 마음도 한순간 하얗게 정리된다. 내일 아침이면 다 녹아 사라지겠지만, 그 잠깐의 고요함이 좋았다.

내년에는 조금 더 천천히 걷고 싶다. 눈처럼.'
),
(
  'morning-coffee',
  '아침 커피 한 잔의 의식',
  '2026-06-12',
  array['일상','습관'],
  '매일 아침 같은 자리에서 커피를 내린다. 별것 아닌 이 반복이 하루를 지탱한다.',
  '나에게는 작은 의식이 하나 있다. 매일 아침, 가장 먼저 하는 일은 커피를 내리는 것이다.

원두를 갈 때 나는 소리, 뜨거운 물이 천천히 스며드는 모습, 방 안에 퍼지는 향. 이 모든 과정이 5분 남짓이지만, 그 시간 동안만큼은 아무 생각도 하지 않는다.

사람들은 대단한 변화가 삶을 바꾼다고 믿지만, 나는 오히려 사소한 반복이 사람을 지탱한다고 생각한다. 매일 같은 시간에 일어나는 것, 같은 자리에서 커피를 마시는 것, 같은 길을 걷는 것.

흔들리는 날일수록 이 작은 의식들이 더 소중해진다. 무엇 하나 확실하지 않은 하루에도, 적어도 아침 커피만큼은 변하지 않으니까.'
),
(
  'walking-alone',
  '혼자 걷는 시간에 대하여',
  '2026-06-03',
  array['생각','산책'],
  '목적지 없이 걷다 보면, 평소엔 들리지 않던 내 안의 목소리가 들려온다.',
  '요즘은 일주일에 한 번씩 혼자 오래 걷는다. 특별한 목적지는 없다. 그냥 신발을 신고 문을 나서서, 발길이 닿는 대로 걷는다.

처음엔 머릿속이 시끄럽다. 해야 할 일, 했어야 했던 말, 내일의 걱정들이 줄줄이 떠오른다. 그런데 30분쯤 지나면 신기하게도 그 소음이 잦아든다.

그제야 비로소 진짜 내 생각이 들리기 시작한다. 무엇을 원하는지, 무엇이 나를 불편하게 하는지, 무엇에 감사한지. 평소에는 너무 바빠서 듣지 못했던 목소리들이다.

혼자 있는 시간이 외로움은 아니다. 오히려 나 자신과 다시 친해지는 시간이다. 걷다 보면 늘 그렇게 느낀다.'
)
on conflict ("Slug") do nothing;
