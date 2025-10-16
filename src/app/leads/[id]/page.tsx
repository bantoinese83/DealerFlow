"use client"

import { useParams, useRouter } from 'next/navigation'
import { LeadDetailView } from '@/components/leads/LeadDetailView'
import { Card } from '@/components/ui/Card'
import { ConversationThread } from '@/components/ai/ConversationThread'
import { AIChatInput } from '@/components/ai/AIChatInput'
import { useConversations, useConversationSummary, useShouldTriggerFollowUp, useGenerateAIResponse } from '@/common/hooks/useConversations'
import { useLead } from '@/common/hooks/useLeads'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Sparkles } from 'lucide-react'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const { data: summary } = useConversationSummary(leadId)
  const { data: shouldFollowUp } = useShouldTriggerFollowUp(leadId)
  const { data: conversationsResp } = useConversations(leadId)
  const { data: lead } = useLead(leadId)
  const generateAI = useGenerateAIResponse()

  if (!leadId) {
    return (
      <Card className="p-6">Invalid lead id</Card>
    )
  }

  return (
    <div className="space-y-6">
      {shouldFollowUp && (
        <Card className="p-4 border-amber-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Follow-up suggested</p>
                <p className="text-xs text-amber-700">AI recommends sending a follow-up based on recent activity.</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!lead) return
                const history = (conversationsResp || []).map((c: any) => ({
                  participant: c.participant,
                  message: c.message,
                  timestamp: c.timestamp,
                }))
                const context = {
                  lead: {
                    name: `${lead.first_name} ${lead.last_name || ''}`.trim(),
                    email: lead.email,
                    phone: lead.phone || undefined,
                    preferred_vehicle: undefined,
                    last_contact: history.length ? history[history.length - 1].timestamp : undefined,
                    notes: lead.notes || undefined,
                  },
                  conversation_history: history,
                  dealership_context: {
                    name: 'Dealership',
                    location: '',
                    specialties: ['New Cars', 'Used Cars', 'Service', 'Parts'],
                  },
                }
                generateAI.mutate({
                  leadId,
                  dealershipId: lead.dealership_id,
                  message: 'Please draft a concise, friendly follow-up message for this lead.',
                  context,
                })
              }}
              disabled={generateAI.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generateAI.isPending ? 'Drafting…' : 'Draft AI Follow-up'}
            </Button>
          </div>
        </Card>
      )}

      <LeadDetailView leadId={leadId} onClose={() => router.push('/leads')} />
      <ConversationThread leadId={leadId} />

      {summary && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Messages</p>
              <p className="font-semibold">{summary.total_messages}</p>
            </div>
            <div>
              <p className="text-gray-500">AI Messages</p>
              <p className="font-semibold">{summary.ai_messages}</p>
            </div>
            <div>
              <p className="text-gray-500">Lead Messages</p>
              <p className="font-semibold">{summary.lead_messages}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Activity</p>
              <p className="font-semibold">{summary.last_activity ? new Date(summary.last_activity).toLocaleString() : '—'}</p>
            </div>
          </div>
          {summary.key_intents?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {summary.key_intents.map((intent) => (
                <span key={intent} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  {intent.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}

      <AIChatInput leadId={leadId} />
    </div>
  )
}


