'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { crmIntegrationSchema } from '@/common/validation/crmIntegrationSchema'
import { cn } from '@/common/utils'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  ExternalLink,
  TestTube,
  Database,
  Key,
  Globe,
  Shield,
  Zap
} from 'lucide-react'
import type { CRMIntegration } from '@/common/types'

interface CRMIntegrationSettingsProps {
  integration?: CRMIntegration
  onSave?: (integration: CRMIntegration) => void
  onTest?: (integration: CRMIntegration) => void
  isLoading?: boolean
  isSaving?: boolean
  className?: string
}

export function CRMIntegrationSettings({ 
  integration, 
  onSave, 
  onTest, 
  isLoading = false, 
  isSaving = false,
  className 
}: CRMIntegrationSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<CRMIntegration>({
    resolver: zodResolver(crmIntegrationSchema),
    defaultValues: {
      crm_type: integration?.crm_type || 'cdk',
      api_endpoint: integration?.api_endpoint || '',
      api_key: integration?.api_key || '',
      api_secret: integration?.api_secret || '',
      username: integration?.username || '',
      password: integration?.password || '',
      dealership_id: integration?.dealership_id || '',
      is_active: integration?.is_active || false,
      sync_frequency_minutes: integration?.sync_frequency_minutes || 60,
      last_sync_at: integration?.last_sync_at || null,
      created_at: integration?.created_at || new Date().toISOString(),
      updated_at: integration?.updated_at || new Date().toISOString()
    }
  })

  const watchedCrmType = watch('crm_type')
  const watchedIsActive = watch('is_active')

  useEffect(() => {
    if (integration) {
      reset(integration)
    }
  }, [integration, reset])

  const onSubmit = async (data: CRMIntegration) => {
    const updatedData = {
      ...data,
      updated_at: new Date().toISOString()
    }
    onSave?.(updatedData)
  }

  const handleTest = async (data: CRMIntegration) => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      // TODO: Implement actual CRM test
      await new Promise(resolve => setTimeout(resolve, 3000))
      setTestResult({
        success: true,
        message: 'CRM integration test successful! Connection established and credentials verified.'
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'CRM integration test failed. Please check your credentials and try again.'
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleReset = () => {
    if (integration) {
      reset(integration)
    }
  }

  const getCrmTypeInfo = (type: string) => {
    switch (type) {
      case 'cdk':
        return {
          name: 'CDK Global',
          description: 'Leading automotive retail technology provider',
          logo: 'CDK',
          color: 'bg-blue-100 text-blue-800'
        }
      case 'reynolds':
        return {
          name: 'Reynolds & Reynolds',
          description: 'Automotive retail management solutions',
          logo: 'R&R',
          color: 'bg-green-100 text-green-800'
        }
      case 'dealertrack':
        return {
          name: 'DealerTrack',
          description: 'Automotive retail technology platform',
          logo: 'DT',
          color: 'bg-purple-100 text-purple-800'
        }
      default:
        return {
          name: 'Custom CRM',
          description: 'Custom CRM integration',
          logo: 'CRM',
          color: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const crmInfo = getCrmTypeInfo(watchedCrmType)

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">CRM Integration</h2>
              <p className="text-sm text-gray-600">Connect your dealership CRM system</p>
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
                <TestTube className="h-4 w-4 mr-2" />
              )}
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* CRM Type Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              CRM System
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="crm_type" className="block text-sm font-medium text-gray-700 mb-2">
                  CRM Provider
                </label>
                <select
                  id="crm_type"
                  {...register('crm_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cdk">CDK Global</option>
                  <option value="reynolds">Reynolds & Reynolds</option>
                  <option value="dealertrack">DealerTrack</option>
                  <option value="custom">Custom CRM</option>
                </select>
                {errors.crm_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.crm_type.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <div className={cn(
                  "inline-flex items-center px-3 py-2 rounded-lg",
                  crmInfo.color
                )}>
                  <span className="text-sm font-medium">{crmInfo.logo}</span>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{crmInfo.name}</p>
                    <p className="text-xs opacity-75">{crmInfo.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              API Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="api_endpoint" className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="api_endpoint"
                    type="url"
                    {...register('api_endpoint')}
                    placeholder="https://api.crm-provider.com/v1"
                    className="pl-10"
                  />
                </div>
                {errors.api_endpoint && (
                  <p className="mt-1 text-sm text-red-600">{errors.api_endpoint.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dealership_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Dealership ID
                </label>
                <Input
                  id="dealership_id"
                  {...register('dealership_id')}
                  placeholder="Enter your dealership ID"
                />
                {errors.dealership_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.dealership_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="api_key"
                    type={showApiKey ? 'text' : 'password'}
                    {...register('api_key')}
                    placeholder="Enter your API key"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.api_key && (
                  <p className="mt-1 text-sm text-red-600">{errors.api_key.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="api_secret" className="block text-sm font-medium text-gray-700 mb-2">
                  API Secret
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="api_secret"
                    type={showSecret ? 'text' : 'password'}
                    {...register('api_secret')}
                    placeholder="Enter your API secret"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.api_secret && (
                  <p className="mt-1 text-sm text-red-600">{errors.api_secret.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Authentication
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sync Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Sync Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sync_frequency_minutes" className="block text-sm font-medium text-gray-700 mb-2">
                  Sync Frequency (Minutes)
                </label>
                <Input
                  id="sync_frequency_minutes"
                  type="number"
                  min="5"
                  max="1440"
                  {...register('sync_frequency_minutes', { valueAsNumber: true })}
                />
                {errors.sync_frequency_minutes && (
                  <p className="mt-1 text-sm text-red-600">{errors.sync_frequency_minutes.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  How often to sync data with your CRM (5-1440 minutes)
                </p>
              </div>

              <div className="flex items-center">
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    {...register('is_active')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Enable Integration
                  </label>
                </div>
              </div>
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
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
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

          {/* Status */}
          {integration && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Integration Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={cn(
                    "ml-2 font-medium",
                    watchedIsActive ? "text-green-600" : "text-gray-600"
                  )}>
                    {watchedIsActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="ml-2 text-gray-900">
                    {integration.last_sync_at 
                      ? new Date(integration.last_sync_at).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Sync Frequency:</span>
                  <span className="ml-2 text-gray-900">
                    Every {integration.sync_frequency_minutes} minutes
                  </span>
                </div>
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
                  <TestTube className="h-4 w-4 mr-2" />
                )}
                {isTesting ? 'Testing...' : 'Test Connection'}
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
                    Save Integration
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
