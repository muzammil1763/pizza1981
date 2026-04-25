import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const phone = searchParams.get('phone') // for guest order lookup

    let orders

    if (userId) {
      orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          rider: { select: { name: true, phone: true } },
          items: { include: { menuItem: { select: { name: true } } } },
        },
      })
    } else if (phone) {
      // Guest order lookup by phone
      const user = await prisma.user.findFirst({ where: { phone, userType: 'GUEST' } })
      if (!user) return NextResponse.json({ orders: [] })
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          rider: { select: { name: true, phone: true } },
          items: { include: { menuItem: { select: { name: true } } } },
        },
      })
    } else {
      return NextResponse.json({ orders: [] })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('User orders API error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
