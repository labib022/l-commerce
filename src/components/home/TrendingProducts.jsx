import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

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
    } catch {
      alert('Please login to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col overflow-hidden">
      <div className="relative bg-gray-50 cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
        {discount && (
          <span className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-44 object-contain p-3"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.category?.name || ''}</p>
        <h3
          onClick={() => navigate(`/products/${product._id}`)}
          className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {'★★★★★'.split('').map((s, i) => (
            <span key={i} className={i < Math.floor(product.ratings || 0) ? 'text-yellow-400 text-xs' : 'text-gray-200 text-xs'}>{s}</span>
          ))}
          <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-600 font-bold">${price}</span>
          {product.discountPrice && <span className="text-gray-400 line-through text-xs">${product.price}</span>}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
            <span className="px-2 py-1 text-xs border-x border-gray-200">{quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); setQuantity(q => q + 1); }} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            {adding ? '...' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/categories'),
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.category?.name === activeTab);

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Trending Products</h2>
        <a href="/products" className="text-blue-600 text-sm font-medium hover:underline">View All →</a>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {['All', ...categories.map(c => c.name)].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="w-full h-44 bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingProducts;