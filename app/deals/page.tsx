'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PIZZA_1981_DEALS } from '@/lib/menu-data';
import { useApp } from '@/lib/app-context';
import { formatPrice } from '@/lib/utils-app';
import { Deal } from '@/lib/types';
import { Tag, ShoppingBag, Flame, Clock, Plus, Minus, CheckCircle2, Star } from 'lucide-react';

function DealCard({ deal }: { deal: Deal }) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    deal.items.forEach((itemId) => addToCart({ menuItemId: itemId, quantity: qty }));
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
          Save {formatPrice(savings)}
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

        <div className="flex items-center gap-1.5 mb-4">
          <CheckCircle2 size={12} className="text-[#f5a623] shrink-0" />
          <span className="text-gray-400 text-xs">{deal.items.length} items included</span>
        </div>

        <div className="flex items-end gap-3 mb-4">
          <span className="text-[#f5a623] font-extrabold text-xl">{formatPrice(deal.discountedPrice)}</span>
          <span className="text-gray-300 line-through text-sm mb-0.5">{formatPrice(deal.originalPrice)}</span>
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
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-14 px-6 bg-white border-b border-gray-100">
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
            { icon: <Tag size={14} />, label: `${PIZZA_1981_DEALS.length} Active Deals` },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PIZZA_1981_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
