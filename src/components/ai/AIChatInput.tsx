'use client'

import { useState, useRef, useEffect } from 'react'
import { useCreateConversation } from '@/common/hooks/useConversations'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  Send, 
  Bot, 
  Mic, 
  MicOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import type { Conversation } from '@/common/types'

interface AIChatInputProps {
  leadId: string
  onMessageSent?: (conversation: Conversation) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function AIChatInput({ 
  leadId, 
  onMessageSent, 
  placeholder = "Type a message or let AI generate a response...",
  className,
  disabled = false
}: AIChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const createConversation = useCreateConversation()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending || disabled) return

    setIsSending(true)
    try {
      const result = await createConversation.mutateAsync({
        lead_id: leadId,
        participant: 'bdc_rep',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        sentiment: 'neutral',
        intent: 'manual_message'
      })
      
      setMessage('')
      onMessageSent?.(result.data)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleAIGenerate = async () => {
    if (isAIGenerating || disabled) return

    setIsAIGenerating(true)
    try {
      const result = await createConversation.mutateAsync({
        lead_id: leadId,
        participant: 'ai',
        message: 'AI is generating a personalized response...',
        timestamp: new Date().toISOString(),
        sentiment: 'neutral',
        intent: 'ai_generated',
        trigger_ai: true
      })
      
      onMessageSent?.(result.data)
    } catch (error) {
      console.error('Failed to generate AI response:', error)
    } finally {
      setIsAIGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleVoiceToggle = () => {
    // TODO: Implement voice recording
    setIsRecording(!isRecording)
  }

  const isDisabled = disabled || isSending || isAIGenerating

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSendMessage} className="space-y-3">
        {/* Message Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={1}
            className={cn(
              "w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              isDisabled && "opacity-50 cursor-not-allowed",
              "min-h-[48px] max-h-32"
            )}
          />
          
          {/* Voice Recording Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            disabled={isDisabled}
            className={cn(
              "absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors",
              isRecording 
                ? "text-red-600 hover:bg-red-50" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isDisabled}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors",
              message.trim() && !isDisabled
                ? "text-blue-600 hover:bg-blue-50"
                : "text-gray-400 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIGenerate}
              disabled={isDisabled}
              className="flex items-center"
            >
              {isAIGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generate
                </>
              )}
            </Button>

            {isRecording && (
              <div className="flex items-center text-sm text-red-600">
                <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                Recording...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>

        {/* Status Indicators */}
        {(isSending || isAIGenerating) && (
          <div className="flex items-center space-x-2 text-sm">
            {isSending && (
              <div className="flex items-center text-blue-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending message...
              </div>
            )}
            {isAIGenerating && (
              <div className="flex items-center text-purple-600">
                <Bot className="h-4 w-4 mr-2" />
                AI is crafting a response...
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {createConversation.error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to send message. Please try again.</span>
          </div>
        )}

        {/* Success State */}
        {createConversation.isSuccess && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
            <CheckCircle className="h-4 w-4" />
            <span>Message sent successfully!</span>
          </div>
        )}
      </form>
    </div>
  )
}
