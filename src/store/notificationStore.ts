import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: Notification = {
          ...notification,
          id,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))

        // Auto-remove notification after duration
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration)
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      },

      clearAllNotifications: () => {
        set({ notifications: [] })
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)

// Helper functions for common notification types
export const notificationHelpers = {
  success: (title: string, message: string, duration = 5000) => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      title,
      message,
      duration,
    })
  },

  error: (title: string, message: string, duration = 0) => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration,
    })
  },

  warning: (title: string, message: string, duration = 7000) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      duration,
    })
  },

  info: (title: string, message: string, duration = 5000) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title,
      message,
      duration,
    })
  },
}
