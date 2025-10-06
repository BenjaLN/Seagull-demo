"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MockSpot } from "@/lib/mock"
import { Calendar, User, Phone } from "lucide-react"

interface CreateBookingModalProps {
  spot: MockSpot | null
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

export function CreateBookingModal({ spot, isOpen, onClose, onCreate }: CreateBookingModalProps) {
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setGuestName('')
      setGuestPhone('')
      setStartAt('')
      setEndAt('')
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!guestName.trim()) {
      newErrors.guestName = 'Navn er påkrævet'
    }
    
    if (!guestPhone.trim()) {
      newErrors.guestPhone = 'Telefonnummer er påkrævet'
    } else if (!/^\+?[\d\s-()]+$/.test(guestPhone)) {
      newErrors.guestPhone = 'Ugyldigt telefonnummer'
    }
    
    if (!startAt) {
      newErrors.startAt = 'Startdato er påkrævet'
    }
    
    if (!endAt) {
      newErrors.endAt = 'Slutdato er påkrævet'
    }
    
    if (startAt && endAt && new Date(startAt) >= new Date(endAt)) {
      newErrors.endAt = 'Slutdato skal være efter startdato'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = () => {
    if (!spot || !validateForm()) return
    
    onCreate({
      spotId: spot.id,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
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
    setErrors({})
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
                className={`pl-10 ${errors.guestName ? 'border-red-500' : ''}`}
                placeholder="Indtast navn"
                required
              />
            </div>
            {errors.guestName && (
              <p className="text-xs text-red-500">{errors.guestName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Telefonnummer</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="guestPhone"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className={`pl-10 ${errors.guestPhone ? 'border-red-500' : ''}`}
                placeholder="+45 12345678"
                required
              />
            </div>
            {errors.guestPhone && (
              <p className="text-xs text-red-500">{errors.guestPhone}</p>
            )}
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
                className={`pl-10 ${errors.startAt ? 'border-red-500' : ''}`}
                required
              />
            </div>
            {errors.startAt && (
              <p className="text-xs text-red-500">{errors.startAt}</p>
            )}
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
                className={`pl-10 ${errors.endAt ? 'border-red-500' : ''}`}
                required
              />
            </div>
            {errors.endAt && (
              <p className="text-xs text-red-500">{errors.endAt}</p>
            )}
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






