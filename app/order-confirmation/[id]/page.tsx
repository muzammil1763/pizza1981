'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, MapPin, Package, Bike, Phone, Copy, Check } from 'lucide-react'
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

export default function OrderConfirmationPage() {
  const { id: orderId } = useParams() as { id: string }
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const copyOrderId = () => {
    if (!order) return
    navigator.clipboard.writeText(order.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`)
        const data = await res.json()
        setOrder(data.order)
      } finally { setLoading(false) }
    }
    fetchOrder()
    // Poll every 30s for status updates
    const interval = setInterval(fetchOrder, 30000)
    return () => clearInterval(interval)
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col"><Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center"><div className="w-10 h-10 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400">Loading order...</p></div>
      </main><Footer />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen bg-white flex flex-col"><Navbar />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Order not found</p>
          <Button asChild className="bg-[#f5a623] text-white rounded-full"><Link href="/menu">Back to Menu</Link></Button>
        </div>
      </main><Footer />
    </div>
  )

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const currentStep = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Header */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isCancelled ? 'bg-red-100' : 'bg-green-100'}`}>
              <CheckCircle size={36} className={isCancelled ? 'text-red-500' : 'text-green-500'} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1e3a5f]">{isCancelled ? 'Order Cancelled' : 'Order Confirmed!'}</h1>
            <p className="text-gray-400 mt-1">Your order has been placed successfully</p>
          </div>

          {/* Order ID — prominent for guests */}
          <Card className={`p-5 rounded-2xl border-2 ${order.isGuest ? 'border-[#f5a623]' : 'border-gray-100'} shadow-sm`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {order.isGuest ? '🔑 Your Order ID — Save this to track your order' : 'Order ID'}
                </p>
                <p className="font-mono font-bold text-[#1e3a5f] text-lg break-all">{order.id}</p>
              </div>
              <button onClick={copyOrderId}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-[#f5a623] hover:bg-[#e09510] text-white'
                }`}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy ID</>}
              </button>
            </div>
            {order.isGuest && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>📋 Paste this ID at <Link href="/track" className="text-[#f5a623] font-semibold underline">/track</Link> to check your order status anytime</span>
              </div>
            )}
          </Card>

          {/* Status tracker */}
          {!isCancelled && (
            <Card className="p-6 rounded-2xl border-0 shadow-sm">
              <h2 className="font-bold text-[#1e3a5f] mb-5 flex items-center gap-2"><Clock size={16} className="text-[#f5a623]" /> Order Status</h2>
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

          {/* Rider info — shown when out for delivery */}
          {order.rider && order.status === 'OUT_FOR_DELIVERY' && (
            <Card className="p-5 rounded-2xl border-0 shadow-sm bg-[#1e3a5f] text-white">
              <h2 className="font-bold mb-3 flex items-center gap-2"><Bike size={16} className="text-[#f5a623]" /> Your Rider</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f5a623] rounded-full flex items-center justify-center font-bold text-white">
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
              {order.notes && <div className="col-span-2"><p className="text-gray-400 text-xs">Notes</p><p className="font-semibold text-[#1e3a5f]">{order.notes}</p></div>}
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6 rounded-2xl border-0 shadow-sm">
            <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><Package size={16} className="text-[#f5a623]" /> Order Items</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">{item.menuItem.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity} · {item.menuItem.category}</p>
                  </div>
                  <p className="font-bold text-[#1e3a5f]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>{formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-bold text-base text-[#1e3a5f] pt-1 border-t border-gray-100">
                <span>Total</span><span className="text-[#f5a623]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 rounded-xl"><Link href="/menu">Order More</Link></Button>
            <Button asChild className="flex-1 rounded-xl bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white"><Link href="/order-history">Order History</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
