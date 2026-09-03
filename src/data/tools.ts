import { supabase } from '@/lib/supabase'

/**
 * @table tools
 * @rls public_read (SELECT: anon + authenticated, is_deleted = false)
 * @write authenticated (INSERT/UPDATE/DELETE require login)
 * @grant SELECT TO anon, authenticated; INSERT,UPDATE,DELETE TO authenticated
 */
export interface Tool {
  /** 工具ID / Tool ID @format uuid */
  id: string
  /** 工具标题 / Title */
  title: string
  /** 工具描述 / Description */
  description: string
  /** 分类 / Category */
  category: string
  /** 标签 / Tags */
  tags: string
  /** 下载量 / Download Count */
  download_count: number
  /** 封面图 / Cover Image @format image */
  cover_url: string
  /** 下载链接 / Download URL @format uri */
  download_url: string
  /** 提取码 / Extract Code */
  extract_code: string
  /** 排序权重 / Sort Order */
  sort_order: number
  /** 删除标记 / Is Deleted */
  is_deleted: boolean
  /** 创建时间 / Created At @format date-time */
  created_at: string
  /** 更新时间 / Updated At @format date-time */
  updated_at: string
}

type ToolInput = Omit<Tool, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>

export async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabase.from('tools').select('*').eq('is_deleted', false).order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getToolById(id: string): Promise<Tool | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  const { data, error } = await supabase.from('tools').select('*').eq('id', id).eq('is_deleted', false).maybeSingle()
  if (error) throw error
  return data
}

export async function createTool(input: ToolInput): Promise<Tool | null> {
  const { data, error } = await supabase.from('tools').insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateTool(id: string, input: Partial<ToolInput>): Promise<Tool | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  const { data, error } = await supabase.from('tools').update(input).eq('id', id).eq('is_deleted', false).select().single()
  if (error) throw error
  return data
}

export async function deleteTool(id: string): Promise<boolean> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return false
  const { data, error } = await supabase.from('tools').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false).select('id').maybeSingle()
  if (error) throw error
  return data !== null
}
