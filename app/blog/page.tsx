'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';

const posts = [
  {
    id: 1, emoji: '🍕', category: 'Recipes', featured: true,
    title: 'Pizza 1981 ka Secret: Perfect Dough Kaise Banate Hain',
    excerpt: 'Hamare head chef Ustad Khalid ne 20 saal ki mehnat ke baad yeh dough recipe perfect ki hai. Crispy crust, chewy inside — janiye kya hai raaz is kamaal ki pizza ka.',
    author: 'Ustad Khalid', date: 'Apr 20, 2026', readTime: '5 min read',
  },
  {
    id: 2, emoji: '🌯', category: 'Recipes', featured: false,
    title: 'Lahore Style Zinger Shawarma — Ghar Mein Banayein',
    excerpt: 'Hamare famous Zinger Shawarma ki recipe step by step. Garlic sauce se le kar crispy chicken tak — sab kuch ghar mein possible hai.',
    author: 'Chef Amna', date: 'Apr 17, 2026', readTime: '6 min read',
  },
  {
    id: 3, emoji: '🍔', category: 'Food Culture', featured: false,
    title: 'Lahore ka Burger Culture: Kaise Badla Sab Kuch',
    excerpt: 'Ek waqt tha jab Lahore mein sirf desi khana milta tha. Aaj yahan world-class burgers milte hain. Is safar ki kahani — Pizza 1981 ki nazar se.',
    author: 'Tariq Mehmood', date: 'Apr 14, 2026', readTime: '7 min read',
  },
  {
    id: 4, emoji: '🫓', category: 'Recipes', featured: false,
    title: 'Paratha Roll: Pakistan ka Sabse Pyara Street Food',
    excerpt: 'Paratha roll sirf khana nahi, yeh ek feeling hai. Subah ki chai ke saath ya raat ko late night snack — janiye kaise banate hain perfect paratha roll.',
    author: 'Chef Amna', date: 'Apr 10, 2026', readTime: '4 min read',
  },
  {
    id: 5, emoji: '🍟', category: 'Healthy Eating', featured: false,
    title: 'Loaded Fries: Guilt-Free Version Bhi Possible Hai',
    excerpt: 'Fries ko healthy banana mushkil nahi. Baked fries, low-fat cheese aur fresh vegetables ke saath aap ek nutritious version bana sakte hain jo taste mein bhi kamaal ho.',
    author: 'Sana Iqbal', date: 'Apr 6, 2026', readTime: '5 min read',
  },
  {
    id: 6, emoji: '🥗', category: 'Healthy Eating', featured: false,
    title: 'Ramzan Mein Healthy Iftar: Pizza 1981 ke Suggestions',
    excerpt: 'Ramzan mein fried food ki jagah healthy options choose karein. Hamare nutritionist ne kuch amazing iftar ideas share kiye hain jo tasty bhi hain aur healthy bhi.',
    author: 'Sana Iqbal', date: 'Apr 2, 2026', readTime: '6 min read',
  },
  {
    id: 7, emoji: '🍕', category: 'Food Culture', featured: false,
    title: 'Pizza Sizes Guide: Kaunsa Size Aapke Liye Sahi Hai?',
    excerpt: '7 inch se 18 inch tak — hamare paas 5 sizes hain. Akele khana ho ya family party, janiye kaunsa size aapki zaroorat ke mutabiq hai aur kitna budget chahiye.',
    author: 'Tariq Mehmood', date: 'Mar 28, 2026', readTime: '3 min read',
  },
  {
    id: 8, emoji: '🌙', category: 'Food Culture', featured: false,
    title: 'Midnight Cravings: Pizza 1981 Raat 2 Baje Tak Khula Hai',
    excerpt: 'Lahore ki raat aur pizza ka combination — kya baat hai! Hamaari midnight special deal mein 15% discount milti hai 11 PM se 2 AM tak. Janiye kaise order karein.',
    author: 'Ustad Khalid', date: 'Mar 24, 2026', readTime: '4 min read',
  },
  {
    id: 9, emoji: '👨‍👩‍👧‍👦', category: 'Recipes', featured: false,
    title: 'Family Deal Guide: Sab Ko Khush Karna Ab Aasaan Hai',
    excerpt: 'Ghar mein 6 log hain aur sab ki pasand alag hai? Hamaari family deals mein pizza, burgers, shawarma sab kuch hai. Janiye kaunsa deal aapke liye best value hai.',
    author: 'Sana Iqbal', date: 'Mar 20, 2026', readTime: '5 min read',
  },
];

const categories = ['All', 'Recipes', 'Healthy Eating', 'Food Culture'];

const WaveDown = ({ fill }: { fill: string }) => (
  <div className="absolute bottom-0 left-0 right-0 leading-none">
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
      <path d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1380,20 1440,45 L1440,90 L0,90 Z" fill={fill} />
    </svg>
  </div>
);

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const featured = posts[0];
  const filtered = posts.slice(1).filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <Navbar />

      {/* ── Hero banner ── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/pizza-banner-2.png" alt="Blog Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#1e3a5f]/70" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Badge className="bg-[#f5a623]/20 text-[#f5a623] border-[#f5a623]/30 mb-4 px-4 py-1.5 text-sm font-medium">
            Our Blog
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Food Stories &amp; <span className="text-[#f5a623]">Recipes</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Recipes, food culture aur tips — hamaari kitchen se aapke ghar tak.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="pl-10 rounded-full border-2 border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-[#f5a623] focus:ring-0" />
            </div>
            <Button className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-6 font-semibold">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* ── Category pills ── */}
      <section className="bg-white py-6 px-6 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                activeCategory === cat
                  ? 'bg-[#f5a623] border-[#f5a623] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-[#f5a623] hover:text-[#f5a623]'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured post ── */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#f5a623] font-semibold text-sm mb-6 flex items-center gap-2">
            <Tag size={14} /> Featured Post
          </p>
          <div className="grid lg:grid-cols-2 gap-10 items-center bg-[#1e3a5f] rounded-3xl p-8 md:p-12">
            <div className="flex justify-center">
              <span className="text-[140px] leading-none select-none">{featured.emoji}</span>
            </div>
            <div>
              <Badge className="bg-[#f5a623]/20 text-[#f5a623] border-[#f5a623]/30 mb-4 text-xs px-3 py-1">
                {featured.category}
              </Badge>
              <h2 className="text-3xl font-extrabold text-white mb-4 leading-snug">{featured.title}</h2>
              <p className="text-[#8a9bb0] leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-[#8a9bb0] mb-6">
                <span className="flex items-center gap-1"><User size={13} /> {featured.author}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {featured.readTime}</span>
                <span>{featured.date}</span>
              </div>
              <Button className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-7 py-4 font-semibold">
                Read Article <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Post grid ── navy section */}
      <section className="relative py-20 px-6 bg-[#1e3a5f]">
        <div className="absolute top-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
            <path d="M0,45 C180,0 360,90 540,45 C720,0 900,90 1080,45 C1260,0 1380,70 1440,45 L1440,0 L0,0 Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto pt-16">
          <h2 className="text-3xl font-extrabold text-white mb-10 text-center">
            Latest <span className="text-[#f5a623]">Articles</span>
            <span className="text-[#8a9bb0] text-lg font-normal ml-3">({filtered.length})</span>
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8a9bb0]">
              <p className="text-5xl mb-4">🔍</p>
              <p>No articles found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map(post => (
                <div key={post.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="bg-[#f5f0d8] flex items-center justify-center py-10">
                    <span className="text-7xl select-none">{post.emoji}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Badge className="bg-[#f5a623]/15 text-[#f5a623] border-[#f5a623]/30 text-xs px-3 py-1 w-fit mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-[#1e3a5f] mb-3 leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100 gap-2">
                      <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-12">
            <Button className="border-2 border-[#f5a623] bg-transparent text-[#f5a623] hover:bg-[#f5a623] hover:text-white rounded-full px-10 py-4 font-semibold transition-all">
              Load More Articles
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
            <path d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1380,20 1440,45 L1440,90 L0,90 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#1e3a5f] mb-3">Naye Articles Miss Mat Karein</h2>
          <p className="text-[#8a9bb0] mb-6 text-sm">Subscribe karein aur weekly recipes, food tips aur exclusive deals seedha inbox mein payein.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="aapka@email.com"
              className="flex-1 rounded-full border-2 border-gray-200 px-5 py-4 focus:border-[#f5a623] focus:ring-0" />
            <Button className="bg-[#f5a623] hover:bg-[#e09510] text-white rounded-full px-7 py-4 font-semibold whitespace-nowrap">
              Subscribe <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
