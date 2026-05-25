import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
      <button
        onClick={() => navigate('/products')}
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Shopping
      </button>
    </div>
  );
};

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    await updateCartItem(itemId, newQty);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.items.length} items)</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const price = item.product?.discountPrice || item.product?.price || 0;
                  const itemTotal = price * item.quantity;
                  return (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-4 font-semibold">{item.product?.name}</td>
                      <td className="p-4">${price.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center border rounded-lg w-fit">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={loading}
                            className="px-3 py-1 hover:bg-gray-100 font-bold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-x">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={loading}
                            className="px-3 py-1 hover:bg-gray-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">${itemTotal.toFixed(2)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700 text-xl"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {cart.items.map((item) => {
              const price = item.product?.discountPrice || item.product?.price || 0;
              const itemTotal = price * item.quantity;
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  <img
                    src={item.product?.images?.[0]?.url || 'https://placehold.co/80x80?text=No+Image'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product?.name}</p>
                    <p className="text-blue-600 font-bold mt-1">${price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={loading}
                          className="px-2 py-1 hover:bg-gray-100 font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-x text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={loading}
                          className="px-2 py-1 hover:bg-gray-100 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">${itemTotal.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={loading}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal > 0 && subtotal <= 100 && (
                <p className="text-xs text-green-600">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors">Apply</button>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full text-center text-blue-600 text-sm hover:underline transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;