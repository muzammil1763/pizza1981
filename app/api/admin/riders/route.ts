import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const riders = await prisma.rider.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          where: { status: { in: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'] } },
          select: { id: true, status: true },
        },
      },
    })
    return NextResponse.json({ riders })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch riders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json()
    if (!name || !phone) return NextResponse.json({ error: 'Name and phone required' }, { status: 400 })
    const rider = await prisma.rider.create({ data: { name, phone } })
    return NextResponse.json({ rider })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rider' }, { status: 500 })
  }
}
