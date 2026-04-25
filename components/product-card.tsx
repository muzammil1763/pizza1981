'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-context';
import { formatPrice } from '@/lib/utils-app';
import { MenuItem } from '@/lib/types';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
}

export function ProductCard({ item, onAddToCart }: ProductCardProps) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      quantity,
    });
    setQuantity(1);
    onAddToCart?.();
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent transition group">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-primary/30 transition">
        <div className="text-4xl">🍕</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground mb-2 text-lg line-clamp-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.description || 'Delicious ' + item.category}
        </p>

        {/* Price */}
        <div className="text-accent font-bold text-xl mb-4">{formatPrice(item.price)}</div>

        {/* Quantity Selector & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-muted-foreground hover:text-accent transition"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1 text-foreground font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-muted-foreground hover:text-accent transition"
            >
              <Plus size={16} />
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-accent hover:bg-accent/90 text-primary"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
