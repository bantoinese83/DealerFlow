import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AIService } from '@/services/aiService'
import type { AIPromptContext } from '@/common/types'

const aiService = new AIService()

export function useConversations(leadId: string) {
  return useQuery({
    queryKey: ['conversations', leadId],
    queryFn: () => aiService.getConversations(leadId),
    enabled: !!leadId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useConversationSummary(leadId: string) {
  return useQuery({
    queryKey: ['conversations', 'summary', leadId],
    queryFn: () => aiService.getConversationSummary(leadId),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStoreConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      lead_id: string
      participant: 'ai' | 'lead' | 'bdc_rep'
      message: string
      sentiment?: string
      intent?: string
      ai_model_used?: string
    }) => aiService.storeConversation(data),
    onSuccess: (_, { lead_id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', lead_id] })
      queryClient.invalidateQueries({ queryKey: ['conversations', 'summary', lead_id] })
    },
  })
}

export function useGenerateAIResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      leadId,
      message,
      context,
    }: {
      leadId: string
      message: string
      context: AIPromptContext
    }) => aiService.generateAIResponse(leadId, message, context),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', leadId] })
      queryClient.invalidateQueries({ queryKey: ['conversations', 'summary', leadId] })
    },
  })
}

export function useShouldTriggerFollowUp(leadId: string) {
  return useQuery({
    queryKey: ['conversations', 'follow-up', leadId],
    queryFn: () => aiService.shouldTriggerFollowUp(leadId),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
