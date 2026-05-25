import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    country: ''
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'profile') {
      setProfileForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        zip: user?.address?.zip || '',
        country: user?.address?.country || ''
      });
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.get('/orders/my');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      const response = await api.put('/auth/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          zip: profileForm.zip,
          country: profileForm.country
        }
      });
      // ✅ localStorage update
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...savedUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ text: 'Password updated successfully! ✅', type: 'success' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setPasswordMessage({
        text: error.response?.data?.message || 'Failed to update password',
        type: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                {getUserInitials()}
              </div>
              <h3 className="font-bold text-gray-800 text-center">{user?.name}</h3>
              <p className="text-sm text-gray-500 text-center truncate w-full text-center">
                {user?.email}
              </p>
              {user?.role === 'admin' && (
                <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border-l-4 ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-600 border-blue-600 font-medium'
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                <span>📦</span> My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border-l-4 ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600 border-blue-600 font-medium'
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                <span>👤</span> Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border-l-4 ${
                  activeTab === 'password'
                    ? 'bg-blue-50 text-blue-600 border-blue-600 font-medium'
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                <span>🔒</span> Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl shadow-sm p-6">

            {/* ── Tab 1: My Orders ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border rounded-lg p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-bold text-gray-800">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                            </span>
                          </div>

                          {/* Items Preview */}
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img
                                  src={item.image || 'https://placehold.co/50x50?text=No+Image'}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">×{item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                +{order.items.length - 2} more
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                              order.paymentMethod === 'cod'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.paymentMethod?.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-gray-800">
                                ${(order.totalPrice + order.shippingPrice).toFixed(2)}
                              </span>
                              <button
                                onClick={() => toggleOrder(order._id)}
                                className="text-blue-600 text-sm font-medium hover:underline"
                              >
                                {expandedOrder === order._id ? 'Hide Details ▲' : 'View Details ▼'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedOrder === order._id && (
                          <div className="p-4 border-t bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {/* Shipping Address */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-2">📍 Shipping Address</h4>
                                <p className="text-sm text-gray-600">{order.shippingAddress?.street}</p>
                                <p className="text-sm text-gray-600">
                                  {order.shippingAddress?.city}, {order.shippingAddress?.zip}
                                </p>
                                <p className="text-sm text-gray-600">{order.shippingAddress?.country}</p>
                              </div>

                              {/* Order Summary */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-2">💰 Price Summary</h4>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Subtotal</span>
                                  <span>${order.totalPrice?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Shipping</span>
                                  <span>
                                    {order.shippingPrice === 0
                                      ? <span className="text-green-600">Free</span>
                                      : `$${order.shippingPrice?.toFixed(2)}`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm font-bold border-t mt-1 pt-1">
                                  <span>Total</span>
                                  <span>${(order.totalPrice + order.shippingPrice).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* All Items */}
                            <h4 className="font-semibold mb-3">🛍️ All Items</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-2 border-b last:border-0">
                                  <img
                                    src={item.image || 'https://placehold.co/50x50?text=No+Image'}
                                    alt={item.name}
                                    className="w-14 h-14 object-cover rounded-lg border"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      ${item.price?.toFixed(2)} × {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-semibold text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab 2: Profile Settings ── */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

                {profileSuccess && (
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <span>✅</span> Profile updated successfully!
                  </div>
                )}
                {profileError && (
                  <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <span>❌</span> {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email (cannot be changed)</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+880 1700 000000"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      value={profileForm.street}
                      onChange={e => setProfileForm({ ...profileForm, street: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={profileForm.zip}
                        onChange={e => setProfileForm({ ...profileForm, zip: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={e => setProfileForm({ ...profileForm, country: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {profileLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* ── Tab 3: Change Password ── */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> If you signed in with Google, please use Google to manage your password.
                  </p>
                </div>

                {passwordMessage.text && (
                  <div className={`px-4 py-3 rounded-lg mb-4 flex items-center gap-2 ${
                    passwordMessage.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span>{passwordMessage.type === 'success' ? '✅' : '❌'}</span>
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password * (min 6 characters)</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating...
                      </span>
                    ) : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;