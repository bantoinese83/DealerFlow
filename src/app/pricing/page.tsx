import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'

const tiers = [
  { name: 'Starter', price: '$0', desc: 'For evaluation and small teams', cta: 'Start Free' },
  { name: 'Pro', price: '$249/mo', desc: 'For growing dealerships', cta: 'Upgrade' },
  { name: 'Enterprise', price: 'Custom', desc: 'Advanced controls and SLAs', cta: 'Contact Sales' },
]

export default function PricingPage() {
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <Card key={t.name} className="p-6">
                <h3 className="text-xl font-semibold text-white">{t.name}</h3>
                <p className="text-3xl font-bold text-white mt-2">{t.price}</p>
                <p className="text-gray-300 mt-2">{t.desc}</p>
                <div className="mt-4">
                  <Button className="cosmic-gradient w-full">{t.cta}</Button>
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


