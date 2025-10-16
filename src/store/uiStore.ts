import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Theme state
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Dashboard view state
  dashboardView: 'grid' | 'list' | 'table'
  setDashboardView: (view: 'grid' | 'list' | 'table') => void

  // Pagination state
  pageSize: number
  setPageSize: (size: number) => void

  // Modal state
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void

  // Loading states
  loading: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void

  // Error states
  errors: Record<string, string | null>
  setError: (key: string, error: string | null) => void
  clearError: (key: string) => void
  clearAllErrors: () => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void

  // Filters state
  filters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void

  // Selected items state
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  addSelectedItem: (item: string) => void
  removeSelectedItem: (item: string) => void
  clearSelectedItems: () => void
  toggleSelectedItem: (item: string) => void

  // Viewport state
  viewport: {
    width: number
    height: number
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }
  setViewport: (width: number, height: number) => void

  // Reset all state
  reset: () => void
}

const initialState = {
  sidebarOpen: true,
  theme: 'system' as const,
  dashboardView: 'grid' as const,
  pageSize: 10,
  modals: {},
  loading: {},
  errors: {},
  searchQuery: '',
  filters: {},
  selectedItems: [],
  viewport: {
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  },
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Dashboard view actions
      setDashboardView: (view) => set({ dashboardView: view }),

      // Pagination actions
      setPageSize: (size) => set({ pageSize: size }),

      // Modal actions
      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),
      closeAllModals: () => set({ modals: {} }),

      // Loading actions
      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),

      // Error actions
      setError: (key, error) =>
        set((state) => ({
          errors: { ...state.errors, [key]: error },
        })),
      clearError: (key) =>
        set((state) => {
          const newErrors = { ...state.errors }
          delete newErrors[key]
          return { errors: newErrors }
        }),
      clearAllErrors: () => set({ errors: {} }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearSearch: () => set({ searchQuery: '' }),

      // Filter actions
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilter: (key) =>
        set((state) => {
          const newFilters = { ...state.filters }
          delete newFilters[key]
          return { filters: newFilters }
        }),
      clearAllFilters: () => set({ filters: {} }),

      // Selected items actions
      setSelectedItems: (items) => set({ selectedItems: items }),
      addSelectedItem: (item) =>
        set((state) => ({
          selectedItems: [...state.selectedItems, item],
        })),
      removeSelectedItem: (item) =>
        set((state) => ({
          selectedItems: state.selectedItems.filter((i) => i !== item),
        })),
      clearSelectedItems: () => set({ selectedItems: [] }),
      toggleSelectedItem: (item) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(item)
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((i) => i !== item)
              : [...state.selectedItems, item],
          }
        }),

      // Viewport actions
      setViewport: (width, height) =>
        set({
          viewport: {
            width,
            height,
            isMobile: width < 768,
            isTablet: width >= 768 && width < 1024,
            isDesktop: width >= 1024,
          },
        }),

      // Reset action
      reset: () => set(initialState),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        dashboardView: state.dashboardView,
        pageSize: state.pageSize,
      }),
    }
  )
)

// Helper hooks for common UI operations
export const useSidebar = () => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore()
  return { sidebarOpen, setSidebarOpen, toggleSidebar }
}

export const useTheme = () => {
  const { theme, setTheme } = useUIStore()
  return { theme, setTheme }
}

export const useModal = (modalId: string) => {
  const { modals, openModal, closeModal } = useUIStore()
  const isOpen = modals[modalId] || false
  return { isOpen, open: () => openModal(modalId), close: () => closeModal(modalId) }
}

export const useLoading = (key: string) => {
  const { loading, setLoading } = useUIStore()
  const isLoading = loading[key] || false
  return { isLoading, setLoading: (loading: boolean) => setLoading(key, loading) }
}

export const useError = (key: string) => {
  const { errors, setError, clearError } = useUIStore()
  const error = errors[key] || null
  return { error, setError: (error: string | null) => setError(key, error), clearError: () => clearError(key) }
}
