export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dealerships: {
        Row: {
          id: string
          name: string
          crm_type: string | null
          crm_config_json: Json | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          phone: string | null
          website: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          crm_type?: string | null
          crm_config_json?: Json | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          website?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          crm_type?: string | null
          crm_config_json?: Json | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          website?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          dealership_id: string
          first_name: string
          last_name: string
          role: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          dealership_id: string
          first_name: string
          last_name: string
          role: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dealership_id?: string
          first_name?: string
          last_name?: string
          role?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          dealership_id: string
          crm_lead_id: string | null
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          status: string
          source: string
          assigned_to: string | null
          preferred_vehicle_id: string | null
          notes: string | null
          last_contacted_at: string | null
          follow_up_due_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dealership_id: string
          crm_lead_id?: string | null
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          status?: string
          source: string
          assigned_to?: string | null
          preferred_vehicle_id?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          follow_up_due_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dealership_id?: string
          crm_lead_id?: string | null
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          status?: string
          source?: string
          assigned_to?: string | null
          preferred_vehicle_id?: string | null
          notes?: string | null
          last_contacted_at?: string | null
          follow_up_due_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          dealership_id: string
          vin: string
          make: string | null
          model: string | null
          year: number | null
          trim: string | null
          mileage: number | null
          price: number | null
          availability_status: string
          last_scraped_at: string | null
          scraped_url: string | null
          image_urls: string[]
          details_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dealership_id: string
          vin: string
          make?: string | null
          model?: string | null
          year?: number | null
          trim?: string | null
          mileage?: number | null
          price?: number | null
          availability_status?: string
          last_scraped_at?: string | null
          scraped_url?: string | null
          image_urls?: string[]
          details_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dealership_id?: string
          vin?: string
          make?: string | null
          model?: string | null
          year?: number | null
          trim?: string | null
          mileage?: number | null
          price?: number | null
          availability_status?: string
          last_scraped_at?: string | null
          scraped_url?: string | null
          image_urls?: string[]
          details_json?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          lead_id: string
          participant: string
          message: string
          timestamp: string
          sentiment: string | null
          intent: string | null
          ai_model_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          participant: string
          message: string
          timestamp?: string
          sentiment?: string | null
          intent?: string | null
          ai_model_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          participant?: string
          message?: string
          timestamp?: string
          sentiment?: string | null
          intent?: string | null
          ai_model_used?: string | null
          created_at?: string
        }
      }
      ai_configs: {
        Row: {
          id: string
          dealership_id: string
          model_name: string
          system_prompt: string
          temperature: number
          max_tokens: number
          follow_up_frequency_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dealership_id: string
          model_name: string
          system_prompt: string
          temperature?: number
          max_tokens?: number
          follow_up_frequency_days?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dealership_id?: string
          model_name?: string
          system_prompt?: string
          temperature?: number
          max_tokens?: number
          follow_up_frequency_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          dealership_id: string
          profile_id: string | null
          lead_id: string | null
          type: string
          message: string
          is_read: boolean
          triggered_at: string
        }
        Insert: {
          id?: string
          dealership_id: string
          profile_id?: string | null
          lead_id?: string | null
          type: string
          message: string
          is_read?: boolean
          triggered_at?: string
        }
        Update: {
          id?: string
          dealership_id?: string
          profile_id?: string | null
          lead_id?: string | null
          type?: string
          message?: string
          is_read?: boolean
          triggered_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
