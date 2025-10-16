import { createServerClient, supabase as supabaseClient } from '@/lib/supabase/client'
import type { Lead, CreateLeadRequest, UpdateLeadRequest, LeadFilters, LeadStats } from '@/common/types'
import { leadArraySchema, leadSchema, createLeadSchema, updateLeadSchema, leadFiltersSchema } from '@/common/validation'

export class LeadService {
  private supabase = supabaseClient

  async getLeads(filters: LeadFilters = {}): Promise<{ data: Lead[]; total: number }> {
    const validFilters = leadFiltersSchema.parse(filters)
    const { page, limit, ...searchFilters } = validFilters
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('leads')
      .select('*', { count: 'exact' })

    // Apply filters
    if (searchFilters.status) {
      query = query.eq('status', searchFilters.status)
    }
    if (searchFilters.assigned_to) {
      query = query.eq('assigned_to', searchFilters.assigned_to)
    }
    if (searchFilters.source) {
      query = query.eq('source', searchFilters.source)
    }
    if (searchFilters.search) {
      query = query.textSearch('search_vector', searchFilters.search)
    }
    if (searchFilters.follow_up_due) {
      const now = new Date()
      switch (searchFilters.follow_up_due) {
        case 'overdue':
          query = query.lt('follow_up_due_at', now.toISOString())
          break
        case 'today':
          const startOfDay = new Date(now.setHours(0, 0, 0, 0))
          const endOfDay = new Date(now.setHours(23, 59, 59, 999))
          query = query.gte('follow_up_due_at', startOfDay.toISOString()).lte('follow_up_due_at', endOfDay.toISOString())
          break
        case 'upcoming':
          query = query.gt('follow_up_due_at', now.toISOString())
          break
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch leads: ${error.message}`)
    }

    const parsed = leadArraySchema.safeParse(data ?? [])
    if (!parsed.success) {
      throw new Error('Failed to parse leads response')
    }

    return {
      data: parsed.data,
      total: count || 0,
    }
  }

  async getLeadById(id: string): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch lead: ${error.message}`)
    }

    return leadSchema.parse(data)
  }

  async createLead(leadData: CreateLeadRequest): Promise<Lead> {
    const validInput = createLeadSchema.parse(leadData) as any
    const { data, error } = await this.supabase
      .from('leads')
      .insert(validInput as any)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create lead: ${error.message}`)
    }

    return leadSchema.parse(data)
  }

  async updateLead(id: string, leadData: UpdateLeadRequest): Promise<Lead> {
    const validInput = updateLeadSchema.parse(leadData) as any
    const { data, error } = await (this.supabase as any)
      .from('leads')
      .update(validInput)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update lead: ${error.message}`)
    }

    return leadSchema.parse(data)
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete lead: ${error.message}`)
    }
  }

  async getLeadStats(dealershipId: string): Promise<LeadStats> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('status')
      .eq('dealership_id', dealershipId)

    if (error) {
      throw new Error(`Failed to fetch lead stats: ${error.message}`)
    }

    const stats = {
      total: data.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      disqualified: 0,
      closed: 0,
      conversion_rate: 0,
    }

    data.forEach((lead: any) => {
      switch (lead.status) {
        case 'new':
          stats.new++
          break
        case 'contacted':
          stats.contacted++
          break
        case 'qualified':
          stats.qualified++
          break
        case 'disqualified':
          stats.disqualified++
          break
        case 'closed':
          stats.closed++
          break
      }
    })

    // Calculate conversion rate (qualified + closed) / total
    stats.conversion_rate = stats.total > 0 ? 
      ((stats.qualified + stats.closed) / stats.total) * 100 : 0

    return stats
  }

  async assignLead(leadId: string, userId: string): Promise<Lead> {
    return this.updateLead(leadId, { assigned_to: userId })
  }

  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<Lead> {
    return this.updateLead(leadId, { status })
  }

  async markAsContacted(leadId: string): Promise<Lead> {
    return this.updateLead(leadId, { 
      last_contacted_at: new Date().toISOString(),
      status: 'contacted'
    })
  }
}
