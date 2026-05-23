import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(slideInterval.current);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Slider */}
        <div className={`flex-1 bg-gradient-to-br ${slide.bg} rounded-2xl p-8 md:p-12 relative overflow-hidden min-h-64 flex items-center transition-all duration-500`}>
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
  );
};

export default HeroSection;