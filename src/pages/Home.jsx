import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = ({ cartId, onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загрузка продуктов
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      console.log(response.data); // Логирование данных с API
      if (Array.isArray(response.data)) {
        setProducts(response.data); // Устанавливаем только если это массив
      } else {
        console.error('Response data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!cartId) {
      alert('Cart not initialized. Please refresh the page.');
      return;
    }

    try {
      await cartAPI.add(cartId, product.id);
      onCartUpdate();
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Transform Your Space
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover elegant furniture that brings comfort and style to your home
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-700 transition transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Featured Products
        </h2>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          Array.isArray(products) && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="mt-4 text-gray-600">No products available</p>
            </div>
          )
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Furni?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted furniture made with finest materials</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">Fast and secure shipping to your doorstep</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">30-day money back guarantee on all items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
