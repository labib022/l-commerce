import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const categoryEmojis = {
  Electronics: '📱',
  Clothing: '👕',
  Books: '📚',
  'Home & Kitchen': '🏠',
  Sports: '⚽',
  'Beauty & Health': '💄',
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Shop by Category</h2>
        <Link to="/categories" className="text-blue-600 text-sm font-medium hover:underline">
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
              <button
                key={cat._id}
                onClick={() => navigate(`/products?category=${cat._id}`)}
                className="flex-shrink-0 w-28 lg:w-auto bg-white rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100"
              >
                <div className="text-3xl mb-2">{categoryEmojis[cat.name] || '📦'}</div>
                <p className="text-xs font-semibold text-gray-700 truncate">{cat.name}</p>
              </button>
            ))
        }
      </div>
    </section>
  );
};

export default CategorySection;