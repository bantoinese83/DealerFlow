import { z } from 'zod'

export const crmTypeSchema = z.enum(['CDK', 'Reynolds', 'DealerSocket', 'VinSolutions', 'other'])

export const crmConfigSchema = z.object({
  api_key: z.string().min(1, 'API key is required'),
  api_secret: z.string().optional(),
  base_url: z.string().url('Invalid base URL'),
  dealership_id: z.string().min(1, 'Dealership ID is required'),
  webhook_url: z.string().url('Invalid webhook URL').optional(),
  sync_frequency_minutes: z.number().int().min(5).max(1440).default(60),
  custom_fields: z.record(z.any()).optional(),
})

export const createCRMIntegrationSchema = z.object({
  crm_type: crmTypeSchema,
  crm_config_json: crmConfigSchema.omit({ api_key: true, api_secret: true }),
  is_active: z.boolean().default(true),
})

export const updateCRMIntegrationSchema = createCRMIntegrationSchema.partial()

export const crmWebhookPayloadSchema = z.object({
  event_type: z.enum(['lead_created', 'lead_updated', 'lead_deleted']),
  lead_id: z.string(),
  data: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    source: z.string(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    custom_fields: z.record(z.any()).optional(),
  }),
  timestamp: z.string(),
})

export type CreateCRMIntegrationInput = z.infer<typeof createCRMIntegrationSchema>
export type UpdateCRMIntegrationInput = z.infer<typeof updateCRMIntegrationSchema>
export type CRMWebhookPayloadInput = z.infer<typeof crmWebhookPayloadSchema>
