import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity >= 1) {
      await updateCartItem(item._id, newQuantity);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(item._id);
    }
  };

  const price = item.product?.discountPrice || item.product?.price;

  return (
    <>
      {/* Desktop Table Row */}
      <tr className="hidden md:table-row border-b">
        <td className="p-4">
          <div className="flex items-center">
            <img
              src={item.product?.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
              alt={item.product?.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <span className="font-semibold">{item.product?.name}</span>
          </div>
        </td>
        <td className="p-4">${price?.toFixed(2)}</td>
        <td className="p-4">
          <div className="flex items-center border rounded-lg w-24">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={loading}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={loading}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </td>
        <td className="p-4 font-bold">${(price * item.quantity)?.toFixed(2)}</td>
        <td className="p-4">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>

      {/* Mobile Card */}
      <div className="md:hidden border-b p-4">
        <div className="flex gap-4">
          <img
            src={item.product?.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
            alt={item.product?.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{item.product?.name}</h3>
            <p className="text-blue-600 font-bold">${price?.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={loading}
                className="p-1 border rounded disabled:opacity-50"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={loading}
                className="p-1 border rounded disabled:opacity-50"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="font-bold mt-2">${(price * item.quantity)?.toFixed(2)}</p>
          </div>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-red-500 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

const Cart = () => {
  const { cart, loading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h14l-1.35 6.75a2 2 0 11-1.75-.75H7l-1.35 6.75a2 2 0 11-1.75-.75H7" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart ({itemCount} items)</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <table className="hidden md:table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium">Image</th>
                <th className="p-4 text-left font-medium">Product Name</th>
                <th className="p-4 text-left font-medium">Price</th>
                <th className="p-4 text-left font-medium">Quantity</th>
                <th className="p-4 text-left font-medium">Total</th>
                <th className="p-4 text-left font-medium">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </tbody>
          </table>

          <div className="md:hidden">
            {cart.items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free (over $100)' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Coupon code"
                className="w-full px-4 py-2 border border-gray-300 rounded-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors">
                Apply
              </button>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/products"
              className="block text-center text-blue-600 mt-4 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;