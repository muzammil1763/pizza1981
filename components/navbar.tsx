'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-context';
import { ShoppingCart, Menu, X, Search, Heart } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const isLoggedIn = status === 'authenticated';
  const isAdmin = session?.user?.isAdmin || false;
  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email || '';

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#93a9a6] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/pizzalogo.png" alt="PIZZA 1981" width={56} height={56} className="rounded-full object-cover" />
            <span className="font-bold text-xl hidden sm:inline tracking-wide">PIZZA 1981</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/" className="hover:opacity-80 transition font-semibold text-sm">Home</Link>
            <Link href="/menu" className="hover:opacity-80 transition text-sm">Menu</Link>
            <Link href="/deals" className="hover:opacity-80 transition text-sm">Deals</Link>
            <Link href="/blog" className="hover:opacity-80 transition text-sm">Blog</Link>
            <Link href="/about" className="hover:opacity-80 transition text-sm">About</Link>
            <Link href="/track" className="hover:opacity-80 transition text-sm">Track Order</Link>
            <Link href="/contact" className="hover:opacity-80 transition text-sm">Contact Us</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/20 rounded-full transition hidden sm:block">
              <Search size={18} />
            </button>

            <Link href="/checkout" className="relative p-2 hover:bg-white/20 rounded-full transition">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f5a623] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="p-2 hover:bg-white/20 rounded-full transition hidden sm:block">
              <Heart size={18} />
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative group">
                <div className="w-9 h-9 bg-[#f5a623] rounded-full flex items-center justify-center font-bold cursor-pointer text-white text-sm shadow">
                  {userName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-gray-800 font-semibold text-sm truncate">{userName}</p>
                    <p className="text-gray-400 text-xs truncate">{userEmail}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm transition">Profile</Link>
                  <Link href="/order-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm transition">Order History</Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm transition">Admin Dashboard</Link>
                  )}
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 text-sm transition">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20 text-sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-4 text-sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden p-2 hover:bg-white/20 rounded-full transition" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Wavy bottom */}
      <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-6 block text-white">
        <path d="M0,15 Q150,0 300,15 T600,15 T900,15 T1200,15 L1200,30 L0,30 Z" fill="currentColor" />
      </svg>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#7d9693] border-t border-white/20 px-4 py-4 z-40">
          <div className="flex flex-col gap-3">
            {[
              { href: '/',        label: 'Home',        bold: true },
              { href: '/menu',    label: 'Menu'         },
              { href: '/deals',   label: 'Deals'        },
              { href: '/blog',    label: 'Blog'         },
              { href: '/about',   label: 'About'        },
              { href: '/track',   label: 'Track Order'  },
              { href: '/contact', label: 'Contact Us'   },
            ].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
                className={`text-white hover:opacity-80 text-sm ${l.bold ? 'font-semibold' : ''}`}>
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-white hover:opacity-80 text-sm">
                Admin Dashboard
              </Link>
            )}
            {!isLoggedIn && (
              <div className="flex gap-2 pt-2 border-t border-white/20">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
