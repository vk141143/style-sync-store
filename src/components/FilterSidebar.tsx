
import React from 'react';
import { useEcommerce } from '../contexts/EcommerceContext';

const FilterSidebar = () => {
  const { state, dispatch } = useEcommerce();

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'men', name: 'Men' },
    { id: 'women', name: 'Women' },
    { id: 'couples', name: 'Couples' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Beige', 'Pink', 'Blue', 'Red'];

  const handleCategoryChange = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = state.selectedFilters.sizes;
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    dispatch({ type: 'SET_FILTERS', payload: { sizes: newSizes } });
  };

  const handleColorToggle = (color: string) => {
    const currentColors = state.selectedFilters.colors;
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    dispatch({ type: 'SET_FILTERS', payload: { colors: newColors } });
  };

  const handlePriceChange = (min: number, max: number) => {
    dispatch({ type: 'SET_FILTERS', payload: { priceRange: [min, max] } });
  };

  return (
    <div className="w-64 bg-white p-6 border-r">
      <h2 className="text-lg font-semibold mb-6">Filters</h2>
      
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={state.selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={state.selectedFilters.priceRange[0] === 0 && state.selectedFilters.priceRange[1] === 50}
              onChange={() => handlePriceChange(0, 50)}
              className="mr-2"
            />
            <span className="text-sm">Under $50</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={state.selectedFilters.priceRange[0] === 50 && state.selectedFilters.priceRange[1] === 100}
              onChange={() => handlePriceChange(50, 100)}
              className="mr-2"
            />
            <span className="text-sm">$50 - $100</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={state.selectedFilters.priceRange[0] === 100 && state.selectedFilters.priceRange[1] === 200}
              onChange={() => handlePriceChange(100, 200)}
              className="mr-2"
            />
            <span className="text-sm">$100 - $200</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={state.selectedFilters.priceRange[0] === 200 && state.selectedFilters.priceRange[1] === 300}
              onChange={() => handlePriceChange(200, 300)}
              className="mr-2"
            />
            <span className="text-sm">Over $200</span>
          </label>
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={state.selectedFilters.sizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
                className="mr-1"
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Colors</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center">
              <input
                type="checkbox"
                checked={state.selectedFilters.colors.includes(color)}
                onChange={() => handleColorToggle(color)}
                className="mr-2"
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          dispatch({ type: 'SET_CATEGORY', payload: 'all' });
          dispatch({ type: 'SET_FILTERS', payload: { priceRange: [0, 300], sizes: [], colors: [] } });
        }}
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
