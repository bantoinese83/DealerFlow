import { z } from 'zod'

export const aiModelSchema = z.enum(['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'])

export const createAIConfigSchema = z.object({
  model_name: aiModelSchema,
  system_prompt: z.string().min(10, 'System prompt must be at least 10 characters').max(4000, 'System prompt too long'),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().int().min(100).max(4000).default(1000),
  follow_up_frequency_days: z.number().int().min(1).max(30).default(3),
})

export const updateAIConfigSchema = createAIConfigSchema.partial()

export const aiPromptContextSchema = z.object({
  lead: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    preferred_vehicle: z.object({
      make: z.string(),
      model: z.string(),
      year: z.number(),
      price: z.number(),
    }).optional(),
    last_contact: z.string().optional(),
    notes: z.string().optional(),
  }),
  conversation_history: z.array(z.object({
    participant: z.string(),
    message: z.string(),
    timestamp: z.string(),
  })),
  dealership_context: z.object({
    name: z.string(),
    location: z.string(),
    specialties: z.array(z.string()),
  }),
})

export type CreateAIConfigInput = z.infer<typeof createAIConfigSchema>
export type UpdateAIConfigInput = z.infer<typeof updateAIConfigSchema>
export type AIPromptContextInput = z.infer<typeof aiPromptContextSchema>
