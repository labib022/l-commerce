import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const categoryEmojis = {
  Electronics: '💻',
  Clothing: '👕',
  Books: '📚',
  'Home & Kitchen': '🏠',
  Sports: '⚽',
  'Beauty & Health': '💄',
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">All Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Categories Found</h2>
        <p className="text-gray-600">Please check back later for categories.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => navigate(`/products?category=${cat._id}`)}
            className="bg-white rounded-xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-200 hover:border-blue-400"
          >
            <div className="text-4xl mb-3">{categoryEmojis[cat.name] || '🛍️'}</div>
            <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;