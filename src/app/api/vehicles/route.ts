import { NextRequest, NextResponse } from 'next/server'
import { VehicleService } from '@/services/vehicleService'
import { createServerClient } from '@/lib/supabase/client'

// Instantiate per request to avoid initializing any request-scoped deps at module load
const vehicleService = new VehicleService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters = {
      make: searchParams.get('make') || undefined,
      model: searchParams.get('model') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      price_min: searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : undefined,
      price_max: searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : undefined,
      mileage_max: searchParams.get('mileage_max') ? parseInt(searchParams.get('mileage_max')!) : undefined,
      availability_status: searchParams.get('availability_status') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    }

    // Get current user to ensure they can only access their dealership's vehicles
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile to determine dealership
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('dealership_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const vehicles = await vehicleService.getVehicles({
      ...filters,
      availability_status: filters.availability_status as any,
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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

    // Check if user has permission to create vehicles
    if (!['manager', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Add dealership_id to the vehicle data
    const vehicleData = {
      ...body,
      dealership_id: profile.dealership_id,
    }

    const vehicle = await vehicleService.createVehicle(vehicleData)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
