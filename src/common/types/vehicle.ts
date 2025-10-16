export interface Vehicle {
  id: string
  dealership_id: string
  vin: string
  make?: string
  model?: string
  year?: number
  trim?: string
  mileage?: number
  price?: number
  availability_status: VehicleAvailabilityStatus
  last_scraped_at?: string
  scraped_url?: string
  image_urls: string[]
  details_json?: Record<string, any>
  created_at: string
  updated_at: string
}

export type VehicleAvailabilityStatus = 'in_stock' | 'sold' | 'pending'

export interface CreateVehicleRequest {
  vin: string
  make?: string
  model?: string
  year?: number
  trim?: string
  mileage?: number
  price?: number
  availability_status: VehicleAvailabilityStatus
  scraped_url?: string
  image_urls?: string[]
  details_json?: Record<string, any>
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  last_scraped_at?: string
}

export interface VehicleFilters {
  make?: string
  model?: string
  year?: number
  price_min?: number
  price_max?: number
  mileage_max?: number
  availability_status?: VehicleAvailabilityStatus
  search?: string
  page?: number
  limit?: number
}

export interface ScrapeVehicleRequest {
  url: string
  dealership_id: string
  vin?: string
}

export interface ScrapeVehicleResponse {
  message: string
  job_id: string
}
