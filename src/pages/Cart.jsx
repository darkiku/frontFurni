import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import { ShoppingCart, AlertCircle } from 'lucide-react';

const Cart = ({ cartId, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartId) {
      fetchCartItems();
    }
  }, [cartId]);

  const fetchCartItems = async () => {
    try {
      const response = await cartAPI.show(cartId);
      const items = response.data;
      
      if (!Array.isArray(items)) {
        setCartItems([]);
        return;
      }
      
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
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      await cartAPI.remove(cartId, item.id);
      await fetchCartItems();
      onCartUpdate();
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      try {
        await cartAPI.clear(cartId);
        setCartItems([]);
        onCartUpdate();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart');
      }
    }
  };

  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    setShowCheckoutMessage(true);
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
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${getTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-amber-600">${getTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
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

      {/* Checkout Message Modal */}
      {showCheckoutMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle size={32} className="text-yellow-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Coming Soon!</h2>
            <p className="text-center text-gray-600 mb-6">
              Sorry, we haven't set up the checkout process yet. This feature is coming very soon!
            </p>
            <button
              onClick={() => setShowCheckoutMessage(false)}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;