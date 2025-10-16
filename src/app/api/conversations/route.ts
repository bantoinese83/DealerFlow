import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/services/aiService'
import { createServerClient } from '@/lib/supabase/client'

const aiService = new AIService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId parameter is required' },
        { status: 400 }
      )
    }

    // Get current user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to this lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('dealership_id, assigned_to')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this lead
    if (lead.dealership_id !== profile.dealership_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Additional check for BDC reps - they can only see assigned leads or unassigned leads
    if (profile.role === 'bdc_rep' && lead.assigned_to && lead.assigned_to !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const conversations = await aiService.getConversations(leadId)
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, participant, message, triggerAI } = body

    if (!leadId || !participant || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, participant, message' },
        { status: 400 }
      )
    }

    // Get current user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user has access to this lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('dealership_id, assigned_to, first_name, last_name, email, phone, preferred_vehicle_id, notes')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this lead
    if (lead.dealership_id !== profile.dealership_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Store the conversation
    await aiService.storeConversation({
      lead_id: leadId,
      participant,
      message,
    })

    // If triggerAI is true and participant is not 'ai', generate AI response
    if (triggerAI && participant !== 'ai') {
      try {
        // Get conversation history
        const conversations = await aiService.getConversations(leadId)
        
        // Get preferred vehicle details if exists
        let preferredVehicle: { make: string; model: string; year: number; price: number } | undefined
        if (lead.preferred_vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select('make, model, year, price')
            .eq('id', lead.preferred_vehicle_id)
            .single()
          if (vehicle) {
            preferredVehicle = {
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
            }
          }
        }

        // Get dealership context
        const { data: dealership } = await supabase
          .from('dealerships')
          .select('name, city, state')
          .eq('id', lead.dealership_id)
          .single()

        const context = {
          lead: {
            name: `${lead.first_name} ${lead.last_name || ''}`.trim(),
            email: lead.email,
            phone: lead.phone,
            preferred_vehicle: preferredVehicle,
            last_contact: conversations[conversations.length - 1]?.timestamp,
            notes: lead.notes,
          },
          conversation_history: conversations.map(c => ({
            participant: c.participant,
            message: c.message,
            timestamp: c.timestamp,
          })),
          dealership_context: {
            name: dealership?.name || 'Dealership',
            location: `${dealership?.city || ''}, ${dealership?.state || ''}`.trim(),
            specialties: ['New Cars', 'Used Cars', 'Service', 'Parts'], // This could be dynamic
          },
        }

        const aiResponse = await aiService.generateAIResponse(leadId, lead.dealership_id, message, context)
        
        return NextResponse.json({
          message: 'Conversation stored and AI response generated',
          ai_response: aiResponse,
        })
      } catch (aiError) {
        console.error('Error generating AI response:', aiError)
        // Still return success for the conversation storage
        return NextResponse.json({
          message: 'Conversation stored, but AI response failed',
          error: 'AI response generation failed',
        })
      }
    }

    return NextResponse.json({
      message: 'Conversation stored successfully',
    })
  } catch (error) {
    console.error('Error storing conversation:', error)
    return NextResponse.json(
      { error: 'Failed to store conversation' },
      { status: 500 }
    )
  }
}
