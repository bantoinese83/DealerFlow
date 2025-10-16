export interface BaseModel {
  id: string
  created_at: string
  updated_at: string
}

export interface TimestampedModel extends BaseModel {
  created_at: string
  updated_at: string
}

export interface SoftDeleteModel extends BaseModel {
  deleted_at?: string | null
}

export interface AuditableModel extends BaseModel {
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface SearchFilters {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DateRange {
  start: string
  end: string
}

export interface StatusFilter {
  status?: string
  statuses?: string[]
}

export interface OwnerFilter {
  owner_id?: string
  assigned_to?: string
}

export interface DateFilter {
  created_after?: string
  created_before?: string
  updated_after?: string
  updated_before?: string
}

export type FilterOptions = SearchFilters & StatusFilter & OwnerFilter & DateFilter
