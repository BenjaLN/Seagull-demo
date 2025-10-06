import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { updateSpotStatus } from '@/lib/actions'

const updateSpotStatusSchema = z.object({
  status: z.enum(['ledig', 'optaget']),
  expectedReturnAt: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { spotId: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateSpotStatusSchema.parse(body)
    
    const result = await updateSpotStatus({
      spotId: params.spotId,
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






