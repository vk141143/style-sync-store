import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { useEcommerce } from '../contexts/EcommerceContext';
import { useToast } from '../hooks/use-toast';
import ProductCarousel from '../components/ProductCarousel';
import ARTryOn from '../components/ARTryOn';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useEcommerce();
  const { toast } = useToast();
  
  const product = state.products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showARTryOn, setShowARTryOn] = useState(false);
  const [currentProductImage, setCurrentProductImage] = useState(product?.image || '');

  // Get alternate products (same category, excluding current product)
  const alternateProducts = state.products.filter(p => 
    p.category === product?.category && p.id !== product?.id
  ).slice(0, 8);

  // Get trending products for carousel
  const trendingProducts = state.products.filter(p => p.isTrending && p.id !== product?.id).slice(0, 8);

  // Color variants - in a real app, this would come from the product data
  const colorVariants = {
    'Black': product?.image || '',
    'White': product?.image || '',
    'Blue': product?.image || '',
    'Red': product?.image || '',
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Update product image based on color selection
    if (colorVariants[color as keyof typeof colorVariants]) {
      setCurrentProductImage(colorVariants[color as keyof typeof colorVariants]);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select both size and color before purchasing.",
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart first
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity
      }
    });
    
    // Navigate to checkout
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select both size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    if (!product.isLiked) {
      dispatch({ type: 'TOGGLE_LIKE', payload: product.id });
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } else {
      dispatch({ type: 'TOGGLE_LIKE', payload: product.id });
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    }
  };

  const handleTryOn = () => {
    toast({
      title: "Try On Feature",
      description: "Virtual try-on feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={currentProductImage}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-semibold rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection with Visual Feedback */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`py-2 px-4 text-sm font-medium rounded-md border transition-colors ${
                      selectedColor === color
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-md bg-white text-center min-w-[60px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    if (!selectedSize || !selectedColor) {
                      toast({
                        title: "Please select options",
                        description: "Please select both size and color before adding to cart.",
                        variant: "destructive",
                      });
                      return;
                    }
                    dispatch({
                      type: 'ADD_TO_CART',
                      payload: { product, size: selectedSize, color: selectedColor, quantity }
                    });
                    toast({
                      title: "Added to Cart",
                      description: `${product.name} has been added to your cart.`,
                    });
                  }}
                  className="flex-1 bg-white text-black py-3 px-6 rounded-md font-medium border border-black hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (!product.isLiked) {
                      dispatch({ type: 'TOGGLE_LIKE', payload: product.id });
                      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
                      toast({
                        title: "Added to Wishlist",
                        description: `${product.name} has been added to your wishlist.`,
                      });
                    } else {
                      dispatch({ type: 'TOGGLE_LIKE', payload: product.id });
                      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
                      toast({
                        title: "Removed from Wishlist",
                        description: `${product.name} has been removed from your wishlist.`,
                      });
                    }
                  }}
                  className={`flex-1 py-3 px-6 rounded-md font-medium border transition-colors flex items-center justify-center ${
                    product.isLiked
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${product.isLiked ? 'fill-current' : ''}`} />
                  {product.isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                
                <button
                  onClick={() => setShowARTryOn(true)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Try On (AR)
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Comfortable fit for all-day wear</li>
                <li>• Easy care and maintenance</li>
                <li>• Available in multiple sizes and colors</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  "Amazing quality and perfect fit! Really happy with this purchase and would definitely recommend."
                </p>
                <p className="text-sm font-medium text-gray-900">Customer {review}</p>
                <p className="text-xs text-gray-500">Verified Purchase</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Products Carousel */}
        {trendingProducts.length > 0 && (
          <ProductCarousel products={trendingProducts} title="Trending Products" />
        )}

        {/* Alternate Products */}
        {alternateProducts.length > 0 && (
          <ProductCarousel 
            products={alternateProducts} 
            title={`More from ${product.category === 'men' ? 'Men\'s' : product.category === 'women' ? 'Women\'s' : product.category === 'couples' ? 'Couple\'s' : 'Student\'s'} Collection`} 
          />
        )}
      </div>

      {/* AR Try-On Modal */}
      <ARTryOn
        isOpen={showARTryOn}
        onClose={() => setShowARTryOn(false)}
        productName={product.name}
        productImage={currentProductImage}
      />
    </div>
  );
};

export default ProductDetailPage;
