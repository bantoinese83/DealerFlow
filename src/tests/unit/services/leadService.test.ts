import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LeadService } from '@/services/leadService'


describe('LeadService', () => {
  let leadService: LeadService

  beforeEach(() => {
    leadService = new LeadService()
  })

  describe('getLeads', () => {
    it('should fetch leads with default filters', async () => {
      const mockLeads = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          status: 'new',
          source: 'website',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      // Mock the Supabase response
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({
            data: mockLeads,
            error: null,
            count: 1,
          }),
        })),
      }

      vi.mocked(leadService['supabase']).from.mockReturnValue(mockSupabase.from())

      const result = await leadService.getLeads()

      expect(result.data).toEqual(mockLeads)
      expect(result.total).toBe(1)
    })

    it('should apply status filter', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          range: vi.fn().mockResolvedValue({
            data: [],
            error: null,
            count: 0,
          }),
        })),
      }
      const table = mockSupabase.from()
      vi.mocked(leadService['supabase']).from.mockReturnValue(table)

      await leadService.getLeads({ status: 'qualified' })

      expect(table.eq).toHaveBeenCalledWith('status', 'qualified')
    })
  })

  describe('createLead', () => {
    it('should create a new lead', async () => {
      const leadData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        source: 'website' as const,
      }

      const mockLead = {
        id: '1',
        ...leadData,
        status: 'new',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: mockLead,
            error: null,
          }),
        })),
      }
      const table = mockSupabase.from()
      vi.mocked(leadService['supabase']).from.mockReturnValue(table)

      const result = await leadService.createLead(leadData)

      expect(result).toEqual(mockLead)
      expect(table.insert).toHaveBeenCalledWith(leadData)
    })

    it('should throw error when creation fails', async () => {
      const leadData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        source: 'website' as const,
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        })),
      }

      vi.mocked(leadService['supabase']).from.mockReturnValue(mockSupabase.from())

      await expect(leadService.createLead(leadData)).rejects.toThrow('Failed to create lead: Database error')
    })
  })

  describe('getLeadStats', () => {
    it('should calculate lead statistics correctly', async () => {
      const mockLeads = [
        { status: 'new' },
        { status: 'contacted' },
        { status: 'qualified' },
        { status: 'qualified' },
        { status: 'disqualified' },
        { status: 'closed' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: mockLeads,
            error: null,
          }),
        })),
      }

      vi.mocked(leadService['supabase']).from.mockReturnValue(mockSupabase.from())

      const result = await leadService.getLeadStats('dealership-1')

      expect(result.total).toBe(6)
      expect(result.new).toBe(1)
      expect(result.contacted).toBe(1)
      expect(result.qualified).toBe(2)
      expect(result.disqualified).toBe(1)
      expect(result.closed).toBe(1)
      expect(result.conversion_rate).toBe(50) // (2 qualified + 1 closed) / 6 total * 100
    })
  })
})
