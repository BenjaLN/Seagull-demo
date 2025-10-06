"use server"

import { z } from "zod"
import { supabaseAdmin } from "./supabase"
import { revalidatePath } from "next/cache"

const createBookingSchema = z.object({
  spotId: z.string(),
  guestName: z.string().min(1),
  guestPhone: z.string().min(1),
  startAt: z.string(),
  endAt: z.string(),
})

const updateSpotStatusSchema = z.object({
  spotId: z.string(),
  status: z.enum(['ledig', 'optaget']),
  expectedReturnAt: z.string().optional(),
})

const updateBookingStatusSchema = z.object({
  bookingId: z.string(),
  status: z.enum(['checked_in', 'checked_out', 'cancelled']),
})

export async function createBooking(data: z.infer<typeof createBookingSchema>) {
  try {
    const validatedData = createBookingSchema.parse(data)
    
    // In mock mode, return mock response
    if (!supabaseAdmin) {
      return {
        success: true,
        booking: {
          id: 'mock-booking-' + Date.now(),
          ...validatedData,
          status: 'reserved',
          payment_status: 'pending',
          amount: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    }
    
    // Check for overlapping bookings
    const { data: overlappingBookings, error: overlapError } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('spot_id', validatedData.spotId)
      .in('status', ['reserved', 'checked_in'])
      .or(`and(start_at.lte.${validatedData.endAt},end_at.gte.${validatedData.startAt})`)
    
    if (overlapError) {
      throw new Error('Failed to check for overlapping bookings')
    }
    
    if (overlappingBookings && overlappingBookings.length > 0) {
      return { error: 'Booking overlaps with existing reservation', status: 409 }
    }
    
    // Create booking
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        spot_id: validatedData.spotId,
        guest_name: validatedData.guestName,
        guest_phone: validatedData.guestPhone,
        start_at: validatedData.startAt,
        end_at: validatedData.endAt,
        status: 'reserved',
        payment_status: 'pending',
        amount: 0, // Calculate based on duration
      })
      .select()
      .single()
    
    if (error) {
      throw new Error('Failed to create booking')
    }
    
    revalidatePath('/admin/rungsted-havn')
    return { data: booking, status: 201 }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { error: 'Failed to create booking', status: 500 }
  }
}

export async function updateSpotStatus(data: z.infer<typeof updateSpotStatusSchema>) {
  try {
    const validatedData = updateSpotStatusSchema.parse(data)
    
    // In mock mode, return mock response
    if (!supabaseAdmin) {
      return {
        success: true,
        message: 'Spot status updated (mock)'
      }
    }
    
    if (validatedData.status === 'ledig' && validatedData.expectedReturnAt) {
      // Create availability window
      const { error: windowError } = await supabaseAdmin
        .from('spot_availability_windows')
        .insert({
          spot_id: validatedData.spotId,
          start_at: new Date().toISOString(),
          end_at: validatedData.expectedReturnAt,
        })
      
      if (windowError) {
        throw new Error('Failed to create availability window')
      }
      
      // Update spot expected return
      const { error: spotError } = await supabaseAdmin
        .from('spots')
        .update({ expected_return_at: validatedData.expectedReturnAt })
        .eq('id', validatedData.spotId)
      
      if (spotError) {
        throw new Error('Failed to update spot')
      }
    } else if (validatedData.status === 'optaget') {
      // Delete active windows
      const { error: windowError } = await supabaseAdmin
        .from('spot_availability_windows')
        .delete()
        .eq('spot_id', validatedData.spotId)
        .gte('end_at', new Date().toISOString())
      
      if (windowError) {
        throw new Error('Failed to delete availability windows')
      }
      
      // Clear expected return
      const { error: spotError } = await supabaseAdmin
        .from('spots')
        .update({ expected_return_at: null })
        .eq('id', validatedData.spotId)
      
      if (spotError) {
        throw new Error('Failed to update spot')
      }
    }
    
    revalidatePath('/admin/rungsted-havn')
    return { status: 200 }
  } catch (error) {
    console.error('Error updating spot status:', error)
    return { error: 'Failed to update spot status', status: 500 }
  }
}

export async function updateBookingStatus(data: z.infer<typeof updateBookingStatusSchema>) {
  try {
    const validatedData = updateBookingStatusSchema.parse(data)
    
    // In mock mode, return mock response
    if (!supabaseAdmin) {
      return {
        success: true,
        message: 'Booking status updated (mock)'
      }
    }
    
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status: validatedData.status })
      .eq('id', validatedData.bookingId)
    
    if (error) {
      throw new Error('Failed to update booking status')
    }
    
    revalidatePath('/admin/rungsted-havn')
    return { status: 200 }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return { error: 'Failed to update booking status', status: 500 }
  }
}
