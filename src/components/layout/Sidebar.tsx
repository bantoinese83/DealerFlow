'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/common/hooks/useAuth'
import { cn } from '@/common/utils'
import { useUIStore } from '@/store/uiStore'
import { siteConfig } from '@/config/site'
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MessageSquare, 
  Settings, 
  Bell,
  BarChart3,
  Wrench,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Car },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const settingsNavigation = [
  { name: 'AI Configuration', href: '/settings/ai', icon: Settings },
  { name: 'Integrations', href: '/settings/integrations', icon: Wrench },
]

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-r border-[hsl(var(--border))] shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-[hsl(var(--border))]">
            <Link href="/dashboard" className="flex items-center" aria-label="Go to dashboard">
              <div className="h-8 w-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                <span className="text-[hsl(var(--primary-foreground))] font-bold text-sm">DF</span>
              </div>
              <span className="ml-2 text-xl font-bold text-[hsl(var(--foreground))]">
                {siteConfig.name}
              </span>
            </Link>
            <button
              onClick={onClose || toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-[hsl(var(--accent))]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                        : "text-muted-foreground hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive(item.href)
                          ? "text-[hsl(var(--primary))]"
                          : "text-muted-foreground group-hover:text-[hsl(var(--foreground))]"
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Settings section */}
            <div className="pt-6">
              <div className="px-3 mb-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Settings
                </h3>
              </div>
              <div className="space-y-1">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive(item.href)
                          ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                          : "text-muted-foreground hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          isActive(item.href)
                            ? "text-[hsl(var(--primary))]"
                            : "text-muted-foreground group-hover:text-[hsl(var(--foreground))]"
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* User info */}
          <div className="border-t border-[hsl(var(--border))] p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-[hsl(var(--secondary))] rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile?.role?.replace('_', ' ') || 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

