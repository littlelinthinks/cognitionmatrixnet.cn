-- =============================================================================
-- Cognition Matrix Net — 知识中枢初始化迁移 (Step 1)
-- 目标库：Supabase (Postgres 15 + pgvector)
-- 设计原则：
--   1) 严格兼容现有前端契约（src/data/insights.ts / src/data/tools.ts 字段名不变）
--   2) 补齐自动化 Pipeline 所需的抽取/质量门控/向量/图谱字段
--   3) 通过 RLS 实现「匿名只读已发布 + 后台 service_role 写入」
--   4) 语义检索走 SECURITY DEFINER 函数，避免向前端泄露 embedding 原始向量
-- 使用方式（任选其一）：
--   A. Supabase Dashboard → SQL Editor → 全选粘贴执行
--   B. Supabase CLI:  supabase migration up    （或把本文件放到 supabase/migrations/ 后 `supabase db push`）
-- 注意：embedding 维度默认 1536（OpenAI text-embedding-3-small）。
--       若改用 bge-m3，请把全文 vector(1536) 统一改为 vector(1024)。
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. 扩展：向量检索 + 模糊搜索
-- -----------------------------------------------------------------------------
create extension if not exists vector;     -- pgvector：语义相似度 / 向量索引
create extension if not exists pg_trgm;    -- 三元组模糊匹配：标题/摘要 ilike 搜索加速

-- -----------------------------------------------------------------------------
-- 1. 通用触发器：自动维护 updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 2. 表：insights（行业情报）
--    兼容原 Insight 接口字段，新增质量门控 / 向量 / 图谱衍生字段
-- =============================================================================
create table if not exists public.insights (
  id                uuid primary key default gen_random_uuid(),
  -- —— 原前端契约字段（保持不变）——
  title             text        not null,
  summary           text,                       -- 一句话总结
  content           text,                       -- 正文 / richtext
  category          text        not null default 'AI动态',
  industry          text,                       -- 行业标签
  source            text,                       -- 来源名（如 arXiv / GitHub / 36Kr）
  author            text,
  published_at      timestamptz default now(),
  cover_url         text,
  view_count        integer     not null default 0,
  is_featured       boolean     not null default false,
  is_deleted        boolean     not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- —— 自动化 Pipeline 新增字段 ——
  key_breakthrough  text,                       -- 核心突破点
  takeaways         jsonb,                      -- 3 条关键 Takeaways（text 数组）
  tags              text[]      default '{}',    -- 自动分类标签（数组，便于 && 查询）
  source_url        text unique,                -- 原文链接（幂等去重键，NULL 允许多个）
  content_hash      text,                       -- URL/标题规一化哈希，Pipeline 去重二次保险
  quality_score     integer     not null default 0 check (quality_score between 0 and 100),
  status            text        not null default 'draft'
                    check (status in ('draft','published','rejected')),
  embedding         vector(1536),               -- 内容向量（text-embedding-3-small）
  raw_payload       jsonb                       -- 抓取原始数据，便于重处理
);

create trigger trg_insights_updated_at
  before update on public.insights
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 3. 表：tools（AI 工具矩阵）
--    兼容原 Tool 接口字段（tags 保持 text 逗号分隔以兼容现有前端）
-- =============================================================================
create table if not exists public.tools (
  id                uuid primary key default gen_random_uuid(),
  -- —— 原前端契约字段（保持不变）——
  title             text        not null,
  description       text,
  category          text        not null default 'AI工具',
  tags              text,                       -- 逗号分隔字符串（兼容现有前端）
  download_count    integer     not null default 0,
  cover_url         text,
  download_url      text,
  extract_code      text,                       -- 提取码（资源站模型兼容）
  sort_order        integer     not null default 0,
  is_deleted        boolean     not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- —— 自动化 Pipeline 新增字段 ——
  source            text,                       -- 收录来源（GitHub / HuggingFace / 手动）
  source_url        text unique,                -- 仓库/模型主页链接（去重键）
  homepage_url      text,                       -- 官网
  repo_url          text,                       -- 代码仓库地址
  stars             integer     default 0,      -- GitHub stars / HF 下载量（质量信号）
  takeaways         jsonb,                      -- 工具亮点（text 数组）
  quality_score     integer     not null default 0 check (quality_score between 0 and 100),
  status            text        not null default 'draft'
                    check (status in ('draft','published','rejected')),
  embedding         vector(1536),
  raw_payload       jsonb
);

create trigger trg_tools_updated_at
  before update on public.tools
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 4. 表：knowledge_nodes（知识图谱节点）
--    由 Pipeline 从 insights/tools 中抽取实体自动建节点，支撑图谱与大模型实体链接
-- =============================================================================
create table if not exists public.knowledge_nodes (
  id            uuid primary key default gen_random_uuid(),
  label         text        not null,           -- 实体名（如 "Transformer"、"Agent"）
  type          text        not null default 'concept'
                check (type in ('concept','tech','company','person','tool','method','dataset')),
  summary       text,                           -- AI 生成的中文释义
  source_ids    uuid[],                         -- 关联来源（insights/tools 的 id）
  embedding     vector(1536),                   -- 节点语义向量
  metadata      jsonb       default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (label, type)                          -- 同名同类型不重复建节点
);

create trigger trg_knowledge_nodes_updated_at
  before update on public.knowledge_nodes
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 5. 表：knowledge_edges（知识图谱边）
-- =============================================================================
create table if not exists public.knowledge_edges (
  id          uuid primary key default gen_random_uuid(),
  source_id   uuid not null references public.knowledge_nodes(id) on delete cascade,
  target_id   uuid not null references public.knowledge_nodes(id) on delete cascade,
  relation    text not null default 'relates_to'
              check (relation in ('relates_to','enables','part_of','used_by','competes_with','developed_by')),
  weight      real not null default 0.5 check (weight between 0 and 1),  -- 置信度
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now(),
  unique (source_id, target_id, relation)       -- 同关系边不重复
);

-- =============================================================================
-- 6. 索引：常规查询 + 模糊搜索 + 向量（HNSW）
-- =============================================================================
-- insights
create index if not exists idx_insights_published_at on public.insights (published_at desc);
create index if not exists idx_insights_category     on public.insights (category);
create index if not exists idx_insights_status       on public.insights (status);
create index if not exists idx_insights_featured     on public.insights (is_featured) where is_featured = true;
create index if not exists idx_insights_content_hash on public.insights (content_hash);
create index if not exists idx_insights_title_trgm   on public.insights using gin (title gin_trgm_ops);
create index if not exists idx_insights_summary_trgm on public.insights using gin (summary gin_trgm_ops);

-- tools
create index if not exists idx_tools_sort_order on public.tools (sort_order);
create index if not exists idx_tools_category   on public.tools (category);
create index if not exists idx_tools_status     on public.tools (status);
create index if not exists idx_tools_stars      on public.tools (stars desc);
create index if not exists idx_tools_content_hash on public.tools (content_hash);

-- knowledge graph
create index if not exists idx_nodes_type     on public.knowledge_nodes (type);
create index if not exists idx_nodes_label    on public.knowledge_nodes (label);
create index if not exists idx_edges_source   on public.knowledge_edges (source_id);
create index if not exists idx_edges_target   on public.knowledge_edges (target_id);

-- 向量索引（HNSW，余弦距离）。推荐方案，构建快、查询快。
-- 若数据量极大且写入频繁，可改用下方 IVFFlat（需先有数据再建，lists≈行数/1000）。
create index if not exists idx_insights_embedding
  on public.insights using hnsw (embedding vector_cosine_ops);
create index if not exists idx_tools_embedding
  on public.tools using hnsw (embedding vector_cosine_ops);
create index if not exists idx_nodes_embedding
  on public.knowledge_nodes using hnsw (embedding vector_cosine_ops);

-- （备选）IVFFlat 向量索引 —— 取消注释以替代对应 HNSW 索引：
-- create index if not exists idx_insights_embedding
--   on public.insights using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- =============================================================================
-- 7. 行级安全 RLS
--    读取：匿名 + 登录用户均可读「已发布且未删除」内容（Quality Gate 在此落地）
--    写入：由后台 Pipeline 使用 service_role 密钥（绕过 RLS）写入，无需写策略
-- =============================================================================
alter table public.insights          enable row level security;
alter table public.tools             enable row level security;
alter table public.knowledge_nodes   enable row level security;
alter table public.knowledge_edges   enable row level security;

-- 7.1 公开读取策略：仅暴露已发布 + 未删除
drop policy if exists insights_read  on public.insights;
create policy insights_read
  on public.insights for select
  to anon, authenticated
  using (is_deleted = false and status = 'published');

drop policy if exists tools_read on public.tools;
create policy tools_read
  on public.tools for select
  to anon, authenticated
  using (is_deleted = false and status = 'published');

-- 知识图谱对站内 RAG / 图谱可视化开放只读
drop policy if exists knowledge_nodes_read on public.knowledge_nodes;
create policy knowledge_nodes_read
  on public.knowledge_nodes for select
  to anon, authenticated
  using (true);

drop policy if exists knowledge_edges_read on public.knowledge_edges;
create policy knowledge_edges_read
  on public.knowledge_edges for select
  to anon, authenticated
  using (true);

-- 7.2 权限授予（写操作依赖 service_role，无需为 anon/authenticated 开写权限）
grant select               on public.insights        to anon, authenticated;
grant select               on public.tools           to anon, authenticated;
grant select               on public.knowledge_nodes to anon, authenticated;
grant select               on public.knowledge_edges to anon, authenticated;
-- 若日后要做管理员后台（用登录用户写），取消下一行注释，并强烈建议加 JWT role 校验：
-- grant insert, update, delete on public.insights, public.tools to authenticated;

-- =============================================================================
-- 8. 语义检索函数（SECURITY DEFINER：以所有者权限执行，绕过 RLS 访问 embedding，
--    但内部已用 status/is_deleted 过滤，不会泄露草稿；前端仅拿到必要字段）
-- =============================================================================
create or replace function public.match_insights(
  query_embedding vector(1536),
  match_threshold float  default 0.78,
  match_count     int     default 8,
  filter_category text    default null
)
returns table (
  id            uuid,
  title         text,
  summary       text,
  category      text,
  source        text,
  published_at  timestamptz,
  similarity    float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.id, i.title, i.summary, i.category, i.source, i.published_at,
    1 - (i.embedding <=> query_embedding) as similarity
  from public.insights i
  where i.status = 'published'
    and i.is_deleted = false
    and i.embedding is not null
    and (filter_category is null or i.category = filter_category)
    and 1 - (i.embedding <=> query_embedding) > match_threshold
  order by i.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.match_tools(
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count     int    default 8,
  filter_category text   default null
)
returns table (
  id           uuid,
  title        text,
  description  text,
  category     text,
  source_url   text,
  stars        integer,
  similarity   float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id, t.title, t.description, t.category, t.source_url, t.stars,
    1 - (t.embedding <=> query_embedding) as similarity
  from public.tools t
  where t.status = 'published'
    and t.is_deleted = false
    and t.embedding is not null
    and (filter_category is null or t.category = filter_category)
    and 1 - (t.embedding <=> query_embedding) > match_threshold
  order by t.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.match_knowledge_nodes(
  query_embedding vector(1536),
  match_threshold float default 0.70,
  match_count     int    default 10
)
returns table (
  id         uuid,
  label      text,
  type       text,
  summary    text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    n.id, n.label, n.type, n.summary,
    1 - (n.embedding <=> query_embedding) as similarity
  from public.knowledge_nodes n
  where n.embedding is not null
    and 1 - (n.embedding <=> query_embedding) > match_threshold
  order by n.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_insights(vector(1536), float, int, text)        to anon, authenticated;
grant execute on function public.match_tools(vector(1536), float, int, text)           to anon, authenticated;
grant execute on function public.match_knowledge_nodes(vector(1536), float, int)       to anon, authenticated;

-- =============================================================================
-- 9. （可选）初始种子数据：让导入后前端立即有内容可验证
--    注意：embedding 为 NULL，语义检索函数不会命中它们，但列表/卡片正常展示。
--    运行 Pipeline（Step 2）后由真实数据覆盖并补全向量。
-- =============================================================================
/*
insert into public.insights (title, summary, content, category, industry, source, author, published_at, is_featured, status, quality_score)
values
  ('认知矩阵知识网络系统上线', '一套结合 Supabase 与自动化 Pipeline 的实时知识中枢。', '本文介绍……', 'AI动态', '人工智能', 'Cognition Matrix', 'littlelinthinks', now(), true, 'published', 85),
  ('2026 年 AI Agent 工程化趋势', '从工具调用到多 Agent 编排，工程化落地加速。', '本文介绍……', '技术前沿', '人工智能', 'arXiv', 'arxiv', now(), false, 'published', 82)
on conflict do nothing;

insert into public.tools (title, description, category, tags, source, source_url, sort_order, status, quality_score)
values
  ('Cognition Matrix Net', '认知矩阵知识网络：实时情报 + 工具矩阵 + 站内 RAG。', 'AI工具', '知识管理,AI', 'GitHub', 'https://github.com/littlelinthinks/cognitionmatrixnet.cn', 1, 'published', 88)
on conflict do nothing;
*/

-- =============================================================================
-- 10. （参考）回滚脚本
-- =============================================================================
/*
drop function if exists public.match_insights(vector(1536), float, int, text);
drop function if exists public.match_tools(vector(1536), float, int, text);
drop function if exists public.match_knowledge_nodes(vector(1536), float, int);
drop table if exists public.knowledge_edges;
drop table if exists public.knowledge_nodes;
drop table if exists public.tools;
drop table if exists public.insights;
drop function if exists public.set_updated_at();
*/
