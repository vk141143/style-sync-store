
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid2X2, List, Trash2, Plus, Minus } from 'lucide-react';
import { useEcommerce } from '../contexts/EcommerceContext';
import { useToast } from '../hooks/use-toast';

const CartPage = () => {
  const { state, dispatch } = useEcommerce();
  const { toast } = useToast();

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some amazing products to get started!</p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART_VIEW' })}
              className={`p-2 rounded ${state.cartView === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART_VIEW' })}
              className={`p-2 rounded ${state.cartView === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`space-y-4 ${
              state.cartView === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-4'
            }`}>
              {state.cart.map((item) => {
                const itemId = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
                
                return (
                  <div
                    key={itemId}
                    className={`bg-white rounded-lg shadow-sm p-6 ${
                      state.cartView === 'list' ? 'flex items-center space-x-6' : ''
                    }`}
                  >
                    <div className={`${state.cartView === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`object-cover rounded-md ${
                          state.cartView === 'list' ? 'w-24 h-24' : 'w-full h-48'
                        }`}
                      />
                    </div>
                    
                    <div className={`${state.cartView === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>Size: {item.selectedSize}</p>
                        <p>Color: {item.selectedColor}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityUpdate(itemId, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 border border-gray-300 rounded-md bg-white text-center min-w-[50px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(itemId, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(itemId)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
                  </p>
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/products"
                className="block text-center text-gray-600 hover:text-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
