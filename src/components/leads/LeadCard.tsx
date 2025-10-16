'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useMarkAsContacted, useUpdateLeadStatus } from '@/common/hooks/useLeads'
import { cn } from '@/common/utils'
import { 
  Phone, 
  Mail, 
  Calendar, 
  MoreHorizontal,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import type { Lead } from '@/common/types'

interface LeadCardProps {
  lead: Lead
  onUpdate?: (lead: Lead) => void
  onDelete?: (leadId: string) => void
}

export function LeadCard({ lead, onUpdate, onDelete }: LeadCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const updateLeadStatus = useUpdateLeadStatus()
  const markAsContacted = useMarkAsContacted()

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'text-[hsl(var(--cosmic-blue))] bg-blue-500/20 border border-blue-500/30'
      case 'contacted':
        return 'text-[hsl(var(--cosmic-orange))] bg-orange-500/20 border border-orange-500/30'
      case 'qualified':
        return 'text-[hsl(var(--cosmic-green))] bg-green-500/20 border border-green-500/30'
      case 'disqualified':
        return 'text-red-400 bg-red-500/20 border border-red-500/30'
      case 'closed':
        return 'text-gray-400 bg-gray-500/20 border border-gray-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border border-gray-500/30'
    }
  }

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4" />
      case 'contacted':
        return <Clock className="h-4 w-4" />
      case 'qualified':
        return <CheckCircle className="h-4 w-4" />
      case 'disqualified':
        return <XCircle className="h-4 w-4" />
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleStatusChange = async (newStatus: Lead['status']) => {
    try {
      await updateLeadStatus.mutateAsync({
        leadId: lead.id,
        status: newStatus
      })
      onUpdate?.(lead)
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  const handleMarkContacted = async () => {
    try {
      await markAsContacted.mutateAsync(lead.id)
      onUpdate?.(lead)
    } catch (error) {
      console.error('Failed to mark as contacted:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 cosmic-gradient rounded-full flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                {lead.first_name} {lead.last_name}
              </h3>
              <p className="text-sm text-gray-300">{lead.source}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${lead.email}`} className="hover:text-[hsl(var(--cosmic-purple))] transition-colors">
                {lead.email}
              </a>
            </div>
            {lead.phone && (
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <a href={`tel:${lead.phone}`} className="hover:text-[hsl(var(--cosmic-purple))] transition-colors">
                  {lead.phone}
                </a>
              </div>
            )}
            {lead.last_contacted_at && (
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                Last contacted: {formatDate(lead.last_contacted_at)}
              </div>
            )}
          </div>

          {lead.notes && (
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {lead.notes}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor(lead.status)
              )}>
                {getStatusIcon(lead.status)}
                <span className="ml-1 capitalize">{lead.status}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {lead.status === 'new' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkContacted}
                  disabled={markAsContacted.isPending}
                >
                  Mark Contacted
                </Button>
              )}
              
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-effect rounded-md shadow-lg border border-[hsl(var(--border))] z-10">
                    <div className="py-1">
                      <Link href={`/leads/${lead.id}`}>
                        <button className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[hsl(var(--accent))] transition-all duration-200">
                          View Details
                        </button>
                      </Link>
                      
                      {lead.status !== 'contacted' && (
                        <button
                          onClick={() => handleStatusChange('contacted')}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[hsl(var(--accent))] transition-all duration-200"
                        >
                          Mark as Contacted
                        </button>
                      )}
                      
                      {lead.status !== 'qualified' && (
                        <button
                          onClick={() => handleStatusChange('qualified')}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[hsl(var(--accent))] transition-all duration-200"
                        >
                          Mark as Qualified
                        </button>
                      )}
                      
                      {lead.status !== 'disqualified' && (
                        <button
                          onClick={() => handleStatusChange('disqualified')}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[hsl(var(--accent))] transition-all duration-200"
                        >
                          Mark as Disqualified
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDelete?.(lead.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all duration-200"
                      >
                        Delete Lead
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
