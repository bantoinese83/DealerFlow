'use client'

import { useState } from 'react'
import { useLead, useUpdateLead, useDeleteLead } from '@/common/hooks/useLeads'
import { useConversations } from '@/common/hooks/useConversations'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/common/utils'
import { 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Car,
  MessageSquare,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import type { Lead } from '@/common/types'

interface LeadDetailViewProps {
  leadId: string
  onClose?: () => void
  onEdit?: (lead: Lead) => void
}

export function LeadDetailView({ leadId, onClose, onEdit }: LeadDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Lead>>({})
  
  const { data: leadResponse, isLoading: leadLoading } = useLead(leadId)
  const { data: conversationsResponse, isLoading: conversationsLoading } = useConversations(leadId)
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()

  const lead = leadResponse?.data
  const conversations = conversationsResponse?.data || []

  const handleEdit = () => {
    if (lead) {
      setEditData(lead)
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!lead) return
    
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        data: editData
      })
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      console.error('Failed to update lead:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleDelete = async () => {
    if (!lead) return
    
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await deleteLead.mutateAsync(lead.id)
        onClose?.()
      } catch (error) {
        console.error('Failed to delete lead:', error)
      }
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'disqualified':
        return 'bg-red-100 text-red-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (leadLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <User className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lead not found</h3>
          <p className="text-gray-600">The lead you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Button onClick={onClose} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                <Input
                  value={editData.first_name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="text-2xl font-bold"
                />
              ) : (
                `${lead.first_name} ${lead.last_name}`
              )}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor(lead.status)
              )}>
                {getStatusIcon(lead.status)}
                <span className="ml-1 capitalize">{lead.status}</span>
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{lead.source}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={updateLead.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={handleDelete} disabled={deleteLead.isPending}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              {onClose && (
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <Input
                    value={editData.email || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                  />
                ) : (
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                      {lead.email}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    type="tel"
                  />
                ) : (
                  <div className="flex items-center text-sm text-gray-900">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">No phone number</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                {isEditing ? (
                  <select
                    value={editData.source || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="website">Website</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="ai_generated">AI Generated</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="text-sm text-gray-900 capitalize">{lead.source}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <select
                    value={editData.status || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as Lead['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="disqualified">Disqualified</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(lead.status)
                  )}>
                    {getStatusIcon(lead.status)}
                    <span className="ml-1 capitalize">{lead.status}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              {isEditing ? (
                <textarea
                  value={editData.notes || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about this lead..."
                />
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {lead.notes || 'No notes available'}
                </p>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Lead created</p>
                  <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                </div>
              </div>
              
              {lead.last_contacted_at && (
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Last contacted</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.last_contacted_at)}</p>
                  </div>
                </div>
              )}

              {lead.follow_up_due_at && (
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Follow-up due</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.follow_up_due_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Lead
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Conversation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </Card>

          {/* Recent Conversations */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Conversations</h3>
            {conversationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.slice(-3).map((conversation) => (
                  <div key={conversation.id} className="border-l-2 border-gray-200 pl-3">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {conversation.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.participant} • {formatDate(conversation.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No conversations yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
