import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// deno-lint-ignore-file no-explicit-any
declare const Deno: any

interface ScrapeRequest {
  url: string
  dealership_id: string
  vin?: string
}

interface ScrapeResponse {
  success: boolean
  vehicle_data?: {
    vin: string
    make: string
    model: string
    year: number
    trim: string
    mileage: number
    price: number
    availability_status: string
    image_urls: string[]
    details_json: Record<string, any>
  }
  error?: string
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
    const { url, dealership_id, vin }: ScrapeRequest = await req.json()

    if (!url || !dealership_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: url and dealership_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const startTime = Date.now()

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    
    // Parse the HTML to extract vehicle information
    const vehicleData = await parseVehicleData(html, url, vin)
    
    const processingTime = Date.now() - startTime

    const scrapeResponse: ScrapeResponse = {
      success: true,
      vehicle_data: vehicleData,
      processing_time_ms: processingTime,
    }

    return new Response(
      JSON.stringify(scrapeResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Web Scraper Error:', error)
    const details = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to scrape vehicle data',
        details,
        processing_time_ms: 0
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function parseVehicleData(html: string, url: string, vin?: string): Promise<any> {
  // This is a simplified parser - in a real implementation, you would use a proper HTML parser
  // and implement specific logic for different dealership websites
  
  // Extract VIN
  const vinMatch = vin || html.match(/VIN[:\s]*([A-HJ-NPR-Z0-9]{17})/i)?.[1]
  if (!vinMatch) {
    throw new Error('VIN not found in the page')
  }

  // Extract make and model (simplified regex patterns)
  const makeMatch = html.match(/(?:Make|Brand)[:\s]*([A-Za-z]+)/i)?.[1]
  const modelMatch = html.match(/(?:Model)[:\s]*([A-Za-z0-9\s]+)/i)?.[1]
  
  // Extract year
  const yearMatch = html.match(/(?:Year)[:\s]*(\d{4})/i)?.[1]
  const year = yearMatch ? parseInt(yearMatch) : new Date().getFullYear()
  
  // Extract trim
  const trimMatch = html.match(/(?:Trim|Edition)[:\s]*([A-Za-z0-9\s]+)/i)?.[1]
  
  // Extract mileage
  const mileageMatch = html.match(/(?:Mileage|Miles)[:\s]*([\d,]+)/i)?.[1]
  const mileage = mileageMatch ? parseInt(mileageMatch.replace(/,/g, '')) : 0
  
  // Extract price
  const priceMatch = html.match(/\$([\d,]+)/g)?.[0]
  const price = priceMatch ? parseFloat(priceMatch.replace(/[$,]/g, '')) : 0
  
  // Extract images (simplified)
  const imageMatches = html.match(/src="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"/gi) || []
  const imageUrls = imageMatches.map(match => {
    const src = match.match(/src="([^"]*)"/)?.[1]
    return src ? (src.startsWith('http') ? src : new URL(src, url).href) : null
  }).filter(Boolean)

  // Determine availability status based on content
  let availabilityStatus = 'in_stock'
  if (html.toLowerCase().includes('sold') || html.toLowerCase().includes('no longer available')) {
    availabilityStatus = 'sold'
  } else if (html.toLowerCase().includes('pending') || html.toLowerCase().includes('reserved')) {
    availabilityStatus = 'pending'
  }

  // Extract additional details
  const details = {
    scraped_url: url,
    scraped_at: new Date().toISOString(),
    raw_html_length: html.length,
    // Add more specific details based on the website structure
  }

  return {
    vin: vinMatch,
    make: makeMatch || 'Unknown',
    model: modelMatch || 'Unknown',
    year,
    trim: trimMatch || 'Base',
    mileage,
    price,
    availability_status: availabilityStatus,
    image_urls: imageUrls,
    details_json: details,
  }
}
