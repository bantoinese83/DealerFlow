'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  Filter, 
  Plus, 
  Car,
  DollarSign,
  Gauge,
  Calendar,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - in a real app, this would come from API calls
  const vehicles = [
    {
      id: '1',
      vin: '1HGBH41JXMN109186',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      trim: 'Sport',
      mileage: 15000,
      price: 25000,
      availability_status: 'in_stock',
      last_scraped_at: '2024-01-15T10:30:00Z',
      image_urls: ['https://example.com/civic1.jpg', 'https://example.com/civic2.jpg'],
    },
    {
      id: '2',
      vin: '1FTFW1ET5DFC12345',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      trim: 'XLT',
      mileage: 25000,
      price: 45000,
      availability_status: 'in_stock',
      last_scraped_at: '2024-01-14T16:45:00Z',
      image_urls: ['https://example.com/f1501.jpg', 'https://example.com/f1502.jpg'],
    },
    {
      id: '3',
      vin: 'WBAFR9C50BC123456',
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      trim: '330i',
      mileage: 12000,
      price: 42000,
      availability_status: 'sold',
      last_scraped_at: '2024-01-13T09:15:00Z',
      image_urls: ['https://example.com/bmw1.jpg', 'https://example.com/bmw2.jpg'],
    },
    {
      id: '4',
      vin: '1G1ZD5ST8LF123456',
      make: 'Chevrolet',
      model: 'Camaro',
      year: 2023,
      trim: 'SS',
      mileage: 8000,
      price: 38000,
      availability_status: 'pending',
      last_scraped_at: '2024-01-12T14:20:00Z',
      image_urls: ['https://example.com/camaro1.jpg'],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.trim.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.availability_status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] tracking-tight">Vehicle Inventory</h1>
          <p className="text-muted-foreground">Manage your dealership&apos;s vehicle inventory</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Car className="h-4 w-4 mr-2" />
            Scrape Inventory
          </Button>
          <Link href="/inventory/new">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="card overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {vehicle.image_urls.length > 0 ? (
                <img
                  src={vehicle.image_urls[0]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Car className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-600">{vehicle.trim}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.availability_status)}`}>
                  {vehicle.availability_status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-lg text-[hsl(var(--foreground))]">
                    {formatCurrency(vehicle.price)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-2" />
                  <span>{formatMileage(vehicle.mileage)} miles</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Last updated: {formatDate(vehicle.last_scraped_at)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  VIN: {vehicle.vin}
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Link href={`/inventory/${vehicle.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first vehicle or scraping inventory.'
                }
              </p>
              <div className="mt-6 flex justify-center space-x-3">
                <Link href="/inventory/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </Link>
                <Button variant="outline">
                  <Car className="h-4 w-4 mr-2" />
                  Scrape Inventory
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
