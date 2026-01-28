'use client';

/**
 * Cart Context
 * 
 * Manages shopping cart state with localStorage persistence.
 * Cart items include: product_id, variant_id, name, price, qty, image
 */

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getStoredCart, setStoredCart } from '@/lib/storage';

const CartContext = createContext(null);

/**
 * Cart reducer for state management
 * Handles all cart operations immutably
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.payload;

    case 'ADD_ITEM': {
      // Find existing item by product_id AND variant_id (or variant name for backwards compat)
      const existingIndex = state.findIndex(
        item => 
          item.id === action.payload.id && 
          (item.variant_id === action.payload.variant_id || item.variant === action.payload.variant)
      );
      
      if (existingIndex > -1) {
        // Update quantity of existing item
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (action.payload.quantity || action.payload.qty || 1),
        };
        return updated;
      }
      
      // Add new item with normalized structure
      return [...state, {
        id: action.payload.id,
        product_id: action.payload.product_id || action.payload.id,
        variant_id: action.payload.variant_id || null,
        name: action.payload.name,
        price: action.payload.price,
        image: action.payload.image,
        variant: action.payload.variant || 'Default',
        quantity: action.payload.quantity || action.payload.qty || 1,
      }];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        item => !(item.id === action.payload.id && item.variant === action.payload.variant)
      );

    case 'UPDATE_QUANTITY': {
      return state.map(item => {
        if (item.id === action.payload.id && item.variant === action.payload.variant) {
          return { ...item, quantity: Math.max(1, action.payload.quantity) };
        }
        return item;
      });
    }

    case 'CLEAR':
      return [];

    default:
      return state;
  }
};

/**
 * Cart Provider Component
 * Wraps the app and provides cart state and actions
 */
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const stored = getStoredCart();
    dispatch({ type: 'INIT', payload: stored });
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      setStoredCart(cart);
    }
  }, [cart, isHydrated]);

  /**
   * Add item to cart
   * @param {Object} product - Product data with id, name, price, image, variant
   */
  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  /**
   * Remove item from cart
   * @param {string} id - Product ID
   * @param {string} variant - Variant name
   */
  const removeItem = (id, variant) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, variant } });
  };

  /**
   * Update item quantity
   * @param {string} id - Product ID
   * @param {string} variant - Variant name
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (id, variant, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, variant, quantity } });
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  // Calculate totals
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /**
   * Get cart items formatted for order API
   * @returns {Array} Items array for order creation
   */
  const getItemsForOrder = () => {
    return cart.map(item => ({
      id: item.id,
      product_id: item.product_id || item.id,
      variant_id: item.variant_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      variant: item.variant,
      image: item.image,
    }));
  };

  const value = {
    cart,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    getItemsForOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 * @returns {Object} Cart state and actions
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
