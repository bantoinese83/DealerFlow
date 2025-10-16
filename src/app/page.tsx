import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] tracking-tight">DealerFlow AI</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" className="btn-ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
              <Button asChild className="btn-primary">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[hsl(var(--foreground))] tracking-tight mb-4">
            Transform Your BDC with
            <span className="text-[hsl(var(--primary))]"> AI-Powered Automation</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            DealerFlow AI revolutionizes your dealership&apos;s Business Development Center with intelligent lead follow-up, 
            real-time vehicle data scraping, and seamless CRM integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-3">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                AI Conversations
              </CardTitle>
              <CardDescription>
                Intelligent AI agents that engage leads with personalized conversations, 
                understand intent, and guide prospects through the sales funnel.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Real-time Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive dashboards and reports that provide insights into lead conversion, 
                AI performance, and team productivity in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Web Scraping
              </CardTitle>
              <CardDescription>
                Automatically scrape and update vehicle inventory from multiple sources, 
                ensuring your data is always current and accurate.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                CRM Integration
              </CardTitle>
              <CardDescription>
                Seamlessly integrate with CDK, Reynolds & Reynolds, and other major CRM systems 
                to sync leads and maintain data consistency.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a2.5 2.5 0 01-2.5-2.5V5a2.5 2.5 0 012.5-2.5h11a2.5 2.5 0 012.5 2.5v11a2.5 2.5 0 01-2.5 2.5h-11z" />
                  </svg>
                </div>
                Smart Alerts
              </CardTitle>
              <CardDescription>
                Get instant notifications for qualified leads, sentiment changes, 
                and critical events that require immediate attention.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Secure & Compliant
              </CardTitle>
              <CardDescription>
                Enterprise-grade security with SOC 2 compliance, data encryption, 
                and role-based access controls to protect your dealership&apos;s data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your BDC?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of dealerships already using DealerFlow AI to increase lead conversion by 40%
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}