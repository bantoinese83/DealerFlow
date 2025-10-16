'use client'

import { useState, useMemo } from 'react'
import { VehicleCard } from './VehicleCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/common/utils'
import { 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List,
  Download,
  RefreshCw,
  Car,
  SlidersHorizontal
} from 'lucide-react'
import type { Vehicle } from '@/common/types'

interface VehicleListProps {
  vehicles: Vehicle[]
  isLoading?: boolean
  error?: Error | null
  onVehicleSelect?: (vehicle: Vehicle) => void
  onRefresh?: () => void
  onScrapeNew?: () => void
  selectedVehicleId?: string
  showFilters?: boolean
  showActions?: boolean
}

export function VehicleList({ 
  vehicles = [],
  isLoading = false,
  error = null,
  onVehicleSelect, 
  onRefresh,
  onScrapeNew,
  selectedVehicleId, 
  showFilters = true, 
  showActions = true 
}: VehicleListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [makeFilter, setMakeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' })
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'year' | 'make'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(search) ||
        vehicle.model.toLowerCase().includes(search) ||
        vehicle.year.toString().includes(search) ||
        vehicle.vin.toLowerCase().includes(search) ||
        (vehicle.trim && vehicle.trim.toLowerCase().includes(search))
      )
    }

    // Make filter
    if (makeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.make === makeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.availability_status === statusFilter)
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(vehicle => {
        if (!vehicle.price) return false
        const min = priceRange.min ? parseInt(priceRange.min) : 0
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity
        return vehicle.price >= min && vehicle.price <= max
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'price':
          aValue = a.price || 0
          bValue = b.price || 0
          break
        case 'year':
          aValue = a.year || 0
          bValue = b.year || 0
          break
        case 'make':
          aValue = a.make || ''
          bValue = b.make || ''
          break
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [vehicles, searchTerm, makeFilter, statusFilter, priceRange, sortBy, sortOrder])

  const makes = useMemo(() => {
    const uniqueMakes = [...new Set(vehicles.map(v => v.make))].filter(Boolean).sort()
    return uniqueMakes
  }, [vehicles])

  const statusOptions = [
    { value: 'all', label: 'All Vehicles', count: vehicles.length },
    { value: 'in_stock', label: 'In Stock', count: vehicles.filter(v => v.availability_status === 'in_stock').length },
    { value: 'sold', label: 'Sold', count: vehicles.filter(v => v.availability_status === 'sold').length },
    { value: 'pending', label: 'Pending', count: vehicles.filter(v => v.availability_status === 'pending').length },
  ]

  const handleVehicleClick = (vehicle: Vehicle) => {
    onVehicleSelect?.(vehicle)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <RefreshCw className="h-8 w-8 mx-auto mb-2" />
          <p>Failed to load vehicles</p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h2>
          <p className="text-gray-600">
            {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onScrapeNew}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Scrape New
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Make Filter */}
            <div className="lg:w-48">
              <select
                value={makeFilter}
                onChange={(e) => setMakeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Makes</option>
                {makes.map(make => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as typeof sortBy)
                  setSortOrder(order as typeof sortOrder)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="price-desc">Price High to Low</option>
                <option value="price-asc">Price Low to High</option>
                <option value="year-desc">Year Newest</option>
                <option value="year-asc">Year Oldest</option>
                <option value="make-asc">Make A-Z</option>
                <option value="make-desc">Make Z-A</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Price Range:</label>
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md",
                  viewMode === 'grid' 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md",
                  viewMode === 'list' 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Car className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-600">
              {searchTerm || makeFilter !== 'all' || statusFilter !== 'all' || priceRange.min || priceRange.max
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by scraping vehicle data or adding vehicles manually.'
              }
            </p>
          </div>
          {showActions && (
            <div className="flex items-center justify-center space-x-3">
              <Button onClick={onScrapeNew} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Scrape Vehicles
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Vehicles Grid/List */}
      {!isLoading && filteredVehicles.length > 0 && (
        <div className={cn(
          "space-y-4",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        )}>
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleVehicleClick(vehicle)}
              className={cn(
                "cursor-pointer transition-all",
                selectedVehicleId === vehicle.id && "ring-2 ring-blue-500 rounded-lg"
              )}
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
