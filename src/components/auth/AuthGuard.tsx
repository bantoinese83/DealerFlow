'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/common/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/Card'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: 'admin' | 'manager' | 'bdc_rep'
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireRole 
}: AuthGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (requireAuth && !user) {
      router.push('/auth/login')
      return
    }

    if (requireRole && profile && profile.role !== requireRole) {
      router.push('/dashboard')
      return
    }
  }, [user, profile, loading, requireAuth, requireRole, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--cosmic-purple))]"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (requireRole && profile && profile.role !== requireRole) {
    return null
  }

  return <>{children}</>
}
