
import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2X2, List } from 'lucide-react';
import { useEcommerce } from '../contexts/EcommerceContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const ProductsPage = () => {
  const { state, dispatch } = useEcommerce();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    if (categoryParam && categoryParam !== state.selectedCategory) {
      dispatch({ type: 'SET_CATEGORY', payload: categoryParam });
    }
  }, [categoryParam, state.selectedCategory, dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = [...state.products];

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === state.selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= state.selectedFilters.priceRange[0] &&
      product.price <= state.selectedFilters.priceRange[1]
    );

    // Filter by sizes
    if (state.selectedFilters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.sizes.some(size => state.selectedFilters.sizes.includes(size))
      );
    }

    // Filter by colors
    if (state.selectedFilters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.colors.some(color => state.selectedFilters.colors.includes(color))
      );
    }

    return filtered;
  }, [state.products, state.searchQuery, state.selectedCategory, state.selectedFilters]);

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <FilterSidebar />

          {/* Main Content */}
          <div className="flex-1 ml-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {state.selectedCategory === 'all' ? 'All Products' : 
                   state.selectedCategory === 'men' ? 'Men\'s Collection' :
                   state.selectedCategory === 'women' ? 'Women\'s Collection' :
                   'Couple\'s Collection'}
                </h1>
                <p className="text-gray-600 mt-1">{filteredProducts.length} products found</p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
                    dispatch({ type: 'SET_CATEGORY', payload: 'all' });
                    dispatch({ type: 'SET_FILTERS', payload: { priceRange: [0, 300], sizes: [], colors: [] } });
                  }}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
