import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// deno-lint-ignore-file no-explicit-any
// Provide ambient Deno for TypeScript checks in non-Deno tooling
declare const Deno: any

interface LLMRequest {
  lead_id: string
  message: string
  context: {
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
  ai_config: {
    model_name: string
    system_prompt: string
    temperature: number
    max_tokens: number
  }
}

interface LLMResponse {
  message: string
  sentiment: string
  intent: string
  confidence: number
  model_used: string
  tokens_used: number
  processing_time_ms: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lead_id, message, context, ai_config }: LLMRequest = await req.json()

    if (!lead_id || !message || !context || !ai_config) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const startTime = Date.now()

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ai_config.model_name,
        messages: [
          {
            role: 'system',
            content: ai_config.system_prompt
          },
          {
            role: 'user',
            content: `Lead: ${context.lead.name} (${context.lead.email})
Preferred Vehicle: ${context.lead.preferred_vehicle ? 
  `${context.lead.preferred_vehicle.year} ${context.lead.preferred_vehicle.make} ${context.lead.preferred_vehicle.model} - $${context.lead.preferred_vehicle.price}` : 
  'None specified'}

Conversation History:
${context.conversation_history.map(msg => 
  `${msg.participant}: ${msg.message}`
).join('\n')}

Dealership: ${context.dealership_context.name} - ${context.dealership_context.location}
Specialties: ${context.dealership_context.specialties.join(', ')}

Lead's latest message: ${message}

Please respond as the AI assistant for this dealership. Be helpful, professional, and focus on understanding their needs and guiding them toward the right vehicle or service.`
          }
        ],
        temperature: ai_config.temperature,
        max_tokens: ai_config.max_tokens,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const aiMessage = openaiData.choices[0].message.content
    const tokensUsed = openaiData.usage.total_tokens

    const processingTime = Date.now() - startTime

    // Analyze sentiment and intent (simplified)
    const sentiment = analyzeSentiment(aiMessage)
    const intent = analyzeIntent(aiMessage)

    const response: LLMResponse = {
      message: aiMessage,
      sentiment,
      intent,
      confidence: 0.85, // This would be calculated by a more sophisticated analysis
      model_used: ai_config.model_name,
      tokens_used: tokensUsed,
      processing_time_ms: processingTime,
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('LLM Proxy Error:', error)
    const details = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process AI request',
        details
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function analyzeSentiment(message: string): string {
  const positiveWords = ['great', 'excellent', 'wonderful', 'amazing', 'perfect', 'love', 'interested', 'excited']
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated', 'angry', 'not interested']
  
  const lowerMessage = message.toLowerCase()
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function analyzeIntent(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('test drive')) {
    return 'appointment_request'
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return 'price_inquiry'
  }
  if (lowerMessage.includes('not interested') || lowerMessage.includes('no thanks') || lowerMessage.includes('not looking')) {
    return 'disinterest'
  }
  if (lowerMessage.includes('follow up') || lowerMessage.includes('call back') || lowerMessage.includes('contact')) {
    return 'follow_up'
  }
  if (lowerMessage.includes('complaint') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    return 'complaint'
  }
  
  return 'inquiry'
}
