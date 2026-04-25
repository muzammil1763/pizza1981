'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d1b2a]/95 backdrop-blur-sm">
      <div className="text-center">
        {/* Simple logo with pulse animation */}
        <div className="relative w-32 h-32 mx-auto animate-pulse">
          <Image 
            src="/pizzalogo.png" 
            alt="Pizza 1981 Logo" 
            fill 
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
