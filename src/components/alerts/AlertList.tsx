'use client'

import { useState, useMemo } from 'react'
import { AlertNotification } from './AlertNotification'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/common/utils'
import { 
  Search, 
  Filter, 
  Bell, 
  CheckCircle, 
  X,
  AlertCircle,
  Info,
  RefreshCw,
  Trash2
} from 'lucide-react'
import type { Alert } from '@/common/types'

interface AlertListProps {
  alerts: Alert[]
  isLoading?: boolean
  error?: Error | null
  onMarkAsRead?: (alertId: string) => void
  onMarkAllAsRead?: () => void
  onDismiss?: (alertId: string) => void
  onDismissAll?: () => void
  onViewDetails?: (alert: Alert) => void
  onRefresh?: () => void
  className?: string
}

export function AlertList({ 
  alerts = [],
  isLoading = false,
  error = null,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onDismissAll,
  onViewDetails,
  onRefresh,
  className
}: AlertListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'triggered_at' | 'type' | 'message'>('triggered_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredAlerts = useMemo(() => {
    let filtered = alerts

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(search) ||
        alert.type.toLowerCase().includes(search)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter)
    }

    // Status filter
    if (statusFilter === 'unread') {
      filtered = filtered.filter(alert => !alert.is_read)
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(alert => alert.is_read)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'message':
          aValue = a.message
          bValue = b.message
          break
        default:
          aValue = new Date(a.triggered_at).getTime()
          bValue = new Date(b.triggered_at).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [alerts, searchTerm, typeFilter, statusFilter, sortBy, sortOrder])

  const unreadCount = alerts.filter(alert => !alert.is_read).length
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.is_read).length

  const typeOptions = [
    { value: 'all', label: 'All Types', count: alerts.length },
    { value: 'critical', label: 'Critical', count: alerts.filter(a => a.type === 'critical').length },
    { value: 'warning', label: 'Warning', count: alerts.filter(a => a.type === 'warning').length },
    { value: 'info', label: 'Info', count: alerts.filter(a => a.type === 'info').length },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Alerts', count: alerts.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'read', label: 'Read', count: alerts.length - unreadCount },
  ]

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.()
  }

  const handleDismissAll = () => {
    if (confirm('Are you sure you want to dismiss all alerts? This action cannot be undone.')) {
      onDismissAll?.()
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load alerts</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2" />
            Alerts
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} unread
              </span>
            )}
            {criticalCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {criticalCount} critical
              </span>
            )}
          </h2>
          <p className="text-gray-600">
            {filteredAlerts.length} of {alerts.length} alerts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismissAll}
            disabled={alerts.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Dismiss All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as typeof sortBy)
                setSortOrder(order as typeof sortOrder)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="triggered_at-desc">Newest First</option>
              <option value="triggered_at-asc">Oldest First</option>
              <option value="type-asc">Type A-Z</option>
              <option value="type-desc">Type Z-A</option>
              <option value="message-asc">Message A-Z</option>
              <option value="message-desc">Message Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You&apos;re all caught up! No alerts at the moment.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {!isLoading && filteredAlerts.length > 0 && (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertNotification
              key={alert.id}
              alert={alert}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  )
}
