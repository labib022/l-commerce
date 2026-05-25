import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import cartIcon from '../../assets/icons/cart.svg';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-1">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-extrabold">
                <span className="text-blue-600">E</span>
                <span className="text-gray-800">-Shop</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-6">
                <NavLink to="/" className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                }>Home</NavLink>
                <NavLink to="/products" className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                }>Products</NavLink>
                <NavLink to="/categories" className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                }>Categories</NavLink>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {!user ? (
                <Link
                  to="/auth/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full font-semibold text-sm hover:bg-green-600 transition-colors"
                  >
                    {getUserInitials()}
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-gray-100">

                      {/* User Info */}
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Dashboard - for ALL users */}
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <span>👤</span>
                        <span>Dashboard</span>
                      </Link>

                      {/* Admin Dashboard - ONLY for admin */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                          <span>⚙️</span>
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-1" />

                      {/* Logout */}
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-sm"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <button
                onClick={() => navigate('/cart')}
                className="relative bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <img src={cartIcon} alt="cart" className="w-7 h-7 object-contain" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="container mx-auto px-4 py-4 space-y-3">
            <div className="flex flex-col gap-1">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                }>Home</NavLink>
              <NavLink to="/products" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                }>Products</NavLink>
              <NavLink to="/categories" onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                }>Categories</NavLink>
              {user && (
                <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                  }>Dashboard</NavLink>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3">
              {!user ? (
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogoutClick}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🚪 Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleLogoutCancel}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              You want to logout from your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;