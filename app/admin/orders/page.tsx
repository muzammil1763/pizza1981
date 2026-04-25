'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RefreshCw, Eye, Bike } from 'lucide-react'

interface Rider { id: string; name: string; phone: string; available: boolean }
interface Order {
  id: string; status: string; total: number; deliveryFee: number
  address: string; area: string; phone: string; customerName: string
  notes: string | null; isGuest: boolean; paymentMethod: string; createdAt: string
  user: { name: string | null; email: string }
  rider: { id: string; name: string; phone: string } | null
  items: Array<{ quantity: number; price: number; menuItem: { name: string; category: string } }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (state.user?.email === 'admin@pizza1981.com' || state.isAdmin) {
      fetchOrders(); fetchRiders()
    } else setLoading(false)
  }, [state.user, state.isAdmin])

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  const fetchRiders = async () => {
    const res = await fetch('/api/admin/riders')
    const data = await res.json()
    setRiders(data.riders || [])
  }

  const updateOrder = async (orderId: string, patch: { status?: string; riderId?: string | null }) => {
    // Optimistic update
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      if (patch.status) return { ...o, status: patch.status }
      if (patch.riderId !== undefined) {
        const rider = patch.riderId ? riders.find(r => r.id === patch.riderId) || null : null
        return { ...o, rider: rider ? { id: rider.id, name: rider.name, phone: rider.phone } : null }
      }
      return o
    }))
    // Persist to DB
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  if (!state.isAdmin && state.user?.email !== 'admin@pizza1981.com') {
    return <AdminLayout><div className="p-8 text-center text-gray-400">Access denied</div></AdminLayout>
  }

  return (
    <AdminLayout title="Orders" subtitle={`${orders.length} total orders`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={fetchOrders} className="gap-2 text-sm">
            <RefreshCw size={14} /> Refresh
          </Button>
          <Link href="/admin/riders">
            <Button className="gap-2 text-sm bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white">
              <Bike size={14} /> Manage Riders
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center text-gray-400">No orders yet</Card>
        ) : (
          <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Order', 'Customer', 'Area', 'Items', 'Total', 'Status', 'Rider', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#1e3a5f] text-xs">#{order.id.slice(-6)}</span>
                        <p className="font-mono text-[10px] text-gray-300 mt-0.5 max-w-[80px] truncate" title={order.id}>{order.id}</p>
                        {order.isGuest && <span className="ml-0 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Guest</span>}
                        <p className="text-xs text-gray-400 mt-0.5">{order.paymentMethod}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{order.customerName || order.user.name || order.user.email}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs max-w-[120px]">{order.area || '—'}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[120px]">{order.address}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.items.length} items</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">
                          {order.items.slice(0, 2).map(i => i.menuItem.name).join(', ')}{order.items.length > 2 ? '…' : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1e3a5f]">Rs. {order.total.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <select value={order.status}
                          onChange={e => updateOrder(order.id, { status: e.target.value })}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'].map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select value={order.rider?.id || ''}
                          onChange={e => updateOrder(order.id, { riderId: e.target.value || null })}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 max-w-[120px]">
                          <option value="">Unassigned</option>
                          {riders.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        {order.rider && (
                          <p className="text-xs text-gray-400 mt-0.5">{order.rider.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/order-confirmation/${order.id}`}>
                          <Button variant="outline" size="sm" className="gap-1 text-xs rounded-lg">
                            <Eye size={12} /> View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
