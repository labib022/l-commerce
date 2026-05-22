import React from 'react';
import { useCart } from '../context/CartContext';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const price = item.product?.discountPrice || item.product?.price || 0;

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
        <td className="p-4">${price.toFixed(2)}</td>
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
        <td className="p-4 font-bold">${(price * item.quantity).toFixed(2)}</td>
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
            <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
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
            <p className="font-bold mt-2">${(price * item.quantity).toFixed(2)}</p>
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

export default CartItem;