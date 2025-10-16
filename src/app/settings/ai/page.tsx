'use client'

import { useState } from 'react'
import { AIConfigForm } from '@/components/ai/AIConfigForm'
import { useAuth } from '@/common/hooks/useAuth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  Bot, 
  Settings, 
  TestTube,
  Save,
  RefreshCw,
  Info
} from 'lucide-react'
import type { AIConfig } from '@/common/types'

// Mock data for demonstration
const mockAIConfig: AIConfig = {
  id: 'ai-config-1',
  dealership_id: 'dealership-1',
  model_name: 'gpt-4-turbo',
  system_prompt: `You are an AI assistant for a car dealership. Your role is to help with lead follow-up and customer service.

Key guidelines:
- Be friendly, professional, and helpful
- Focus on understanding customer needs and preferences
- Ask qualifying questions about budget, timeline, and vehicle preferences
- Provide accurate information about vehicles and services
- Always be honest about pricing and availability
- Escalate complex issues to human representatives
- Maintain a conversational, not salesy tone
- Respect customer privacy and preferences

Remember: Your goal is to build relationships and help customers find the right vehicle, not just make a sale.`,
  temperature: 0.7,
  max_tokens: 1000,
  follow_up_frequency_days: 3,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
}

export default function AISettingsPage() {
  const { profile } = useAuth()
  const [aiConfig, setAiConfig] = useState<AIConfig>(mockAIConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (config: AIConfig) => {
    setIsSaving(true)
    try {
      // TODO: Implement actual save logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      setAiConfig(config)
      console.log('AI config saved:', config)
    } catch (error) {
      console.error('Failed to save AI config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async (config: AIConfig) => {
    console.log('Testing AI config:', config)
    // TODO: Implement actual test logic
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[hsl(var(--foreground))] tracking-tight flex items-center">
            <Bot className="h-8 w-8 mr-3" />
            AI Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your AI assistant&apos;s behavior and capabilities
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button className="btn-primary">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      {/* AI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">AI Model</p>
              <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                {aiConfig.model_name.replace('-', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TestTube className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
          </div>
        </Card>

        <Card className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Follow-up</p>
              <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Every {aiConfig.follow_up_frequency_days} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Configuration Form */}
      <AIConfigForm
        config={aiConfig}
        onSave={handleSave}
        onTest={handleTest}
        isSaving={isSaving}
      />

      {/* AI Performance Metrics */}
      <Card className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">AI Performance</h3>
            <p className="text-sm text-muted-foreground">Track your AI assistant&apos;s effectiveness</p>
          </div>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[hsl(var(--foreground))]">87%</p>
            <p className="text-sm text-muted-foreground">Response Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[hsl(var(--foreground))]">4.2</p>
            <p className="text-sm text-muted-foreground">Avg Response Time (min)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[hsl(var(--foreground))]">92%</p>
            <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[hsl(var(--foreground))]">156</p>
            <p className="text-sm text-muted-foreground">Conversations Today</p>
          </div>
        </div>
      </Card>

      {/* AI Guidelines */}
      <Card className="card p-6">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">AI Guidelines</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Best Practices</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep system prompts clear and specific to your dealership&apos;s voice</li>
              <li>• Test different temperature settings to find the right balance of creativity and consistency</li>
              <li>• Monitor AI responses regularly and adjust prompts as needed</li>
              <li>• Set appropriate follow-up frequencies to avoid overwhelming customers</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• AI responses are generated based on your configuration and may not always be perfect</li>
              <li>• Always review AI-generated content before sending to customers</li>
              <li>• Monitor for any inappropriate or off-brand responses</li>
              <li>• Update your system prompt regularly to reflect changes in your business</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
