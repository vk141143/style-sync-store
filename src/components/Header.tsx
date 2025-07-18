
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Settings } from 'lucide-react';
import { useEcommerce } from '../contexts/EcommerceContext';

const Header = () => {
  const { state, dispatch } = useEcommerce();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.searchQuery.trim()) {
      navigate('/products');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            StyleCo
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-black transition-colors">
              <Heart className="h-6 w-6" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.wishlist.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            <Link to="/admin-login" className="p-2 text-gray-700 hover:text-black transition-colors">
              <Settings className="h-6 w-6" />
            </Link>
            
            <button className="p-2 text-gray-700 hover:text-black transition-colors">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
