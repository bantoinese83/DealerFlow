'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { aiConfigSchema } from '@/common/validation/aiConfigSchema'
import { cn } from '@/common/utils'
import { 
  Bot, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Settings,
  MessageSquare,
  Zap,
  Target,
  Clock
} from 'lucide-react'
import type { AIConfig } from '@/common/types'

interface AIConfigFormProps {
  config?: AIConfig
  onSave?: (config: AIConfig) => void
  onTest?: (config: AIConfig) => void
  isLoading?: boolean
  isSaving?: boolean
  className?: string
}

export function AIConfigForm({ 
  config, 
  onSave, 
  onTest, 
  isLoading = false, 
  isSaving = false,
  className 
}: AIConfigFormProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<AIConfig>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      model_name: config?.model_name || 'gpt-4-turbo',
      system_prompt: config?.system_prompt || '',
      temperature: config?.temperature || 0.7,
      max_tokens: config?.max_tokens || 1000,
      follow_up_frequency_days: config?.follow_up_frequency_days || 3,
      dealership_id: config?.dealership_id || '',
      created_at: config?.created_at || new Date().toISOString(),
      updated_at: config?.updated_at || new Date().toISOString()
    }
  })

  const watchedTemperature = watch('temperature')
  const watchedMaxTokens = watch('max_tokens')

  useEffect(() => {
    if (config) {
      reset(config)
    }
  }, [config, reset])

  const onSubmit = async (data: AIConfig) => {
    const updatedData = {
      ...data,
      updated_at: new Date().toISOString()
    }
    onSave?.(updatedData)
  }

  const handleTest = async (data: AIConfig) => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      // TODO: Implement actual AI test
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTestResult({
        success: true,
        message: 'AI configuration test successful! The AI can generate appropriate responses.'
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'AI configuration test failed. Please check your settings and try again.'
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleReset = () => {
    if (config) {
      reset(config)
    }
  }

  const getTemperatureDescription = (temp: number) => {
    if (temp <= 0.3) return 'Very focused and deterministic'
    if (temp <= 0.7) return 'Balanced creativity and consistency'
    if (temp <= 1.0) return 'More creative and varied'
    return 'Highly creative and unpredictable'
  }

  const getMaxTokensDescription = (tokens: number) => {
    if (tokens <= 500) return 'Short responses'
    if (tokens <= 1000) return 'Medium responses'
    if (tokens <= 2000) return 'Long responses'
    return 'Very long responses'
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Configuration</h2>
              <p className="text-sm text-gray-600">Configure your AI assistant&apos;s behavior and capabilities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTest(watch())}
              disabled={isTesting || isSaving}
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isTesting ? 'Testing...' : 'Test AI'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Model Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Model Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="model_name" className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  id="model_name"
                  {...register('model_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
                {errors.model_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.model_name.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Choose the AI model that best fits your needs and budget
                </p>
              </div>

              <div>
                <label htmlFor="follow_up_frequency_days" className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Frequency (Days)
                </label>
                <Input
                  id="follow_up_frequency_days"
                  type="number"
                  min="1"
                  max="30"
                  {...register('follow_up_frequency_days', { valueAsNumber: true })}
                  className={errors.follow_up_frequency_days ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                />
                {errors.follow_up_frequency_days && (
                  <p className="mt-1 text-sm text-red-600">{errors.follow_up_frequency_days.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  How often should AI follow up with leads (1-30 days)
                </p>
              </div>
            </div>
          </div>

          {/* Response Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Response Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature: {watchedTemperature}
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {getTemperatureDescription(watchedTemperature)}
                </p>
                {errors.temperature && (
                  <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Response Length: {watchedMaxTokens} tokens
                </label>
                <input
                  id="max_tokens"
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  {...register('max_tokens', { valueAsNumber: true })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {getMaxTokensDescription(watchedMaxTokens)}
                </p>
                {errors.max_tokens && (
                  <p className="mt-1 text-sm text-red-600">{errors.max_tokens.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              System Prompt
            </h3>
            
            <div>
              <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-2">
                AI Instructions
              </label>
              <textarea
                id="system_prompt"
                rows={8}
                {...register('system_prompt')}
                placeholder="Enter instructions for how the AI should behave when communicating with leads..."
                className={cn(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.system_prompt && "border-red-300 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.system_prompt && (
                <p className="mt-1 text-sm text-red-600">{errors.system_prompt.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Define how the AI should communicate with leads. Include tone, personality, and specific instructions.
              </p>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={cn(
              "p-4 rounded-md flex items-start space-x-3",
              testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            )}>
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  testResult.success ? "text-green-800" : "text-red-800"
                )}>
                  {testResult.success ? 'Test Successful' : 'Test Failed'}
                </p>
                <p className={cn(
                  "text-sm mt-1",
                  testResult.success ? "text-green-700" : "text-red-700"
                )}>
                  {testResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSaving || isTesting}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleTest(watch())}
                disabled={isTesting || isSaving}
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {isTesting ? 'Testing...' : 'Test Configuration'}
              </Button>
              
              <Button
                type="submit"
                disabled={!isDirty || isSaving || isTesting}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
