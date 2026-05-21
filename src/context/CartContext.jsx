import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to cart';
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update cart';
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const response = await api.delete(`/cart/${itemId}`);
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove from cart';
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const response = await api.delete('/cart/clear');
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.totalPrice || 0;

  const value = {
    cart,
    loading,
    itemCount,
    totalPrice,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};