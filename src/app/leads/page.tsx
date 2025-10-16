'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - in a real app, this would come from API calls
  const leads = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      status: 'new',
      source: 'website',
      assignedTo: 'Sarah Johnson',
      lastContact: '2024-01-15T10:30:00Z',
      followUpDue: '2024-01-17T14:00:00Z',
      preferredVehicle: '2023 Honda Civic Sport',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      status: 'qualified',
      source: 'walk_in',
      assignedTo: 'Mike Davis',
      lastContact: '2024-01-14T16:45:00Z',
      followUpDue: '2024-01-16T10:00:00Z',
      preferredVehicle: '2023 Ford F-150 XLT',
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '(555) 345-6789',
      status: 'contacted',
      source: 'phone',
      assignedTo: 'Sarah Johnson',
      lastContact: '2024-01-15T09:15:00Z',
      followUpDue: '2024-01-18T11:30:00Z',
      preferredVehicle: '2023 BMW 3 Series 330i',
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@email.com',
      phone: '(555) 456-7890',
      status: 'new',
      source: 'ai_generated',
      assignedTo: null,
      lastContact: null,
      followUpDue: '2024-01-16T09:00:00Z',
      preferredVehicle: '2023 Chevrolet Camaro SS',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '(555) 567-8901',
      status: 'disqualified',
      source: 'referral',
      assignedTo: 'Mike Davis',
      lastContact: '2024-01-13T14:20:00Z',
      followUpDue: null,
      preferredVehicle: null,
    },
  ]

  const getStatusColor = (status: string) => {
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

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website':
        return 'bg-purple-100 text-purple-800'
      case 'walk_in':
        return 'bg-green-100 text-green-800'
      case 'ai_generated':
        return 'bg-blue-100 text-blue-800'
      case 'phone':
        return 'bg-orange-100 text-orange-800'
      case 'referral':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage and track your sales leads</p>
        </div>
        <Link href="/leads/new">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="disqualified">Disqualified</option>
                <option value="closed">Closed</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                        {lead.source}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {lead.phone}
                      </div>
                      {lead.assignedTo && (
                        <div className="text-sm text-gray-500">
                          Assigned to: {lead.assignedTo}
                        </div>
                      )}
                    </div>
                    {lead.preferredVehicle && (
                      <div className="text-sm text-gray-600 mt-1">
                        Interested in: {lead.preferredVehicle}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-500">
                    {lead.lastContact && (
                      <div>Last contact: {formatDate(lead.lastContact)}</div>
                    )}
                    {lead.followUpDue && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Follow up: {formatDate(lead.followUpDue)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link href={`/leads/${lead.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new lead.'
                }
              </p>
              <div className="mt-6">
                <Link href="/leads/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Lead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
