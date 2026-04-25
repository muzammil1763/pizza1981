import { CartItem, MenuItem, Order } from './types';
import { PIZZA_1981_MENU, PIZZA_1981_LOCATIONS } from './menu-data';

export function getMenuItemById(id: string): MenuItem | undefined {
  return PIZZA_1981_MENU.find((item) => item.id === id);
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  if (category === 'all') return PIZZA_1981_MENU;
  return PIZZA_1981_MENU.filter((item) => item.category === category);
}

export function calculateCartTotal(
  items: CartItem[],
  deliveryFee: number = 200
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const menuItem = getMenuItemById(item.menuItemId);
    return sum + (menuItem?.price || 0) * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax + deliveryFee;

  return { subtotal, tax, total };
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getLocationById(id: string) {
  return PIZZA_1981_LOCATIONS.find((loc) => loc.id === id);
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-purple-100 text-purple-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'out_for_delivery':
      return 'bg-orange-100 text-orange-800';
    case 'delivered':
      return 'bg-green-200 text-green-900';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone.replace(/\D/g, ''));
}

// Mock authentication functions (for demo purposes)
export function mockLoginUser(email: string, password: string) {
  if (validateEmail(email) && password.length >= 6) {
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      isAdmin: email.includes('admin'),
    };
  }
  return null;
}

export function mockSignupUser(name: string, email: string, password: string, phone: string) {
  if (
    name.length >= 2 &&
    validateEmail(email) &&
    password.length >= 6 &&
    validatePhone(phone)
  ) {
    return {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      isAdmin: false,
    };
  }
  return null;
}
