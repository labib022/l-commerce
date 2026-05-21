import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Shop
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Home</NavLink>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Products</NavLink>
            {user && <NavLink to="/orders" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Orders</NavLink>}
            {isAdmin && <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Admin</NavLink>}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700">
                  <UserIcon className="h-6 w-6" />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
              </div>
            )}

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <NavLink to="/" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Products</NavLink>
            {user && <NavLink to="/orders" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Orders</NavLink>}
            {isAdmin && <NavLink to="/admin/dashboard" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;