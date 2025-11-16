import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import { ShoppingCart, Sparkles, Tag, Gift, Zap, Trash2 } from 'lucide-react';

const Cart = ({ cartId, onCartUpdate }) => {
  const [cartItems, setCartItems] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
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
      if (items.length > 0) {
        const priceResponse = await cartAPI.calculate(cartId);
        setPriceData(priceResponse.data);
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

  const applyCustomDiscount = async () => {
    try {
      // ✅ Используем cartAPI вместо fetch
      const response = await cartAPI.applyDiscount(cartId, discountType, discountValue);
      
      setPriceData({
        originalPrice: response.data.originalPrice,
        discount: response.data.saved,
        finalPrice: response.data.finalPrice,
        message: `${discountType === 'percentage' ? discountValue + '%' : '$' + discountValue} discount applied!`
      });
      
      setShowDiscountModal(false);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-24 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
      notification.textContent = '✨ Discount applied!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (error) {
      console.error('Failed to apply discount:', error);
      alert('Failed to apply discount: ' + (error.response?.data || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-2">Shopping Cart</h1>
            <p className="text-gray-600 text-lg">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          {cartItems.length > 0 && (
            <button onClick={handleClearCart} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-all">
              <Trash2 size={20} />
              Clear All
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8">Discover amazing furniture to fill it up!</p>
            <button onClick={() => navigate('/products')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
{cartItems.map((item) => (
<CartItem key={item.id} item={item} onRemove={handleRemove} />
))}
</div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl">
                <Sparkles className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Order Summary</h2>
            </div>

            {priceData && (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Subtotal</span>
                  <span className="font-semibold">${parseFloat(priceData.originalPrice).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-green-600 font-semibold text-lg">
                  <span className="flex items-center gap-2">
                    <Zap size={20} />
                    Smart Savings
                  </span>
                  <span>-${parseFloat(priceData.discount).toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 flex justify-between font-bold text-3xl">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    ${parseFloat(priceData.finalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-900 flex items-center gap-2 font-medium">
                    <Sparkles size={18} className="text-amber-600" />
                    {priceData.message}
                  </p>
                </div>
              </div>
            )}
            <button onClick={() => alert('Checkout coming soon!')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-5 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Proceed to Checkout
            </button>
            <button onClick={() => navigate('/products')} className="w-full border-2 border-amber-500 text-amber-600 py-4 rounded-xl text-lg font-semibold hover:bg-amber-50 transition-all mt-3">
              Continue Shopping
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Tag size={28} />
              </div>
              <h3 className="text-2xl font-bold">Special Discount</h3>
            </div>
            <p className="text-white/90 mb-6 text-lg">Apply your custom discount code and save more!</p>
            <button onClick={() => setShowDiscountModal(true)} className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  {showDiscountModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowDiscountModal(false)}>
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
            <Gift className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Apply Discount</h2>
            <p className="text-gray-600">Choose your discount type</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg cursor-pointer bg-white">
              <option value="percentage">💯 Percentage Discount</option>
              <option value="fixed">💵 Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-700">
              {discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
            </label>
            <input type="number" value={discountValue} onChange={(e) => setDiscountValue(parseFloat(e.target.value))} min="1" className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg" />
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
            <p className="text-purple-900 font-semibold text-lg">
              Preview: {discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`} OFF
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={applyCustomDiscount} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
              Apply Discount
            </button>
            <button onClick={() => setShowDiscountModal(false)} className="flex-1 border-2 border-gray-300 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
  <style>{`
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}
@keyframes slideUp {
from { transform: translateY(30px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
.animate-fadeIn {
animation: fadeIn 0.3s ease-out;
}
.animate-slideUp {
animation: slideUp 0.4s ease-out;
}
`}</style>
</div>
);
};
export default Cart;