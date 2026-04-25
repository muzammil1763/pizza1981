'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
  role: string
  createdAt: string
  _count: {
    orders: number
  }
  orders: Array<{
    total: number
  }>
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (session?.user?.email === 'admin@pizza1981.com' || session?.user?.role === 'ADMIN') {
      setIsAdmin(true)
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&apos;t have permission to access this page</p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please login with admin credentials:
            </p>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              admin@pizza1981.com
            </p>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
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
          <Button onClick={fetchUsers} className="w-full">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <AdminLayout title="Manage Users" subtitle="View and manage all registered users">
      {users.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Card className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left font-bold">Name</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Phone</th>
                  <th className="px-6 py-4 text-left font-bold">Orders</th>
                  <th className="px-6 py-4 text-left font-bold">Total Spent</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{user.name || 'N/A'}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-sm">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-semibold">
                        {user._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      Rs. {user.orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'ADMIN' && (
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </AdminLayout>
  )
}
