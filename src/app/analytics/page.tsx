"use client"

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Card } from '@/components/ui/Card'

type LeadRow = Database['public']['Tables']['leads']['Row']

export default function AnalyticsPage() {
  const supabase = createClientComponentClient()
  const [leads, setLeads] = useState<Pick<LeadRow, 'status' | 'created_at'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('status, created_at')
        .order('created_at', { ascending: false })
        .limit(1000)
      if (!ignore) {
        if (!error) setLeads(data ?? [])
        setLoading(false)
      }
    }
    load()

    // realtime updates
    const channel = supabase
      .channel('analytics-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, load)
      .subscribe()

    return () => {
      ignore = true
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const stats = useMemo(() => {
    const s = { total: 0, new: 0, contacted: 0, qualified: 0, disqualified: 0, closed: 0 }
    for (const row of leads) {
      s.total++
      if (row.status in s) (s as any)[row.status]++
    }
    const today = new Date().toISOString().slice(0, 10)
    const todayCount = leads.filter(l => l.created_at?.slice(0,10) === today).length
    return { ...s, today: todayCount }
  }, [leads])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-gray-300 mt-2">Live metrics from Supabase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-gray-300">Total Leads</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-300">New Today</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.today}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-300">Qualified</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.qualified}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-300">Contacted</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.contacted}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-300">Closed</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.closed}</div>
        </Card>
        <Card className="p-6">
          <div className="text-gray-300">Disqualified</div>
          <div className="text-3xl font-semibold text-white mt-2">{loading ? '—' : stats.disqualified}</div>
        </Card>
      </div>
    </div>
  )
}


