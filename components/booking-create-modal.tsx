"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { SpotWithAvailability } from "@/lib/types"
import { Calendar, User, Phone } from "lucide-react"

interface BookingCreateModalProps {
  spot: SpotWithAvailability | null
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    spotId: string
    guestName: string
    guestPhone: string
    startAt: string
    endAt: string
  }) => void
}

export function BookingCreateModal({ spot, isOpen, onClose, onCreate }: BookingCreateModalProps) {
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  const handleCreate = () => {
    if (!spot || !guestName || !guestPhone || !startAt || !endAt) return
    
    onCreate({
      spotId: spot.id,
      guestName,
      guestPhone,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
    })
    
    handleClose()
  }

  const handleClose = () => {
    setGuestName('')
    setGuestPhone('')
    setStartAt('')
    setEndAt('')
    onClose()
  }

  if (!spot) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Opret booking for {spot.code}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Gæstens navn</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="pl-10"
                placeholder="Indtast navn"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Telefonnummer</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="guestPhone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="pl-10"
                placeholder="+45 12345678"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startAt">Fra</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="startAt"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endAt">Til</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="endAt"
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annullér
          </Button>
          <Button onClick={handleCreate}>
            Opret booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}






