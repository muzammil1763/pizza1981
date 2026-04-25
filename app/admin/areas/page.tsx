'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Pencil, Check, X, MapPin } from 'lucide-react'

interface Area { id: string; name: string; deliveryFee: number; active: boolean }

export default function AdminAreasPage() {
  const { data: session } = useSession()
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', deliveryFee: '' })
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', deliveryFee: '' })

  useEffect(() => {
    if (session?.user?.email === 'admin@pizza1981.com' || session?.user?.role === 'ADMIN') fetchAreas()
    else setLoading(false)
  }, [session])

  const fetchAreas = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/areas')
    const data = await res.json()
    setAreas(data.areas || [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!form.name || !form.deliveryFee) return
    setAdding(true)
    await fetch('/api/admin/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, deliveryFee: parseFloat(form.deliveryFee) }),
    })
    setForm({ name: '', deliveryFee: '' })
    setAdding(false)
    fetchAreas()
  }

  const startEdit = (area: Area) => {
    setEditId(area.id)
    setEditForm({ name: area.name, deliveryFee: String(area.deliveryFee) })
  }

  const saveEdit = async (id: string) => {
    await fetch(`/api/admin/areas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name, deliveryFee: parseFloat(editForm.deliveryFee) }),
    })
    setEditId(null)
    fetchAreas()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/areas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    fetchAreas()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this area?')) return
    await fetch(`/api/admin/areas/${id}`, { method: 'DELETE' })
    fetchAreas()
  }

  if (session?.user?.role !== 'ADMIN' && session?.user?.email !== 'admin@pizza1981.com') {
    return <AdminLayout><div className="p-8 text-center text-gray-400">Access denied</div></AdminLayout>
  }

  return (
    <AdminLayout title="Delivery Areas" subtitle={`${areas.length} areas configured`}>
      <div className="max-w-4xl space-y-6">

        {/* Add Area */}
        <Card className="p-5 rounded-2xl border-0 shadow-sm">
          <h2 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2"><Plus size={16} /> Add New Area</h2>
          <div className="flex gap-3 flex-wrap">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Area / Society name" className="flex-1 min-w-48 rounded-xl" />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
              <Input value={form.deliveryFee} onChange={e => setForm(f => ({ ...f, deliveryFee: e.target.value }))}
                placeholder="Delivery fee" type="number" className="pl-10 w-36 rounded-xl" />
            </div>
            <Button onClick={handleAdd} disabled={adding || !form.name || !form.deliveryFee}
              className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-xl px-6">
              {adding ? 'Adding...' : 'Add Area'}
            </Button>
          </div>
        </Card>

        {/* Areas Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading areas...</div>
        ) : (
          <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Area Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Fee</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {areas.map(area => (
                    <tr key={area.id} className={`hover:bg-gray-50 transition ${!area.active ? 'opacity-50' : ''}`}>
                      <td className="px-5 py-3">
                        {editId === area.id ? (
                          <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="h-8 text-sm rounded-lg w-56" />
                        ) : (
                          <span className="flex items-center gap-2 font-medium text-[#1e3a5f]">
                            <MapPin size={13} className="text-[#f5a623]" /> {area.name}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {editId === area.id ? (
                          <div className="relative w-28">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rs.</span>
                            <Input value={editForm.deliveryFee} onChange={e => setEditForm(f => ({ ...f, deliveryFee: e.target.value }))}
                              type="number" className="h-8 text-sm rounded-lg pl-8" />
                          </div>
                        ) : (
                          <span className="font-semibold text-[#1e3a5f]">Rs. {area.deliveryFee}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleActive(area.id, area.active)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full transition ${area.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                          {area.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {editId === area.id ? (
                            <>
                              <button onClick={() => saveEdit(area.id)} className="text-green-600 hover:text-green-700 transition"><Check size={16} /></button>
                              <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={16} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(area)} className="text-[#1e3a5f] hover:text-[#f5a623] transition"><Pencil size={15} /></button>
                              <button onClick={() => handleDelete(area.id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={15} /></button>
                            </>
                          )}
                        </div>
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
