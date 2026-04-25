'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DataLoader } from '@/components/data-loader';
import { useApp } from '@/lib/app-context';
import { formatPrice } from '@/lib/utils-app';
import { Search, Star, Plus, Minus, Zap, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  available: boolean;
}

const CATEGORY_EMOJI: Record<string, string> = {
  all:      '🍽️',
  pizza:    '🍕',
  burger:   '🍔',
  shawarma: '🌯',
  sandwich: '🥪',
  fries:    '🍟',
  paratha:  '🫓',
  deal:     '🏷️',
};

const MENU_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'burger', label: 'Burgers' },
  { id: 'shawarma', label: 'Shawarma' },
  { id: 'sandwich', label: 'Sandwiches' },
  { id: 'paratha', label: 'Paratha Rolls' },
  { id: 'fries', label: 'Fries & Drinks' },
];

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart({ menuItemId: item.id, quantity: qty });
    setQty(1);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Image area */}
      <div className="relative h-44 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="bg-[#f5f0d8] h-full flex items-center justify-center">
            <span className="text-7xl">{CATEGORY_EMOJI[item.category.toLowerCase()] ?? '🍽️'}</span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Stars */}
        <div className="flex gap-0.5 mb-2">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
          ))}
          <Star size={12} className="text-gray-200 fill-gray-200" />
        </div>

        <h3 className="font-bold text-gray-800 text-base leading-snug mb-1 line-clamp-2">{item.name}</h3>
        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{item.description || 'Delicious and fresh'}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-orange-500 font-extrabold text-xl">Rs. {item.price}</span>
        </div>

        {/* Qty + Add */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-gray-100 rounded-full overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 text-gray-500 hover:text-orange-500 transition">
              <Minus size={14} />
            </button>
            <span className="px-2 font-semibold text-gray-700 text-sm">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 text-gray-500 hover:text-orange-500 transition">
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2 text-sm font-semibold transition-all flex items-center justify-center gap-1"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-32 pb-14 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="flex items-center justify-center gap-2 text-orange-500 font-semibold text-sm mb-3">
            <Zap size={14} className="fill-orange-500" /> Our Special Menu
          </p>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-3">
            Fresh &amp; <span className="text-orange-500">Delicious</span> Every Day
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            Handcrafted with love — explore our full menu and order your favourites.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition"
            />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              <span>{CATEGORY_EMOJI[cat.id]}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto flex gap-8">

          {/* Products Grid — 4 columns */}
          <div className="flex-1">
            {loading ? (
              <DataLoader />
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <span className="text-6xl block mb-4">🍽️</span>
                <p className="text-lg font-medium">No items found</p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-6">{filteredItems.length} items</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
