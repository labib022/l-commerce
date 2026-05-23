import React, { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subscribe: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email) {
      alert('🎉 Subscribed successfully! Check your email.');
      setFormData({ name: '', email: '', subscribe: false });
    }
  };

  return (
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
            <div className="text-5xl mt-4">🌿</div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
              <input
                type="email"
                placeholder="abc@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subscribe}
                  onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
                  className="rounded"
                />
                Subscribe to the newsletter
              </label>
              <button
                type="submit"
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;