'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react'
import type { Lead } from '@/common/types'

interface LeadStats {
  total: number
  new: number
  contacted: number
  qualified: number
  disqualified: number
  closed: number
  conversionRate: number
  avgResponseTime: number
  trend: {
    total: number
    conversionRate: number
    responseTime: number
  }
}

interface LeadStatsWidgetProps {
  stats?: LeadStats
  isLoading?: boolean
  error?: Error | null
  onRefresh?: () => void
  onViewLeads?: (status?: Lead['status']) => void
  className?: string
}

export function LeadStatsWidget({ 
  stats, 
  isLoading = false, 
  error = null,
  onRefresh,
  onViewLeads,
  className 
}: LeadStatsWidgetProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'text-[hsl(var(--cosmic-blue))] bg-blue-500/20'
      case 'contacted':
        return 'text-[hsl(var(--cosmic-orange))] bg-orange-500/20'
      case 'qualified':
        return 'text-[hsl(var(--cosmic-green))] bg-green-500/20'
      case 'disqualified':
        return 'text-red-400 bg-red-500/20'
      case 'closed':
        return 'text-gray-400 bg-gray-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <Users className="h-4 w-4" />
      case 'contacted':
        return <Clock className="h-4 w-4" />
      case 'qualified':
        return <UserCheck className="h-4 w-4" />
      case 'disqualified':
        return <UserX className="h-4 w-4" />
      case 'closed':
        return <UserCheck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4 bg-gray-300 rounded-full" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-[hsl(var(--cosmic-green))]'
    if (trend < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`
    return `${Math.round(minutes / 1440)}d`
  }

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <RefreshCw className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load stats</p>
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
          <h3 className="text-lg font-semibold text-white">Lead Statistics</h3>
          <p className="text-sm text-gray-300">Overview of your lead pipeline</p>
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

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Total Leads */}
          <div className="cosmic-gradient p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Leads</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(stats.trend.total)}
                  <span className={cn("text-sm font-medium ml-1", getTrendColor(stats.trend.total))}>
                    {formatPercentage(stats.trend.total)}
                  </span>
                  <span className="text-sm text-white/60 ml-1">vs last period</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { status: 'new' as const, label: 'New', value: stats.new },
              { status: 'contacted' as const, label: 'Contacted', value: stats.contacted },
              { status: 'qualified' as const, label: 'Qualified', value: stats.qualified },
              { status: 'disqualified' as const, label: 'Disqualified', value: stats.disqualified },
            ].map(({ status, label, value }) => (
              <div
                key={status}
                className="p-4 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] cursor-pointer transition-all duration-200 glass-effect"
                onClick={() => onViewLeads?.(status)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(status)
                  )}>
                    {getStatusIcon(status)}
                    <span className="ml-1">{label}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400">
                  {stats.total > 0 ? Math.round((value / stats.total) * 100) : 0}% of total
                </p>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(stats.trend.conversionRate)}
                    <span className={cn("text-sm font-medium ml-1", getTrendColor(stats.trend.conversionRate))}>
                      {formatPercentage(stats.trend.conversionRate)}
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-[hsl(var(--cosmic-green))]" />
              </div>
            </div>

            <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Avg Response Time</p>
                  <p className="text-2xl font-bold text-white">{formatTime(stats.avgResponseTime)}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(-stats.trend.responseTime)}
                    <span className={cn("text-sm font-medium ml-1", getTrendColor(-stats.trend.responseTime))}>
                      {formatPercentage(-stats.trend.responseTime)}
                    </span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-[hsl(var(--cosmic-orange))]" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-[hsl(var(--border))]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">Quick Actions</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewLeads?.()}
                >
                  View All Leads
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewLeads?.('new')}
                >
                  New Leads
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No data available</h3>
          <p className="text-gray-300">Lead statistics will appear here once you have leads.</p>
        </div>
      )}
    </Card>
  )
}
