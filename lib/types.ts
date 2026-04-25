// Menu and Products
export interface MenuItem {
  id: string;
  name: string;
  category: 'pizza' | 'burger' | 'shawarma' | 'sandwich' | 'fries' | 'drink' | 'paratha' | 'deal';
  price: number;
  description?: string;
  image?: string;
  variants?: MenuItemVariant[];
}

export interface MenuItemVariant {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  items: string[];
  image?: string;
}

// Cart and Orders
export interface CartItem {
  menuItemId: string;
  quantity: number;
  variant?: string;
  notes?: string;
}

export interface Cart {
  location: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export interface OrderStatus {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timestamp: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  location: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus['status'];
  statusHistory: OrderStatus[];
  createdAt: string;
  estimatedDelivery?: string;
}

// User and Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  addresses: UserAddress[];
  orders: Order[];
  favoriteItems: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Admin
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  activeCustomers: number;
  ordersTrend: { date: string; count: number; revenue: number }[];
}

export interface AppState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  cart: Cart;
  selectedLocation: string;
}
