'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X, 
  Clock,
  User,
  MessageSquare,
  Car,
  Bell,
  ExternalLink
} from 'lucide-react'
import type { Alert } from '@/common/types'

interface AlertNotificationProps {
  alert: Alert
  onMarkAsRead?: (alertId: string) => void
  onDismiss?: (alertId: string) => void
  onViewDetails?: (alert: Alert) => void
  compact?: boolean
  className?: string
}

export function AlertNotification({ 
  alert, 
  onMarkAsRead, 
  onDismiss, 
  onViewDetails,
  compact = false,
  className 
}: AlertNotificationProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'warning':
        return 'text-[hsl(var(--cosmic-orange))] bg-orange-500/20 border-orange-500/30'
      case 'info':
        return 'text-[hsl(var(--cosmic-blue))] bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getAlertIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-400'
      case 'warning':
        return 'text-[hsl(var(--cosmic-orange))]'
      case 'info':
        return 'text-[hsl(var(--cosmic-blue))]'
      default:
        return 'text-gray-400'
    }
  }

  const getContextIcon = (message: string) => {
    if (message.toLowerCase().includes('lead')) return <User className="h-4 w-4" />
    if (message.toLowerCase().includes('conversation') || message.toLowerCase().includes('message')) return <MessageSquare className="h-4 w-4" />
    if (message.toLowerCase().includes('vehicle') || message.toLowerCase().includes('inventory')) return <Car className="h-4 w-4" />
    return <Bell className="h-4 w-4" />
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleMarkAsRead = () => {
    if (!alert.is_read) {
      onMarkAsRead?.(alert.id)
    }
  }

  const handleDismiss = () => {
    onDismiss?.(alert.id)
  }

  const handleViewDetails = () => {
    onViewDetails?.(alert)
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
          getAlertColor(alert.type),
          !alert.is_read && "ring-2 ring-blue-500 ring-opacity-50",
          isHovered && "shadow-md"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        <div className={cn("flex-shrink-0", getAlertIconColor(alert.type))}>
          {getAlertIcon(alert.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white line-clamp-1">
            {alert.message}
          </p>
          <p className="text-xs text-gray-300">
            {formatTime(alert.triggered_at)}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {!alert.is_read && (
            <div className="h-2 w-2 bg-[hsl(var(--cosmic-purple))] rounded-full"></div>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDismiss()
            }}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn(
      "p-4 transition-all",
      !alert.is_read && "ring-2 ring-[hsl(var(--cosmic-purple))] ring-opacity-50 bg-purple-500/10",
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className={cn("flex-shrink-0", getAlertIconColor(alert.type))}>
          {getAlertIcon(alert.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  getAlertColor(alert.type)
                )}>
                  {getContextIcon(alert.message)}
                  <span className="ml-1 capitalize">{alert.type}</span>
                </span>
                {!alert.is_read && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--cosmic-purple))]/20 text-[hsl(var(--cosmic-purple))] border border-[hsl(var(--cosmic-purple))]/30">
                    New
                  </span>
                )}
              </div>

              <p className="text-sm text-white mb-2">
                {alert.message}
              </p>

              <div className="flex items-center space-x-4 text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(alert.triggered_at)}</span>
                </div>
                {alert.lead_id && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>Lead #{alert.lead_id.slice(-8)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-4">
              {!alert.is_read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAsRead}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark Read
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewDetails}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
            
            {alert.lead_id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(`/leads/${alert.lead_id}`, '_blank')}
                className="text-xs"
              >
                <User className="h-3 w-3 mr-1" />
                View Lead
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
