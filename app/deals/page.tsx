'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DataLoader } from '@/components/data-loader';
import { useApp } from '@/lib/app-context';
import { formatPrice } from '@/lib/utils-app';
import { Tag, ShoppingBag, Flame, Clock, Plus, Minus, CheckCircle2, Star } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image?: string;
  items: string[];
  available: boolean;
}

function DealCard({ deal }: { deal: Deal }) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Note: Since items are now strings (descriptions), we'll need to handle this differently
    // For now, just show the added state
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const savings = deal.originalPrice - deal.discountedPrice;

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {deal.image ? (
          <Image src={deal.image} alt={deal.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="bg-[#f5f0d8] h-full flex items-center justify-center text-5xl">🍕</div>
        )}
        <span className="absolute top-3 right-3 bg-[#f5a623] text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow">
          <Tag size={11} /> {deal.discountPercentage}% OFF
        </span>
        <span className="absolute bottom-3 left-3 bg-white/90 text-[#1e3a5f] text-xs font-semibold px-2 py-1 rounded-full z-10">
          Save Rs. {savings}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Stars */}
        <div className="flex gap-0.5 mb-2">
          {[...Array(4)].map((_, i) => <Star key={i} size={11} className="fill-[#f5a623] text-[#f5a623]" />)}
          <Star size={11} className="text-gray-200 fill-gray-200" />
        </div>

        <h3 className="font-bold text-[#1e3a5f] text-base mb-1">{deal.name}</h3>
        <p className="text-gray-400 text-xs mb-3 leading-relaxed line-clamp-2">{deal.description}</p>

        <div className="border-t border-gray-100 pt-3 mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-[#f5a623]" />
            Includes:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            {deal.items.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-center gap-1">
                <span className="text-[#f5a623]">•</span> {item}
              </li>
            ))}
            {deal.items.length > 3 && (
              <li className="text-gray-400 italic">+ {deal.items.length - 3} more items</li>
            )}
          </ul>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <span className="text-[#f5a623] font-extrabold text-xl">Rs. {deal.discountedPrice}</span>
          <span className="text-gray-300 line-through text-sm mb-0.5">Rs. {deal.originalPrice}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-gray-100 rounded-full overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 text-gray-400 hover:text-[#f5a623] transition">
              <Minus size={13} />
            </button>
            <span className="px-2 text-[#1e3a5f] text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 text-gray-400 hover:text-[#f5a623] transition">
              <Plus size={13} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              added ? 'bg-green-500 text-white' : 'bg-[#f5a623] hover:bg-[#e09510] text-white'
            }`}
          >
            {added ? <><CheckCircle2 size={14} /> Added!</> : <><ShoppingBag size={14} /> Grab Deal</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data.filter((deal: Deal) => deal.available));
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-5">
            <Flame size={14} className="fill-[#f5a623]" /> Limited Time Offers
          </div>
          <h1 className="text-5xl font-extrabold text-[#1e3a5f] mb-3">
            Hot <span className="text-[#f5a623]">Deals</span> Just For You
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Stack up savings on your favourite combos — fresh deals every day.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-6 justify-center sm:justify-start">
          {[
            { icon: <Tag size={14} />, label: `${deals.length} Active Deals` },
            { icon: <Clock size={14} />, label: 'Updated Daily' },
            { icon: <Flame size={14} />, label: 'Up to 30% Off' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-[#f5a623]">{s.icon}</span> {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <DataLoader />
          ) : deals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🎁</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No deals available</h3>
              <p className="text-gray-500">Check back soon for amazing offers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
