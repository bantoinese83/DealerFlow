'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  User, 
  MessageSquare, 
  Car, 
  Bell, 
  Clock,
  ArrowUpRight,
  RefreshCw,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  Bot
} from 'lucide-react'

export interface ActivityItem {
  id: string
  type: 'lead_created' | 'lead_updated' | 'conversation' | 'vehicle_scraped' | 'alert' | 'ai_action'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  lead_id?: string
  vehicle_id?: string
  alert_id?: string
  metadata?: Record<string, any>
}

interface RecentActivityFeedProps {
  activities?: ActivityItem[]
  isLoading?: boolean
  error?: Error | null
  onRefresh?: () => void
  onViewLead?: (leadId: string) => void
  onViewVehicle?: (vehicleId: string) => void
  onViewAlert?: (alertId: string) => void
  className?: string
}

export function RecentActivityFeed({ 
  activities = [],
  isLoading = false,
  error = null,
  onRefresh,
  onViewLead,
  onViewVehicle,
  onViewAlert,
  className
}: RecentActivityFeedProps) {
  const [filter, setFilter] = useState<string>('all')
  const [showCount, setShowCount] = useState(10)

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead_created':
      case 'lead_updated':
        return <User className="h-4 w-4" />
      case 'conversation':
        return <MessageSquare className="h-4 w-4" />
      case 'vehicle_scraped':
        return <Car className="h-4 w-4" />
      case 'alert':
        return <Bell className="h-4 w-4" />
      case 'ai_action':
        return <Bot className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lead_created':
        return 'text-green-600 bg-green-100'
      case 'lead_updated':
        return 'text-blue-600 bg-blue-100'
      case 'conversation':
        return 'text-purple-600 bg-purple-100'
      case 'vehicle_scraped':
        return 'text-orange-600 bg-orange-100'
      case 'alert':
        return 'text-red-600 bg-red-100'
      case 'ai_action':
        return 'text-indigo-600 bg-indigo-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'lead_created':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'ai_action':
        return <Bot className="h-3 w-3 text-indigo-500" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filteredActivities = activities
    .filter(activity => filter === 'all' || activity.type === filter)
    .slice(0, showCount)

  const filterOptions = [
    { value: 'all', label: 'All Activity', count: activities.length },
    { value: 'lead_created', label: 'New Leads', count: activities.filter(a => a.type === 'lead_created').length },
    { value: 'conversation', label: 'Conversations', count: activities.filter(a => a.type === 'conversation').length },
    { value: 'vehicle_scraped', label: 'Vehicle Updates', count: activities.filter(a => a.type === 'vehicle_scraped').length },
    { value: 'alert', label: 'Alerts', count: activities.filter(a => a.type === 'alert').length },
    { value: 'ai_action', label: 'AI Actions', count: activities.filter(a => a.type === 'ai_action').length },
  ]

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.lead_id) {
      onViewLead?.(activity.lead_id)
    } else if (activity.vehicle_id) {
      onViewVehicle?.(activity.vehicle_id)
    } else if (activity.alert_id) {
      onViewAlert?.(activity.alert_id)
    }
  }

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <RefreshCw className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load activity</p>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600">Latest updates from your dealership</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.count})
            </option>
          ))}
        </select>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Activity will appear here as things happen in your dealership.'
                : 'No activity of this type found.'
              }
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleActivityClick(activity)}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                getActivityColor(activity.type)
              )}>
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    
                    {activity.user && (
                      <div className="flex items-center mt-2">
                        <div className="h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-gray-700">
                            {activity.user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          by {activity.user.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {getAlertIcon(activity.type)}
                    <span className="text-xs text-gray-500">
                      {formatTime(activity.timestamp)}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>

                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {key}: {String(value)}
                      </span>
                    ))}
                    {Object.keys(activity.metadata).length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        +{Object.keys(activity.metadata).length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length >= showCount && activities.length > showCount && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCount(prev => prev + 10)}
            className="w-full"
          >
            Load More Activity
          </Button>
        </div>
      )}
    </Card>
  )
}
