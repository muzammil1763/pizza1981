'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign
} from 'lucide-react'

interface DashboardData {
  stats: {
    totalOrders: number
    totalUsers: number
    totalMenuItems: number
    totalRevenue: number
    avgOrderValue: number
  }
  chartData: Array<{
    day: string
    orders: number
    revenue: number
  }>
  ordersByStatus: Array<{
    status: string
    _count: { status: number }
  }>
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: {
      name: string | null
      email: string
    }
    items: Array<{
      quantity: number
      menuItem: {
        name: string
      }
    }>
  }>
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchDashboardData} className="w-full">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { stats, chartData, ordersByStatus, recentOrders } = dashboardData

  // Prepare pie chart data for order status
  const statusColors = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    PREPARING: '#8b5cf6',
    OUT_FOR_DELIVERY: '#06b6d4',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444'
  }

  const pieData = ordersByStatus.map(item => ({
    name: item.status.replace('_', ' '),
    value: item._count.status,
    color: statusColors[item.status as keyof typeof statusColors] || '#6b7280'
  }))

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Welcome back, Administrator"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
          <p className="text-gray-600">Your business metrics at a glance</p>
        </div>
        <Button variant="outline" onClick={fetchDashboardData} size="sm">
          Refresh Data
        </Button>
      </div>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  <p className="text-blue-100 text-xs mt-1">All time</p>
                </div>
                <ShoppingBag className="w-10 h-10 text-blue-200" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">Rs. {(stats.totalRevenue / 1000).toFixed(1)}k</p>
                  <p className="text-green-100 text-xs mt-1">All time</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-200" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-purple-100 text-xs mt-1">Registered</p>
                </div>
                <Users className="w-10 h-10 text-purple-200" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Avg Order Value</p>
                  <p className="text-3xl font-bold">Rs. {Math.round(stats.avgOrderValue).toLocaleString()}</p>
                  <p className="text-orange-100 text-xs mt-1">Per order</p>
                </div>
                <TrendingUp className="w-10 h-10 text-orange-200" />
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Order Analytics Chart */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">7-Day Order Analytics</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="day" stroke="currentColor" opacity={0.5} />
                    <YAxis stroke="currentColor" opacity={0.5} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="orders" fill="var(--accent)" name="Orders" />
                    <Bar dataKey="revenue" fill="var(--chart-2)" name="Revenue (Rs.)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Order Status Distribution */}
            <div>
              <Card className="p-6 h-full">
                <h2 className="text-xl font-bold mb-6">Order Status</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="capitalize">{entry.name.toLowerCase()}</span>
                      </div>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.user.name || order.user.email}</p>
                          <p className="text-sm text-gray-500">{order.items.length} items</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.items.length}</td>
                      <td className="py-3 px-4 font-semibold">Rs. {order.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
    </AdminLayout>
  )
}