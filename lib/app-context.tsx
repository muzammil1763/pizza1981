'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Cart, CartItem, AuthUser, AppState } from './types';

type AppAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { index: number; item: CartItem } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATE'; payload: Partial<AppState> };

// Load initial state from localStorage
const getInitialState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      cart: {
        location: 'lahore',
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
      },
      selectedLocation: 'lahore',
    };
  }

  try {
    const savedUser = localStorage.getItem('pizza1981_user');
    const savedCart = localStorage.getItem('pizza1981_cart');
    const savedLocation = localStorage.getItem('pizza1981_location');

    const user = savedUser ? JSON.parse(savedUser) : null;
    const cart = savedCart ? JSON.parse(savedCart) : {
      location: savedLocation || 'lahore',
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0,
    };

    return {
      user,
      isLoggedIn: !!user,
      isAdmin: user?.isAdmin || false,
      cart,
      selectedLocation: savedLocation || 'lahore',
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return {
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      cart: {
        location: 'lahore',
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
      },
      selectedLocation: 'lahore',
    };
  }
};

const initialState: AppState = getInitialState();

const AppContext = createContext<{
  state: AppState;
  setUser: (user: AuthUser | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItem: (index: number, item: CartItem) => void;
  clearCart: () => void;
  setLocation: (location: string) => void;
  logout: () => void;
} | undefined>(undefined);

function cartReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_USER': {
      const newState = {
        ...state,
        user: action.payload,
        isLoggedIn: !!action.payload,
        isAdmin: action.payload?.isAdmin || false,
      };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('pizza1981_user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('pizza1981_user');
        }
      }
      return newState;
    }

    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.items.findIndex(
        (item) =>
          item.menuItemId === action.payload.menuItemId &&
          item.variant === action.payload.variant
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = [...state.cart.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.cart.items, action.payload];
      }

      const newCart = { ...state.cart, items: newItems };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pizza1981_cart', JSON.stringify(newCart));
      }

      return {
        ...state,
        cart: newCart,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.cart.items.filter(
        (item) => item.menuItemId !== action.payload
      );
      const newCart = { ...state.cart, items: newItems };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pizza1981_cart', JSON.stringify(newCart));
      }
      return {
        ...state,
        cart: newCart,
      };
    }

    case 'UPDATE_CART_ITEM': {
      const newItems = [...state.cart.items];
      newItems[action.payload.index] = action.payload.item;
      const newCart = { ...state.cart, items: newItems };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pizza1981_cart', JSON.stringify(newCart));
      }
      return {
        ...state,
        cart: newCart,
      };
    }

    case 'CLEAR_CART': {
      const newCart = {
        ...state.cart,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      };
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pizza1981_cart', JSON.stringify(newCart));
      }
      return {
        ...state,
        cart: newCart,
      };
    }

    case 'SET_LOCATION':
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('pizza1981_location', action.payload);
      }
      return {
        ...state,
        selectedLocation: action.payload,
        cart: { ...state.cart, location: action.payload },
      };

    case 'LOGOUT':
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pizza1981_user');
        localStorage.removeItem('pizza1981_cart');
      }
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isAdmin: false,
        cart: {
          location: state.selectedLocation,
          items: [],
          subtotal: 0,
          tax: 0,
          deliveryFee: 0,
          total: 0,
        },
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const setUser = useCallback((user: AuthUser | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  }, []);

  const removeFromCart = useCallback((menuItemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: menuItemId });
  }, []);

  const updateCartItem = useCallback((index: number, item: CartItem) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { index, item } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setLocation = useCallback((location: string) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setUser,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        setLocation,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
