import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, guestInfo, items, total, deliveryFee, address, area, phone, customerName, notes, paymentMethod, isGuest } = await request.json()

    if (!items || !total || !address || !phone || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let resolvedUserId = userId

    // Validate if userId is a valid MongoDB ObjectID (24 hex characters)
    const isValidObjectId = userId && /^[a-f\d]{24}$/i.test(userId)

    // Guest checkout OR invalid userId — find or create a guest user
    if (isGuest || !userId || !isValidObjectId) {
      const guestEmail = guestInfo?.email || `guest_${phone.replace(/\D/g, '')}@guest.pizza1981.com`
      let guestUser = await prisma.user.findFirst({ where: { email: guestEmail } })
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: guestEmail,
            name: customerName,
            phone,
            address,
            userType: 'GUEST',
          },
        })
      }
      resolvedUserId = guestUser.id
    }

    const order = await prisma.order.create({
      data: {
        userId: resolvedUserId,
        total: parseFloat(total),
        deliveryFee: parseFloat(deliveryFee) || 200,
        address,
        area: area || '',
        phone,
        customerName,
        notes,
        paymentMethod: paymentMethod || 'COD',
        isGuest: isGuest || false,
        status: 'PENDING',
      },
    })

    // Resolve each item's menuItemId to a real DB ObjectId
    const resolvedItems = await Promise.all(
      items.map(async (item: any) => {
        // Already a valid MongoDB ObjectId
        if (/^[a-f\d]{24}$/i.test(item.menuItemId)) {
          return item
        }
        // Look up by exact name (sent from checkout)
        const dbItem = await prisma.menuItem.findFirst({
          where: { name: item.itemName ?? '' },
        })
        if (dbItem) return { ...item, menuItemId: dbItem.id, price: item.price || dbItem.price }
        return null
      })
    )

    const validItems = resolvedItems.filter(Boolean)

    await Promise.all(
      validItems.map((item: any) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: parseFloat(item.price),
          },
        })
      )
    )

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        user: { select: { name: true, email: true } },
        rider: { select: { name: true, phone: true } },
        items: { include: { menuItem: { select: { name: true, category: true } } } },
      },
    })

    return NextResponse.json({ order: completeOrder })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
