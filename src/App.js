import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import { userAPI, cartAPI } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      initializeUser();
    } else {
      setLoading(false);
    }
  }, []);

  const initializeUser = async () => {
    try {
      console.log('=== Starting User Initialization ===');
      
      const response = await userAPI.getMe();
      console.log('✅ API Response:', response);
      console.log('📦 Response Data:', response.data);
      
      const userData = response.data;
      
      if (!userData || !userData.id) {
        console.error('❌ Invalid user data:', userData);
        throw new Error('No user data received');
      }
      
      console.log('👤 User ID:', userData.id);
      console.log('📧 Email:', userData.email);
      console.log('🛒 Cart:', userData.cart);
      
      setUser(userData);
      
      // Получаем cartId
      let finalCartId = null;
      
      if (userData.cart && userData.cart.id) {
        finalCartId = userData.cart.id;
        console.log('✅ Got cartId from user.cart.id:', finalCartId);
      } else {
        // Если нет корзины - используем userId как fallback
        finalCartId = userData.id;
        console.log('⚠️ No cart found, using userId as cartId:', finalCartId);
      }
      
      console.log('🎯 Final cartId:', finalCartId);
      
      // Сохраняем cartId
      localStorage.setItem('cartId', String(finalCartId));
      setCartId(String(finalCartId));
      
      // Загружаем количество товаров в корзине
      await updateCartCount(String(finalCartId));
      
      console.log('✅ User initialization complete!');
      
    } catch (error) {
      console.error('❌ Failed to initialize user:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Если ошибка авторизации - разлогиниваем
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔓 Unauthorized, logging out...');
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = async (cId) => {
    if (!cId || cId === 'null' || cId === 'undefined') {
      console.warn('⚠️ Invalid cartId for updateCartCount:', cId);
      setCartCount(0);
      return;
    }
    
    try {
      console.log('🔄 Updating cart count for cartId:', cId);
      const response = await cartAPI.show(cId);
      console.log('📦 Cart data:', response.data);
      
      let items = response.data;
      
      // Если вернулся массив - это продукты
      if (Array.isArray(items)) {
        setCartCount(items.length);
        console.log('✅ Cart count:', items.length);
      } else if (items && items.products) {
        // Если вернулся объект Cart с полем products
        setCartCount(items.products.length);
        console.log('✅ Cart count:', items.products.length);
      } else {
        setCartCount(0);
        console.log('⚠️ Cart is empty');
      }
    } catch (error) {
      console.error('❌ Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  const handleLogin = (token) => {
    console.log('🔐 Login successful, token:', token.substring(0, 20) + '...');
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    initializeUser();
  };

  const handleLogout = () => {
    console.log('🔓 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('cartId');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCartId(null);
    setCartCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <Navbar cartCount={cartCount} onLogout={handleLogout} />
        )}

        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/verify"
            element={
              !isAuthenticated ? <Verify /> : <Navigate to="/" replace />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated && cartId ? (
                <Home cartId={cartId} onCartUpdate={() => updateCartCount(cartId)} />
              ) : !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
                    <p className="mt-4 text-xl text-gray-600">Loading cart...</p>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/products"
            element={
              isAuthenticated && cartId ? (
                <Products cartId={cartId} onCartUpdate={() => updateCartCount(cartId)} />
              ) : !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
                </div>
              )
            }
          />
          <Route
            path="/cart"
            element={
              isAuthenticated && cartId ? (
                <Cart cartId={cartId} onCartUpdate={() => updateCartCount(cartId)} />
              ) : !isAuthenticated ? (
                <Navigate to="/login" replace />
              ) : (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
                </div>
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;