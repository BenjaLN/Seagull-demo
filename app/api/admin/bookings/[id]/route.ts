import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { updateBookingStatus } from '@/lib/actions'

const updateBookingStatusSchema = z.object({
  status: z.enum(['checked_in', 'checked_out', 'cancelled']),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateBookingStatusSchema.parse(body)
    
    const result = await updateBookingStatus({
      bookingId: params.id,
      ...validatedData,
    })
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }
    
    return NextResponse.json({ success: true }, { status: result.status })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}






