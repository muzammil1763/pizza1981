'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '@/lib/app-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { showConfirm } from '@/components/ui/confirm-dialog';
import { PIZZA_1981_MENU } from '@/lib/menu-data';
import { formatPrice } from '@/lib/utils-app';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, User, UserPlus } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { state, updateCartItem, removeFromCart } = useApp();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const cartItems = state.cart.items;
  const deliveryFee = state.cart.deliveryFee || 0;
  
  const subtotal = cartItems.reduce((sum, item) => {
    const menuItem = menuItems.find(m => m.id === item.menuItemId);
    return sum + ((menuItem?.price ?? 0) * item.quantity);
  }, 0);

  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const item = cartItems[index];
    updateCartItem(index, { ...item, quantity: newQuantity });
  };

  const handleRemove = (menuItemId: string) => {
    showConfirm('Remove this item from cart?', () => {
      removeFromCart(menuItemId);
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 pt-32">
          <div className="text-center max-w-md">
            <div className="relative w-32 h-32 mx-auto mb-6 opacity-20">
              <Image src="/pizzalogo.png" alt="Empty Cart" fill className="object-contain" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1e3a5f] mb-3">Your Cart is Empty</h2>
            <p className="text-gray-400 mb-8">Add some delicious items to get started!</p>
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-8 py-6 text-base font-semibold">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-4 py-10 pt-32">
        <div className="max-w-6xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-[#1e3a5f] mb-6 hover:opacity-70 text-sm font-medium">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>

          <h1 className="text-4xl font-extrabold text-[#1e3a5f] mb-8">
            Your Cart <span className="text-[#f5a623]">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading cart...</p>
                </div>
              ) : (
                cartItems.map((item, index) => {
                  const menuItem = menuItems.find(m => m.id === item.menuItemId);
                  if (!menuItem) return null;

                  const itemTotal = menuItem.price * item.quantity;

                  return (
                    <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5f0d8]">
                          {menuItem.image ? (
                            <Image src={menuItem.image} alt={menuItem.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              🍕
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-[#1e3a5f] text-lg">{menuItem.name}</h3>
                              <p className="text-gray-400 text-xs">{menuItem.category}</p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.menuItemId)}
                              className="text-red-500 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{menuItem.description}</p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                              <button
                                onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                className="px-4 py-2 text-gray-500 hover:text-[#f5a623] hover:bg-gray-50 transition"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 font-bold text-[#1e3a5f]">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                className="px-4 py-2 text-gray-500 hover:text-[#f5a623] hover:bg-gray-50 transition"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Rs. {menuItem.price} each</p>
                              <p className="text-xl font-extrabold text-[#f5a623]">Rs. {itemTotal}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-bold text-[#1e3a5f] text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">Rs. {deliveryFee}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-[#1e3a5f]">Total</span>
                    <span className="text-[#f5a623]">Rs. {total}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full py-6 text-base font-bold shadow-lg shadow-[#f5a623]/20"
                >
                  Proceed to Checkout
                </Button>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Cash on Delivery available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>30-minute delivery guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fresh & hot food guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
