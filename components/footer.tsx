'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#93a9a6] text-white mt-0">

      {/* ── Wavy top edge ── */}
      <div className="relative w-full overflow-hidden leading-none" style={{ height: 90 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <rect width="1440" height="90" fill="#93a9a6" />
          <path d="M0,0 L0,50 C180,95 360,5 540,50 C720,95 900,5 1080,50 C1260,95 1380,20 1440,50 L1440,0 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* ── Logo + tagline + social ── */}
      <div className="border-b border-white/20 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <Image src="/pizzalogo.png" alt="PIZZA 1981" width={110} height={110} className="rounded-full object-cover" />
          <span className="text-white font-bold text-2xl tracking-wide">PIZZA 1981</span>
          <span className="text-white/60 text-sm tracking-widest uppercase">The Taste Expert</span>
          <div className="flex items-center gap-3 mt-1">
            {[
              { icon: <Facebook size={14} />, href: '#' },
              { icon: <Instagram size={14} />, href: '#' },
              { icon: <Twitter size={14} />, href: '#' },
              { icon: <Youtube size={14} />, href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:bg-[#f5a623] hover:border-[#f5a623] hover:text-white transition-all duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Four columns ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-white/20 pb-2">About Us</h4>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Pizza 1981 has been serving Lahore's finest handcrafted pizzas, burgers, shawarmas and more since 1981. Dine in, takeaway, or home delivery — we've got you covered.
          </p>
          <p className="text-white/50 text-xs">Dine In · Takeaway · Home Delivery</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-white/20 pb-2">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {[
              { label: 'Home',         href: '/'             },
              { label: 'Menu',         href: '/menu'         },
              { label: 'Deals',        href: '/deals'        },
              { label: 'About Us',     href: '/about'        },
              { label: 'Contact Us',   href: '/contact'      },
              { label: 'Order History',href: '/order-history'},
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-[#f5a623] transition-colors flex items-center gap-1.5">
                  <span className="text-[#f5a623] text-xs">›</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-white/20 pb-2">Contact Info</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <Phone size={13} className="mt-0.5 shrink-0 text-[#f5a623]" />
              <div>
                <p>033 9911 1102</p>
                <p>033 9911 1103</p>
                <p className="text-white/40 text-xs mt-0.5">Helpline: 033 9911 1107</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={13} className="mt-0.5 shrink-0 text-[#f5a623]" />
              <div>
                <p>info@pizza1981.com</p>
                <p>www.pizza1981.com</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={13} className="mt-0.5 shrink-0 text-[#f5a623]" />
              <span>Shop No. G-9, Eden Mall, Eden Value Homes, Multan Road, Lahore</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={13} className="mt-0.5 shrink-0 text-[#f5a623]" />
              <span>Every Day: 4:00 PM – 2:00 AM</span>
            </li>
          </ul>
        </div>

        {/* Gallery */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 border-b border-white/20 pb-2">Gallery</h4>
          <div className="grid grid-cols-3 gap-2">
            {['🍕', '🍔', '🌯', '🥪', '🍟', '🫓'].map((emoji, i) => (
              <div key={i}
                className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-2xl hover:bg-[#f5a623]/40 transition-colors cursor-pointer">
                {emoji}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/15 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Pizza 1981 — The Taste Expert. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Food Safety</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
