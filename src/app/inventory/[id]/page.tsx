"use client"

import { useParams, useRouter } from 'next/navigation'
import { VehicleDetailView } from '@/components/inventory/VehicleDetailView'
import type { Vehicle } from '@/common/types'
import { Card } from '@/components/ui/Card'

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  if (!id) {
    return (
      <Card className="p-6">Invalid vehicle id</Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* This page expects a full Vehicle; fetch wiring would populate it. For now, render a placeholder minimal object. */}
      <VehicleDetailView vehicle={{ id, dealership_id: '', vin: '', availability_status: 'in_stock', image_urls: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Vehicle} />
    </div>
  )
}


