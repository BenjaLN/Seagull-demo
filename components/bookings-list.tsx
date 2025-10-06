"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Booking } from "@/lib/types"
import { formatDateTime, formatCurrency } from "@/lib/utils"
import { Calendar, Phone, CreditCard, MoreHorizontal } from "lucide-react"

interface BookingsListProps {
  bookings: Booking[]
  onCheckIn?: (bookingId: string) => void
  onCheckOut?: (bookingId: string) => void
  onCancel?: (bookingId: string) => void
  onDetails?: (bookingId: string) => void
}

export function BookingsList({ 
  bookings, 
  onCheckIn, 
  onCheckOut, 
  onCancel, 
  onDetails 
}: BookingsListProps) {
  const [statusFilter] = useState<string>("all")

  const filteredBookings = bookings.filter(booking => 
    statusFilter === "all" || booking.status === statusFilter
  )

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'refunded':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kommende bookinger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{booking.guest_name}</h4>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {booking.guest_phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDateTime(booking.start_at)} - {formatDateTime(booking.end_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span className={getPaymentStatusColor(booking.payment_status)}>
                        {booking.payment_status === 'paid' ? 'Betalt' : 
                         booking.payment_status === 'pending' ? 'Afventer betaling' : 'Refunderet'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{formatCurrency(booking.amount)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status === 'reserved' && (
                    <Button
                      size="sm"
                      onClick={() => onCheckIn?.(booking.id)}
                    >
                      Check-in
                    </Button>
                  )}
                  {booking.status === 'checked_in' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCheckOut?.(booking.id)}
                    >
                      Check-out
                    </Button>
                  )}
                  {(booking.status === 'reserved' || booking.status === 'checked_in') && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onCancel?.(booking.id)}
                    >
                      Annullér
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDetails?.(booking.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Ingen bookinger fundet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}






