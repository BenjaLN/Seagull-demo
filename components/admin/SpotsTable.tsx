"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./StatusBadge"
import { formatDateTime } from "@/lib/format"
import { MapPin, Calendar, Clock, MoreHorizontal, Search, Filter } from "lucide-react"
import { MockSpot } from "@/lib/mock"

interface SpotsTableProps {
  spots: MockSpot[]
  onSpotClick?: (spot: MockSpot) => void
  onStatusChange?: (spotId: string) => void
  onCreateBooking?: (spotId: string) => void
  onDetails?: (spotId: string) => void
  selectedSpotId?: string
}

export function SpotsTable({ 
  spots, 
  onSpotClick, 
  onStatusChange, 
  onCreateBooking, 
  onDetails,
  selectedSpotId
}: SpotsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [areaFilter, setAreaFilter] = useState<string>("all")

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || spot.current_status === statusFilter
    const matchesArea = areaFilter === "all" || spot.code.startsWith(areaFilter)
    
    return matchesSearch && matchesStatus && matchesArea
  })

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <SelectItem value="ledig">Ledig</SelectItem>
                <SelectItem value="reserveret">Reserveret</SelectItem>
                <SelectItem value="optaget">Optaget</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Område" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle områder</SelectItem>
                <SelectItem value="A">Bro A</SelectItem>
                <SelectItem value="B">Bro B</SelectItem>
                <SelectItem value="C">Bro C</SelectItem>
                <SelectItem value="D">Bro D</SelectItem>
                <SelectItem value="E">Bro E</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Plads
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Forventet hjemkomst
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Sidst opdateret
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSpots.map((spot) => (
                  <tr 
                    key={spot.id} 
                    className={`
                      border-b transition-colors hover:bg-muted/50 cursor-pointer
                      ${selectedSpotId === spot.id ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                    onClick={() => onSpotClick?.(spot)}
                  >
                    <td className="p-4 align-middle">
                      <div>
                        <div className="font-medium">{spot.code}</div>
                        {spot.name && (
                          <div className="text-sm text-muted-foreground">{spot.name}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={spot.current_status} />
                    </td>
                    <td className="p-4 align-middle">
                      {spot.expected_return_at ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDateTime(spot.expected_return_at)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateTime(spot.updated_at)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onStatusChange?.(spot.id)
                          }}
                        >
                          Skift status
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCreateBooking?.(spot.id)
                          }}
                        >
                          Opret booking
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDetails?.(spot.id)
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredSpots.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Ingen pladser fundet</p>
            <p className="text-sm">Prøv at ændre søgekriterierne</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}






