import axios from 'axios';

const API_BASE_URL = 'https://sdpfinalfurni-production.up.railway.app';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматически добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  verify: (data) => api.post('/auth/verify', data),
  resend: (email) => api.post(`/auth/resend?email=${email}`),
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users/'),
};

// Product API
export const productAPI = {
  getAll: () => api.get('/api/product/allProducts'),
  getById: (id) => api.get(`/api/product/product/${id}`),
  add: (product) => api.post('/api/product/addProduct', product),
  update: (product) => api.put('/api/product/updateProduct', product),
  delete: (id) => api.delete(`/api/product/deleteProduct?id=${id}`),
};


// Order API
export const orderAPI = {
  create: (order) => api.post('/api/order/save', order),
  getById: (id) => api.get(`/api/order/findById?id=${id}`),
  getAll: () => api.get('/api/order/findAll'),
};
// Cart API
export const cartAPI = {
  show: (cartId) => api.get(`/api/cart/showCart/${cartId}`),
  add: (cartId, productId) => api.post(`/api/cart/addToCart/${cartId}/${productId}`),
  remove: (cartId, productId) => api.delete(`/api/cart/removeFromCart/${cartId}/${productId}`),
  clear: (cartId) => api.delete(`/api/cart/clearCart/${cartId}`),
  calculate: (cartId) => api.get(`/api/cart/calculate/${cartId}`),  // ← Добавь это
};
export default api;