import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      alert(`✅ ${product.name} added to cart!`);
    } catch (err) {
      alert('Please login to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < full ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 flex flex-col">

      {/* Image Area */}
      <div
        className="relative bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <span className={isWishlisted ? 'text-red-500' : 'text-gray-400'}>
            {isWishlisted ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Product Image */}
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-contain p-4 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info Area */}
      <div className="p-3 flex flex-col flex-1">
        {/* Name */}
        <h3
          onClick={() => navigate(`/products/${product._id}`)}
          className="font-semibold text-gray-800 text-sm mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors"
        >
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-400 mb-1">
          {product.category?.name || 'General'}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-sm">
            {renderStars(product.ratings || 0)}
          </div>
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-600 font-bold text-lg">${price}</span>
          {product.discountPrice && (
            <span className="text-gray-400 line-through text-sm">${product.price}</span>
          )}
        </div>

        {/* Stock */}
        <p className={`text-xs font-medium mb-3 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✕ Out of Stock'}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">
              {quantity}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setQuantity(q => Math.min(product.stock, q + 1)); }}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : adding
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {adding ? '...' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;