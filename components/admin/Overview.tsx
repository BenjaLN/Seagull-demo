"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/format"
import { BarChart3, TrendingUp, Calendar, MapPin } from "lucide-react"
import { MockBooking } from "@/lib/mock"

interface OverviewProps {
  bookings: MockBooking[]
}

type TimeFilter = "day" | "month" | "year"

export function Overview({ bookings }: OverviewProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month")
  const [selectedBerth, setSelectedBerth] = useState<string>("all")

  // Get unique berth IDs for filter
  const berthIds = useMemo(() => {
    const ids = [...new Set(bookings.map(booking => booking.spot_id))]
    return ids.sort((a, b) => parseInt(a) - parseInt(b))
  }, [bookings])

  // Filter bookings based on time and berth
  const filteredBookings = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (timeFilter) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0)
    }

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.created_at)
      const berthMatch = selectedBerth === "all" || booking.spot_id === selectedBerth
      const timeMatch = bookingDate >= startDate
      return berthMatch && timeMatch
    })
  }, [bookings, timeFilter, selectedBerth])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBookings = filteredBookings.length
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0)
    const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // Berth performance
    const berthPerformance = filteredBookings.reduce((acc, booking) => {
      const berthId = booking.spot_id
      if (!acc[berthId]) {
        acc[berthId] = { bookings: 0, revenue: 0 }
      }
      acc[berthId].bookings += 1
      acc[berthId].revenue += booking.amount
      return acc
    }, {} as Record<string, { bookings: number; revenue: number }>)

    // Sort berths by revenue
    const sortedBerths = Object.entries(berthPerformance)
      .map(([berthId, data]) => ({ berthId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      totalBookings,
      totalRevenue,
      averageRevenue,
      berthPerformance: sortedBerths
    }
  }, [filteredBookings])

  const getTimeFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case "day": return "I dag"
      case "month": return "Denne måned"
      case "year": return "Dette år"
      default: return "Alle"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Oversigt
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">I dag</SelectItem>
                <SelectItem value="month">Denne måned</SelectItem>
                <SelectItem value="year">Dette år</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Bookinger</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalBookings}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Omsætning</p>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Gennemsnit</p>
                  <p className="text-2xl font-bold text-purple-800">{formatCurrency(stats.averageRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Berth Performance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Plads performance</h3>
              <Select value={selectedBerth} onValueChange={setSelectedBerth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle pladser</SelectItem>
                  {berthIds.map(berthId => (
                    <SelectItem key={berthId} value={berthId}>
                      Plads {berthId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {stats.berthPerformance.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {stats.berthPerformance.map(({ berthId, bookings, revenue }) => (
                  <div key={berthId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Plads {berthId}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">{bookings} bookinger</span>
                      <span className="font-semibold text-green-600">{formatCurrency(revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingen bookinger fundet for {getTimeFilterLabel(timeFilter).toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
