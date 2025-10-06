export type SpotStatus = 'ledig' | 'reserveret' | 'optaget'

export type BookingStatus = 'reserved' | 'checked_in' | 'checked_out' | 'cancelled'

export interface Harbor {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Spot {
  id: string
  harbor_id: string
  code: string
  name?: string
  latitude: number
  longitude: number
  expected_return_at?: string
  created_at: string
  updated_at: string
}

export interface SpotAvailabilityWindow {
  id: string
  spot_id: string
  start_at: string
  end_at: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  spot_id: string
  guest_name: string
  guest_phone: string
  start_at: string
  end_at: string
  status: BookingStatus
  payment_status: 'pending' | 'paid' | 'refunded'
  amount: number
  created_at: string
  updated_at: string
}

export interface SpotWithAvailability extends Spot {
  current_status: SpotStatus
  availability_windows: SpotAvailabilityWindow[]
  current_booking?: Booking
}

export interface HarborKPIs {
  available_spots: number
  guests_in_harbor: number
  bookings_today: number
  revenue_today: number
}

export interface Notification {
  id: string
  type: 'conflict' | 'payment_missing' | 'double_booking_attempt'
  message: string
  created_at: string
  read: boolean
}






