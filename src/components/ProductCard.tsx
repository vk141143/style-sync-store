
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product, useEcommerce } from '../contexts/EcommerceContext';
import { useToast } from '../hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useEcommerce();
  const { toast } = useToast();

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_LIKE', payload: product.id });
    
    if (!product.isLiked) {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart with default size and color
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: product.variants.sizes[0],
        color: product.variants.colors[0],
        quantity: 1
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Trending Badge */}
          {product.isTrending && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              TRENDING
            </div>
          )}
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-full shadow-md transition-colors ${
                product.isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${product.isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleQuickAdd}
              className="p-2 bg-white text-gray-600 hover:text-black rounded-full shadow-md transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          {/* Available Sizes */}
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {product.variants.sizes.slice(0, 4).map((size) => (
                <span key={size} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {size}
                </span>
              ))}
              {product.variants.sizes.length > 4 && (
                <span className="text-xs text-gray-500">+{product.variants.sizes.length - 4} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
