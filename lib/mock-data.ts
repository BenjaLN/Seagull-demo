import { Harbor, Spot, Booking, SpotWithAvailability, HarborKPIs, Notification } from './types'

export const mockHarbor: Harbor = {
  id: '1',
  name: 'Rungsted Havn',
  slug: 'rungsted-havn',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockSpots: Spot[] = [
  {
    id: '1',
    harbor_id: '1',
    code: 'A1',
    name: 'Bro A - Plads 1',
    latitude: 55.8833,
    longitude: 12.5167,
    expected_return_at: undefined,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    harbor_id: '1',
    code: 'A2',
    name: 'Bro A - Plads 2',
    latitude: 55.8835,
    longitude: 12.5169,
    expected_return_at: '2024-01-15T18:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    harbor_id: '1',
    code: 'B1',
    name: 'Bro B - Plads 1',
    latitude: 55.8837,
    longitude: 12.5171,
    expected_return_at: undefined,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    harbor_id: '1',
    code: 'B2',
    name: 'Bro B - Plads 2',
    latitude: 55.8839,
    longitude: 12.5173,
    expected_return_at: undefined,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    harbor_id: '1',
    code: 'C1',
    name: 'Bro C - Plads 1',
    latitude: 55.8841,
    longitude: 12.5175,
    expected_return_at: '2024-01-16T14:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

export const mockBookings: Booking[] = [
  {
    id: '1',
    spot_id: '2',
    guest_name: 'Lars Nielsen',
    guest_phone: '+45 12345678',
    start_at: '2024-01-10T10:00:00Z',
    end_at: '2024-01-15T18:00:00Z',
    status: 'checked_in',
    payment_status: 'paid',
    amount: 2500,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    spot_id: '5',
    guest_name: 'Anna Hansen',
    guest_phone: '+45 87654321',
    start_at: '2024-01-12T14:00:00Z',
    end_at: '2024-01-16T14:00:00Z',
    status: 'reserved',
    payment_status: 'paid',
    amount: 2000,
    created_at: '2024-01-10T14:00:00Z',
    updated_at: '2024-01-10T14:00:00Z',
  },
  {
    id: '3',
    spot_id: '1',
    guest_name: 'Peter Larsen',
    guest_phone: '+45 11223344',
    start_at: '2024-01-20T09:00:00Z',
    end_at: '2024-01-25T17:00:00Z',
    status: 'reserved',
    payment_status: 'pending',
    amount: 3000,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'payment_missing',
    message: 'Betaling mangler for booking #3 (Peter Larsen)',
    created_at: '2024-01-15T10:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'conflict',
    message: 'Tidskonflikt opdaget for plads A2',
    created_at: '2024-01-14T15:30:00Z',
    read: true,
  },
]

export const mockKPIs: HarborKPIs = {
  available_spots: 3,
  guests_in_harbor: 2,
  bookings_today: 1,
  revenue_today: 2500,
}

export function getMockSpotsWithAvailability(): SpotWithAvailability[] {
  return mockSpots.map(spot => {
    const currentBooking = mockBookings.find(
      booking => booking.spot_id === spot.id && 
      (booking.status === 'checked_in' || booking.status === 'reserved')
    )
    
    let currentStatus: 'ledig' | 'reserveret' | 'optaget' = 'ledig'
    if (currentBooking) {
      currentStatus = currentBooking.status === 'checked_in' ? 'optaget' : 'reserveret'
    }

    return {
      ...spot,
      current_status: currentStatus,
      availability_windows: [],
      current_booking: currentBooking,
    }
  })
}
