import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

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
              className="px-2 py-1 hover:bg-gray-100"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </td>
        <td className="p-4 font-bold">${(price * item.quantity)?.toFixed(2)}</td>
        <td className="p-4">
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>

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
                className="p-1 border rounded"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-1 border rounded"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="font-bold mt-2">${(price * item.quantity)?.toFixed(2)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-500"
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
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <table className="hidden md:table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <CartItem key={item._id} item={item} />
              ))}
            </tbody>
          </table>

          <div className="md:hidden">
            {cart.items.map(item => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:w-80">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="w-full px-4 py-2 border rounded-lg mb-2"
              />
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
                Apply Coupon
              </button>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
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