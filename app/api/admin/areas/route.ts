import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const areas = await prisma.deliveryArea.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ areas })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, deliveryFee } = await request.json()
    if (!name || deliveryFee === undefined) return NextResponse.json({ error: 'Name and fee required' }, { status: 400 })
    const area = await prisma.deliveryArea.create({ data: { name, deliveryFee: parseFloat(deliveryFee), active: true } })
    return NextResponse.json({ area })
  } catch {
    return NextResponse.json({ error: 'Failed to create area' }, { status: 500 })
  }
}
