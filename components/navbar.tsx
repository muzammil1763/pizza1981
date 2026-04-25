'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-context';
import { ShoppingCart, Menu, X } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1b2a] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/pizzalogo.png" alt="Pizza 1981" width={50} height={50} className="rounded-full object-cover" />
            <span className="font-bold text-2xl tracking-tight hidden sm:inline">
              <span className="text-[#f5a623]">Pizza</span>
              <span className="text-white"> 1981</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="hover:text-[#f5a623] transition font-medium text-sm uppercase tracking-wide">HOME</Link>
            <Link href="/menu" className="hover:text-[#f5a623] transition text-sm uppercase tracking-wide">MENU</Link>
            <Link href="/blog" className="hover:text-[#f5a623] transition text-sm uppercase tracking-wide">BLOG</Link>
            <Link href="/deals" className="hover:text-[#f5a623] transition text-sm uppercase tracking-wide">DEALS</Link>
            <Link href="/about" className="hover:text-[#f5a623] transition text-sm uppercase tracking-wide">ABOUT</Link>
            <Link href="/contact" className="hover:text-[#f5a623] transition text-sm uppercase tracking-wide">CONTACT</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon with Badge */}
            <Link href="/checkout" className="relative p-2 hover:bg-white/20 rounded-full transition">
              <ShoppingCart size={20} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f5a623] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile or Login/Signup */}
            {isLoggedIn ? (
              <div className="relative group">
                <div className="w-10 h-10 bg-[#f5a623] rounded-full flex items-center justify-center font-bold cursor-pointer text-white text-base shadow-lg hover:bg-[#e09510] transition">
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
              <div className="hidden md:flex items-center gap-3">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20 text-sm font-medium">
                  <Link href="/login">LOGIN</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-md px-5 py-2 text-sm font-semibold uppercase tracking-wide">
                  <Link href="/signup">SIGN UP</Link>
                </Button>
              </div>
            )}

            {/* Order Online Button */}
            <Button asChild className="hidden lg:flex bg-[#f5a623] hover:bg-[#e09510] text-white rounded-md px-6 py-2 font-semibold text-sm uppercase tracking-wide">
              <Link href="/menu">ORDER ONLINE</Link>
            </Button>

            {/* Mobile toggle */}
            <button className="lg:hidden p-2 hover:bg-white/20 rounded-full transition" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0d1b2a] border-t border-white/20 px-6 py-4 z-40">
          <div className="flex flex-col gap-4">
            {[
              { href: '/',        label: 'HOME' },
              { href: '/menu',    label: 'MENU' },
              { href: '/blog',    label: 'BLOG' },
              { href: '/deals',   label: 'DEALS' },
              { href: '/about',   label: 'ABOUT' },
              { href: '/contact', label: 'CONTACT' },
              { href: '/track',   label: 'TRACK ORDER' },
            ].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#f5a623] text-sm uppercase tracking-wide font-medium">
                {l.label}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            {isLoggedIn ? (
              <>
                <div className="border-t border-white/20 pt-3 mt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#f5a623] rounded-full flex items-center justify-center font-bold text-white text-base">
                      {userName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{userName}</p>
                      <p className="text-gray-400 text-xs">{userEmail}</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#f5a623] text-sm py-2">
                    Profile
                  </Link>
                  <Link href="/order-history" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#f5a623] text-sm py-2">
                    Order History
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#f5a623] text-sm py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 text-sm py-2 w-full text-left">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-white/20 mt-2">
                <Button asChild variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/20">
                  <Link href="/login">LOGIN</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-[#f5a623] hover:bg-[#e09510] text-white rounded-md">
                  <Link href="/signup">SIGN UP</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile Order Button */}
            <Button asChild className="w-full bg-[#f5a623] hover:bg-[#e09510] text-white rounded-md py-3 font-semibold text-sm uppercase tracking-wide mt-2">
              <Link href="/menu">ORDER ONLINE</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
