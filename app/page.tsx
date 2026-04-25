'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, ArrowRight, Zap, Flame, Quote, Clock, Truck, ShieldCheck, Phone, Tag } from 'lucide-react';

const WaveDown = ({ fill }: { fill: string }) => (
  <div className="absolute bottom-0 left-0 right-0 leading-none">
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
      <path d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1380,20 1440,45 L1440,90 L0,90 Z" fill={fill} />
    </svg>
  </div>
);

const WaveUp = ({ fill }: { fill: string }) => (
  <div className="absolute top-0 left-0 right-0 leading-none">
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
      <path d="M0,45 C180,0 360,90 540,45 C720,0 900,90 1080,45 C1260,0 1380,70 1440,45 L1440,0 L0,0 Z" fill={fill} />
    </svg>
  </div>
);

const reviews = [
  { name: 'Usman Tariq',   city: 'Johar Town',       stars: 5, text: 'Pizza 1981 ki pizza Lahore mein sab se behtareen hai! Dough bilkul crispy aur toppings fresh hote hain. Delivery bhi 30 minute mein aa gayi. Zabardast!' },
  { name: 'Ayesha Malik',  city: 'DHA Lahore',        stars: 5, text: 'Zinger burger ne toh dil jeet liya! Crispy coating, juicy chicken aur sauce ka combination kamaal ka tha. Ghar wale bhi bohat khush hue. Definitely order karein ge dobara.' },
  { name: 'Bilal Ahmed',   city: 'Gulberg',            stars: 5, text: 'Shawarma itna tasty tha ke fingers bhi chaat liye! Garlic sauce aur fresh paratha ka combination lajawab hai. Price bhi reasonable hai. 10/10 recommend.' },
  { name: 'Sana Rehman',   city: 'Model Town',         stars: 5, text: 'Family deal liya tha — 2 large pizzas, burgers aur drinks. Sab kuch hot aur fresh tha. Pizza 1981 ab hamare ghar ka favourite ban gaya hai!' },
  { name: 'Hamza Qureshi', city: 'Bahria Town',        stars: 4, text: 'Paratha roll try kiya pehli baar — sach mein lajawab tha! Zinger paratha roll mein chicken crispy thi aur sauce perfect tha. Worth it tha.' },
  { name: 'Fatima Noor',   city: 'Eden Value Homes',   stars: 5, text: 'Raat ko 1 baje order kiya aur 35 minute mein delivery aa gayi! Midnight special deal mein pizza bilkul garam tha. Shukriya Pizza 1981!' },
];

const menuHighlights = [
  { emoji: '🍕', label: 'Pizzas',        count: '5 sizes',    from: 'Rs. 750',  color: 'bg-orange-50'  },
  { emoji: '🍔', label: 'Burgers',       count: '19 options', from: 'Rs. 480',  color: 'bg-yellow-50'  },
  { emoji: '🌯', label: 'Shawarma',      count: '10 types',   from: 'Rs. 350',  color: 'bg-red-50'     },
  { emoji: '🥪', label: 'Sandwiches',    count: '11 options', from: 'Rs. 300',  color: 'bg-green-50'   },
  { emoji: '🫓', label: 'Paratha Rolls', count: '9 types',    from: 'Rs. 300',  color: 'bg-amber-50'   },
  { emoji: '🍟', label: 'Fries & Drinks',count: '8 items',    from: 'Rs. 100',  color: 'bg-blue-50'    },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-8 flex items-center px-6 overflow-hidden bg-[#0d1b2a]">
        <div className="absolute inset-0 opacity-30">
          <Image src="/banner-bg-1.png" alt="Hero Banner" fill className="object-cover" priority />
        </div>
        {/* Decorative food icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 opacity-20">
            <Image src="/pizza-banner-1.png" alt="" width={80} height={80} className="animate-pulse" />
          </div>
          <div className="absolute bottom-32 left-20 opacity-20">
            <Image src="/pizza-banner-2.png" alt="" width={60} height={60} className="animate-bounce" />
          </div>
          <div className="absolute top-40 right-20 opacity-20">
            <span className="text-6xl">🍃</span>
          </div>
          <div className="absolute bottom-40 right-32 opacity-20">
            <span className="text-7xl">🍃</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 py-8">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              QUALITY <span className="text-[#f5a623]">FOODS</span>
            </h1>
            <p className="text-[#f5a623] text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-6">
              HEALTHY FOOD FOR HEALTHY BODY
            </p>
            
            {/* Pizza Image */}
            <div className="relative w-full max-w-xs mx-auto mb-6">
              <div className="relative aspect-square">
                <Image 
                  src="/pizza-banner-1.png" 
                  alt="Delicious Pizza" 
                  fill 
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                {/* Floating basil leaves */}
                <div className="absolute -left-6 top-16 animate-float">
                  <span className="text-3xl">🌿</span>
                </div>
                <div className="absolute -right-6 top-24 animate-float-delayed">
                  <span className="text-4xl">🌿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WaveDown fill="#ffffff" />
      </section>

      {/* ── MENU CATEGORIES ── white ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Tag size={14} /> Explore Our Menu
            </span>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f]">Something for <span className="text-[#f5a623]">Everyone</span></h2>
            <p className="text-[#8a9bb0] mt-3 max-w-md mx-auto text-sm">From classic pizzas to desi paratha rolls — our menu has 60+ items to satisfy every craving.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {menuHighlights.map(m => (
              <Link href="/menu" key={m.label}
                className={`${m.color} rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">{m.emoji}</span>
                <p className="font-bold text-[#1e3a5f] text-sm">{m.label}</p>
                <p className="text-[#8a9bb0] text-xs mt-1">{m.count}</p>
                <p className="text-[#f5a623] font-bold text-xs mt-1">From {m.from}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild className="bg-[#1e3a5f] hover:bg-[#f5a623] text-white rounded-full px-8 py-3 font-semibold transition-all">
              <Link href="/menu">View Full Menu <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHY US ── navy ───────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-[#1e3a5f]" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto pt-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/15 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <ShieldCheck size={14} /> Why Pizza 1981
            </span>
            <h2 className="text-4xl font-extrabold text-white">The <span className="text-[#f5a623]">Pizza 1981</span> Promise</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock size={32} className="text-[#f5a623]" />, title: '30-Min Delivery', desc: 'Hot food at your door in 30 minutes or your next order is on us. We track every delivery.' },
              { icon: <ShieldCheck size={32} className="text-[#f5a623]" />, title: 'Fresh Daily', desc: 'Dough kneaded fresh every morning. No frozen shortcuts — ever. Taste the difference.' },
              { icon: <Truck size={32} className="text-[#f5a623]" />, title: '54+ Areas', desc: 'From Eden Value Homes to DHA, Johar Town to Model Town — we cover all of Lahore.' },
              { icon: <Phone size={32} className="text-[#f5a623]" />, title: 'Open Till 2 AM', desc: 'Late night cravings? We are open 4 PM to 2 AM every day. Call 033 9911 1102.' },
            ].map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[#8a9bb0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── white ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Flame size={14} /> Most Ordered
            </span>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f]">This Week's <span className="text-[#f5a623]">Bestsellers</span></h2>
            <p className="text-[#8a9bb0] mt-3 max-w-md mx-auto text-sm">Ordered thousands of times every week — these are the dishes Lahore can't get enough of.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              { emoji: '🍕', name: 'Large Pizza (13")', desc: 'Fresh hand-tossed dough, premium mozzarella, homemade tomato sauce, your choice of toppings', was: 'Rs. 2,150', now: 'Rs. 1,650', tag: 'Best Seller' },
              { emoji: '🍔', name: 'Double Zinger Burger', desc: 'Two crispy chicken patties, special house sauce, fresh lettuce, tomato and pickles', was: 'Rs. 900', now: 'Rs. 680', tag: 'Fan Favourite' },
              { emoji: '🌯', name: 'Zinger Shawarma', desc: 'Crispy zinger wrapped in fresh paratha with garlic sauce, pickled veggies and chilli', was: 'Rs. 750', now: 'Rs. 580', tag: 'Must Try' },
            ].map(item => (
              <Card key={item.name} className="bg-white rounded-3xl border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-br from-[#1e3a5f]/5 to-[#f5a623]/5 py-10 flex justify-center relative">
                  <span className="text-8xl select-none">{item.emoji}</span>
                  <span className="absolute top-3 right-3 bg-[#f5a623] text-white text-[10px] font-bold px-2 py-1 rounded-full">{item.tag}</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-[#f5a623] text-[#f5a623]" />)}
                  </div>
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-1">{item.name}</h3>
                  <p className="text-[#8a9bb0] text-xs mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gray-400 line-through text-sm">{item.was}</span>
                    <span className="text-xl font-extrabold text-[#f5a623]">{item.now}</span>
                  </div>
                  <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#f5a623] text-white rounded-full py-2.5 font-semibold text-sm transition-all">
                    <Link href="/menu">Add To Cart 🛒</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT DEALS BANNER ── navy ─────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-[#1e3a5f]" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto pt-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#f5a623]/15 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <Flame size={14} /> Limited Time Deals
              </span>
              <h2 className="text-4xl font-extrabold text-white mb-5">
                Save Big with Our <span className="text-[#f5a623]">Combo Deals</span>
              </h2>
              <p className="text-[#8a9bb0] leading-relaxed mb-6">
                From student deals to party packages — we have 24 combo deals designed to give you maximum value. Up to 30% off on your favourite combinations.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { name: 'Student Deal', price: 'Rs. 1,999', save: 'Save Rs. 811' },
                  { name: 'Couple Deal',  price: 'Rs. 1,250', save: 'Save Rs. 270' },
                  { name: 'Family Deal',  price: 'Rs. 2,999', save: 'Save Rs. 1,001' },
                  { name: 'Party Deal',   price: 'Rs. 9,999', save: 'Save Rs. 3,041' },
                ].map(d => (
                  <div key={d.name} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white font-semibold text-sm">{d.name}</p>
                    <p className="text-[#f5a623] font-extrabold">{d.price}</p>
                    <p className="text-green-400 text-xs">{d.save}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-8 py-4 font-bold shadow-lg shadow-[#f5a623]/30">
                <Link href="/deals">View All 24 Deals <ArrowRight size={16} className="ml-1" /></Link>
              </Button>
            </div>
            <div className="relative flex justify-center">
              <div className="relative">
                <span className="text-[160px] leading-none select-none">🍕</span>
                <span className="absolute -top-6 -right-6 bg-[#f5a623] text-white font-extrabold text-lg px-4 py-2 rounded-full shadow-lg animate-bounce">UP TO 30% OFF</span>
                <span className="absolute bottom-0 -left-8 text-5xl animate-pulse select-none">🍔</span>
                <span className="absolute top-8 -left-10 text-4xl animate-bounce select-none">🌯</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── white ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Truck size={14} /> How It Works
            </span>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f]">Order in <span className="text-[#f5a623]">3 Easy Steps</span></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-[#f5a623]/30" />
            {[
              { step: '01', emoji: '📱', title: 'Browse & Choose', desc: 'Explore our menu of 60+ items. Pizzas, burgers, shawarmas, paratha rolls and more.' },
              { step: '02', emoji: '📍', title: 'Select Your Area', desc: 'Choose from 54+ delivery areas across Lahore. We cover your neighbourhood.' },
              { step: '03', emoji: '🏍️', title: 'Fast Delivery', desc: 'Our riders deliver hot food to your door in 30 minutes. Cash on delivery — no hassle.' },
            ].map(s => (
              <div key={s.step} className="text-center relative">
                <div className="w-20 h-20 bg-[#1e3a5f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">{s.emoji}</span>
                </div>
                <span className="text-[#f5a623] font-extrabold text-xs tracking-widest">{s.step}</span>
                <h3 className="font-bold text-[#1e3a5f] text-lg mt-1 mb-2">{s.title}</h3>
                <p className="text-[#8a9bb0] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-10 py-4 font-bold shadow-lg shadow-[#f5a623]/20 text-base">
              <Link href="/menu">Start Your Order <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ── navy ─────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-[#1e3a5f]" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto pt-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/15 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Star size={14} className="fill-[#f5a623]" /> Customer Reviews
            </span>
            <h2 className="text-4xl font-extrabold text-white">What Lahore <span className="text-[#f5a623]">Says</span></h2>
            <p className="text-[#8a9bb0] mt-3 max-w-md mx-auto text-sm">Real reviews from our valued customers across Lahore</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r.name} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <Quote size={24} className="text-[#f5a623]/50 mb-3" />
                <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#f5a623] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{r.name}</p>
                      <p className="text-[#8a9bb0] text-xs">{r.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.stars)].map((_, i) => <Star key={i} size={12} className="fill-[#f5a623] text-[#f5a623]" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={28} className="fill-[#f5a623] text-[#f5a623]" />)}
            </div>
            <p className="text-5xl font-extrabold text-[#f5a623] mb-1">4.9 / 5</p>
            <p className="text-[#8a9bb0]">Based on 50,000+ orders across Lahore</p>
          </div>
        </div>
      </section>

      {/* ── PIZZA PROMO ── white ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center order-2 lg:order-1">
            <span className="text-[160px] leading-none select-none">🍕</span>
            <span className="absolute top-0 left-4 text-4xl animate-bounce select-none">🍅</span>
            <span className="absolute bottom-0 right-4 text-4xl animate-pulse select-none">🧀</span>
            <span className="absolute top-1/2 -left-8 text-3xl animate-bounce select-none">🫑</span>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 bg-[#f5a623]/10 text-[#f5a623] text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <Flame size={14} /> Pizza Special
            </span>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f] mb-4">
              Lahore's Finest <span className="text-[#f5a623]">Handcrafted Pizza</span>
            </h2>
            <p className="text-[#8a9bb0] leading-relaxed mb-5">
              Every pizza at Pizza 1981 is made from scratch — fresh dough kneaded daily, premium mozzarella, homemade tomato sauce and your choice of toppings. Available in 5 sizes from 7" to 18".
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                ['Small 7"', 'Rs. 750'],
                ['Medium 11"', 'Rs. 1,650'],
                ['Large 13"', 'Rs. 2,150'],
                ['Family 16"', 'Rs. 2,650'],
              ].map(([size, price]) => (
                <div key={size} className="bg-[#1e3a5f]/5 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-[#1e3a5f] font-semibold text-sm">{size}</span>
                  <span className="text-[#f5a623] font-bold text-sm">{price}</span>
                </div>
              ))}
            </div>
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-8 py-4 font-bold shadow-lg shadow-[#f5a623]/30">
              <Link href="/menu">Order Pizza Now <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── navy ───────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-[#1e3a5f] overflow-hidden" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-8">
          <div>
            <span className="inline-block bg-[#f5a623]/15 text-[#f5a623] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Stay Updated</span>
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Subscribe To Our <span className="text-[#f5a623]">Newsletter</span>
            </h2>
            <p className="text-[#8a9bb0] text-sm mb-6">Get exclusive deals, new menu items and special offers straight to your inbox. Join 10,000+ subscribers.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="email" placeholder="Enter your email here"
                className="flex-1 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/40 px-5 py-4 focus:border-[#f5a623] focus:ring-0" />
              <Button className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-7 py-4 font-semibold whitespace-nowrap shadow-lg shadow-[#f5a623]/20">
                Subscribe <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            <p className="text-[#8a9bb0] text-xs mt-3">No spam. Unsubscribe anytime. 📧</p>
          </div>
          <div className="flex justify-center">
            <span className="text-[120px] leading-none select-none">👩‍🍳</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
