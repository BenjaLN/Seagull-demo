"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SpotStatus = 'ledig' | 'optaget' | 'reserveret'
type BookingStatus = 'booked' | 'cancelled'

interface StatusBadgeProps {
  status: SpotStatus | BookingStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: SpotStatus | BookingStatus) => {
    switch (status) {
      case 'ledig':
        return 'success'
      case 'reserveret':
        return 'default'
      case 'optaget':
      case 'booked':
        return 'destructive'
      case 'cancelled':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getLabel = (status: SpotStatus | BookingStatus) => {
    switch (status) {
      case 'ledig':
        return 'Ledig'
      case 'reserveret':
        return 'Reserveret'
      case 'optaget':
      case 'booked':
        return 'Optaget'
      case 'cancelled':
        return 'Annulleret'
      default:
        return status
    }
  }

  return (
    <Badge 
      variant={getVariant(status)} 
      className={cn("font-medium", className)}
    >
      {getLabel(status)}
    </Badge>
  )
}






