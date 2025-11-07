import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AlertCircle, Check } from 'lucide-react';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Verifying user:', { email, verificationCode });
      
      const response = await authAPI.verify({ email, verificationCode });
      console.log('Verification response:', response);
      
      setMessage({ 
        type: 'success', 
        text: 'Account verified! Redirecting to login...' 
      });
      
      // ✅ Перенаправляем на логин через 2 секунды
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Account verified successfully! Please login.' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data || 'Invalid verification code. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email first.' });
      return;
    }

    try {
      console.log('Resending code to:', email);
      await authAPI.resend(email);
      setMessage({ type: 'success', text: 'Verification code resent! Check your email.' });
    } catch (error) {
      console.error('Resend error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data || 'Failed to resend code.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✉️ Verify Email</h1>
          <p className="text-gray-600">Enter the verification code sent to your email</p>
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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder="Verification Code (4 digits)"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl tracking-widest"
            required
          />
          <button
            onClick={handleVerify}
            disabled={loading || !email || !verificationCode}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
          <button
            onClick={handleResend}
            disabled={!email}
            className="w-full text-amber-600 hover:underline disabled:opacity-50"
          >
            Resend Code
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-amber-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;