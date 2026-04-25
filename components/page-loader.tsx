'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading animation for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d1b2a]">
      <div className="text-center">
        {/* Logo with animation */}
        <div className="relative w-48 h-48 mx-auto mb-6 animate-logo-spin">
          <Image 
            src="/pizzalogo.png" 
            alt="Pizza 1981 Logo" 
            fill 
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Brand name with fade-in animation */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Pizza <span className="text-[#f5a623]">1981</span>
          </h1>
          <p className="text-white/60 text-sm mb-6">Quality Foods for Healthy Body</p>
          
          {/* Loading spinner */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#f5a623] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[#f5a623] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[#f5a623] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
