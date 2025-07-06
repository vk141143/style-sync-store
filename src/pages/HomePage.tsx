
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEcommerce } from '../contexts/EcommerceContext';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { state } = useEcommerce();

  const trendingProducts = state.products.filter(product => product.isTrending);
  const featuredCategories = [
    {
      name: 'Men\'s Collection',
      image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800',
      link: '/products?category=men'
    },
    {
      name: 'Women\'s Collection',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      link: '/products?category=women'
    },
    {
      name: 'Couple\'s Collection',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      link: '/products?category=couples'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div 
          className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Style Your Story
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Discover the latest trends in fashion for men, women, and couples
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <span className="text-white/90 font-medium">Explore Collection →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link
              to="/trending"
              className="text-black font-medium hover:underline flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to get special offers, free giveaways, and exclusive deals.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-r-full hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
