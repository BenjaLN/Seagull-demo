"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBerthsStore } from "@/store/berths"
import { getAllPiers, Pier, BerthStatus } from "@/lib/berths"
import { Search, Filter, RotateCcw, CheckCircle, XCircle } from "lucide-react"

export function BerthControls() {
  const {
    selectedPier,
    searchQuery,
    getVisibleBerths,
    setBerthStatus,
    setAllVisibleStatus,
    setSelectedPier,
    setSearchQuery,
    resetBerths
  } = useBerthsStore()

  const [selectedBerth, setSelectedBerth] = useState<string | null>(null)
  const visibleBerths = getVisibleBerths()
  const allPiers = getAllPiers()

  const handleStatusToggle = (berthId: string, currentStatus: BerthStatus) => {
    const newStatus: BerthStatus = currentStatus === "available" ? "occupied" : "available"
    setBerthStatus(berthId, newStatus)
  }

  const handleSetAllGreen = () => {
    setAllVisibleStatus("available")
  }

  const handleSetAllRed = () => {
    setAllVisibleStatus("occupied")
  }

  const getStatusColor = (status: BerthStatus) => {
    return status === "available" ? "success" : "destructive"
  }

  const getStatusLabel = (status: BerthStatus) => {
    return status === "available" ? "Ledig" : "Optaget"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Berth Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pier Filter</label>
            <Select value={selectedPier} onValueChange={(value: Pier | "all") => setSelectedPier(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Piers</SelectItem>
                {allPiers.map(pier => (
                  <SelectItem key={pier} value={pier}>{pier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search Berth ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search berth ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bulk Actions</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSetAllGreen}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
              Set All Green
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSetAllRed}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4 text-red-600" />
              Set All Red
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetBerths}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Berth List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Visible Berths ({visibleBerths.length})</label>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-1">
            {visibleBerths.map((berth) => (
              <div
                key={berth.id}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                  selectedBerth === berth.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedBerth(berth.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{berth.id}</div>
                  <div className="text-xs text-gray-500">{berth.pier}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(berth.status)}>
                    {getStatusLabel(berth.status)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusToggle(berth.id, berth.status)
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {berth.status === "available" ? "🔴" : "🟢"}
                  </Button>
                </div>
              </div>
            ))}
            
            {visibleBerths.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No berths found
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {visibleBerths.filter(b => b.status === "available").length}
              </div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {visibleBerths.filter(b => b.status === "occupied").length}
              </div>
              <div className="text-xs text-gray-500">Occupied</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}






