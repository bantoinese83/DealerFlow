'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/common/utils'
import { 
  Car, 
  Calendar, 
  DollarSign, 
  Gauge, 
  MapPin,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import type { Vehicle } from '@/common/types'

interface VehicleCardProps {
  vehicle: Vehicle
  onUpdate?: (vehicle: Vehicle) => void
  onDelete?: (vehicleId: string) => void
  onRefresh?: (vehicleId: string) => void
}

export function VehicleCard({ vehicle, onUpdate, onDelete, onRefresh }: VehicleCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getAvailabilityColor = (status: Vehicle['availability_status']) => {
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

  const getAvailabilityIcon = (status: Vehicle['availability_status']) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="h-4 w-4" />
      case 'sold':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getImageUrl = () => {
    if (vehicle.image_urls && vehicle.image_urls.length > 0) {
      return vehicle.image_urls[0]
    }
    return '/placeholder-vehicle.jpg'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Vehicle Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={getImageUrl()}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-vehicle.jpg'
          }}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getAvailabilityColor(vehicle.availability_status)
          )}>
            {getAvailabilityIcon(vehicle.availability_status)}
            <span className="ml-1 capitalize">
              {vehicle.availability_status.replace('_', ' ')}
            </span>
          </span>
        </div>

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <Link href={`/inventory/${vehicle.id}`}>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      View Details
                    </button>
                  </Link>
                  
                  <button
                    onClick={() => onRefresh?.(vehicle.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <RefreshCw className="h-4 w-4 inline mr-2" />
                    Refresh Data
                  </button>
                  
                  <button
                    onClick={() => window.open(vehicle.scraped_url, '_blank')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ExternalLink className="h-4 w-4 inline mr-2" />
                    View Source
                  </button>
                  
                  <button
                    onClick={() => onDelete?.(vehicle.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Remove from Inventory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-sm text-gray-600">{vehicle.trim}</p>
          )}
          <p className="text-sm text-gray-500">VIN: {vehicle.vin}</p>
        </div>

        {/* Key Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Price</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Gauge className="h-4 w-4 mr-2" />
              <span>Mileage</span>
            </div>
            <span className="text-sm text-gray-900">
              {vehicle.mileage ? `${formatMileage(vehicle.mileage)} mi` : 'N/A'}
            </span>
          </div>

          {vehicle.last_scraped_at && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Last Updated</span>
              </div>
              <span className="text-sm text-gray-900">
                {formatDate(vehicle.last_scraped_at)}
              </span>
            </div>
          )}
        </div>

        {/* Additional Details */}
        {vehicle.details_json && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
            <div className="flex flex-wrap gap-1">
              {Object.entries(vehicle.details_json).slice(0, 3).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {key}: {String(value)}
                </span>
              ))}
              {Object.keys(vehicle.details_json).length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  +{Object.keys(vehicle.details_json).length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Car className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {vehicle.availability_status === 'in_stock' ? 'Available Now' : 
               vehicle.availability_status === 'sold' ? 'Sold' : 'Pending'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
