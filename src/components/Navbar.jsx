import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, LogOut, User } from 'lucide-react';

const Navbar = ({ cartCount = 0, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartId');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🪑</span>
            <span className="text-2xl font-bold text-amber-600">Furni</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition"
            >
              <Home size={20} />
              <span className="hidden md:inline">Home</span>
            </Link>

            <Link
              to="/products"
              className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition"
            >
              <Package size={20} />
              <span className="hidden md:inline">Products</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition relative"
            >
              <ShoppingCart size={20} />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;