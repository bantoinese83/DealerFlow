export interface Conversation {
  id: string
  lead_id: string
  participant: ConversationParticipant
  message: string
  timestamp: string
  sentiment?: ConversationSentiment
  intent?: ConversationIntent
  ai_model_used?: string
  created_at: string
}

export type ConversationParticipant = 'ai' | 'lead' | 'bdc_rep'

export type ConversationSentiment = 'positive' | 'neutral' | 'negative'

export type ConversationIntent = 
  | 'inquiry'
  | 'appointment_request'
  | 'price_inquiry'
  | 'disinterest'
  | 'follow_up'
  | 'complaint'
  | 'other'

export interface CreateConversationRequest {
  lead_id: string
  participant: ConversationParticipant
  message: string
  trigger_ai?: boolean
}

export interface ConversationFilters {
  lead_id: string
  participant?: ConversationParticipant
  sentiment?: ConversationSentiment
  intent?: ConversationIntent
  date_from?: string
  date_to?: string
}

export interface ConversationSummary {
  total_messages: number
  ai_messages: number
  lead_messages: number
  bdc_rep_messages: number
  last_activity: string
  sentiment_trend: ConversationSentiment[]
  key_intents: ConversationIntent[]
}
