import Image from 'next/image';

export function DataLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-24 h-24 mb-4 animate-pulse">
        <Image 
          src="/pizzalogo.png" 
          alt="Loading..." 
          fill 
          className="object-contain"
        />
      </div>
      <p className="text-[#8a9bb0] text-sm">Loading delicious items...</p>
    </div>
  );
}
