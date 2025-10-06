import { Badge } from "@/components/ui/badge"
import { SpotStatus, BookingStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: SpotStatus | BookingStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: SpotStatus | BookingStatus) => {
    switch (status) {
      case 'ledig':
      case 'checked_out':
        return 'success'
      case 'reserveret':
      case 'reserved':
        return 'warning'
      case 'optaget':
      case 'checked_in':
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
        return 'Optaget'
      case 'reserved':
        return 'Reserveret'
      case 'checked_in':
        return 'Checked-in'
      case 'checked_out':
        return 'Check-out'
      case 'cancelled':
        return 'Annulleret'
      default:
        return status
    }
  }

  return (
    <Badge 
      variant={getVariant(status)} 
      className={className}
    >
      {getLabel(status)}
    </Badge>
  )
}






