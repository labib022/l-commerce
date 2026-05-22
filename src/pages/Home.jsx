import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// ===== HERO SLIDES =====
const heroSlides = [
  {
    badge: '🔥 Hot Deals',
    title: 'Best Products &',
    title2: 'Best Prices',
    desc: 'Discover amazing products at unbeatable prices. Shop now and save big!',
    bg: 'from-blue-50 to-indigo-100',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    emoji: '📱',
  },
  {
    badge: '⚡ Flash Sale',
    title: 'Up to 50% Off',
    title2: 'This Weekend',
    desc: 'Limited time offers on electronics, clothing, and more. Don\'t miss out!',
    bg: 'from-green-50 to-emerald-100',
    btnColor: 'bg-green-600 hover:bg-green-700',
    emoji: '👕',
  },
  {
    badge: '🌟 New Arrivals',
    title: 'Fresh Collection',
    title2: 'Just Dropped',
    desc: 'Explore our latest collection of premium products curated just for you.',
    bg: 'from-purple-50 to-violet-100',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    emoji: '✨',
  },
];

const categoryEmojis = {
  Electronics: '📱',
  Clothing: '👕',
  Books: '📚',
  'Home & Kitchen': '🏠',
  Sports: '⚽',
  'Beauty & Health': '💄',
};

// ===== PRODUCT CARD (inline for Home) =====
const HomeProductCard = ({ product }) => {
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

// ===== MAIN HOME COMPONENT =====
const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newsletterData, setNewsletterData] = useState({ name: '', email: '', subscribe: false });
  const bestSellingRef = useRef(null);
  const slideInterval = useRef(null);

  // Auto-slide
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(slideInterval.current);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=10'),
        ]);
        setCategories(catRes.data);
        setTrendingProducts(prodRes.data.products);
        setBestSelling(prodRes.data.products.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = activeTab === 'All'
    ? trendingProducts
    : trendingProducts.filter(p => p.category?.name === activeTab);

  const scrollBestSelling = (dir) => {
    if (bestSellingRef.current) {
      bestSellingRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ===== SECTION 1: HERO ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Main Slider */}
          <div className={`flex-1 bg-gradient-to-br ${slide.bg} rounded-2xl p-8 md:p-12 relative overflow-hidden min-h-64 flex items-center transition-all duration-500`}>
            {/* Background decoration */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-9xl opacity-20 select-none">
              {slide.emoji}
            </div>
            <div className="relative z-10 max-w-md">
              <span className="inline-block bg-white bg-opacity-70 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {slide.badge}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight mb-2">
                {slide.title}<br />
                <span className="text-blue-600">{slide.title2}</span>
              </h1>
              <p className="text-gray-600 mb-6 text-sm md:text-base">{slide.desc}</p>
              <button
                onClick={() => navigate('/products')}
                className={`${slide.btnColor} text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg`}
              >
                SHOP NOW →
              </button>
            </div>

            {/* Slide Dots */}
            <div className="absolute bottom-4 left-8 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Promo Cards */}
          <div className="flex lg:flex-col gap-4 lg:w-72">
            <div className="flex-1 bg-green-50 rounded-2xl p-6 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
              <div className="absolute right-2 bottom-2 text-5xl opacity-20">🥗</div>
              <p className="text-green-600 font-bold text-lg">20% Off</p>
              <div className="w-8 h-0.5 bg-green-300 my-2"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Sale</p>
              <h3 className="font-bold text-gray-800 text-lg mt-1">Electronics</h3>
              <p className="text-blue-600 text-sm mt-2 font-medium">Shop Collection →</p>
            </div>
            <div className="flex-1 bg-pink-50 rounded-2xl p-6 relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
              <div className="absolute right-2 bottom-2 text-5xl opacity-20">🛍️</div>
              <p className="text-pink-600 font-bold text-lg">15% Off</p>
              <div className="w-8 h-0.5 bg-pink-300 my-2"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Sale</p>
              <h3 className="font-bold text-gray-800 text-lg mt-1">Fashion</h3>
              <p className="text-blue-600 text-sm mt-2 font-medium">Shop Collection →</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: CATEGORIES ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Shop by Category</h2>
          <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">
            View All Categories →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-6">
          {loading
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-28 lg:w-auto bg-white rounded-2xl p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mx-auto w-16"></div>
              </div>
            ))
            : categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="flex-shrink-0 w-28 lg:w-auto bg-white rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 cursor-pointer"
              >
                <div className="text-3xl mb-2">{categoryEmojis[cat.name] || '📦'}</div>
                <p className="text-xs font-semibold text-gray-700 truncate">{cat.name}</p>
              </Link>
            ))
          }
        </div>
      </section>

      {/* ===== SECTION 3: TRENDING PRODUCTS ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Trending Products</h2>
          <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">View All →</Link>
        </div>

        {/* Category Tabs */}
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

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
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
              <HomeProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ===== SECTION 4: PROMO BANNERS ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-pink-50 rounded-2xl p-8 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/products')}
          >
            <div>
              <p className="text-yellow-500 font-bold text-lg">Upto 25% Off</p>
              <h3 className="text-2xl font-extrabold text-gray-800 mt-1">Premium Books</h3>
              <p className="text-gray-500 text-sm mt-2">Very tasty knowledge you wish to get</p>
              <button className="mt-4 bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
                SHOW NOW
              </button>
            </div>
            <div className="text-7xl opacity-60">📚</div>
          </div>
          <div
            className="bg-blue-50 rounded-2xl p-8 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/products')}
          >
            <div>
              <p className="text-yellow-500 font-bold text-lg">Upto 25% Off</p>
              <h3 className="text-2xl font-extrabold text-gray-800 mt-1">Electronics</h3>
              <p className="text-gray-500 text-sm mt-2">Best gadgets at amazing prices</p>
              <button className="mt-4 bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
                SHOW NOW
              </button>
            </div>
            <div className="text-7xl opacity-60">📱</div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: BEST SELLING ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Best Selling Products</h2>
          <div className="flex items-center gap-3">
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">View All →</Link>
            <div className="flex gap-2">
              <button
                onClick={() => scrollBestSelling(-1)}
                className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                ‹
              </button>
              <button
                onClick={() => scrollBestSelling(1)}
                className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                ›
              </button>
            </div>
          </div>
        </div>
        <div
          ref={bestSellingRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        >
          {bestSelling.map(product => (
            <div key={product._id} className="flex-shrink-0 w-48 sm:w-56">
              <HomeProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 6: FEATURES ===== */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h4 className="font-bold text-gray-800 text-sm">{f.title}</h4>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 7: NEWSLETTER ===== */}
      <section className="container mx-auto px-4 py-6 pb-10">
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Get <span className="text-yellow-500">25% Discount</span>
              </h2>
              <h3 className="text-xl font-bold text-gray-800 mt-1">on your first purchase</h3>
              <p className="text-gray-500 text-sm mt-3 max-w-sm">
                Subscribe to our newsletter and get exclusive deals, updates and special offers directly in your inbox.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newsletterData.name}
                  onChange={(e) => setNewsletterData({ ...newsletterData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white"
                />
                <input
                  type="email"
                  placeholder="abc@mail.com"
                  value={newsletterData.email}
                  onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletterData.subscribe}
                    onChange={(e) => setNewsletterData({ ...newsletterData, subscribe: e.target.checked })}
                    className="rounded"
                  />
                  Subscribe to the newsletter
                </label>
                <button
                  onClick={() => {
                    if (newsletterData.email) {
                      alert('🎉 Subscribed successfully! Check your email.');
                      setNewsletterData({ name: '', email: '', subscribe: false });
                    }
                  }}
                  className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;