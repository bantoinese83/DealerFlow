'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'

type LeadRow = Database['public']['Tables']['leads']['Row']
type VehicleRow = Database['public']['Tables']['vehicles']['Row']
type AlertRow = Database['public']['Tables']['alerts']['Row']

export default function FeaturesPage() {
  const supabase = createClientComponentClient()
  const [featureStats, setFeatureStats] = useState({
    aiConversations: 0,
    vehiclesScraped: 0,
    activeAlerts: 0,
    avgResponseTime: 0
  })

  useEffect(() => {
    const loadFeatureStats = async () => {
      const [conversationsResult, vehiclesResult, alertsResult] = await Promise.all([
        supabase.from('conversations').select('id', { count: 'exact' }).eq('participant', 'ai'),
        supabase.from('vehicles').select('id', { count: 'exact' }),
        supabase.from('alerts').select('id', { count: 'exact' }).eq('is_read', false)
      ])

      // Calculate average response time (mock for now)
      const avgResponseTime = 42 // minutes

      setFeatureStats({
        aiConversations: conversationsResult.count || 0,
        vehiclesScraped: vehiclesResult.count || 0,
        activeAlerts: alertsResult.count || 0,
        avgResponseTime
      })
    }

    loadFeatureStats()
  }, [supabase])

  const features = [
    { 
      title: 'AI Conversations', 
      desc: 'Lead nurturing, intent detection, and compliant messaging.',
      stat: `${featureStats.aiConversations.toLocaleString()} AI responses sent`
    },
    { 
      title: 'Realtime Inventory', 
      desc: 'Scrape, normalize, and sync vehicle data as it changes.',
      stat: `${featureStats.vehiclesScraped.toLocaleString()} vehicles tracked`
    },
    { 
      title: 'CRM Integrations', 
      desc: 'Push/pull leads with CDK and Reynolds & Reynolds.',
      stat: 'Seamless data sync'
    },
    { 
      title: 'Alerts & Automation', 
      desc: 'Sentiment triggers, SLA breaches, and manager notifications.',
      stat: `${featureStats.activeAlerts} active alerts`
    },
    { 
      title: 'Analytics', 
      desc: 'Conversion insights, response times, and pipeline health.',
      stat: `${featureStats.avgResponseTime}min avg response time`
    },
    { 
      title: 'Security & RLS', 
      desc: 'Per-dealership isolation via Supabase RLS and JWTs.',
      stat: 'Enterprise-grade security'
    },
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Features</h1>
            <p className="text-gray-300 mt-2">Everything you need to automate your BDC.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="text-lg font-medium text-white">{f.title}</h3>
                <p className="text-gray-300 mt-2">{f.desc}</p>
                <div className="mt-3 text-sm text-[hsl(var(--cosmic-purple))] font-medium">
                  {f.stat}
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


