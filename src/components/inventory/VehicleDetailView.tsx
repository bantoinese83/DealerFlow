'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/common/utils'
import { 
  Car, 
  Calendar, 
  DollarSign, 
  Gauge, 
  MapPin,
  ExternalLink,
  RefreshCw,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  Phone,
  Mail
} from 'lucide-react'
import type { Vehicle } from '@/common/types'

interface VehicleDetailViewProps {
  vehicle: Vehicle
  onClose?: () => void
  onUpdate?: (vehicle: Vehicle) => void
  onRefresh?: (vehicleId: string) => void
}

export function VehicleDetailView({ vehicle, onClose, onRefresh }: VehicleDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Vehicle>>({})
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getImageUrl = (index: number) => {
    if (vehicle.image_urls && vehicle.image_urls[index]) {
      return vehicle.image_urls[index]
    }
    return '/placeholder-vehicle.jpg'
  }

  const handleEdit = () => {
    setEditData(vehicle)
    setIsEditing(true)
  }

  const handleSave = async () => {
    // TODO: Implement update logic
    console.log('Saving vehicle:', editData)
    setIsEditing(false)
    setEditData({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleRefresh = () => {
    onRefresh?.(vehicle.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
            <Car className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            {vehicle.trim && (
              <p className="text-sm text-gray-600">{vehicle.trim}</p>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getAvailabilityColor(vehicle.availability_status)
              )}>
                {getAvailabilityIcon(vehicle.availability_status)}
                <span className="ml-1 capitalize">
                  {vehicle.availability_status.replace('_', ' ')}
                </span>
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">VIN: {vehicle.vin}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {onClose && (
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Images */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Images</h3>
            {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={getImageUrl(selectedImageIndex)}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-vehicle.jpg'
                    }}
                  />
                </div>
                
                {vehicle.image_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.image_urls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "relative h-16 rounded-md overflow-hidden border-2",
                          selectedImageIndex === index 
                            ? "border-blue-500" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <img
                          src={url}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-vehicle.jpg'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                <p>No images available</p>
              </div>
            )}
          </Card>

          {/* Vehicle Details */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  {isEditing ? (
                    <Input
                      value={editData.make || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, make: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{vehicle.make}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  {isEditing ? (
                    <Input
                      value={editData.model || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, model: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{vehicle.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.year || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{vehicle.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  {isEditing ? (
                    <Input
                      value={editData.trim || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, trim: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{vehicle.trim || 'N/A'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <p className="text-sm text-gray-900 font-mono">{vehicle.vin}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.mileage || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, mileage: parseInt(e.target.value) }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {vehicle.mileage ? `${formatMileage(vehicle.mileage)} miles` : 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.price || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {vehicle.price ? formatPrice(vehicle.price) : 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {isEditing ? (
                    <select
                      value={editData.availability_status || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, availability_status: e.target.value as Vehicle['availability_status'] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                    </select>
                  ) : (
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getAvailabilityColor(vehicle.availability_status)
                    )}>
                      {getAvailabilityIcon(vehicle.availability_status)}
                      <span className="ml-1 capitalize">
                        {vehicle.availability_status.replace('_', ' ')}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          {vehicle.details_json && Object.keys(vehicle.details_json).length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(vehicle.details_json).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-sm text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Details
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </Card>

          {/* Vehicle Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Vehicle added to inventory</p>
                  <p className="text-xs text-gray-500">{formatDate(vehicle.created_at)}</p>
                </div>
              </div>
              
              {vehicle.last_scraped_at && (
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Last data refresh</p>
                    <p className="text-xs text-gray-500">{formatDate(vehicle.last_scraped_at)}</p>
                  </div>
                </div>
              )}

              {vehicle.scraped_url && (
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Source URL</p>
                    <a 
                      href={vehicle.scraped_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 break-all"
                    >
                      {vehicle.scraped_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
