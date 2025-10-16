'use client'

import { useState } from 'react'
import { AlertList } from '@/components/alerts/AlertList'
import { useAuth } from '@/common/hooks/useAuth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  Filter, 
  Download,
  RefreshCw,
  Settings
} from 'lucide-react'
import type { Alert } from '@/common/types'

// Mock data for demonstration
const mockAlerts: Alert[] = [
  {
    id: '1',
    dealership_id: 'dealership-1',
    profile_id: 'profile-1',
    lead_id: 'lead-1',
    type: 'critical',
    message: 'New qualified lead: Sarah Johnson - High interest in 2024 Honda Accord',
    is_read: false,
    triggered_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    dealership_id: 'dealership-1',
    profile_id: 'profile-1',
    lead_id: 'lead-2',
    type: 'warning',
    message: 'Follow-up overdue: John Smith - Last contacted 3 days ago',
    is_read: false,
    triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    dealership_id: 'dealership-1',
    profile_id: 'profile-1',
    type: 'info',
    message: 'AI generated new lead: Mike Davis - Interested in SUVs',
    is_read: true,
    triggered_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    dealership_id: 'dealership-1',
    profile_id: 'profile-1',
    lead_id: 'lead-3',
    type: 'critical',
    message: 'Negative sentiment detected in conversation with Lisa Brown',
    is_read: true,
    triggered_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

export default function AlertsPage() {
  const { profile } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_read: true, updated_at: new Date().toISOString() }
          : alert
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ 
        ...alert, 
        is_read: true, 
        updated_at: new Date().toISOString() 
      }))
    )
  }

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleDismissAll = () => {
    setAlerts([])
  }

  const handleViewDetails = (alert: Alert) => {
    console.log('View details for alert:', alert)
    // TODO: Implement navigation to alert details
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export alerts')
  }

  const unreadCount = alerts.filter(alert => !alert.is_read).length
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.is_read).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[hsl(var(--foreground))] tracking-tight flex items-center">
            <Bell className="h-8 w-8 mr-3" />
            Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay informed about important events and updates in your dealership
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{alerts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-[hsl(var(--foreground))]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-[hsl(var(--foreground))]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{criticalCount}</p>
            </div>
          </div>
        </Card>

        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-[hsl(var(--accent))] rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-[hsl(var(--foreground))]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{alerts.length - unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <AlertList
        alerts={alerts}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDismiss={handleDismiss}
        onDismissAll={handleDismissAll}
        onViewDetails={handleViewDetails}
        onRefresh={handleRefresh}
      />
    </div>
  )
}

// Import cn utility
import { cn } from '@/common/utils'
