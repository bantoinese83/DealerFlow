export interface User {
  id: string
  dealership_id: string
  first_name: string
  last_name: string
  role: UserRole
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'manager' | 'bdc_rep'

export interface CreateUserRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  role: UserRole
  dealership_id: string
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  email?: string
  role?: UserRole
  avatar_url?: string
}

export interface UserSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest extends CreateUserRequest {}

export interface UserPermissions {
  can_view_leads: boolean
  can_edit_leads: boolean
  can_delete_leads: boolean
  can_view_vehicles: boolean
  can_edit_vehicles: boolean
  can_view_conversations: boolean
  can_send_messages: boolean
  can_trigger_ai: boolean
  can_view_ai_config: boolean
  can_edit_ai_config: boolean
  can_view_crm_integration: boolean
  can_edit_crm_integration: boolean
  can_view_alerts: boolean
  can_manage_users: boolean
  can_view_analytics: boolean
}
