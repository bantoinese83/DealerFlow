import { createServerClient } from '@/lib/supabase/client'
import type { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleFilters, ScrapeVehicleRequest, ScrapeVehicleResponse } from '@/common/types'

export class VehicleService {
  private supabase = createServerClient()

  async getVehicles(filters: VehicleFilters = {}): Promise<{ data: Vehicle[]; total: number }> {
    const { page = 1, limit = 20, ...searchFilters } = filters
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('vehicles')
      .select('*', { count: 'exact' })

    // Apply filters
    if (searchFilters.make) {
      query = query.eq('make', searchFilters.make)
    }
    if (searchFilters.model) {
      query = query.eq('model', searchFilters.model)
    }
    if (searchFilters.year) {
      query = query.eq('year', searchFilters.year)
    }
    if (searchFilters.price_min) {
      query = query.gte('price', searchFilters.price_min)
    }
    if (searchFilters.price_max) {
      query = query.lte('price', searchFilters.price_max)
    }
    if (searchFilters.mileage_max) {
      query = query.lte('mileage', searchFilters.mileage_max)
    }
    if (searchFilters.availability_status) {
      query = query.eq('availability_status', searchFilters.availability_status)
    }
    if (searchFilters.search) {
      query = query.textSearch('search_vector', searchFilters.search)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`)
    }

    return {
      data: data || [],
      total: count || 0,
    }
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch vehicle: ${error.message}`)
    }

    return data
  }

  async getVehicleByVin(vin: string): Promise<Vehicle | null> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('*')
      .eq('vin', vin)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to fetch vehicle by VIN: ${error.message}`)
    }

    return data
  }

  async createVehicle(vehicleData: CreateVehicleRequest): Promise<Vehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`)
    }

    return data
  }

  async updateVehicle(id: string, vehicleData: UpdateVehicleRequest): Promise<Vehicle> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update vehicle: ${error.message}`)
    }

    return data
  }

  async deleteVehicle(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete vehicle: ${error.message}`)
    }
  }

  async scrapeVehicle(scrapeData: ScrapeVehicleRequest): Promise<ScrapeVehicleResponse> {
    try {
      // Call the web scraper Edge Function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/web-scraper`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scrapeData),
      })

      if (!response.ok) {
        throw new Error(`Scraping failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success && result.vehicle_data) {
        // Check if vehicle already exists by VIN
        const existingVehicle = await this.getVehicleByVin(result.vehicle_data.vin)
        
        if (existingVehicle) {
          // Update existing vehicle
          await this.updateVehicle(existingVehicle.id, {
            ...result.vehicle_data,
            last_scraped_at: new Date().toISOString(),
          })
        } else {
          // Create new vehicle
          await this.createVehicle({
            ...result.vehicle_data,
            dealership_id: scrapeData.dealership_id,
          })
        }
      }

      return {
        message: result.success ? 'Vehicle scraped successfully' : 'Scraping failed',
        job_id: `scrape_${Date.now()}`,
      }
    } catch (error) {
      throw new Error(`Failed to scrape vehicle: ${error.message}`)
    }
  }

  async getVehicleMakes(dealershipId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('vehicles')
      .select('make')
      .eq('dealership_id', dealershipId)
      .not('make', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch vehicle makes: ${error.message}`)
    }

    return [...new Set(data.map(v => v.make).filter(Boolean))] as string[]
  }

  async getVehicleModels(dealershipId: string, make?: string): Promise<string[]> {
    let query = this.supabase
      .from('vehicles')
      .select('model')
      .eq('dealership_id', dealershipId)
      .not('model', 'is', null)

    if (make) {
      query = query.eq('make', make)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch vehicle models: ${error.message}`)
    }

    return [...new Set(data.map(v => v.model).filter(Boolean))] as string[]
  }

  async updateAvailabilityStatus(id: string, status: Vehicle['availability_status']): Promise<Vehicle> {
    return this.updateVehicle(id, { availability_status: status })
  }
}
