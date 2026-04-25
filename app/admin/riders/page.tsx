'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { showConfirm } from '@/components/ui/confirm-dialog'
import { Plus, Trash2, Phone, User, CheckCircle, XCircle } from 'lucide-react'

interface Rider {
  id: string
  name: string
  phone: string
  available: boolean
  orders: { id: string; status: string }[]
}

export default function AdminRidersPage() {
  const { data: session } = useSession()
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (session?.user?.email === 'admin@pizza1981.com' || session?.user?.role === 'ADMIN') fetchRiders()
    else setLoading(false)
  }, [session])

  const fetchRiders = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/riders')
    const data = await res.json()
    setRiders(data.riders || [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!form.name || !form.phone) return
    setAdding(true)
    await fetch('/api/admin/riders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ name: '', phone: '' })
    setAdding(false)
    fetchRiders()
  }

  const toggleAvailable = async (id: string, available: boolean) => {
    await fetch(`/api/admin/riders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !available }),
    })
    fetchRiders()
  }

  const handleDelete = async (id: string) => {
    showConfirm('Delete this rider?', async () => {
      await fetch(`/api/admin/riders/${id}`, { method: 'DELETE' })
      fetchRiders()
    });
  }

  if (session?.user?.role !== 'ADMIN' && session?.user?.email !== 'admin@pizza1981.com') {
    return <AdminLayout><div className="p-8 text-center text-gray-400">Access denied</div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Rider Management</h1>

        {/* Add Rider */}
        <Card className="p-5 mb-6 rounded-2xl border-0 shadow-sm">
          <h2 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2"><Plus size={16} /> Add New Rider</h2>
          <div className="flex gap-3 flex-wrap">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Rider name" className="flex-1 min-w-40 rounded-xl" />
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Phone number" className="flex-1 min-w-40 rounded-xl" />
            <Button onClick={handleAdd} disabled={adding || !form.name || !form.phone}
              className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-xl px-6">
              {adding ? 'Adding...' : 'Add Rider'}
            </Button>
          </div>
        </Card>

        {/* Riders List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading riders...</div>
        ) : riders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No riders yet. Add one above.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {riders.map(rider => {
              const activeOrders = rider.orders.length
              return (
                <Card key={rider.id} className="p-5 rounded-2xl border-0 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
                        {rider.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#1e3a5f]">{rider.name}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1"><Phone size={12} /> {rider.phone}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(rider.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${rider.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {rider.available ? 'Available' : 'Busy'}
                      </span>
                      {activeOrders > 0 && (
                        <span className="text-xs text-gray-400">{activeOrders} active order{activeOrders > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <button onClick={() => toggleAvailable(rider.id, rider.available)}
                      className="text-xs text-[#1e3a5f] underline hover:text-[#f5a623] transition">
                      {rider.available ? 'Mark Busy' : 'Mark Available'}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
