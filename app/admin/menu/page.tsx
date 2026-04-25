'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { showAlert } from '@/components/ui/confirm-dialog'
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image: string | null
  available: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminMenuPage() {
  const { data: session } = useSession()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Pizza',
    description: '',
    image: '',
  })

  useEffect(() => {
    if (session?.user?.email === 'admin@pizza1981.com' || session?.user?.role === 'ADMIN') {
      setIsAdmin(true)
      fetchMenuItems()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/menu')
      if (!response.ok) {
        throw new Error('Failed to fetch menu items')
      }
      const data = await response.json()
      setMenuItems(data.menuItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'items')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setNewItem({ ...newItem, image: data.url })
    } catch (err) {
      console.error('Upload error:', err)
      showAlert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&apos;t have permission to access this page</p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu items...</p>
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
          <Button onClick={fetchMenuItems} className="w-full">Try Again</Button>
        </Card>
      </div>
    )
  }

  const handleAddItem = async () => {
    if (newItem.name && newItem.price && newItem.category) {
      try {
        const response = await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newItem.name,
            price: parseFloat(newItem.price),
            category: newItem.category,
            description: newItem.description,
            image: newItem.image || '/placeholder.jpg',
          }),
        })

        if (!response.ok) throw new Error('Failed to add menu item')

        setIsAddingItem(false)
        setNewItem({ name: '', price: '', category: 'Pizza', description: '', image: '' })
        fetchMenuItems()
      } catch (err) {
        console.error('Error adding menu item:', err)
      }
    }
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <AdminLayout title="Manage Menu" subtitle="Add, edit, and manage menu items">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
          <p className="text-gray-600">Manage your restaurant menu</p>
        </div>
        <Button onClick={() => setIsAddingItem(!isAddingItem)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {isAddingItem && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <Input
              placeholder="Price (Rs.)"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="px-3 py-2 border border-border rounded-md bg-input text-foreground"
            >
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Shawarma">Shawarma</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Paratha">Paratha</option>
              <option value="Fries">Fries</option>
              <option value="Drinks">Drinks</option>
            </select>
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
          </div>

          {/* Image Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <div className="flex items-center gap-4">
              {newItem.image && (
                <img src={newItem.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-card">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleAddItem} disabled={uploading}>Add Item</Button>
            <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold capitalize mb-4 text-gray-900">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <p className="font-bold text-accent mt-1">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1 gap-1">
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
