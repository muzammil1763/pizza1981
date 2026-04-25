'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ShoppingBag, Clock, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils-app'

interface Order {
  id: string; status: string; total: number; createdAt: string; isGuest: boolean
  rider: { name: string; phone: string } | null
  items: Array<{ quantity: number; menuItem: { name: string } }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [guestPhone, setGuestPhone] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchOrders(`?userId=${session.user.id}`)
    }
  }, [status, session])

  const fetchOrders = async (query: string) => {
    setLoading(true)
    const res = await fetch(`/api/user/orders${query}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
    setSearched(true)
  }

  const handleGuestSearch = () => {
    if (!guestPhone.trim()) return
    fetchOrders(`?phone=${encodeURIComponent(guestPhone.trim())}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] mb-2">Order History</h1>
          <p className="text-gray-400 text-sm mb-8">Track your past and current orders</p>

          {/* Guest lookup */}
          {status !== 'authenticated' && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm mb-6">
              <p className="text-sm font-semibold text-[#1e3a5f] mb-3">Look up guest orders by phone number</p>
              <div className="flex gap-3">
                <Input value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                  placeholder="0300-1234567" className="rounded-xl border-gray-200 flex-1"
                  onKeyDown={e => e.key === 'Enter' && handleGuestSearch()} />
                <Button onClick={handleGuestSearch} className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-xl px-5 gap-2">
                  <Search size={14} /> Search
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Or <Link href="/login" className="text-[#1e3a5f] underline font-medium">login</Link> to see all your orders automatically.
              </p>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-16"><div className="w-8 h-8 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : orders.length === 0 && searched ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No orders found</p>
              <Button asChild className="mt-4 bg-[#f5a623] text-white rounded-full px-6"><Link href="/menu">Start Ordering</Link></Button>
            </div>
          ) : orders.length === 0 && !searched && status === 'authenticated' ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No orders yet</p>
              <Button asChild className="mt-4 bg-[#f5a623] text-white rounded-full px-6"><Link href="/menu">Order Now</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="p-5 rounded-2xl border-0 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-bold text-[#1e3a5f]">#{order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {new Date(order.createdAt).toLocaleString()}
                        {order.isGuest && <span className="ml-1 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px]">Guest</span>}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {order.items.slice(0, 3).map(i => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                    {order.items.length > 3 && ` +${order.items.length - 3} more`}
                  </p>

                  {order.rider && order.status === 'OUT_FOR_DELIVERY' && (
                    <div className="bg-[#1e3a5f]/5 rounded-xl p-3 mb-3 text-sm flex items-center justify-between">
                      <span className="text-[#1e3a5f] font-medium">🏍️ {order.rider.name}</span>
                      <a href={`tel:${order.rider.phone}`} className="text-[#f5a623] font-semibold text-xs">{order.rider.phone}</a>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1e3a5f]">{formatPrice(order.total)}</span>
                    <Link href={`/order-confirmation/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs">View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
