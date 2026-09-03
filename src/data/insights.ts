import { supabase } from '@/lib/supabase'

/**
 * @table insights
 * @rls public_read (SELECT: anon + authenticated, no auth required for reading)
 * @write authenticated (INSERT/UPDATE/DELETE require login)
 * @grant SELECT TO anon; SELECT, INSERT, UPDATE, DELETE TO authenticated
 */
export interface Insight {
  /** 情报ID / Insight ID @format uuid */
  id: string
  /** 标题 / Title */
  title: string
  /** 摘要 / Summary */
  summary: string
  /** 正文 / Content @format richtext */
  content: string
  /** 分类 / Category */
  category: string
  /** 行业标签 / Industry Tag */
  industry: string
  /** 来源 / Source */
  source: string
  /** 作者 / Author */
  author: string
  /** 发布时间 / Published At @format date-time */
  published_at: string
  /** 封面图 / Cover Image @format image */
  cover_url: string
  /** 浏览量 / View Count */
  view_count: number
  /** 精选标记 / Is Featured */
  is_featured: boolean
  /** 删除标记 / Is Deleted */
  is_deleted: boolean
  /** 创建时间 / Created At @format date-time */
  created_at: string
  /** 更新时间 / Updated At @format date-time */
  updated_at: string
}

type InsightInput = Omit<Insight, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>

export async function getInsights(): Promise<Insight[]> {
  const { data, error } = await supabase.from('insights').select('*').eq('is_deleted', false).order('published_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getInsightById(id: string): Promise<Insight | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  const { data, error } = await supabase.from('insights').select('*').eq('id', id).eq('is_deleted', false).maybeSingle()
  if (error) throw error
  return data
}

export async function createInsight(input: InsightInput): Promise<Insight | null> {
  const { data, error } = await supabase.from('insights').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateInsight(id: string, input: Partial<InsightInput>): Promise<Insight | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  const { data, error } = await supabase.from('insights').update(input).eq('id', id).eq('is_deleted', false).select().single()
  if (error) throw error
  return data
}

export async function deleteInsight(id: string): Promise<boolean> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return false
  const { data, error } = await supabase.from('insights').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false).select('id').maybeSingle()
  if (error) throw error
  return data !== null
}
