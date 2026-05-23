import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiscountSection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default DiscountSection;