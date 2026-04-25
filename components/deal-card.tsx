'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-context';
import { formatPrice } from '@/lib/utils-app';
import { Deal } from '@/lib/types';
import { Plus, Minus, Tag } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onAddToCart?: () => void;
}

export function DealCard({ deal, onAddToCart }: DealCardProps) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    deal.items.forEach((itemId) => {
      addToCart({
        menuItemId: itemId,
        quantity,
      });
    });
    setQuantity(1);
    onAddToCart?.();
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-accent/50 hover:border-accent transition group">
      {/* Header with Discount Badge */}
      <div className="relative w-full h-32 bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
        <div className="absolute top-3 right-3 bg-accent text-primary px-3 py-1 rounded-full flex items-center gap-1 font-bold">
          <Tag size={14} />
          {deal.discountPercentage}% OFF
        </div>
        <div className="text-5xl">🎉</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-1 text-lg line-clamp-2">{deal.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-accent font-bold text-lg">{formatPrice(deal.discountedPrice)}</span>
          <span className="text-muted-foreground line-through text-sm">{formatPrice(deal.originalPrice)}</span>
        </div>

        {/* Items Count */}
        <p className="text-xs text-muted-foreground mb-4">{deal.items.length} items included</p>

        {/* Quantity Selector & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-muted-foreground hover:text-accent transition"
            >
              <Minus size={16} />
            </button>
            <span className="px-2 py-1 text-foreground font-medium text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-muted-foreground hover:text-accent transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-accent hover:bg-accent/90 text-primary text-sm"
          >
            Add Deal
          </Button>
        </div>
      </div>
    </div>
  );
}
