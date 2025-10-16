'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/common/hooks/useAuth'
import { useNotificationStore } from '@/store/notificationStore'
import { useUIStore } from '@/store/uiStore'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  onMenuToggle?: () => void
  isMenuOpen?: boolean
}

export function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const notifications = useNotificationStore((s) => s.notifications)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="glass-effect border-b border-[hsl(var(--border))]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle || toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-[hsl(var(--accent))] transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <Link href="/dashboard" className="ml-2 lg:ml-0" aria-label="Go to dashboard">
              <div className="flex items-center">
                <div className="h-8 w-8 cosmic-gradient rounded-lg flex items-center justify-center shadow-lg" aria-hidden="true">
                  <span className="text-white font-bold text-sm">DF</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white hidden sm:block">
                  {siteConfig.name}
                </span>
              </div>
            </Link>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-[hsl(var(--accent))] rounded-md relative transition-all duration-200"
                aria-haspopup="dialog"
                aria-expanded={isNotificationsOpen}
                aria-controls="header-notifications"
                aria-label="Open notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" aria-hidden="true">
                  {Math.min(notifications.length, 9)}
                </span>
              </button>
              
              {isNotificationsOpen && (
                <div id="header-notifications" role="dialog" aria-label="Notifications" className="absolute right-0 mt-2 w-80 glass-effect rounded-md shadow-lg border border-[hsl(var(--border))] z-50">
                  <div className="p-4 border-b border-[hsl(var(--border))]">
                    <h3 className="text-lg font-medium text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-all duration-200">
                      <p className="text-sm text-white">New qualified lead: Sarah Johnson</p>
                      <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                    </div>
                    <div className="p-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-all duration-200">
                      <p className="text-sm text-white">Follow-up overdue: John Smith</p>
                      <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                    </div>
                    <div className="p-4 hover:bg-[hsl(var(--accent))] transition-all duration-200">
                      <p className="text-sm text-white">AI generated new lead: Mike Davis</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-[hsl(var(--border))]">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/alerts">View All Alerts</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-all duration-200"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-controls="user-menu"
                aria-label="Open user menu"
              >
                <div className="h-8 w-8 cosmic-gradient rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-medium text-white">
                    {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">
                    {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {profile?.role?.replace('_', ' ') || 'User'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-300" />
              </button>

              {isUserMenuOpen && (
                <div id="user-menu" role="menu" className="absolute right-0 mt-2 w-48 glass-effect rounded-md shadow-lg border border-[hsl(var(--border))] z-50">
                  <div className="py-1">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                    </Button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[hsl(var(--accent))] transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
