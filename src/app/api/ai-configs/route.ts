import { NextRequest, NextResponse } from 'next/server'
import { AIService } from '@/services/aiService'
import { createAIConfigSchema, updateAIConfigSchema } from '@/common/validation/aiConfigSchema'
import { createServerClient } from '@/lib/supabase/client'

const aiService = new AIService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dealershipId = searchParams.get('dealershipId')

    if (!dealershipId) {
      return NextResponse.json(
        { error: 'dealershipId parameter is required' },
        { status: 400 }
      )
    }

    // Get current user
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if user has access to this dealership
    if (dealershipId !== profile.dealership_id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const aiConfig = await aiService.getAIConfig(dealershipId)
    return NextResponse.json(aiConfig)
  } catch (error) {
    console.error('Error fetching AI config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI config' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = createAIConfigSchema.parse(body)
    
    // Get current user
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if user has permission to create AI config
    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const aiConfig = await aiService.createAIConfig(profile.dealership_id, validatedData)
    return NextResponse.json(aiConfig, { status: 201 })
  } catch (error) {
    console.error('Error creating AI config:', error)
    return NextResponse.json(
      { error: 'Failed to create AI config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = updateAIConfigSchema.parse(body)
    
    // Get current user
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if user has permission to update AI config
    if (profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const aiConfig = await aiService.updateAIConfig(profile.dealership_id, validatedData)
    return NextResponse.json(aiConfig)
  } catch (error) {
    console.error('Error updating AI config:', error)
    return NextResponse.json(
      { error: 'Failed to update AI config' },
      { status: 500 }
    )
  }
}
