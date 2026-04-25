'use client';

import { useApp } from '@/lib/app-context';
import { getMenuItemById, calculateCartTotal, formatPrice } from '@/lib/utils-app';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CartSummary() {
  const { state, removeFromCart } = useApp();
  const { subtotal, tax, total } = calculateCartTotal(state.cart.items, state.cart.deliveryFee);

  if (state.cart.items.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-center text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-primary">
          <Link href="/menu">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-bold text-lg text-foreground mb-4">Order Summary</h3>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {state.cart.items.map((item, index) => {
          const menuItem = getMenuItemById(item.menuItemId);
          if (!menuItem) return null;

          return (
            <div key={index} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <p className="text-foreground font-medium">{menuItem.name}</p>
                <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent font-medium">
                  {formatPrice(menuItem.price * item.quantity)}
                </span>
                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="text-destructive hover:text-destructive/80 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%):</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee:</span>
          <span className="text-foreground">{formatPrice(state.cart.deliveryFee)}</span>
        </div>

        <div className="border-t border-border pt-2 flex justify-between font-bold">
          <span className="text-foreground">Total:</span>
          <span className="text-accent text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-primary" size="lg">
        Proceed to Checkout
      </Button>
    </div>
  );
}
