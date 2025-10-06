"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { MapPin, Calendar, Search, Filter } from "lucide-react"
import { useBerthsStore } from "@/store/berths"
import { Berth, Pier } from "@/lib/berths"
import { MockBooking } from "@/lib/mock"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BerthsTableProps {
  onBerthClick?: (berth: Berth) => void
  selectedBerthId?: string
  bookings?: MockBooking[]
}

export function BerthsTable({ 
  onBerthClick,
  selectedBerthId,
  bookings = []
}: BerthsTableProps) {
  const [dateDialogOpen, setDateDialogOpen] = useState(false)
  const [berthForDate, setBerthForDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState("")
  
  const { 
    getVisibleBerths, 
    setBerthStatus, 
    setSelectedPier, 
    setSearchQuery,
    setStatusFilter,
    selectedPier,
    searchQuery,
    statusFilter
  } = useBerthsStore()

  // Get all berths and apply filters
  const allBerths = getVisibleBerths()
  
  // Filter to only show berths that are on the map (berths 1-125)
  const mapBerths = allBerths.filter(berth => {
    const berthNumber = parseInt(berth.id)
    return !isNaN(berthNumber) && berthNumber >= 1 && berthNumber <= 125
  })
  
  const filteredBerths = mapBerths.sort((a, b) => {
    // Sort by numerical order of berth IDs
    const aNum = parseInt(a.id)
    const bNum = parseInt(b.id)
    return aNum - bNum
  })


  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleAreaFilterChange = (pier: string) => {
    if (pier === "all") {
      setSelectedPier("all")
    } else {
      setSelectedPier(pier as Pier)
    }
  }

  // Get bookings for a specific berth
  const getBerthBookings = (berthId: string) => {
    return bookings.filter(booking => booking.spot_id === berthId)
  }

  const handleOptagetClick = (berthId: string) => {
    setBerthForDate(berthId)
    setDateDialogOpen(true)
  }

  const handleDateConfirm = () => {
    if (berthForDate && endDate) {
      setBerthStatus(berthForDate, "booked", endDate)
      console.log(`Berth ${berthForDate} marked as occupied until ${endDate}`)
      setDateDialogOpen(false)
      setBerthForDate(null)
      setEndDate("")
    }
  }

  const handleDateCancel = () => {
    setDateDialogOpen(false)
    setBerthForDate(null)
    setEndDate("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Pladser (live)
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søg på plads-kode..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                <SelectItem value="available">Ledig</SelectItem>
                <SelectItem value="booked">Optaget</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPier} onValueChange={handleAreaFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Område" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle områder</SelectItem>
                <SelectItem value="Bro 3">Bro 3</SelectItem>
                <SelectItem value="Bro 4">Bro 4</SelectItem>
                <SelectItem value="Bro 5">Bro 5</SelectItem>
                <SelectItem value="Bro 6">Bro 6</SelectItem>
                <SelectItem value="Bro 7">Bro 7</SelectItem>
                <SelectItem value="Bro 8">Bro 8</SelectItem>
                <SelectItem value="Bro 9">Bro 9</SelectItem>
                <SelectItem value="Bro 11">Bro 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Plads
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Bro
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Kommende bookinger
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBerths.map((berth) => (
                  <tr 
                    key={berth.id} 
                    id={`berth-row-${berth.id}`}
                    className={`
                      border-b transition-colors hover:bg-muted/50 cursor-pointer
                      ${selectedBerthId === berth.id ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                    onClick={() => onBerthClick?.(berth)}
                  >
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{berth.id}</div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="text-sm font-medium">{berth.pier}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="space-y-1">
                        <StatusBadge 
                          status={
                            berth.status === "available" ? "ledig" : 
                            "optaget"
                          } 
                        />
                        {berth.status === "booked" && berth.endDate && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ledig fra: {(() => {
                              const endDate = new Date(berth.endDate)
                              endDate.setDate(endDate.getDate() + 1) // Add 1 day
                              return endDate.toLocaleDateString('da-DK')
                            })()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="space-y-1">
                        {getBerthBookings(berth.id).map((booking) => (
                          <div key={booking.id} className="text-xs text-muted-foreground">
                            <div className="font-medium text-foreground">{booking.guest_name}</div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(booking.start_at).toLocaleDateString('da-DK')} - {new Date(booking.end_at).toLocaleDateString('da-DK')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {getBerthBookings(berth.id).length === 0 && (
                          <span className="text-xs text-muted-foreground">Ingen bookinger</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant={berth.status === "available" ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation()
                            setBerthStatus(berth.id, "available")
                          }}
                          className={`text-xs ${
                            berth.status === "available" 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "border-green-600 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          Ledig
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={berth.status === "booked" ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation()
                              setBerthStatus(berth.id, "booked")
                            }}
                            className={`text-xs flex-1 ${
                              berth.status === "booked" 
                                ? "bg-red-600 hover:bg-red-700 text-white" 
                                : "border-red-600 text-red-600 hover:bg-red-50"
                            }`}
                          >
                            Optaget
                          </Button>
                          {berth.status === "booked" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOptagetClick(berth.id)
                              }}
                              className="text-xs px-2"
                              title="Sæt slutdato"
                            >
                              📅
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredBerths.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ingen pladser fundet</p>
            <p className="text-sm">Prøv at ændre søgekriterierne</p>
          </div>
        )}
      </CardContent>
      
      {/* Date Input Dialog */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Markér plads som optaget</DialogTitle>
            <DialogDescription>
              Vælg en slutdato for hvornår pladsen skal blive ledig igen.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right cursor-pointer">
                Slutdato
              </label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => {
                  e.currentTarget.showPicker?.()
                }}
                className="col-span-3 cursor-pointer hover:bg-muted/50 transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDateCancel}>
              Annuller
            </Button>
            <Button 
              onClick={handleDateConfirm}
              disabled={!endDate}
              className="bg-red-600 hover:bg-red-700"
            >
              Markér som optaget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
