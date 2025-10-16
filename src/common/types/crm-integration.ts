export interface CRMIntegration {
  id: string
  dealership_id: string
  crm_type: CRMType
  crm_config_json: CRMConfig
  is_active: boolean
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export type CRMType = 'CDK' | 'Reynolds' | 'DealerSocket' | 'VinSolutions' | 'other'

export interface CRMConfig {
  api_key: string
  api_secret?: string
  base_url: string
  dealership_id: string
  webhook_url?: string
  sync_frequency_minutes: number
  custom_fields?: Record<string, any>
}

export interface CreateCRMIntegrationRequest {
  crm_type: CRMType
  crm_config_json: Omit<CRMConfig, 'api_key' | 'api_secret'>
  is_active?: boolean
}

export interface UpdateCRMIntegrationRequest extends Partial<CreateCRMIntegrationRequest> {}

export interface CRMLead {
  id: string
  first_name: string
  last_name?: string
  email: string
  phone?: string
  source: string
  status: string
  created_at: string
  updated_at: string
  custom_fields?: Record<string, any>
}

export interface CRMSyncResult {
  success: boolean
  leads_created: number
  leads_updated: number
  leads_failed: number
  errors: string[]
  sync_duration_ms: number
}

export interface CRMWebhookPayload {
  event_type: 'lead_created' | 'lead_updated' | 'lead_deleted'
  lead_id: string
  data: CRMLead
  timestamp: string
}
