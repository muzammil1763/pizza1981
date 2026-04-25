import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const areas = await prisma.deliveryArea.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, deliveryFee: true },
    })
    return NextResponse.json({ areas })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 })
  }
}
