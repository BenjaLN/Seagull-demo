"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDateTime, formatCurrency } from "@/lib/format"
import { Calendar, Phone, MapPin, Ship, Plus } from "lucide-react"
import { MockBooking } from "@/lib/mock"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingsListProps {
  bookings: MockBooking[]
  onCancel?: (bookingId: string) => void
  onBerthClick?: (berthId: string) => void
  onCreateBooking?: (booking: Omit<MockBooking, 'id' | 'created_at' | 'updated_at'>) => void
}

export function BookingsList({ 
  bookings, 
  onCancel, 
  onBerthClick,
  onCreateBooking
}: BookingsListProps) {
  const [statusFilter] = useState<string>("all")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [newBookingDialogOpen, setNewBookingDialogOpen] = useState(false)
  const [newBooking, setNewBooking] = useState({
    spot_id: "",
    guest_name: "",
    guest_phone: "",
    start_at: "",
    end_at: "",
    status: "reserved" as const,
    payment_status: "paid" as const,
    amount: 0,
    boat_name: "",
    boat_length: 0,
    boat_width: 0
  })

  const filteredBookings = bookings.filter(booking => 
    statusFilter === "all" || booking.status === statusFilter
  )

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = () => {
    if (bookingToCancel) {
      onCancel?.(bookingToCancel)
      setCancelDialogOpen(false)
      setBookingToCancel(null)
    }
  }

  const handleCancelCancel = () => {
    setCancelDialogOpen(false)
    setBookingToCancel(null)
  }

  const handleNewBookingClick = () => {
    setNewBookingDialogOpen(true)
  }

  const handleNewBookingSubmit = () => {
    if (onCreateBooking && newBooking.spot_id && newBooking.guest_name && newBooking.start_at && newBooking.end_at) {
      onCreateBooking(newBooking)
      setNewBookingDialogOpen(false)
      setNewBooking({
        spot_id: "",
        guest_name: "",
        guest_phone: "",
        start_at: "",
        end_at: "",
        status: "reserved" as const,
        payment_status: "paid" as const,
        amount: 0,
        boat_name: "",
        boat_length: 0,
        boat_width: 0
      })
    }
  }

  const handleNewBookingCancel = () => {
    setNewBookingDialogOpen(false)
    setNewBooking({
      spot_id: "",
      guest_name: "",
      guest_phone: "",
      start_at: "",
      end_at: "",
      status: "reserved" as const,
      payment_status: "paid" as const,
      amount: 0,
      boat_name: "",
      boat_length: 0,
      boat_width: 0
    })
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kommende bookinger
          </CardTitle>
          <Button onClick={handleNewBookingClick} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tilføj booking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="border rounded-lg p-4 bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{booking.guest_name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {booking.guest_phone}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatDateTime(booking.start_at)} - {formatDateTime(booking.end_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <button
                      onClick={() => onBerthClick?.(booking.spot_id)}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                    >
                      Plads {booking.spot_id}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ship className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{booking.boat_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Længde: {booking.boat_length}m</span>
                    <span>•</span>
                    <span>Bredde: {booking.boat_width}m</span>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-2">
                  <div className="text-lg font-semibold">
                    {formatCurrency(booking.amount)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelClick(booking.id)
                    }}
                    className="text-xs border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Annuller booking
                  </Button>
                </div>

              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ingen bookinger fundet</p>
              <p className="text-sm">Alle bookinger er afsluttet eller annulleret</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuller booking</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på, at du vil annullere denne booking? Denne handling kan ikke fortrydes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCancel}>
              Fortryd
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Annuller booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* New Booking Dialog */}
      <Dialog open={newBookingDialogOpen} onOpenChange={setNewBookingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tilføj ny booking</DialogTitle>
            <DialogDescription>
              Opret en ny booking for en gæst.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spot_id">Plads nummer</Label>
                <Input
                  id="spot_id"
                  value={newBooking.spot_id}
                  onChange={(e) => setNewBooking({...newBooking, spot_id: e.target.value})}
                  placeholder="f.eks. 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest_name">Gæstens navn</Label>
                <Input
                  id="guest_name"
                  value={newBooking.guest_name}
                  onChange={(e) => setNewBooking({...newBooking, guest_name: e.target.value})}
                  placeholder="f.eks. Erik Sørensen"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest_phone">Telefon</Label>
                <Input
                  id="guest_phone"
                  value={newBooking.guest_phone}
                  onChange={(e) => setNewBooking({...newBooking, guest_phone: e.target.value})}
                  placeholder="+45 12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boat_name">Bådnavn</Label>
                <Input
                  id="boat_name"
                  value={newBooking.boat_name}
                  onChange={(e) => setNewBooking({...newBooking, boat_name: e.target.value})}
                  placeholder="f.eks. Nordlys"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="boat_length">Længde (m)</Label>
                <Input
                  id="boat_length"
                  type="number"
                  step="0.1"
                  value={newBooking.boat_length}
                  onChange={(e) => setNewBooking({...newBooking, boat_length: parseFloat(e.target.value) || 0})}
                  placeholder="12.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boat_width">Bredde (m)</Label>
                <Input
                  id="boat_width"
                  type="number"
                  step="0.1"
                  value={newBooking.boat_width}
                  onChange={(e) => setNewBooking({...newBooking, boat_width: parseFloat(e.target.value) || 0})}
                  placeholder="3.8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Beløb (DKK)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newBooking.amount}
                  onChange={(e) => setNewBooking({...newBooking, amount: parseFloat(e.target.value) || 0})}
                  placeholder="700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_at">Startdato</Label>
                <Input
                  id="start_at"
                  type="date"
                  value={newBooking.start_at}
                  onChange={(e) => setNewBooking({...newBooking, start_at: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_at">Slutdato</Label>
                <Input
                  id="end_at"
                  type="date"
                  value={newBooking.end_at}
                  onChange={(e) => setNewBooking({...newBooking, end_at: e.target.value})}
                  min={newBooking.start_at || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleNewBookingCancel}>
              Annuller
            </Button>
            <Button 
              onClick={handleNewBookingSubmit}
              disabled={!newBooking.spot_id || !newBooking.guest_name || !newBooking.start_at || !newBooking.end_at}
            >
              Opret booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}






