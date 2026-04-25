'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search, Clock, MapPin, Package, Bike, Phone, AlertCircle, History } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils-app'

interface Order {
  id: string; status: string; total: number; deliveryFee: number
  address: string; area: string; phone: string; customerName: string
  notes: string | null; isGuest: boolean; paymentMethod: string; createdAt: string
  user: { name: string | null; email: string }
  rider: { name: string; phone: string } | null
  items: Array<{ id: string; quantity: number; price: number; menuItem: { name: string; category: string } }>
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Received', CONFIRMED: 'Confirmed', PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'On the Way', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

interface SavedOrder { id: string; date: string; name: string; phone: string; total: number }

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentOrders, setRecentOrders] = useState<SavedOrder[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pizza1981_orders') || '[]')
      setRecentOrders(saved)
    } catch {}
  }, [])

  const handleTrack = async () => {
    const id = orderId.trim()
    if (!id) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      // Try direct lookup first (full ObjectId)
      let res = await fetch(`/api/admin/orders/${id}`)
      if (!res.ok) {
        // Try searching by short suffix via orders list
        const listRes = await fetch('/api/admin/orders')
        const listData = await listRes.json()
        const match = (listData.orders || []).find((o: any) =>
          o.id.endsWith(id) || o.id.slice(-6) === id || o.id === id
        )
        if (!match) throw new Error('not found')
        res = await fetch(`/api/admin/orders/${match.id}`)
        if (!res.ok) throw new Error('not found')
      }
      const data = await res.json()
      setOrder(data.order)
    } catch {
      setError('Order not found. Please check your Order ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1
  const isCancelled = order?.status === 'CANCELLED'
  const subtotal = order ? order.items.reduce((s, i) => s + i.price * i.quantity, 0) : 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1e3a5f] py-16 px-6 text-center">
        <span className="inline-flex items-center gap-2 bg-[#f5a623]/15 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
          <Search size={14} /> Order Tracking
        </span>
        <h1 className="text-4xl font-extrabold text-white mb-3">Track Your <span className="text-[#f5a623]">Order</span></h1>
        <p className="text-[#8a9bb0] max-w-md mx-auto text-sm mb-8">
          Enter your Order ID to check the live status of your order. You received this ID on your order confirmation page.
        </p>

        {/* Search box */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <Input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            placeholder="Paste your Order ID here..."
            className="flex-1 rounded-xl border-white/20 bg-white/10 text-white placeholder-white/40 px-5 py-4 focus:border-[#f5a623] focus:ring-0 font-mono text-sm"
          />
          <Button onClick={handleTrack} disabled={loading || !orderId.trim()}
            id="track-btn"
            className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-xl px-8 py-4 font-bold whitespace-nowrap">
            {loading ? 'Searching...' : 'Track Order'}
          </Button>
        </div>
      </section>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Error */}
          {error && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm bg-red-50">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle size={20} />
                <p className="font-medium text-sm">{error}</p>
              </div>
              <p className="text-red-400 text-xs mt-2">
                Tip: Copy the full Order ID from your confirmation page — it's a long string like <span className="font-mono">6830a1b2c3d4e5f6a7b8c9d0</span>
              </p>
            </Card>
          )}

          {order && (
            <>
              {/* Status header */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Order ID</p>
                    <p className="font-mono text-[#1e3a5f] font-bold text-sm break-all">{order.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </Card>

              {/* Progress tracker */}
              {!isCancelled && (
                <Card className="p-6 rounded-2xl border-0 shadow-sm">
                  <h2 className="font-bold text-[#1e3a5f] mb-5 flex items-center gap-2"><Clock size={16} className="text-[#f5a623]" /> Live Status</h2>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                    <div className="absolute top-4 left-0 h-0.5 bg-[#f5a623] z-0 transition-all"
                      style={{ width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }} />
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex flex-col items-center z-10 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          i <= currentStep ? 'bg-[#f5a623] border-[#f5a623] text-white' : 'bg-white border-gray-200 text-gray-400'
                        }`}>{i + 1}</div>
                        <p className={`text-[10px] mt-1.5 text-center leading-tight ${i <= currentStep ? 'text-[#1e3a5f] font-semibold' : 'text-gray-400'}`}>
                          {STATUS_LABELS[step]}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Rider info */}
              {order.rider && order.status === 'OUT_FOR_DELIVERY' && (
                <Card className="p-5 rounded-2xl border-0 shadow-sm bg-[#1e3a5f] text-white">
                  <h2 className="font-bold mb-3 flex items-center gap-2"><Bike size={16} className="text-[#f5a623]" /> Your Rider is On the Way!</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f5a623] rounded-full flex items-center justify-center font-bold">
                        {order.rider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{order.rider.name}</p>
                        <p className="text-white/60 text-sm flex items-center gap-1"><Phone size={11} /> {order.rider.phone}</p>
                      </div>
                    </div>
                    <a href={`tel:${order.rider.phone}`}
                      className="bg-[#f5a623] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#e09510] transition">
                      Call Rider
                    </a>
                  </div>
                </Card>
              )}

              {/* Delivery info */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><MapPin size={16} className="text-[#f5a623]" /> Delivery Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-400 text-xs">Name</p><p className="font-semibold text-[#1e3a5f]">{order.customerName || order.user.name}</p></div>
                  <div><p className="text-gray-400 text-xs">Phone</p><p className="font-semibold text-[#1e3a5f]">{order.phone}</p></div>
                  <div><p className="text-gray-400 text-xs">Area</p><p className="font-semibold text-[#1e3a5f]">{order.area || '—'}</p></div>
                  <div><p className="text-gray-400 text-xs">Payment</p><p className="font-semibold text-[#1e3a5f]">{order.paymentMethod}</p></div>
                  <div className="col-span-2"><p className="text-gray-400 text-xs">Address</p><p className="font-semibold text-[#1e3a5f]">{order.address}</p></div>
                </div>
              </Card>

              {/* Items */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><Package size={16} className="text-[#f5a623]" /> Order Items</h2>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                      <span className="text-gray-700">{item.quantity}× {item.menuItem.name}</span>
                      <span className="font-semibold text-[#1e3a5f]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>{formatPrice(order.deliveryFee)}</span></div>
                  <div className="flex justify-between font-bold text-[#1e3a5f] text-base pt-1 border-t border-gray-100">
                    <span>Total</span><span className="text-[#f5a623]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1 rounded-xl"><Link href="/menu">Order More</Link></Button>
                <Button onClick={handleTrack} className="flex-1 rounded-xl bg-[#1e3a5f] text-white hover:bg-[#1e3a5f]/90">Refresh Status</Button>
              </div>
            </>
          )}

          {/* Recent orders from this device */}
          {!order && !error && !loading && recentOrders.length > 0 && (
            <Card className="p-6 rounded-2xl border-0 shadow-sm">
              <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <History size={16} className="text-[#f5a623]" /> Recent Orders on This Device
              </h3>
              <div className="space-y-3">
                {recentOrders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#f5a623]/5 transition">
                    <div>
                      <p className="font-mono text-xs text-[#1e3a5f] font-bold truncate max-w-[180px]">{r.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.name} · {formatPrice(r.total)} · {new Date(r.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => { setOrderId(r.id); setTimeout(() => document.getElementById('track-btn')?.click(), 50) }}
                      className="text-xs bg-[#f5a623] hover:bg-[#e09510] text-white font-semibold px-3 py-1.5 rounded-lg transition">
                      Track
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Help text when no search yet and no recent orders */}
          {!order && !error && !loading && recentOrders.length === 0 && (
            <Card className="p-6 rounded-2xl border-0 shadow-sm text-center">
              <p className="text-5xl mb-3">📋</p>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Where is my Order ID?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                After placing your order, the confirmation page shows your full Order ID with a <strong>Copy ID</strong> button. Paste it above to track your order.
              </p>
              <p className="text-[#8a9bb0] text-xs mt-3">
                Already have an account? <Link href="/order-history" className="text-[#f5a623] underline">View Order History</Link>
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
