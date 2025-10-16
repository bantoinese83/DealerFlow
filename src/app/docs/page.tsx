'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Footer } from '@/components/layout/Footer'

export default function DocumentationPage() {
  const supabase = createClientComponentClient()
  const [apiStats, setApiStats] = useState({
    totalEndpoints: 0,
    activeUsers: 0,
    lastUpdated: new Date()
  })

  useEffect(() => {
    const loadApiStats = async () => {
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
      
      setApiStats({
        totalEndpoints: 8, // Based on our API routes
        activeUsers: userCount || 0,
        lastUpdated: new Date()
      })
    }

    loadApiStats()
  }, [supabase])

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/leads',
      description: 'Retrieve leads with filtering and pagination',
      example: 'GET /api/leads?status=new&page=1&limit=10'
    },
    {
      method: 'POST',
      path: '/api/leads',
      description: 'Create a new lead',
      example: 'POST /api/leads { "first_name": "John", "email": "john@example.com" }'
    },
    {
      method: 'GET',
      path: '/api/conversations',
      description: 'Get conversation history for a lead',
      example: 'GET /api/conversations?leadId=uuid'
    },
    {
      method: 'POST',
      path: '/api/conversations',
      description: 'Send a message or trigger AI response',
      example: 'POST /api/conversations { "leadId": "uuid", "message": "Hello" }'
    },
    {
      method: 'GET',
      path: '/api/vehicles',
      description: 'Retrieve vehicle inventory',
      example: 'GET /api/vehicles?make=Toyota&year=2024'
    },
    {
      method: 'POST',
      path: '/api/vehicles/scrape',
      description: 'Trigger vehicle data scraping',
      example: 'POST /api/vehicles/scrape { "url": "https://dealer.com/vehicle" }'
    },
    {
      method: 'GET',
      path: '/api/alerts',
      description: 'Get alerts for current user',
      example: 'GET /api/alerts?type=critical'
    },
    {
      method: 'PUT',
      path: '/api/ai-configs',
      description: 'Update AI configuration',
      example: 'PUT /api/ai-configs { "model_name": "gpt-4", "temperature": 0.7 }'
    }
  ]
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 cosmic-gradient rounded-lg flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">DealerFlow AI</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="cosmic-gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Documentation</h1>
            <p className="text-gray-300 mt-2">Developer docs for API routes and integrations.</p>
            <div className="mt-4 text-sm text-gray-400">
              {apiStats.totalEndpoints} endpoints • {apiStats.activeUsers} active users • Last updated {apiStats.lastUpdated.toLocaleDateString()}
            </div>
          </div>

          <div className="glass-effect p-6 rounded-lg border border-[hsl(var(--border))]">
            <h2 className="text-xl font-semibold text-white">API Overview</h2>
            <p className="text-gray-300 mt-2">Use our Next.js API routes under /api. Auth via Supabase JWT.</p>
            
            <div className="mt-4 p-4 bg-[hsl(var(--muted))] rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Authentication</h3>
              <code className="text-sm text-gray-300">
                Authorization: Bearer {'{supabase_jwt_token}'}
              </code>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
            {apiEndpoints.map((endpoint, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-white font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-300 mt-2">{endpoint.description}</p>
                    <code className="text-xs text-gray-400 mt-2 block">{endpoint.example}</code>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


