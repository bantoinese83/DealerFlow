'use client'

import { useState, useMemo } from 'react'
import { useLeads } from '@/common/hooks/useLeads'
import { LeadCard } from './LeadCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/common/utils'
import { 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List,
  Download,
  RefreshCw
} from 'lucide-react'
import type { Lead, LeadFilters } from '@/common/types'

interface LeadListProps {
  onLeadSelect?: (lead: Lead) => void
  selectedLeadId?: string
  showFilters?: boolean
  showActions?: boolean
}

export function LeadList({ 
  onLeadSelect, 
  selectedLeadId, 
  showFilters = true, 
  showActions = true 
}: LeadListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'last_contacted_at' | 'name'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filters: LeadFilters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter as Lead['status'] : undefined,
    sortBy,
    sortOrder,
    page: 1,
    limit: 50
  }

  const { data: leadsResponse, isLoading, error, refetch } = useLeads(filters)
  const leads = leadsResponse?.data || []

  const filteredLeads = useMemo(() => {
    if (!leads) return []
    
    return leads.filter(lead => {
      const matchesSearch = !searchTerm || 
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchTerm))
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [leads, searchTerm, statusFilter])

  const statusOptions = [
    { value: 'all', label: 'All Leads', count: leads.length },
    { value: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length },
    { value: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
    { value: 'qualified', label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
    { value: 'disqualified', label: 'Disqualified', count: leads.filter(l => l.status === 'disqualified').length },
    { value: 'closed', label: 'Closed', count: leads.filter(l => l.status === 'closed').length },
  ]

  const handleLeadClick = (lead: Lead) => {
    onLeadSelect?.(lead)
  }

  const handleRefresh = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <RefreshCw className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load leads</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-600">
            {filteredLeads.length} of {leads.length} leads
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="last_contacted_at-desc">Last Contacted</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md",
                  viewMode === 'grid' 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md",
                  viewMode === 'list' 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first lead.'
              }
            </p>
          </div>
          {showActions && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </Button>
          )}
        </div>
      )}

      {/* Leads Grid/List */}
      {!isLoading && filteredLeads.length > 0 && (
        <div className={cn(
          "space-y-4",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        )}>
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleLeadClick(lead)}
              className={cn(
                "cursor-pointer transition-all",
                selectedLeadId === lead.id && "ring-2 ring-blue-500 rounded-lg"
              )}
            >
              <LeadCard lead={lead} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
