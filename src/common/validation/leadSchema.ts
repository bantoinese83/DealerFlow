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

// Runtime-validated Lead record as returned from DB
export const leadSchema = z.object({
  id: z.string().uuid(),
  dealership_id: z.string().uuid(),
  crm_lead_id: z.string().optional(),
  first_name: z.string(),
  last_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  status: leadStatusSchema,
  source: leadSourceSchema,
  assigned_to: z.string().uuid().optional(),
  preferred_vehicle_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  last_contacted_at: z.string().datetime().optional(),
  follow_up_due_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const leadArraySchema = z.array(leadSchema)
export type LeadOutput = z.infer<typeof leadSchema>
