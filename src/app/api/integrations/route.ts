import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import { createCRMIntegrationSchema } from '@/common/validation/crmIntegrationSchema'
import { z } from 'zod'

// GET /api/integrations - Get CRM integration settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to get dealership_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get CRM integration settings for the dealership
    const { data: integration, error: integrationError } = await supabase
      .from('crm_integrations')
      .select('*')
      .eq('dealership_id', profile.dealership_id)
      .single()

    if (integrationError) {
      if (integrationError.code === 'PGRST116') {
        // No integration found, return null
        return NextResponse.json({ data: null })
      }
      return NextResponse.json({ error: integrationError.message }, { status: 500 })
    }

    // Remove sensitive data before returning
    const safeIntegration = {
      ...integration,
      api_key: integration.api_key ? '***' + integration.api_key.slice(-4) : null,
      api_secret: integration.api_secret ? '***' + integration.api_secret.slice(-4) : null,
      password: integration.password ? '***' : null,
    }

    return NextResponse.json({ data: safeIntegration })
  } catch (error) {
    console.error('Error fetching CRM integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/integrations - Create or update CRM integration settings
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to get dealership_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user has permission to manage integrations
    if (!['admin', 'manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validatedData = createCRMIntegrationSchema.parse(body)

    // Check if integration already exists
    const { data: existingIntegration } = await supabase
      .from('crm_integrations')
      .select('id')
      .eq('dealership_id', profile.dealership_id)
      .single()

    let result
    if (existingIntegration) {
      // Update existing integration
      const { data, error } = await supabase
        .from('crm_integrations')
        .update({
          ...validatedData,
          dealership_id: profile.dealership_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingIntegration.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else {
      // Create new integration
      const { data, error } = await supabase
        .from('crm_integrations')
        .insert({
          ...validatedData,
          dealership_id: profile.dealership_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    }

    // Remove sensitive data before returning
    const safeIntegration = {
      ...result,
      api_key: result.api_key ? '***' + result.api_key.slice(-4) : null,
      api_secret: result.api_secret ? '***' + result.api_secret.slice(-4) : null,
      password: result.password ? '***' : null,
    }

    return NextResponse.json({ data: safeIntegration })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error saving CRM integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/integrations - Update CRM integration settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to get dealership_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user has permission to manage integrations
    if (!['admin', 'manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validatedData = createCRMIntegrationSchema.parse(body)

    // Update the integration
    const { data, error } = await supabase
      .from('crm_integrations')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('dealership_id', profile.dealership_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Remove sensitive data before returning
    const safeIntegration = {
      ...data,
      api_key: data.api_key ? '***' + data.api_key.slice(-4) : null,
      api_secret: data.api_secret ? '***' + data.api_secret.slice(-4) : null,
      password: data.password ? '***' : null,
    }

    return NextResponse.json({ data: safeIntegration })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error updating CRM integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/integrations - Delete CRM integration settings
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to get dealership_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user has permission to manage integrations
    if (!['admin', 'manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Delete the integration
    const { error } = await supabase
      .from('crm_integrations')
      .delete()
      .eq('dealership_id', profile.dealership_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Integration deleted successfully' })
  } catch (error) {
    console.error('Error deleting CRM integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
