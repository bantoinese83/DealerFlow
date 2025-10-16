import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'

const features = [
  { title: 'AI Conversations', desc: 'Lead nurturing, intent detection, and compliant messaging.' },
  { title: 'Realtime Inventory', desc: 'Scrape, normalize, and sync vehicle data as it changes.' },
  { title: 'CRM Integrations', desc: 'Push/pull leads with CDK and Reynolds & Reynolds.' },
  { title: 'Alerts & Automation', desc: 'Sentiment triggers, SLA breaches, and manager notifications.' },
  { title: 'Analytics', desc: 'Conversion insights, response times, and pipeline health.' },
  { title: 'Security & RLS', desc: 'Per-dealership isolation via Supabase RLS and JWTs.' },
]

export default function FeaturesPage() {
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Features</h1>
            <p className="text-gray-300 mt-2">Everything you need to automate your BDC.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="text-lg font-medium text-white">{f.title}</h3>
                <p className="text-gray-300 mt-2">{f.desc}</p>
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


