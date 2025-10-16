import { createServerClient } from '@/lib/supabase/client'
import type { AIConfig, CreateAIConfigRequest, UpdateAIConfigRequest, AIResponse, AIPromptContext } from '@/common/types'

export class AIService {
  private supabase = createServerClient()

  async getAIConfig(dealershipId: string): Promise<AIConfig | null> {
    const { data, error } = await this.supabase
      .from('ai_configs')
      .select('*')
      .eq('dealership_id', dealershipId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch AI config: ${error.message}`)
    }

    return data
  }

  async createAIConfig(dealershipId: string, configData: CreateAIConfigRequest): Promise<AIConfig> {
    const { data, error } = await this.supabase
      .from('ai_configs')
      .insert({
        ...configData,
        dealership_id: dealershipId,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create AI config: ${error.message}`)
    }

    return data
  }

  async updateAIConfig(dealershipId: string, configData: UpdateAIConfigRequest): Promise<AIConfig> {
    const { data, error } = await this.supabase
      .from('ai_configs')
      .update(configData)
      .eq('dealership_id', dealershipId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update AI config: ${error.message}`)
    }

    return data
  }

  async generateAIResponse(
    leadId: string,
    dealershipId: string,
    message: string,
    context: AIPromptContext
  ): Promise<AIResponse> {
    try {
      // Get AI config for the dealership
      const aiConfig = await this.getAIConfig(dealershipId)
      if (!aiConfig) {
        throw new Error('AI configuration not found for dealership')
      }

      // Call the LLM proxy Edge Function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/llm-proxy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: leadId,
          message,
          context,
          ai_config: {
            model_name: aiConfig.model_name,
            system_prompt: aiConfig.system_prompt,
            temperature: aiConfig.temperature,
            max_tokens: aiConfig.max_tokens,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Store the AI response in the conversations table
      await this.storeConversation({
        lead_id: leadId,
        participant: 'ai',
        message: result.message,
        sentiment: result.sentiment,
        intent: result.intent,
        ai_model_used: result.model_used,
      })

      return result
    } catch (error) {
      throw new Error(`Failed to generate AI response: ${error.message}`)
    }
  }

  async storeConversation(conversationData: {
    lead_id: string
    participant: 'ai' | 'lead' | 'bdc_rep'
    message: string
    sentiment?: string
    intent?: string
    ai_model_used?: string
  }): Promise<void> {
    const { error } = await this.supabase
      .from('conversations')
      .insert(conversationData)

    if (error) {
      throw new Error(`Failed to store conversation: ${error.message}`)
    }
  }

  async getConversations(leadId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`)
    }

    return data || []
  }

  async getConversationSummary(leadId: string): Promise<{
    total_messages: number
    ai_messages: number
    lead_messages: number
    bdc_rep_messages: number
    last_activity: string
    sentiment_trend: string[]
    key_intents: string[]
  }> {
    const conversations = await this.getConversations(leadId)
    
    const summary = {
      total_messages: conversations.length,
      ai_messages: conversations.filter(c => c.participant === 'ai').length,
      lead_messages: conversations.filter(c => c.participant === 'lead').length,
      bdc_rep_messages: conversations.filter(c => c.participant === 'bdc_rep').length,
      last_activity: conversations[conversations.length - 1]?.timestamp || '',
      sentiment_trend: conversations.map(c => c.sentiment).filter(Boolean),
      key_intents: [...new Set(conversations.map(c => c.intent).filter(Boolean))],
    }

    return summary
  }

  async shouldTriggerFollowUp(leadId: string): Promise<boolean> {
    const aiConfig = await this.getAIConfig('') // This would need the actual dealership ID
    if (!aiConfig) return false

    const conversations = await this.getConversations(leadId)
    const lastAIMessage = conversations
      .filter(c => c.participant === 'ai')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

    if (!lastAIMessage) return false

    const daysSinceLastAI = Math.floor(
      (Date.now() - new Date(lastAIMessage.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    )

    return daysSinceLastAI >= aiConfig.follow_up_frequency_days
  }

  async getAvailableModels(): Promise<Array<{
    id: string
    name: string
    provider: 'openai' | 'anthropic'
    max_tokens: number
    cost_per_token: number
    description: string
  }>> {
    return [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        max_tokens: 128000,
        cost_per_token: 0.00001,
        description: 'Most capable GPT-4 model with improved performance and lower costs',
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        max_tokens: 8192,
        cost_per_token: 0.00003,
        description: 'High-quality text generation with strong reasoning capabilities',
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        max_tokens: 4096,
        cost_per_token: 0.000002,
        description: 'Fast and efficient model for most tasks',
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        max_tokens: 200000,
        cost_per_token: 0.000015,
        description: 'Most powerful Claude model with excellent reasoning',
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        max_tokens: 200000,
        cost_per_token: 0.000003,
        description: 'Balanced performance and cost for most use cases',
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        max_tokens: 200000,
        cost_per_token: 0.00000025,
        description: 'Fastest and most cost-effective Claude model',
      },
    ]
  }
}
