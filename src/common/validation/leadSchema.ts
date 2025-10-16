import { z } from 'zod'

export const leadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'disqualified', 'closed'])

export const leadSourceSchema = z.enum(['website', 'walk_in', 'ai_generated', 'phone', 'referral', 'other'])

export const createLeadSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().max(100).optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  source: leadSourceSchema,
  assigned_to: z.string().uuid().optional(),
  preferred_vehicle_id: z.string().uuid().optional(),
  notes: z.string().max(1000).optional(),
  follow_up_due_at: z.string().datetime().optional(),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: leadStatusSchema.optional(),
  last_contacted_at: z.string().datetime().optional(),
})

export const leadFiltersSchema = z.object({
  status: leadStatusSchema.optional(),
  assigned_to: z.string().uuid().optional(),
  source: leadSourceSchema.optional(),
  search: z.string().max(100).optional(),
  follow_up_due: z.enum(['overdue', 'today', 'upcoming']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>
