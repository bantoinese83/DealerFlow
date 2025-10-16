'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export default function PricingPage() {
  const supabase = createClientComponentClient()
  const [userCount, setUserCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadUserStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)

      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
      
      setUserCount(count || 0)
    }

    loadUserStats()
  }, [supabase])

  const tiers = [
    { 
      name: 'Starter', 
      price: '$0', 
      desc: 'For evaluation and small teams',
      features: ['Up to 100 leads/month', 'Basic AI responses', 'Email support'],
      cta: 'Start Free',
      href: '/auth/signup',
      popular: false
    },
    { 
      name: 'Pro', 
      price: '$249/mo', 
      desc: 'For growing dealerships',
      features: ['Unlimited leads', 'Advanced AI models', 'CRM integrations', 'Priority support'],
      cta: isLoggedIn ? 'Upgrade' : 'Get Started',
      href: isLoggedIn ? '/dashboard' : '/auth/signup',
      popular: true
    },
    { 
      name: 'Enterprise', 
      price: 'Custom', 
      desc: 'Advanced controls and SLAs',
      features: ['Custom AI training', 'Dedicated support', 'SLA guarantees', 'On-premise options'],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false
    },
  ]
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 cosmic-gradient rounded-lg flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">DealerFlow AI</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="cosmic-gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Pricing</h1>
            <p className="text-gray-300 mt-2">Simple plans designed for dealerships of all sizes.</p>
            <div className="mt-4 text-sm text-gray-400">
              Join {userCount.toLocaleString()} users already using DealerFlow AI
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <Card key={t.name} className={`p-6 relative ${t.popular ? 'cosmic-border' : ''}`}>
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[hsl(var(--cosmic-purple))] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white">{t.name}</h3>
                <p className="text-3xl font-bold text-white mt-2">{t.price}</p>
                <p className="text-gray-300 mt-2">{t.desc}</p>
                
                <ul className="mt-4 space-y-2">
                  {t.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <span className="text-[hsl(var(--cosmic-purple))] mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <Link href={t.href}>
                    <Button className={t.popular ? "cosmic-gradient w-full" : "w-full"}>
                      {t.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


