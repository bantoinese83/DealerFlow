export interface Dealership {
  id: string
  name: string
  crm_type?: string
  crm_config_json?: Record<string, any>
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  website?: string
  timezone?: string
  created_at: string
  updated_at: string
}

export interface CreateDealershipRequest {
  name: string
  crm_type?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  website?: string
  timezone?: string
}

export interface UpdateDealershipRequest extends Partial<CreateDealershipRequest> {
  crm_config_json?: Record<string, any>
}

export interface DealershipStats {
  total_leads: number
  active_leads: number
  qualified_leads: number
  conversion_rate: number
  total_vehicles: number
  available_vehicles: number
  total_conversations: number
  ai_conversations: number
  active_users: number
}
