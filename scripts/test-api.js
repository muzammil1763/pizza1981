// Simple test script to verify the dashboard API
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDashboardData() {
  try {
    console.log('🧪 Testing dashboard data...')
    
    // Test basic counts
    const totalOrders = await prisma.order.count()
    const totalUsers = await prisma.user.count()
    const totalMenuItems = await prisma.menuItem.count()
    
    console.log('📊 Dashboard Stats:')
    console.log(`- Total Orders: ${totalOrders}`)
    console.log(`- Total Users: ${totalUsers}`)
    console.log(`- Total Menu Items: ${totalMenuItems}`)
    
    // Test revenue calculation
    const orders = await prisma.order.findMany({
      select: { total: true }
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    console.log(`- Total Revenue: Rs. ${totalRevenue.toLocaleString()}`)
    console.log(`- Average Order Value: Rs. ${Math.round(avgOrderValue).toLocaleString()}`)
    
    // Test recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { menuItem: { select: { name: true } } } }
      }
    })
    
    console.log(`\n📋 Recent Orders (${recentOrders.length}):`);
    recentOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.id.slice(-6)} - Rs. ${order.total} - ${order.status}`)
      console.log(`   Customer: ${order.user.name || order.user.email}`)
      console.log(`   Items: ${order.items.length} items`)
    })
    
    // Test order status distribution
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true }
    })
    
    console.log('\n📈 Order Status Distribution:')
    ordersByStatus.forEach(item => {
      console.log(`- ${item.status}: ${item._count.status} orders`)
    })
    
    console.log('\n✅ Dashboard API data is ready!')
    console.log('\n🚀 Next steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Navigate to: http://localhost:3000/admin/dashboard')
    console.log('3. Login with: admin@pizza1981.com')
    console.log('4. View your dynamic dashboard with real data!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDashboardData()