"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { SpotWithAvailability } from "@/lib/types"
import { Calendar } from "lucide-react"

interface StatusChangeModalProps {
  spot: SpotWithAvailability | null
  isOpen: boolean
  onClose: () => void
  onSave: (spotId: string, status: 'ledig' | 'optaget', expectedReturnAt?: string) => void
}

export function StatusChangeModal({ spot, isOpen, onClose, onSave }: StatusChangeModalProps) {
  const [status, setStatus] = useState<'ledig' | 'optaget'>('ledig')
  const [expectedReturnAt, setExpectedReturnAt] = useState('')

  const handleSave = () => {
    if (!spot) return
    
    const returnDate = status === 'ledig' && expectedReturnAt 
      ? new Date(expectedReturnAt).toISOString()
      : undefined
    
    onSave(spot.id, status, returnDate)
    onClose()
  }

  const handleClose = () => {
    setStatus('ledig')
    setExpectedReturnAt('')
    onClose()
  }

  if (!spot) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Skift status for {spot.code}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="ledig"
                  checked={status === 'ledig'}
                  onChange={(e) => setStatus(e.target.value as 'ledig')}
                />
                <span>Ledig</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="optaget"
                  checked={status === 'optaget'}
                  onChange={(e) => setStatus(e.target.value as 'optaget')}
                />
                <span>Optaget</span>
              </label>
            </div>
          </div>
          
          {status === 'ledig' && (
            <div className="space-y-2">
              <Label htmlFor="expectedReturnAt">Forventet hjemkomst</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expectedReturnAt"
                  type="datetime-local"
                  value={expectedReturnAt}
                  onChange={(e) => setExpectedReturnAt(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annullér
          </Button>
          <Button onClick={handleSave}>
            Gem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}






