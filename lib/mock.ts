/**
 * Mock data for development and testing
 * Used when USE_MOCK=true in environment variables
 */

export interface MockHarbor {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface MockSpot {
  id: string
  harbor_id: string
  code: string
  name?: string
  latitude: number
  longitude: number
  expected_return_at?: string
  current_status: 'ledig' | 'reserveret' | 'optaget'
  created_at: string
  updated_at: string
}

export interface MockBooking {
  id: string
  spot_id: string
  guest_name: string
  guest_phone: string
  start_at: string
  end_at: string
  status: 'reserved' | 'checked_in' | 'checked_out' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  boat_name: string
  boat_length: number
  boat_width: number
  created_at: string
  updated_at: string
}

export interface MockKPIs {
  available_spots: number
  guests_in_harbor: number
  bookings_today: number
  revenue_today: number
}

export const mockHarbor: MockHarbor = {
  id: 'harbor-1',
  name: 'Rungsted Havn',
  slug: 'rungsted-havn',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockSpots: MockSpot[] = [
  {
    id: 'spot-1',
    harbor_id: 'harbor-1',
    code: 'A1',
    name: 'Bro A - Plads 1',
    latitude: 55.8833,
    longitude: 12.5167,
    current_status: 'ledig',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-2',
    harbor_id: 'harbor-1',
    code: 'A2',
    name: 'Bro A - Plads 2',
    latitude: 55.8835,
    longitude: 12.5169,
    current_status: 'reserveret',
    expected_return_at: '2024-01-20T18:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-3',
    harbor_id: 'harbor-1',
    code: 'B1',
    name: 'Bro B - Plads 1',
    latitude: 55.8837,
    longitude: 12.5171,
    current_status: 'optaget',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-4',
    harbor_id: 'harbor-1',
    code: 'B2',
    name: 'Bro B - Plads 2',
    latitude: 55.8839,
    longitude: 12.5173,
    current_status: 'ledig',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-5',
    harbor_id: 'harbor-1',
    code: 'C1',
    name: 'Bro C - Plads 1',
    latitude: 55.8841,
    longitude: 12.5175,
    current_status: 'reserveret',
    expected_return_at: '2024-01-22T14:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-6',
    harbor_id: 'harbor-1',
    code: 'C2',
    name: 'Bro C - Plads 2',
    latitude: 55.8843,
    longitude: 12.5177,
    current_status: 'ledig',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-7',
    harbor_id: 'harbor-1',
    code: 'D1',
    name: 'Bro D - Plads 1',
    latitude: 55.8845,
    longitude: 12.5179,
    current_status: 'optaget',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-8',
    harbor_id: 'harbor-1',
    code: 'D2',
    name: 'Bro D - Plads 2',
    latitude: 55.8847,
    longitude: 12.5181,
    current_status: 'ledig',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-9',
    harbor_id: 'harbor-1',
    code: 'E1',
    name: 'Bro E - Plads 1',
    latitude: 55.8849,
    longitude: 12.5183,
    current_status: 'reserveret',
    expected_return_at: '2024-01-25T16:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'spot-10',
    harbor_id: 'harbor-1',
    code: 'E2',
    name: 'Bro E - Plads 2',
    latitude: 55.8851,
    longitude: 12.5185,
    current_status: 'ledig',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
]

export const mockBookings: MockBooking[] = [
  {
    id: 'booking-1',
    spot_id: '12',
    guest_name: 'Erik Sørensen',
    guest_phone: '+45 23456789',
    start_at: '2025-10-10T10:00:00Z',
    end_at: '2025-10-12T16:00:00Z',
    status: 'booked',
    payment_status: 'paid',
    amount: 700, // 2 days × 350 DKK
    boat_name: 'Nordlys',
    boat_length: 12.5,
    boat_width: 3.8,
    created_at: '2025-10-03T10:00:00Z',
    updated_at: '2025-10-03T10:00:00Z',
  },
  {
    id: 'booking-2',
    spot_id: '18',
    guest_name: 'Camilla Nielsen',
    guest_phone: '+45 34567890',
    start_at: '2025-10-11T14:00:00Z',
    end_at: '2025-10-14T12:00:00Z',
    status: 'booked',
    payment_status: 'paid',
    amount: 1050, // 3 days × 350 DKK
    boat_name: 'Seahawk',
    boat_length: 15.2,
    boat_width: 4.1,
    created_at: '2025-10-04T14:00:00Z',
    updated_at: '2025-10-04T14:00:00Z',
  },
  {
    id: 'booking-3',
    spot_id: '25',
    guest_name: 'Mads Andersen',
    guest_phone: '+45 45678901',
    start_at: '2025-10-12T09:00:00Z',
    end_at: '2025-10-13T18:00:00Z',
    status: 'booked',
    payment_status: 'paid',
    amount: 350, // 1 day × 350 DKK
    boat_name: 'Viking Spirit',
    boat_length: 8.5,
    boat_width: 2.9,
    created_at: '2025-10-05T09:00:00Z',
    updated_at: '2025-10-05T09:00:00Z',
  },
  {
    id: 'booking-4',
    spot_id: '42',
    guest_name: 'Louise Hansen',
    guest_phone: '+45 56789012',
    start_at: '2025-10-13T16:00:00Z',
    end_at: '2025-10-17T10:00:00Z',
    status: 'booked',
    payment_status: 'paid',
    amount: 1400, // 4 days × 350 DKK
    boat_name: 'Ocean Dream',
    boat_length: 18.0,
    boat_width: 5.2,
    created_at: '2025-10-06T16:00:00Z',
    updated_at: '2025-10-06T16:00:00Z',
  },
  {
    id: 'booking-5',
    spot_id: '67',
    guest_name: 'Thomas Larsen',
    guest_phone: '+45 67890123',
    start_at: '2025-10-14T08:00:00Z',
    end_at: '2025-10-16T16:00:00Z',
    status: 'booked',
    payment_status: 'paid',
    amount: 700, // 2 days × 350 DKK
    boat_name: 'Stormwind',
    boat_length: 11.0,
    boat_width: 3.5,
    created_at: '2025-10-07T08:00:00Z',
    updated_at: '2025-10-07T08:00:00Z',
  },
]

export const mockKPIs: MockKPIs = {
  available_spots: 4,
  guests_in_harbor: 2,
  bookings_today: 1,
  revenue_today: 2500,
}

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'payment_missing',
    message: 'Betaling mangler for booking #3 (Peter Larsen)',
    created_at: '2024-01-15T10:00:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'conflict',
    message: 'Tidskonflikt opdaget for plads A2',
    created_at: '2024-01-14T15:30:00Z',
    read: true,
  },
  {
    id: 'notif-3',
    type: 'double_booking_attempt',
    message: 'Dobbeltbooking forsøg for plads B1',
    created_at: '2024-01-13T11:20:00Z',
    read: true,
  },
]

// Simulate realtime updates
export function simulateRealtimeUpdates(
  setSpots: (spots: MockSpot[]) => void,
  setBookings: (bookings: MockBooking[]) => void,
  setKPIs: (kpis: MockKPIs) => void
) {
  const interval = setInterval(() => {
    // Simulate occasional status changes
    if (Math.random() < 0.1) {
      // Simulate status changes by updating timestamps
      const updatedSpots = mockSpots.map(spot => {
        if (Math.random() < 0.05) {
          return {
            ...spot,
            updated_at: new Date().toISOString(),
          }
        }
        return spot
      })
      setSpots(updatedSpots)
    }

    // Simulate KPI updates
    if (Math.random() < 0.2) {
      // Simulate KPI updates
      const updatedKPIs = {
        ...mockKPIs,
        available_spots: Math.max(0, mockKPIs.available_spots + (Math.random() < 0.5 ? 1 : -1)),
      }
      setKPIs(updatedKPIs)
    }
  }, 5000) // Update every 5 seconds

  return () => clearInterval(interval)
}
