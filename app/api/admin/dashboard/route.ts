import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get total counts
    const [totalOrders, totalUsers, totalMenuItems] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.menuItem.count(),
    ])

    // Get total revenue
    const orders = await prisma.order.findMany({
      select: { total: true }
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Get recent orders for chart data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    })

    // Group orders by day for chart
    const chartData = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      
      const dayOrders = recentOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.toDateString() === date.toDateString()
      })
      
      chartData.push({
        day: dayName,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      })
    }

    // Get order status distribution
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    // Get recent orders with user info
    const recentOrdersList = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalOrders,
        totalUsers,
        totalMenuItems,
        totalRevenue,
        avgOrderValue
      },
      chartData,
      ordersByStatus,
      recentOrders: recentOrdersList
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}