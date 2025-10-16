"use client"

import { VehicleList } from '@/components/inventory/VehicleList'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <VehicleList vehicles={[]} />
    </div>
  )
}
