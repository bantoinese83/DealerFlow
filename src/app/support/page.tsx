'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Footer } from '@/components/layout/Footer'

type AlertRow = Database['public']['Tables']['alerts']['Row']

export default function SupportPage() {
  const supabase = createClientComponentClient()
  const [supportStats, setSupportStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    resolvedToday: 0
  })

  useEffect(() => {
    const loadSupportStats = async () => {
      const [totalResult, criticalResult, resolvedResult] = await Promise.all([
        supabase.from('alerts').select('id', { count: 'exact' }),
        supabase.from('alerts').select('id', { count: 'exact' }).eq('type', 'critical'),
        supabase.from('alerts').select('id', { count: 'exact' }).eq('is_read', true)
      ])

      setSupportStats({
        totalAlerts: totalResult.count || 0,
        criticalAlerts: criticalResult.count || 0,
        resolvedToday: resolvedResult.count || 0
      })
    }

    loadSupportStats()
  }, [supabase])

  const supportChannels = [
    {
      title: 'Help Center',
      description: 'Guides and FAQs',
      href: '/help',
      icon: '📚',
      stats: 'Self-service resources'
    },
    {
      title: 'Documentation',
      description: 'Developer docs and API',
      href: '/docs',
      icon: '📖',
      stats: '8 API endpoints'
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our team',
      href: '/contact',
      icon: '💬',
      stats: `${supportStats.totalAlerts} support tickets`
    },
    {
      title: 'System Status',
      description: 'Check service health',
      href: '/status',
      icon: '🔧',
      stats: 'Real-time monitoring'
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Support</h1>
            <p className="text-gray-300 mt-2">How can we help?</p>
            
            {/* Support Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{supportStats.totalAlerts}</div>
                <div className="text-sm text-gray-400">Total Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{supportStats.criticalAlerts}</div>
                <div className="text-sm text-gray-400">Critical Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{supportStats.resolvedToday}</div>
                <div className="text-sm text-gray-400">Resolved Today</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel) => (
              <Link 
                key={channel.title}
                href={channel.href} 
                className="glass-effect p-6 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{channel.icon}</div>
                <h3 className="text-lg font-medium text-white group-hover:text-[hsl(var(--cosmic-purple))] transition-colors">
                  {channel.title}
                </h3>
                <p className="text-gray-300 mt-2">{channel.description}</p>
                <div className="mt-3 text-sm text-[hsl(var(--cosmic-purple))] font-medium">
                  {channel.stats}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


