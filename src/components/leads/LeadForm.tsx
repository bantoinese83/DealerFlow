'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateLead, useUpdateLead } from '@/common/hooks/useLeads'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { leadSchema } from '@/common/validation/leadSchema'
import { X, Save, User, Mail, Phone, Calendar } from 'lucide-react'
import type { Lead, CreateLeadRequest, UpdateLeadRequest } from '@/common/types'

interface LeadFormProps {
  lead?: Lead
  onSuccess?: (lead: Lead) => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export function LeadForm({ lead, onSuccess, onCancel, mode = 'create' }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<CreateLeadRequest>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: lead?.first_name || '',
      last_name: lead?.last_name || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      source: lead?.source || 'website',
      status: lead?.status || 'new',
      notes: lead?.notes || '',
      follow_up_due_at: lead?.follow_up_due_at || '',
    }
  })

  const watchedStatus = watch('status')

  useEffect(() => {
    if (lead) {
      reset({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone || '',
        source: lead.source,
        status: lead.status,
        notes: lead.notes || '',
        follow_up_due_at: lead.follow_up_due_at || '',
      })
    }
  }, [lead, reset])

  const onSubmit = async (data: CreateLeadRequest) => {
    setIsSubmitting(true)
    
    try {
      if (mode === 'edit' && lead) {
        const updateData: UpdateLeadRequest = {
          ...data,
          updated_at: new Date().toISOString()
        }
        
        const result = await updateLead.mutateAsync({
          id: lead.id,
          data: updateData
        })
        
        onSuccess?.(result.data)
      } else {
        const result = await createLead.mutateAsync(data)
        onSuccess?.(result.data)
      }
      
      reset()
    } catch (error) {
      console.error('Failed to save lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'edit' ? 'Edit Lead' : 'Create New Lead'}
        </h2>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="Enter first name"
                className={errors.first_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Enter last name"
                className={errors.last_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Lead Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                Lead Source
              </label>
              <select
                id="source"
                {...register('source')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="website">Website</option>
                <option value="walk_in">Walk-in</option>
                <option value="ai_generated">AI Generated</option>
                <option value="referral">Referral</option>
                <option value="phone">Phone</option>
                <option value="other">Other</option>
              </select>
              {errors.source && (
                <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="disqualified">Disqualified</option>
                <option value="closed">Closed</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="follow_up_due_at" className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Due Date
            </label>
            <Input
              id="follow_up_due_at"
              type="datetime-local"
              {...register('follow_up_due_at')}
              className={errors.follow_up_due_at ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {errors.follow_up_due_at && (
              <p className="mt-1 text-sm text-red-600">{errors.follow_up_due_at.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            placeholder="Add any additional notes about this lead..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Status Preview */}
        {watchedStatus && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status Preview</h4>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(watchedStatus)}`}>
                {watchedStatus.charAt(0).toUpperCase() + watchedStatus.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                This lead will be marked as {watchedStatus}
              </span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {mode === 'edit' ? 'Update Lead' : 'Create Lead'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
