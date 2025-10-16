"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background relative flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isMenuOpen={sidebarOpen} />
        <div className="lg:flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="lg:pl-64 flex-1 relative z-10">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  )
}
