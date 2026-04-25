'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PIZZA_1981_MENU } from '@/lib/menu-data'
import { formatPrice } from '@/lib/utils-app'
import { ArrowLeft, MapPin, Phone, User, CreditCard, ChevronDown, Search, Locate, ShoppingBag } from 'lucide-react'
import { useToast } from '@/components/ui/toast-popup'


export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useApp()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<'choose' | 'guest' | 'user'>('choose')
  const [areaSearch, setAreaSearch] = useState('')
  const [areaOpen, setAreaOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [dbAreas, setDbAreas] = useState<{ name: string; deliveryFee: number }[]>([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    address: '',
    notes: '',
  })

  // Pre-fill if logged in
  useEffect(() => {
    if (state.isLoggedIn && state.user) {
      setMode('user')
      setForm(f => ({ 
        ...f, 
        name: state.user?.name || '', 
        email: state.user?.email || '',
        phone: state.user?.phone || '',
        address: state.user?.address || '',
      }))
    }
  }, [state.isLoggedIn, state.user])

  // Load areas from DB
  useEffect(() => {
    fetch('/api/areas').then(r => r.json()).then(d => setDbAreas(d.areas || []))
  }, [])

  const cartItems = state.cart.items
  const selectedArea = dbAreas.find(a => a.name === form.area)
  const deliveryFee = selectedArea?.deliveryFee ?? 0
  const subtotal = cartItems.reduce((s, i) => {
    const menuItem = PIZZA_1981_MENU.find(m => m.id === i.menuItemId)
    return s + ((menuItem?.price ?? 0) * i.quantity)
  }, 0)
  const total = subtotal + deliveryFee

  const filteredAreas = dbAreas.filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase()))

  const handleLocate = () => {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(
      () => {
        // In production, reverse geocode to get area. For now just show a message.
        setLocating(false)
        alert('Live location detected. Please select your area from the list.')
      },
      () => {
        setLocating(false)
        alert('Could not get location. Please select your area manually.')
      }
    )
  }

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.area || !form.address) {
      alert('Please fill in all required fields (Name, Phone, Area, Address)')
      return
    }
    if (cartItems.length === 0) return

    setIsProcessing(true)
    try {
      const isGuest = mode === 'guest'
      const orderData = {
        userId: state.user?.id || null,
        isGuest,
        guestInfo: isGuest ? { email: form.email } : undefined,
        customerName: form.name,
        items: cartItems.map(item => {
          const menuItem = PIZZA_1981_MENU.find(m => m.id === item.menuItemId)
          return {
            menuItemId: item.menuItemId,
            itemName: menuItem?.name ?? item.menuItemId,
            quantity: item.quantity,
            price: menuItem?.price ?? 0,
          }
        }),
        total,
        deliveryFee,
        area: form.area,
        address: form.address,
        phone: form.phone,
        notes: form.notes || null,
        paymentMethod: 'COD',
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) throw new Error('Failed to place order')
      const { order } = await res.json()

      // Save order ID to localStorage so guest can find it later
      try {
        const saved = JSON.parse(localStorage.getItem('pizza1981_orders') || '[]')
        saved.unshift({ id: order.id, date: new Date().toISOString(), name: form.name, phone: form.phone, total })
        localStorage.setItem('pizza1981_orders', JSON.stringify(saved.slice(0, 10))) // keep last 10
      } catch {}

      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some items before checking out</p>
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-8">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Mode selection screen (only if not logged in)
  if (mode === 'choose' && !state.isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-extrabold text-[#1e3a5f] text-center mb-2">How would you like to order?</h1>
            <p className="text-gray-400 text-center mb-8 text-sm">Login for faster checkout with saved info, or continue as guest</p>
            <div className="space-y-4">
              <button onClick={() => router.push('/login?redirect=/checkout')}
                className="w-full border-2 border-[#1e3a5f] rounded-2xl p-5 text-left hover:bg-[#1e3a5f] hover:text-white transition-all group">
                <p className="font-bold text-lg group-hover:text-white text-[#1e3a5f]">Login / Sign Up</p>
                <p className="text-sm text-gray-400 group-hover:text-white/70">Use saved address & order history</p>
              </button>
              <button onClick={() => setMode('guest')}
                className="w-full border-2 border-[#f5a623] rounded-2xl p-5 text-left hover:bg-[#f5a623] hover:text-white transition-all group">
                <p className="font-bold text-lg group-hover:text-white text-[#f5a623]">Continue as Guest</p>
                <p className="text-sm text-gray-400 group-hover:text-white/70">Quick order — no account needed</p>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-[#1e3a5f] mb-6 hover:opacity-70 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Menu
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
                {mode === 'guest' ? 'Guest Checkout' : 'Checkout'}
              </h1>

              {mode === 'guest' && (
                <div className="bg-[#f5a623]/10 border border-[#f5a623]/30 rounded-2xl p-4 text-sm text-[#1e3a5f]">
                  Ordering as guest. <Link href="/login?redirect=/checkout" className="underline font-semibold">Login</Link> to save your info for next time.
                </div>
              )}

              {/* Personal Info */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><User size={18} className="text-[#f5a623]" /> Personal Info</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name *</label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Ali Hassan" className="mt-1 rounded-xl border-gray-200" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone *</label>
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="0300-1234567" className="mt-1 rounded-xl border-gray-200" />
                  </div>
                  {mode === 'guest' && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email (optional)</label>
                      <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="ali@example.com" className="mt-1 rounded-xl border-gray-200" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Delivery Location */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#f5a623]" /> Delivery Location</h2>

                {/* Area picker */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Area / Society *</label>
                  <div className="relative mt-1">
                    <button type="button" onClick={() => setAreaOpen(!areaOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 border-2 border-gray-200 rounded-xl text-left text-sm hover:border-[#f5a623] transition">
                      <span className={form.area ? 'text-[#1e3a5f] font-medium' : 'text-gray-400'}>
                        {form.area || 'Choose your area...'}
                      </span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>
                    {areaOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                          <Search size={14} className="text-gray-400" />
                          <input autoFocus value={areaSearch} onChange={e => setAreaSearch(e.target.value)}
                            placeholder="Search area..." className="flex-1 text-sm outline-none" />
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredAreas.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-4">No area found</p>
                          ) : filteredAreas.map(area => (
                            <button key={area.name} type="button"
                              onClick={() => { setForm(f => ({ ...f, area: area.name })); setAreaOpen(false); setAreaSearch('') }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f5a623]/10 transition flex justify-between items-center ${form.area === area.name ? 'bg-[#f5a623]/15 font-semibold text-[#1e3a5f]' : 'text-gray-700'}`}>
                              <span>{area.name}</span>
                              <span className="text-xs text-gray-400">Rs. {area.deliveryFee}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live location */}
                <button type="button" onClick={handleLocate} disabled={locating}
                  className="flex items-center gap-2 text-sm text-[#1e3a5f] font-medium mb-4 hover:text-[#f5a623] transition">
                  <Locate size={15} className={locating ? 'animate-spin' : ''} />
                  {locating ? 'Getting location...' : 'Use my current location'}
                </button>

                {/* Street address */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Street Address / House No. *</label>
                  <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="House 12, Street 5, Block A" className="mt-1 rounded-xl border-gray-200" />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Ring the bell, gate code, landmark..." rows={2}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f5a623]" />
                </div>
              </Card>

              {/* Payment */}
              <Card className="p-6 rounded-2xl border-0 shadow-sm">
                <h2 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2"><CreditCard size={18} className="text-[#f5a623]" /> Payment Method</h2>
                <div className="flex items-center gap-3 border-2 border-[#f5a623] rounded-xl p-4 bg-[#f5a623]/5">
                  <div className="w-5 h-5 rounded-full bg-[#f5a623] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e3a5f] text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                </div>
              </Card>

              <Button onClick={handlePlaceOrder} disabled={isProcessing}
                className="w-full h-14 text-base font-bold bg-[#f5a623] hover:bg-[#e09510] text-white rounded-2xl shadow-lg shadow-[#f5a623]/20">
                {isProcessing ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 rounded-2xl border-0 shadow-sm sticky top-24">
                <h2 className="font-bold text-[#1e3a5f] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                {cartItems.map((item, i) => {
                    const menuItem = PIZZA_1981_MENU.find(m => m.id === item.menuItemId)
                    const price = menuItem?.price ?? 0
                    return (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}× <span className="text-[#1e3a5f] font-medium">{menuItem?.name ?? item.menuItemId}</span></span>
                        <span className="font-semibold text-[#1e3a5f]">{formatPrice(price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee {form.area && <span className="text-xs text-gray-400">({form.area})</span>}</span>
                    <span>{form.area ? formatPrice(deliveryFee) : '—'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1e3a5f] text-base pt-1 border-t border-gray-100">
                    <span>Total</span><span className="text-[#f5a623]">{formatPrice(total)}</span>
                  </div>
                </div>
                {form.area && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                    <p className="font-semibold text-[#1e3a5f] mb-0.5">Delivering to:</p>
                    <p>{form.area}{form.address ? `, ${form.address}` : ''}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
