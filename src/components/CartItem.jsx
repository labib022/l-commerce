import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity >= 1) {
      await updateCartItem(item._id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item._id);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={item.product?.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image'}
        alt={item.product?.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold">{item.product?.name}</h3>
        <p className="text-blue-600 font-bold">${item.product?.discountPrice || item.product?.price}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="px-2 py-1 border rounded-l"
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="px-2 py-1 border rounded-r"
        >
          +
        </button>
      </div>
      <div className="ml-4 text-right">
        <p className="font-bold">${(item.product?.discountPrice || item.product?.price) * item.quantity}</p>
        <button onClick={handleRemove} className="text-red-500 text-sm">Remove</button>
      </div>
    </div>
  );
};

export default CartItem;