/**
 * Zustand store for berth management
 * Handles state updates and provides actions for berth control
 */

import { create } from 'zustand'
import { Berth, BerthStatus, Pier, Booking, applyBookingReservations } from '@/lib/berths'
import { generateAllBerths } from '@/lib/berths'
import { mockBookings } from '@/lib/mock'

interface BerthsState {
  berths: Berth[]
  selectedPier: Pier | "all"
  searchQuery: string
  statusFilter: BerthStatus | "all"
  
  // Actions
  setBerthStatus: (id: string, status: BerthStatus, endDate?: string) => void
  setPierStatus: (pier: Pier, status: BerthStatus) => void
  setAllVisibleStatus: (status: BerthStatus) => void
  setSelectedPier: (pier: Pier | "all") => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: BerthStatus | "all") => void
  resetBerths: () => void
  updateBerthsWithBookings: (bookings: Booking[]) => void
  
  // Computed getters
  getVisibleBerths: () => Berth[]
  getBerthById: (id: string) => Berth | undefined
}

export const useBerthsStore = create<BerthsState>((set, get) => ({
  berths: applyBookingReservations(generateAllBerths(), mockBookings),
  selectedPier: "all",
  searchQuery: "",
  statusFilter: "all",
  
  setBerthStatus: (id: string, status: BerthStatus, endDate?: string) => {
    set(state => ({
      berths: state.berths.map(berth => 
        berth.id === id ? { ...berth, status, endDate } : berth
      )
    }))
  },
  
  setPierStatus: (pier: Pier, status: BerthStatus) => {
    set(state => ({
      berths: state.berths.map(berth => 
        berth.pier === pier ? { ...berth, status } : berth
      )
    }))
  },
  
  setAllVisibleStatus: (status: BerthStatus) => {
    const { getVisibleBerths } = get()
    const visibleBerths = getVisibleBerths()
    const visibleIds = visibleBerths.map(berth => berth.id)
    
    set(state => ({
      berths: state.berths.map(berth => 
        visibleIds.includes(berth.id) ? { ...berth, status } : berth
      )
    }))
  },
  
  setSelectedPier: (pier: Pier | "all") => {
    set({ selectedPier: pier })
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },
  
  setStatusFilter: (status: BerthStatus | "all") => {
    set({ statusFilter: status })
  },
  
  resetBerths: () => {
    set({
      berths: applyBookingReservations(generateAllBerths(), mockBookings),
      selectedPier: "all",
      searchQuery: "",
      statusFilter: "all"
    })
  },
  
  updateBerthsWithBookings: (bookings: Booking[]) => {
    set(state => ({
      berths: applyBookingReservations(generateAllBerths(), bookings)
    }))
  },
  
  getVisibleBerths: () => {
    const { berths, selectedPier, searchQuery, statusFilter } = get()
    
    let filtered = berths
    
    // Filter to only show berths that are on the map (berths 1-125)
    filtered = filtered.filter(berth => {
      const berthNumber = parseInt(berth.id)
      return !isNaN(berthNumber) && berthNumber >= 1 && berthNumber <= 125
    })
    
    // Filter by pier
    if (selectedPier !== "all") {
      filtered = filtered.filter(berth => berth.pier === selectedPier)
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(berth => berth.status === statusFilter)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(berth => 
        berth.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  },
  
  getBerthById: (id: string) => {
    const { berths } = get()
    return berths.find(berth => berth.id === id)
  }
}))






