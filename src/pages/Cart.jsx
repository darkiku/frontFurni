import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import { ShoppingCart, Sparkles } from 'lucide-react';

const Cart = ({ cartId, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartId) {
      fetchCartData();
    }
  }, [cartId]);

  const fetchCartData = async () => {
    try {
      const productsResponse = await cartAPI.show(cartId);
      const items = productsResponse.data;
      
      const groupedItems = items.reduce((acc, item) => {
        const existing = acc.find(i => i.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ ...item, quantity: 1 });
        }
        return acc;
      }, []);
      
      setCartItems(groupedItems);
      
      // ✅ Вызываем Visitor Pattern расчёт
      if (items.length > 0) {
        const priceResponse = await cartAPI.calculate(cartId);
        setPriceData(priceResponse.data);
        console.log('Visitor Pattern result:', priceResponse.data);
      }
      
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      await cartAPI.remove(cartId, item.id);
      await fetchCartData();
      onCartUpdate();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(item);
      return;
    }

    try {
      const currentQuantity = item.quantity;
      
      if (newQuantity > currentQuantity) {
        for (let i = 0; i < newQuantity - currentQuantity; i++) {
          await cartAPI.add(cartId, item.id);
        }
      } else if (newQuantity < currentQuantity) {
        for (let i = 0; i < currentQuantity - newQuantity; i++) {
          await cartAPI.remove(cartId, item.id);
        }
      }
      
      await fetchCartData();
      onCartUpdate();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      try {
        await cartAPI.clear(cartId);
        setCartItems([]);
        setPriceData(null);
        onCartUpdate();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>

            {/* ✅ Visitor Pattern результат */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-amber-600" size={24} />
                <h2 className="text-2xl font-bold">Price Summary</h2>
              </div>
              
              {priceData && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Original Price</span>
                    <span>${parseFloat(priceData.originalPrice).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>💰 Smart Discount</span>
                    <span>-${parseFloat(priceData.discount).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-bold text-2xl">
                    <span>Final Price</span>
                    <span className="text-amber-600">
                      ${parseFloat(priceData.finalPrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-amber-800 flex items-center gap-2">
                      <Sparkles size={16} />
                      <span>{priceData.message}</span>
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => alert('Checkout coming soon!')}
                className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold hover:bg-amber-700 transition transform hover:scale-105"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-amber-600 text-amber-600 py-3 rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;