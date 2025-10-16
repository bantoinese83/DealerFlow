import { NextRequest, NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'
import { createServerClient } from '@/lib/supabase/client'

const vehicleService = new VehicleService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, dealership_id, vin } = body

    if (!url || !dealership_id) {
      return NextResponse.json(
        { error: 'Missing required fields: url and dealership_id' },
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

    // Check if user has permission to scrape vehicles
    if (!['manager', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Verify the dealership_id matches the user's dealership
    if (dealership_id !== profile.dealership_id) {
      return NextResponse.json(
        { error: 'Invalid dealership' },
        { status: 403 }
      )
    }

    const result = await vehicleService.scrapeVehicle({
      url,
      dealership_id,
      vin,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error scraping vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to scrape vehicle' },
      { status: 500 }
    )
  }
}
