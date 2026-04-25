'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  LogOut, 
  ShoppingBag, 
  Users, 
  Menu as MenuIcon, 
  LayoutDashboard,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Bike,
  MapPin,
  Tag
} from 'lucide-react'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed')
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true')
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('adminSidebarCollapsed', String(newState))
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: ShoppingBag,     label: 'Orders',    href: '/admin/orders'    },
    { icon: Bike,            label: 'Riders',    href: '/admin/riders'    },
    { icon: MapPin,          label: 'Areas',     href: '/admin/areas'     },
    { icon: Users,           label: 'Users',     href: '/admin/users'     },
    { icon: MenuIcon,        label: 'Menu',      href: '/admin/menu'      },
    { icon: Tag,             label: 'Deals',     href: '/admin/deals'     },
  ]

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h1>
          <p className="text-gray-600 mb-6">You need to login first</p>
          <Button onClick={() => router.push('/login')} className="bg-[#1e3a5f] hover:bg-[#f5a623] text-white rounded-full px-8">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  // Not admin
  const isAdmin = session?.user?.role === 'ADMIN'
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Admin</h1>
          <p className="text-gray-600 mb-4">You don't have admin permissions</p>
          <p className="text-sm text-gray-500 mb-2">Current role: {session?.user?.role || 'USER'}</p>
          <p className="text-sm text-gray-500 mb-4">Admin email needed:</p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-6">admin@pizza1981.com</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleLogout} variant="outline" className="rounded-full px-6">
              Logout
            </Button>
            <Button onClick={() => router.push('/')} className="bg-[#1e3a5f] hover:bg-[#f5a623] text-white rounded-full px-8">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Admin - render dashboard

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col h-screen sticky top-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pizza 1981</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">A</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full mt-3 justify-start gap-2 text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}