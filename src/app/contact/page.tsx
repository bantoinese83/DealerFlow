import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Footer } from '@/components/layout/Footer'

export default function ContactPage() {
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Contact Us</h1>
            <p className="text-gray-300 mt-2">We'd love to hear from you.</p>
          </div>

          <Card className="p-6">
            <form className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-white">Name</label>
                <Input className="mt-1" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Email</label>
                <Input type="email" className="mt-1" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Message</label>
                <textarea className="mt-1 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cosmic-purple))] focus:border-transparent" rows={5} placeholder="How can we help?" />
              </div>
              <Button className="cosmic-gradient">Send</Button>
            </form>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}


