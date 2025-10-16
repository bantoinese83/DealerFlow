'use client'

import { useState } from 'react'
import { CRMIntegrationSettings } from '@/components/integrations/CRMIntegrationSettings'
import { useAuth } from '@/common/hooks/useAuth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Settings, 
  Database, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react'
import type { CRMIntegration } from '@/common/types'

// Mock data for demonstration
const mockCRMIntegration: CRMIntegration = {
  id: 'crm-integration-1',
  crm_type: 'cdk',
  api_endpoint: 'https://api.cdkglobal.com/v1',
  api_key: 'cdk_api_key_12345',
  api_secret: 'cdk_secret_67890',
  username: 'dealership_user',
  password: 'secure_password',
  dealership_id: 'CDK123456',
  is_active: true,
  sync_frequency_minutes: 60,
  last_sync_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
}

export default function IntegrationsSettingsPage() {
  const { profile } = useAuth()
  const [crmIntegration, setCrmIntegration] = useState<CRMIntegration>(mockCRMIntegration)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (integration: CRMIntegration) => {
    setIsSaving(true)
    try {
      // TODO: Implement actual save logic
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCrmIntegration(integration)
      console.log('CRM integration saved:', integration)
    } catch (error) {
      console.error('Failed to save CRM integration:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async (integration: CRMIntegration) => {
    console.log('Testing CRM integration:', integration)
    // TODO: Implement actual test logic
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getCrmTypeInfo = (type: string) => {
    switch (type) {
      case 'cdk':
        return {
          name: 'CDK Global',
          description: 'Leading automotive retail technology provider',
          logo: 'CDK',
          color: 'bg-blue-100 text-blue-800',
          status: 'Connected'
        }
      case 'reynolds':
        return {
          name: 'Reynolds & Reynolds',
          description: 'Automotive retail management solutions',
          logo: 'R&R',
          color: 'bg-green-100 text-green-800',
          status: 'Available'
        }
      case 'dealertrack':
        return {
          name: 'DealerTrack',
          description: 'Automotive retail technology platform',
          logo: 'DT',
          color: 'bg-purple-100 text-purple-800',
          status: 'Available'
        }
      default:
        return {
          name: 'Custom CRM',
          description: 'Custom CRM integration',
          logo: 'CRM',
          color: 'bg-gray-100 text-gray-800',
          status: 'Available'
        }
    }
  }

  const crmInfo = getCrmTypeInfo(crmIntegration.crm_type)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Integrations
          </h1>
          <p className="text-gray-600 mt-1">
            Connect and configure your dealership&apos;s systems and services
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CRM System</p>
              <p className="text-lg font-semibold text-gray-900">{crmInfo.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">
                {crmIntegration.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Sync</p>
              <p className="text-lg font-semibold text-gray-900">
                {crmIntegration.last_sync_at 
                  ? new Date(crmIntegration.last_sync_at).toLocaleTimeString()
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* CRM Integration Settings */}
      <CRMIntegrationSettings
        integration={crmIntegration}
        onSave={handleSave}
        onTest={handleTest}
        isSaving={isSaving}
      />

      {/* Available Integrations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Available Integrations</h3>
            <p className="text-sm text-gray-600">Connect additional services to enhance your workflow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Marketing */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-red-600">EM</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Email Marketing</h4>
                <p className="text-sm text-gray-600">Mailchimp, Constant Contact</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Automatically sync leads with your email marketing campaigns
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>

          {/* SMS Notifications */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">SMS</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Twilio, SendGrid</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Send automated SMS notifications to leads and customers
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>

          {/* Analytics */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">GA</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-600">Google Analytics, Mixpanel</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Track lead behavior and conversion metrics
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>

          {/* Calendar */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-yellow-600">CAL</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Calendar</h4>
                <p className="text-sm text-gray-600">Google Calendar, Outlook</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sync appointments and follow-up schedules
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>

          {/* Social Media */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-pink-600">SOC</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Social Media</h4>
                <p className="text-sm text-gray-600">Facebook, Instagram</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage social media leads and campaigns
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>

          {/* Webhooks */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">WH</span>
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Webhooks</h4>
                <p className="text-sm text-gray-600">Custom integrations</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Create custom webhook integrations
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Configure
            </Button>
          </div>
        </div>
      </Card>

      {/* Integration Guidelines */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Integration Guidelines</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Security Best Practices</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always use secure API keys and never share them publicly</li>
              <li>• Enable two-factor authentication where available</li>
              <li>• Regularly rotate API keys and passwords</li>
              <li>• Monitor integration logs for suspicious activity</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Testing & Monitoring</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Test all integrations in a staging environment first</li>
              <li>• Set up monitoring and alerts for integration failures</li>
              <li>• Keep integration documentation up to date</li>
              <li>• Have a rollback plan for critical integrations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Import cn utility
import { cn } from '@/common/utils'
