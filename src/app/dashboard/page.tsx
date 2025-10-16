'use client'

import { LeadStatsWidget } from '@/components/dashboard/LeadStatsWidget'
import { RecentActivityFeed, ActivityItem } from '@/components/dashboard/RecentActivityFeed'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Car, Plus } from 'lucide-react'

export default function DashboardPage() {
  // Mock data for widgets (replace with real queries later)
  const leadStats = {
    total: 1247,
    new: 23,
    contacted: 530,
    qualified: 156,
    disqualified: 88,
    closed: 50,
    conversionRate: 12.5,
    avgResponseTime: 42, // minutes
    trend: { total: 3.2, conversionRate: 1.1, responseTime: -5.0 },
  }

  const activities: ActivityItem[] = [
    { id: 'a1', type: 'lead_created', title: 'New lead: Sarah Johnson', description: 'Interested in Accord', timestamp: new Date().toISOString(), lead_id: '1' },
    { id: 'a2', type: 'conversation', title: 'AI replied to Mike Davis', description: 'Shared financing options', timestamp: new Date(Date.now() - 15*60*1000).toISOString(), lead_id: '3' },
    { id: 'a3', type: 'vehicle_scraped', title: 'Inventory updated', description: '10 vehicles refreshed', timestamp: new Date(Date.now() - 60*60*1000).toISOString() },
    { id: 'a4', type: 'alert', title: 'Follow-up overdue', description: 'John Smith needs outreach', timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), alert_id: 'al1' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome back! Here&apos;s what&apos;s happening with your BDC.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/leads/new">
            <Button className="cosmic-gradient">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </Link>
          <Link href="/inventory/scrape">
            <Button variant="outline">
              <Car className="h-4 w-4 mr-2" />
              Scrape Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <LeadStatsWidget stats={leadStats} />

      {/* Activity */}
      <RecentActivityFeed activities={activities} />

      {/* Quick Actions retained via lead widget actions */}
    </div>
  )
}
