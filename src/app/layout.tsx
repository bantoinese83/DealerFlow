import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/lib/providers/SupabaseProvider'
import { QueryProvider } from '@/lib/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DealerFlow AI - AI-Powered BDC Automation',
  description: 'Transform your dealership\'s Business Development Center with AI-powered lead follow-up, vehicle data scraping, and CRM integration.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-blue-700 border border-blue-300 px-3 py-2 rounded"
        >
          Skip to content
        </a>
        <QueryProvider>
          <SupabaseProvider>
            <div className="min-h-screen bg-background">
              <main id="main-content" role="main">
                {children}
              </main>
            </div>
          </SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  )
}