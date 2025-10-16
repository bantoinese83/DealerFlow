'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'

type LeadRow = Database['public']['Tables']['leads']['Row']
type ConversationRow = Database['public']['Tables']['conversations']['Row']

export default function ProductPage() {
  const supabase = createClientComponentClient()
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalConversations: 0,
    activeDealerships: 0,
    aiResponses: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      const [leadsResult, conversationsResult, dealershipsResult] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('conversations').select('id', { count: 'exact' }),
        supabase.from('dealerships').select('id', { count: 'exact' })
      ])

      const aiResponses = await supabase
        .from('conversations')
        .select('id', { count: 'exact' })
        .eq('participant', 'ai')

      setStats({
        totalLeads: leadsResult.count || 0,
        totalConversations: conversationsResult.count || 0,
        activeDealerships: dealershipsResult.count || 0,
        aiResponses: aiResponses.count || 0
      })
    }

    loadStats()
  }, [supabase])
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Product</h1>
            <p className="text-gray-300 mt-2">Overview of DealerFlow AI capabilities and value.</p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white">Why DealerFlow AI</h2>
            <p className="text-gray-300 mt-2">AI-powered follow-ups, real-time vehicle data, CRM integrations, and alerts.</p>
            
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalLeads.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Leads Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalConversations.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.activeDealerships}</div>
                <div className="text-sm text-gray-400">Active Dealerships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.aiResponses.toLocaleString()}</div>
                <div className="text-sm text-gray-400">AI Responses</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/auth/signup">
                <Button className="cosmic-gradient">Get Started</Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-white">AI Conversations</h3>
              <p className="text-gray-300 mt-2">Personalized, compliant, and effective lead engagement.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-white">Realtime Inventory</h3>
              <p className="text-gray-300 mt-2">Scrape and sync latest pricing and availability.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-medium text-white">CRM Integrations</h3>
              <p className="text-gray-300 mt-2">Seamless CDK, Reynolds & Reynolds workflows.</p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


