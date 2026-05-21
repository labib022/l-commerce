import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const price = product.discountPrice || product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-600 font-bold">${price}</span>
              {product.discountPrice && (
                <span className="text-gray-500 line-through ml-2">${product.price}</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;