import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'men' | 'women' | 'couples' | 'students';
  type: string;
  description: string;
  variants: {
    sizes: string[];
    colors: string[];
  };
  isLiked: boolean;
  isTrending: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface EcommerceState {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  selectedCategory: string;
  selectedFilters: {
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
  };
  cartView: 'list' | 'grid';
}

type EcommerceAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<EcommerceState['selectedFilters']> }
  | { type: 'TOGGLE_LIKE'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; color: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART_VIEW' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string };

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'men',
    type: 'T-Shirts',
    description: 'Ultra-soft premium cotton t-shirt with modern fit. Perfect for casual wear and layering.',
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy', 'Gray']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Elegant Floral Dress',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    category: 'women',
    type: 'Dresses',
    description: 'Beautiful floral dress with flowing silhouette. Perfect for special occasions and summer events.',
    variants: {
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Floral Pink', 'Floral Blue', 'Floral White']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.8,
    reviews: 203
  },
  {
    id: '3',
    name: 'Matching Couple Hoodies',
    price: 149.99,
    originalPrice: 180.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    category: 'couples',
    type: 'Hoodies',
    description: 'Adorable matching hoodies for couples. Soft, comfortable, and perfect for those cozy moments together.',
    variants: {
      sizes: ['S/S', 'M/M', 'L/L', 'XL/XL'],
      colors: ['Black/Black', 'Gray/Gray', 'Navy/Navy']
    },
    isLiked: false,
    isTrending: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '4',
    name: 'Classic Denim Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500',
    category: 'men',
    type: 'Jackets',
    description: 'Timeless denim jacket with classic styling. A wardrobe essential that never goes out of style.',
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Light Blue', 'Dark Blue', 'Black']
    },
    isLiked: false,
    isTrending: false,
    rating: 4.3,
    reviews: 156
  },
  {
    id: '5',
    name: 'Chic Blazer',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    category: 'women',
    type: 'Blazers',
    description: 'Professional chic blazer perfect for office wear or smart casual occasions.',
    variants: {
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Navy', 'Beige']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.7,
    reviews: 94
  },
  {
    id: '6',
    name: 'Matching Date Night Set',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=500',
    category: 'couples',
    type: 'Sets',
    description: 'Elegant matching outfit set perfect for date nights and special occasions.',
    variants: {
      sizes: ['S/S', 'M/M', 'L/L'],
      colors: ['Black/Black', 'Wine/Wine', 'Navy/Navy']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '7',
    name: 'Student Backpack Set',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'students',
    type: 'Accessories',
    description: 'Complete backpack set perfect for students with laptop compartment and organizers.',
    variants: {
      sizes: ['One Size'],
      colors: ['Black', 'Navy', 'Gray', 'Burgundy']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.4,
    reviews: 167
  },
  {
    id: '8',
    name: 'Campus Casual Hoodie',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    category: 'students',
    type: 'Hoodies',
    description: 'Comfortable and stylish hoodie perfect for campus life and study sessions.',
    variants: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Heather Gray', 'Navy', 'Forest Green', 'Maroon']
    },
    isLiked: false,
    isTrending: false,
    rating: 4.2,
    reviews: 89
  },
  {
    id: '9',
    name: 'Study Buddy T-Shirt Pack',
    price: 39.99,
    originalPrice: 55.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'students',
    type: 'T-Shirts',
    description: 'Pack of 3 comfortable t-shirts designed for long study sessions and campus activities.',
    variants: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Multi-Pack A', 'Multi-Pack B', 'Multi-Pack C']
    },
    isLiked: false,
    isTrending: true,
    rating: 4.6,
    reviews: 234
  }
];

const initialState: EcommerceState = {
  products: initialProducts,
  cart: [],
  wishlist: [],
  searchQuery: '',
  selectedCategory: 'all',
  selectedFilters: {
    priceRange: [0, 300],
    sizes: [],
    colors: []
  },
  cartView: 'grid'
};

function ecommerceReducer(state: EcommerceState, action: EcommerceAction): EcommerceState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_FILTERS':
      return {
        ...state,
        selectedFilters: { ...state.selectedFilters, ...action.payload }
      };
    
    case 'TOGGLE_LIKE':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload
            ? { ...product, isLiked: !product.isLiked }
            : product
        )
      };
    
    case 'ADD_TO_CART':
      const existingCartItem = state.cart.find(
        item => item.id === action.payload.product.id &&
                item.selectedSize === action.payload.size &&
                item.selectedColor === action.payload.color
      );
      
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === existingCartItem.id &&
            item.selectedSize === existingCartItem.selectedSize &&
            item.selectedColor === existingCartItem.selectedColor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        cart: [...state.cart, {
          ...action.payload.product,
          quantity: action.payload.quantity,
          selectedSize: action.payload.size,
          selectedColor: action.payload.color
        }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => `${item.id}-${item.selectedSize}-${item.selectedColor}` !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          `${item.id}-${item.selectedSize}-${item.selectedColor}` === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'TOGGLE_CART_VIEW':
      return {
        ...state,
        cartView: state.cartView === 'grid' ? 'list' : 'grid'
      };
    
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };
    
    default:
      return state;
  }
}

const EcommerceContext = createContext<{
  state: EcommerceState;
  dispatch: React.Dispatch<EcommerceAction>;
} | null>(null);

export function EcommerceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ecommerceReducer, initialState);

  return (
    <EcommerceContext.Provider value={{ state, dispatch }}>
      {children}
    </EcommerceContext.Provider>
  );
}

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
}
