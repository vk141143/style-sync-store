
import React from 'react';
import { useEcommerce } from '../contexts/EcommerceContext';
import ProductCard from '../components/ProductCard';

const TrendingPage = () => {
  const { state } = useEcommerce();
  const trendingProducts = state.products.filter(product => product.isTrending);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trending Products</h1>
          <p className="text-gray-600 mt-2">Discover what's popular right now</p>
        </div>

        {trendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trending products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
