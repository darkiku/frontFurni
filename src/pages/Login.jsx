import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AlertCircle, Check } from 'lucide-react';

const Login = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Показываем сообщение если пришли после верификации
  useEffect(() => {
    if (location.state?.message) {
      setMessage({ type: 'success', text: location.state.message });
      // Очищаем state чтобы сообщение не показывалось при перезагрузке
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    console.log('=== SENDING LOGIN REQUEST ===');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await authAPI.login({ email, password });
      console.log('Response:', response);
      
      const data = response.data;
      console.log('Data:', data);

      // Парсим токен из ответа
      let token;
      if (typeof data === 'string') {
        // Если ответ строка - парсим
        const tokenMatch = data.match(/token=([^,\s]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
      } else if (data.token) {
        // Если ответ объект с полем token
        token = data.token;
      }

      console.log('Token:', token);

      if (token) {
        onLogin(token);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        // Небольшая задержка для показа сообщения
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage({ type: 'error', text: 'Invalid response from server' });
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      // Проверяем специфичные ошибки
      if (errorMessage.includes('not verified') || errorMessage.includes('verify')) {
        errorMessage = 'Account not verified. Please check your email for verification code.';
        // Перенаправляем на страницу верификации
        setTimeout(() => {
          navigate('/verify', { state: { email } });
        }, 2000);
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🪑 Furni</h1>
          <p className="text-gray-600">Welcome back! Sign in to continue</p>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link to="/register" className="block text-amber-600 hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link to="/verify" className="block text-gray-600 hover:underline text-sm">
            Need to verify your account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;