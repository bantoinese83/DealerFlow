export interface Alert {
  id: string
  dealership_id: string
  profile_id?: string
  lead_id?: string
  type: AlertType
  message: string
  is_read: boolean
  triggered_at: string
}

export type AlertType = 'critical' | 'warning' | 'info'

export interface CreateAlertRequest {
  profile_id?: string
  lead_id?: string
  type: AlertType
  message: string
}

export interface AlertFilters {
  is_read?: boolean
  type?: AlertType
  lead_id?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

export interface AlertStats {
  total: number
  unread: number
  critical: number
  warning: number
  info: number
}

export interface AlertTemplate {
  id: string
  name: string
  type: AlertType
  message_template: string
  conditions: AlertCondition[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AlertCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number
}

export type AlertTrigger = 
  | 'lead_qualified'
  | 'sentiment_deteriorated'
  | 'follow_up_overdue'
  | 'new_crm_lead_created'
  | 'scrape_failed'
  | 'ai_error'
  | 'crm_sync_failed'
