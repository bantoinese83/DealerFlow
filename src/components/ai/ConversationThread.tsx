'use client'

import { useState, useEffect, useRef } from 'react'
import { useConversations, useCreateConversation } from '@/common/hooks/useConversations'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import type { Conversation, Lead } from '@/common/types'

interface ConversationThreadProps {
  leadId: string
  lead?: Lead
  onNewMessage?: (conversation: Conversation) => void
  className?: string
}

export function ConversationThread({ leadId, lead, onNewMessage, className }: ConversationThreadProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { data: conversationsResponse, isLoading, error, refetch } = useConversations(leadId)
  const createConversation = useCreateConversation()
  
  const conversations = conversationsResponse || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      await createConversation.mutateAsync({
        lead_id: leadId,
        participant: 'bdc_rep',
        message: newMessage.trim(),
        
        sentiment: 'neutral',
        intent: 'general_inquiry'
      })
      
      setNewMessage('')
      onNewMessage?.({} as any)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleTriggerAI = async () => {
    if (isSending) return

    setIsSending(true)
    try {
      await createConversation.mutateAsync({
        lead_id: leadId,
        participant: 'ai',
        message: 'AI is generating a response...',
        
        sentiment: 'neutral',
        intent: 'ai_response'
      })
      
      onNewMessage?.({} as any)
    } catch (error) {
      console.error('Failed to trigger AI:', error)
    } finally {
      setIsSending(false)
    }
  }

  const getParticipantIcon = (participant: Conversation['participant']) => {
    switch (participant) {
      case 'ai':
        return <Bot className="h-4 w-4" />
      case 'bdc_rep':
        return <User className="h-4 w-4" />
      case 'lead':
        return <User className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getParticipantColor = (participant: Conversation['participant']) => {
    switch (participant) {
      case 'ai':
        return 'bg-blue-100 text-blue-800'
      case 'bdc_rep':
        return 'bg-green-100 text-green-800'
      case 'lead':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSentimentIcon = (sentiment: Conversation['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'negative':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      case 'neutral':
        return <Clock className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load conversations</h3>
          <p className="text-gray-600 mb-4">There was an error loading the conversation history.</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("flex flex-col h-96", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Conversation</h3>
            {lead && (
              <p className="text-sm text-gray-600">
                with {lead.first_name} {lead.last_name}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600">
              Start a conversation with {lead?.first_name || 'this lead'} or let AI generate a follow-up message.
            </p>
          </div>
        ) : (
          conversations.map((conversation: any, index: number) => {
            const showDate = index === 0 || 
              formatDate(conversation.timestamp) !== formatDate(conversations[index - 1].timestamp)
            
            return (
              <div key={conversation.id}>
                {showDate && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(conversation.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    getParticipantColor(conversation.participant)
                  )}>
                    {getParticipantIcon(conversation.participant)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {conversation.participant.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.timestamp)}
                      </span>
                      {conversation.sentiment && getSentimentIcon(conversation.sentiment)}
                    </div>
                    
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {conversation.message}
                    </div>
                    
                    {conversation.intent && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                          {conversation.intent.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerAI}
              disabled={isSending}
            >
              <Bot className="h-4 w-4 mr-2" />
              Let AI Respond
            </Button>
            
            <div className="text-xs text-gray-500">
              {conversations.length} message{conversations.length !== 1 ? 's' : ''}
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}
