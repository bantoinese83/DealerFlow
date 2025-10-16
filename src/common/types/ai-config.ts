export interface AIConfig {
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

export interface CreateAIConfigRequest {
  model_name: string
  system_prompt: string
  temperature: number
  max_tokens: number
  follow_up_frequency_days: number
}

export interface UpdateAIConfigRequest extends Partial<CreateAIConfigRequest> {}

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic'
  max_tokens: number
  cost_per_token: number
  description: string
}

export interface AIResponse {
  message: string
  sentiment?: string
  intent?: string
  confidence: number
  model_used: string
  tokens_used: number
  processing_time_ms: number
}

export interface AIPromptContext {
  lead: {
    name: string
    email: string
    phone?: string
    preferred_vehicle?: {
      make: string
      model: string
      year: number
      price: number
    }
    last_contact?: string
    notes?: string
  }
  conversation_history: Array<{
    participant: string
    message: string
    timestamp: string
  }>
  dealership_context: {
    name: string
    location: string
    specialties: string[]
  }
}
