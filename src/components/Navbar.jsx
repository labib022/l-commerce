import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const userDropdownRef = useRef(null);
  const deptDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target)) {
        setIsDeptDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery.trim()}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const departments = [
    { name: 'Electronics', emoji: '📱', path: '/products?category=electronics' },
    { name: 'Clothing', emoji: '👕', path: '/products?category=clothing' },
    { name: 'Books', emoji: '📚', path: '/products?category=books' },
    { name: 'Home & Kitchen', emoji: '🏠', path: '/products?category=home' },
    { name: 'Sports', emoji: '⚽', path: '/products?category=sports' },
    { name: 'Beauty & Health', emoji: '💄', path: '/products?category=beauty' },
  ];

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>

      {/* ===== ROW 1: TOP BAR ===== */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-1">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-extrabold">
                <span className="text-blue-600">E</span>
                <span className="text-gray-800">-Shop</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full border-2 border-blue-600 rounded-lg overflow-hidden">
                <select className="px-3 py-2 bg-gray-50 border-r border-gray-200 text-sm text-gray-600 focus:outline-none cursor-pointer">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Books</option>
                  <option>Sports</option>
                  <option>Home & Kitchen</option>
                  <option>Beauty & Health</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search for more than 100 products..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                />
                <button
                  onClick={() => searchQuery.trim() && navigate(`/products?keyword=${searchQuery}`)}
                  className="px-5 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  🔍
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">

              {/* Phone - Desktop only */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs text-gray-500">For Support?</span>
                <span className="text-sm font-bold text-gray-800">+880-1234-5678</span>
              </div>

              {/* User */}
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-xl">👤</span>
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                    <span className="text-xs">{isUserDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="font-semibold text-gray-800 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        📦 My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/register" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Register
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <button className="p-2 text-gray-700 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50">
                <span className="text-xl">🤍</span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-xl">🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Cart Total - Desktop */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs text-gray-500">Your Cart</span>
                <span className="text-sm font-bold text-gray-800">{itemCount} items</span>
              </div>

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
      </div>

      {/* ===== ROW 2: BOTTOM NAV BAR (Desktop only) ===== */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-11 gap-8">

            {/* Shop by Departments */}
            <div className="relative" ref={deptDropdownRef}>
              <button
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors h-9"
              >
                <span>☰</span>
                Shop by Departments
                <span className="text-xs">{isDeptDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isDeptDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {departments.map((dept) => (
                    <Link
                      key={dept.name}
                      to={dept.path}
                      onClick={() => setIsDeptDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                    >
                      <span>{dept.emoji}</span>
                      {dept.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                }
              >
                Products
              </NavLink>
              {user && (
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                  }
                >
                  Orders
                </NavLink>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
                  }
                >
                  Admin
                </NavLink>
              )}
            </div>

            {/* Right side promo text */}
            <div className="ml-auto text-sm text-gray-500">
              🚚 Free shipping on orders over <span className="font-bold text-blue-600">$50</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-4 space-y-3">

          {/* Mobile Search */}
          <div className="flex border-2 border-blue-600 rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/products?keyword=${searchQuery}`);
                  setIsMenuOpen(false);
                }
              }}
              className="px-4 bg-blue-600 text-white"
            >
              🔍
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1">
            {[
              { to: '/', label: '🏠 Home' },
              { to: '/products', label: '🛍️ Products' },
              ...(user ? [{ to: '/orders', label: '📦 Orders' }] : []),
              ...(isAdmin ? [{ to: '/admin/dashboard', label: '⚙️ Admin' }] : []),
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Auth */}
          <div className="border-t border-gray-100 pt-3">
            {user ? (
              <div className="space-y-1">
                <p className="px-4 text-sm text-gray-500">Hello, <span className="font-semibold text-gray-800">{user.name}</span></p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;