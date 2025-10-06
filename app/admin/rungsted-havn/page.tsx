"use client"

import { useState, useEffect } from "react"
import { KpiCard } from "@/components/admin/KpiCard"
import { BerthsTable } from "@/components/admin/BerthsTable"
import { AdminMap } from "@/components/admin/AdminMap"
import { BookingsList } from "@/components/admin/BookingsList"
import { Overview } from "@/components/admin/Overview"
import { ChangeStatusModal } from "@/components/admin/ChangeStatusModal"
import { CreateBookingModal } from "@/components/admin/CreateBookingModal"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { mockSpots, mockBookings, mockKPIs, simulateRealtimeUpdates } from "@/lib/mock"
import { MockSpot, MockBooking, MockKPIs } from "@/lib/mock"
import { useBerthsStore } from "@/store/berths"
import { Berth } from "@/lib/berths"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

/**
 * Rungsted Havn Admin Dashboard
 * 
 * How to run:
 * 1. Set USE_MOCK=true in .env.local for mock data (default)
 * 2. Configure Supabase credentials for production
 * 3. Run: npm run dev
 * 4. Visit: http://localhost:3000/admin/rungsted-havn
 * 
 * Features:
 * - Live KPI dashboard with harbor metrics
 * - Interactive spots table with filtering and search
 * - Real-time map with color-coded markers
 * - Booking management with status updates
 * - Status change modals with validation
 * - Responsive design with accessibility
 */

export default function RungstedHavnAdminPage() {
  const [spots, setSpots] = useState<MockSpot[]>([])
  const [bookings, setBookings] = useState<MockBooking[]>(() => {
    // Load bookings from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedBookings = localStorage.getItem('rungsted-bookings')
      if (savedBookings) {
        try {
          return JSON.parse(savedBookings)
        } catch (e) {
          console.error('Failed to parse saved bookings:', e)
        }
      }
    }
    return mockBookings
  })
  const [kpis, setKpis] = useState<MockKPIs>(mockKPIs)
  const [selectedSpot, setSelectedSpot] = useState<MockSpot | null>(null)
  const [selectedBerthId, setSelectedBerthId] = useState<string | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useMock, setUseMock] = useState(true)
  
  // Get berth data from store
  const { getVisibleBerths } = useBerthsStore()

  // Check if we should use mock data
  useEffect(() => {
    // Always use mock data for now
    setUseMock(true)
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && bookings.length > 0) {
      localStorage.setItem('rungsted-bookings', JSON.stringify(bookings))
    }
  }, [bookings])

  // Update berth store whenever bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const { updateBerthsWithBookings } = useBerthsStore.getState()
      updateBerthsWithBookings(bookings)
      console.log('Berth store updated with', bookings.length, 'bookings')
    }
  }, [bookings])

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      if (useMock) {
        // Use mock data
        setSpots(mockSpots)
        // Don't overwrite bookings - they're loaded from localStorage in useState
        setKpis(mockKPIs)
      } else {
        // TODO: Load from Supabase when not using mock
        console.log('Loading from Supabase...')
        setSpots(mockSpots)
        // Don't overwrite bookings - they're loaded from localStorage in useState
        setKpis(mockKPIs)
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [useMock])

  // Set up realtime updates
  useEffect(() => {
    if (useMock) {
      // Simulate realtime updates with mock data
      const cleanup = simulateRealtimeUpdates(setSpots, setBookings, setKpis)
      return cleanup
    } else {
      // TODO: Set up Supabase realtime subscriptions
      console.log('Setting up Supabase realtime...')
    }
  }, [useMock])

  const handleSpotClick = (spot: MockSpot) => {
    setSelectedSpot(spot)
  }

  const handleStatusChange = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId)
    if (spot) {
      setSelectedSpot(spot)
      setIsStatusModalOpen(true)
    }
  }

  const handleCreateBooking = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId)
    if (spot) {
      setSelectedSpot(spot)
      setIsBookingModalOpen(true)
    }
  }

  const handleStatusSave = async (spotId: string, status: 'ledig' | 'optaget', expectedReturnAt?: string) => {
    if (useMock) {
      // Mock update
      setSpots(prev => prev.map(spot => 
        spot.id === spotId 
          ? { 
              ...spot, 
              current_status: status, 
              expected_return_at: expectedReturnAt,
              updated_at: new Date().toISOString()
            }
          : spot
      ))
    } else {
      // TODO: Call API to update spot status
      console.log('Updating spot status via API...')
    }
  }

  const handleBookingCreate = async (data: {
    spotId: string
    guestName: string
    guestPhone: string
    startAt: string
    endAt: string
  }) => {
    if (useMock) {
      // Mock booking creation
      const newBooking: MockBooking = {
        id: `booking-${Date.now()}`,
        spot_id: data.spotId,
        guest_name: data.guestName,
        guest_phone: data.guestPhone,
        start_at: data.startAt,
        end_at: data.endAt,
        status: 'reserved',
        payment_status: 'pending',
        amount: Math.floor(Math.random() * 3000) + 1000, // Random amount
        boat_name: 'Unknown',
        boat_length: 10.0,
        boat_width: 3.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setBookings(prev => [...prev, newBooking])
      setSpots(prev => prev.map(spot => 
        spot.id === data.spotId 
          ? { ...spot, current_status: 'reserveret' as const }
          : spot
      ))
    } else {
      // TODO: Call API to create booking
      console.log('Creating booking via API...')
    }
  }

  const handleCreateBookingFromList = (bookingData: Omit<MockBooking, 'id' | 'created_at' | 'updated_at'>) => {
    if (useMock) {
      // Mock booking creation
      const newBooking: MockBooking = {
        id: `booking-${Date.now()}`,
        ...bookingData,
        status: 'reserved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // Update bookings state
      const updatedBookings = [...bookings, newBooking]
      setBookings(updatedBookings)
      
      // Update berth store with current bookings
      const { updateBerthsWithBookings } = useBerthsStore.getState()
      updateBerthsWithBookings(updatedBookings)
      
      console.log(`New booking created: ${newBooking.guest_name} for berth ${newBooking.spot_id}`)
    } else {
      // TODO: Call API to create booking
      console.log('Creating booking via API...')
    }
  }

  const handleBookingStatusUpdate = async (bookingId: string, status: 'checked_in' | 'checked_out' | 'cancelled') => {
    if (useMock) {
      if (status === 'cancelled') {
        // Actually delete the booking
        const bookingToDelete = bookings.find(b => b.id === bookingId)
        setBookings(prev => prev.filter(booking => booking.id !== bookingId))
        
        // Update spot status to available
        if (bookingToDelete) {
          setSpots(prev => prev.map(spot => 
            spot.id === bookingToDelete.spot_id
              ? { ...spot, current_status: 'ledig' as const }
              : spot
          ))
        }
        
        // Update berth store to reflect cancelled bookings
        const { updateBerthsWithBookings } = useBerthsStore.getState()
        updateBerthsWithBookings(bookings.filter(booking => booking.id !== bookingId))
      } else {
        // Mock status update for other statuses
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, updated_at: new Date().toISOString() }
            : booking
        ))
        
        // Update spot status if booking is checked in/out
        if (status === 'checked_in') {
          setSpots(prev => prev.map(spot => 
            spot.id === bookings.find(b => b.id === bookingId)?.spot_id
              ? { ...spot, current_status: 'optaget' as const }
              : spot
          ))
        } else if (status === 'checked_out') {
          setSpots(prev => prev.map(spot => 
            spot.id === bookings.find(b => b.id === bookingId)?.spot_id
              ? { ...spot, current_status: 'ledig' as const }
              : spot
          ))
        }
      }
    } else {
      // TODO: Call API to update booking status
      console.log('Updating booking status via API...')
    }
  }

  const handleBerthClick = (berth: Berth) => {
    // Set the selected berth (no scrolling for map clicks)
    setSelectedBerthId(berth.id)
    console.log(`Selected berth: ${berth.id}`)
  }

  const handleBerthClickFromMap = (berthId: string) => {
    // Handler for map clicks (receives just the berth ID)
    setSelectedBerthId(berthId)
    console.log(`Selected berth from map: ${berthId}`)
  }

  // Calculate available berths dynamically
  const availableBerths = getVisibleBerths().filter(berth => berth.status === "available").length
  
  // Calculate current guests in harbor (bookings that are currently active)
  const currentGuests = bookings.filter(booking => {
    const now = new Date()
    const startDate = new Date(booking.start_at)
    const endDate = new Date(booking.end_at)
    return booking.status === 'checked_in' && now >= startDate && now <= endDate
  }).length
  
  // Calculate bookings created today
  const bookingsToday = bookings.filter(booking => {
    const today = new Date()
    const bookingDate = new Date(booking.created_at)
    return bookingDate.toDateString() === today.toDateString()
  }).length

  const handleBookingBerthClick = (berthId: string) => {
    // Set the selected berth
    setSelectedBerthId(berthId)
    
    // Scroll to the specific berth row in the Pladser (live) table
    const berthRowElement = document.getElementById(`berth-row-${berthId}`)
    if (berthRowElement) {
      berthRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    
    console.log(`Selected berth from booking: ${berthId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Indlæser dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <header className="bg-[#272E43] text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <img 
              src="/Header 1.png" 
              alt="Rungsted Havn Header" 
              className="h-32 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="Ledige pladser (nu)"
            value={availableBerths}
            description="Tilgængelige nu"
          />
          <KpiCard
            title="Gæster i havn (nu)"
            value={currentGuests}
            description="Aktive gæster"
          />
          <KpiCard
            title="Bookinger i dag"
            value={bookingsToday}
            description="Nye bookinger"
          />
        </div>

        {/* Main Split */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Berths Table (7 cols) */}
          <div className="col-span-12 lg:col-span-7">
            <BerthsTable
              onBerthClick={handleBerthClick}
              selectedBerthId={selectedBerthId}
              bookings={bookings}
            />
          </div>

          {/* Right: Map (5 cols) */}
          <div className="col-span-12 lg:col-span-5">
            <AdminMap
              id="admin-map"
              spots={spots}
              onSpotClick={handleSpotClick}
              selectedSpotId={selectedSpot?.id}
              onBerthClick={handleBerthClickFromMap}
              selectedBerthId={selectedBerthId}
            />
          </div>
        </div>


        {/* Secondary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings */}
          <BookingsList
            bookings={bookings}
            onCheckIn={(id) => handleBookingStatusUpdate(id, 'checked_in')}
            onCheckOut={(id) => handleBookingStatusUpdate(id, 'checked_out')}
            onCancel={(id) => handleBookingStatusUpdate(id, 'cancelled')}
            onBerthClick={handleBookingBerthClick}
            onCreateBooking={handleCreateBookingFromList}
          />

          {/* Overview */}
          <Overview bookings={bookings} />
        </div>

        {/* Modals */}
        <ChangeStatusModal
          spot={selectedSpot}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onSave={handleStatusSave}
        />

        <CreateBookingModal
          spot={selectedSpot}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onCreate={handleBookingCreate}
        />
      </div>
    </div>
  )
}
