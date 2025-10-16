import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters = {
      is_read: searchParams.get('is_read') ? searchParams.get('is_read') === 'true' : undefined,
      type: searchParams.get('type') || undefined,
      lead_id: searchParams.get('lead_id') || undefined,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
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

    // Build query
    let query = supabase
      .from('alerts')
      .select('*', { count: 'exact' })
      .eq('dealership_id', profile.dealership_id)

    // Apply filters
    if (filters.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.lead_id) {
      query = query.eq('lead_id', filters.lead_id)
    }
    if (filters.date_from) {
      query = query.gte('triggered_at', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('triggered_at', filters.date_to)
    }

    // For BDC reps, only show alerts assigned to them or general alerts
    if (profile.role === 'bdc_rep') {
      query = query.or(`profile_id.eq.${user.id},profile_id.is.null`)
    }

    const offset = (filters.page - 1) * filters.limit
    const { data, error, count } = await query
      .order('triggered_at', { ascending: false })
      .range(offset, offset + filters.limit - 1)

    if (error) {
      throw new Error(`Failed to fetch alerts: ${error.message}`)
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
