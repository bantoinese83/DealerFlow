export interface Lead {
  id: string
  dealership_id: string
  crm_lead_id?: string
  first_name: string
  last_name?: string
  email: string
  phone?: string
  status: LeadStatus
  source: LeadSource
  assigned_to?: string
  preferred_vehicle_id?: string
  notes?: string
  last_contacted_at?: string
  follow_up_due_at?: string
  created_at: string
  updated_at: string
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified' | 'closed'

export type LeadSource = 'website' | 'walk_in' | 'ai_generated' | 'phone' | 'referral' | 'other'

export interface CreateLeadRequest {
  first_name: string
  last_name?: string
  email: string
  phone?: string
  source: LeadSource
  assigned_to?: string
  preferred_vehicle_id?: string
  notes?: string
  follow_up_due_at?: string
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  status?: LeadStatus
  last_contacted_at?: string
}

export interface LeadFilters {
  status?: LeadStatus
  assigned_to?: string
  source?: LeadSource
  search?: string
  follow_up_due?: 'overdue' | 'today' | 'upcoming'
  page?: number
  limit?: number
}

export interface LeadStats {
  total: number
  new: number
  contacted: number
  qualified: number
  disqualified: number
  closed: number
  conversion_rate: number
}
