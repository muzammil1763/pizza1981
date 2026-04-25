'use client';

import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Clock, Truck, Users } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: '🍕', value: '200+',  label: 'Menu Items'       },
  { icon: '😊', value: '50k+',  label: 'Happy Customers'  },
  { icon: '⭐', value: '4.9',   label: 'Average Rating'   },
  { icon: '🚀', value: '30min', label: 'Avg. Delivery'    },
  { icon: '📍', value: '54+',   label: 'Delivery Areas'   },
  { icon: '🏆', value: '1981',  label: 'Est. Since'       },
];

const team = [
  { emoji: '👨‍🍳', name: 'Ustad Khalid',   role: 'Head Chef',          bio: 'Over 20 years mastering Pakistani and Italian fusion cuisine. The man behind our legendary pizza dough recipe.' },
  { emoji: '👩‍🍳', name: 'Chef Amna',      role: 'Sous Chef',           bio: 'Specialist in desi flavours — her shawarma and paratha rolls have won the hearts of thousands.' },
  { emoji: '🧑‍💼', name: 'Tariq Mehmood',  role: 'Operations Manager',  bio: 'Ensures every order reaches you hot and on time. 10 years keeping our kitchen running like clockwork.' },
  { emoji: '👩‍💻', name: 'Sana Iqbal',     role: 'Customer Experience', bio: 'Dedicated to making every customer interaction exceptional. Your satisfaction is her mission.' },
];

const values = [
  { icon: <Award size={28} className="text-[#f5a623]" />,  title: 'Quality First',     desc: 'Sirf taaza aur local ingredients use karte hain — har dish mein freshness guaranteed.' },
  { icon: <Truck size={28} className="text-[#f5a623]" />,  title: 'Tez Delivery',      desc: '30 minute mein ghar tak — ya agla order hamare taraf se. Yeh hamaara wada hai.' },
  { icon: <Clock size={28} className="text-[#f5a623]" />,  title: 'Hamesha Fresh',     desc: 'Hamari kitchen roz 4 baje se shuru hoti hai — koi bhi cheez raat bhar nahi rehti.' },
  { icon: <Users size={28} className="text-[#f5a623]" />,  title: 'Community First',   desc: 'Lahore ke local farmers se ingredients lete hain aur community mein invest karte hain.' },
];



export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#0d1b2a]">
        <div className="absolute inset-0 opacity-20">
          <Image src="/pizza-banner-1.png" alt="Hero" fill className="object-cover" priority />
        </div>
        <span className="absolute top-4 right-[10%] text-3xl opacity-20 select-none rotate-12">🥬</span>
        <span className="absolute bottom-4 left-[6%] text-2xl opacity-20 select-none">🍅</span>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Badge className="bg-[#f5a623]/20 text-[#f5a623] border-[#f5a623]/30 mb-3 px-4 py-1.5 text-sm font-medium">
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Passionate About <span className="text-[#f5a623]">Good Food</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
            We started with one simple belief — everyone deserves a delicious, freshly prepared meal
            delivered fast, without compromise.
          </p>
        </div>
      </section>

      {/* ── Our story ── white */}
      <section className="relative py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* left */}
          <div className="relative flex justify-center">
            <div className="bg-[#1e3a5f] border-4 border-[#8a9bb0]/30 rounded-3xl w-80 h-80 flex items-center justify-center shadow-xl">
              <span className="text-[110px] leading-none select-none">🍽️</span>
            </div>
            <span className="absolute -top-4 -right-4 text-4xl animate-bounce">🍕</span>
            <span className="absolute -bottom-4 -left-4 text-4xl animate-pulse delay-300">🥗</span>
          </div>

          {/* right */}
          <div>
            <Badge className="bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/30 mb-4 text-sm px-3 py-1">
              Since 1981
            </Badge>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f] mb-5 leading-snug">
              Lahore ki Pehchan —<br /><span className="text-[#f5a623]">Pizza 1981</span>
            </h2>
            <p className="text-[#8a9bb0] leading-relaxed mb-4">
              1981 mein ek chhoti si kitchen se shuru hua yeh safar aaj Lahore ke sabse pasandeeda restaurant tak pahuncha hai. Hamare founders ka ek hi yaqeen tha — achi khana sirf ameer logon ka haq nahi, har kisi ka haq hai.
            </p>
            <p className="text-[#8a9bb0] leading-relaxed mb-4">
              Aaj hum roz hazaron orders deliver karte hain — Eden Value Homes se DHA tak, Johar Town se Model Town tak. Lekin hamaari commitment wahi hai: taaza ingredients, honest prices, aur 30 minute delivery.
            </p>
            <p className="text-[#8a9bb0] leading-relaxed mb-8">
              Shop No. G-9, Eden Mall, Multan Road par hamaari branch 4 PM se 2 AM tak khuli rehti hai. Dine in, takeaway ya home delivery — jo bhi aapko pasand ho.
            </p>
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-7 py-4 font-semibold shadow-lg shadow-[#f5a623]/20">
              <Link href="/menu">Explore Our Menu <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </div>
        </div>

      </section>

      {/* ── Stats ── navy */}
      <section className="relative py-40 px-6 bg-[#1e3a5f]" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 rounded-3xl py-10 px-4 hover:bg-white/10 transition-colors">
              <div className="text-5xl mb-3 select-none">{s.icon}</div>
              <div className="text-4xl font-extrabold text-[#f5a623] mb-1">{s.value}</div>
              <div className="text-[#8a9bb0] text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── white */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/30 mb-4 px-4 py-1.5 text-sm font-medium">
              What We Stand For
            </Badge>
            <h2 className="text-4xl font-extrabold text-[#1e3a5f]">
              Our <span className="text-[#f5a623]">Core Values</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-7 shadow-lg border border-[#8a9bb0]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">{v.title}</h3>
                <p className="text-[#8a9bb0] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── navy */}
      <section className="relative py-32 px-6 bg-[#1e3a5f]" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/30 mb-4 px-4 py-1.5 text-sm font-medium">
              The People
            </Badge>
            <h2 className="text-4xl font-extrabold text-white">
              Meet the <span className="text-[#f5a623]">Team</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {team.map((member) => (
              <div key={member.name} className="bg-white/5 border border-[#8a9bb0]/20 rounded-3xl p-7 text-center hover:bg-white/10 hover:-translate-y-2 transition-all duration-300">
                <div className="text-7xl mb-4 select-none">{member.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#f5a623] text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-[#8a9bb0] text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── white */}
      <section className="relative py-40 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-7xl mb-6 block select-none">🚀</span>
          <h2 className="text-4xl font-extrabold mb-5 text-[#1e3a5f]">
            Ready to <span className="text-[#f5a623]">Order?</span>
          </h2>
          <p className="text-[#8a9bb0] leading-relaxed mb-8">
            Hamaara full menu browse karein aur apna favourite order karein — 30 minute mein garam khana aapke darwaze par.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-8 py-4 font-semibold shadow-lg shadow-[#f5a623]/30">
              <Link href="/menu">Order Now <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
            <Button asChild className="border-2 border-[#8a9bb0]/40 bg-transparent text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white rounded-full px-8 py-4 font-semibold">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
