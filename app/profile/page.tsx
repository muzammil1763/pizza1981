'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User, Mail, Phone, MapPin, Save, ArrowLeft, LogOut, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        phone: session.user.phone || '',
        address: session.user.address || '',
      })
    }
  }, [status, session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          ...formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Failed to update profile')
        setLoading(false)
        return
      }

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      
      // Refresh the page to update session
      router.refresh()
    } catch (err) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-[#1e3a5f] mb-6 hover:opacity-70 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Menu
          </Link>

          <Card className="p-8 rounded-2xl border-0 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f5a623] rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1e3a5f]">My Profile</h1>
                <p className="text-gray-500 text-sm">Update your personal information</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <Input
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="mt-1 rounded-xl border-gray-200 bg-gray-50"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <User size={14} /> Full Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-1 rounded-xl border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <Phone size={14} /> Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300-1234567"
                  className="mt-1 rounded-xl border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <MapPin size={14} /> Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your delivery address"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold bg-[#f5a623] hover:bg-[#e09510] text-white rounded-xl shadow-lg shadow-[#f5a623]/20 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 mb-6">
            <Link href="/order-history">
              <Card className="p-5 rounded-2xl border-0 shadow-sm cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#f5a623]" />
                  <div>
                    <h3 className="font-bold text-[#1e3a5f]">Order History</h3>
                    <p className="text-sm text-gray-500">View your past orders</p>
                  </div>
                </div>
              </Card>
            </Link>

            {session?.user?.isAdmin && (
              <Link href="/admin/dashboard">
                <Card className="p-5 rounded-2xl border-2 border-[#1e3a5f] shadow-sm cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e3a5f]">Admin Dashboard</h3>
                      <p className="text-sm text-gray-500">Manage orders, users, and menu</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="w-full h-12 text-base font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
