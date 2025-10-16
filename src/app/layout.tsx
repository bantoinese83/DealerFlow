import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/lib/providers/SupabaseProvider'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${siteConfig.name} - AI-Powered BDC Automation`,
  description: siteConfig.description,
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 glass-effect text-white border border-[hsl(var(--cosmic-purple))] px-3 py-2 rounded"
        >
          Skip to content
        </a>
        <QueryProvider>
          <SupabaseProvider>
            <div className="min-h-screen bg-background relative">
              <main id="main-content" role="main" className="relative z-10">
                {children}
              </main>
            </div>
          </SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  )
}