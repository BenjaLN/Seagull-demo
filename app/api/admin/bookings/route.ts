import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createBooking } from '@/lib/actions'

const createBookingSchema = z.object({
  spotId: z.string(),
  guestName: z.string().min(1),
  guestPhone: z.string().min(1),
  startAt: z.string(),
  endAt: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBookingSchema.parse(body)
    
    const result = await createBooking(validatedData)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }
    
    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}






