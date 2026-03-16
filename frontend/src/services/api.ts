// BrindaRani API Service
// Configure API_BASE_URL to point to your backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

// Token management
let authToken: string | null = localStorage.getItem('brindaRani-token');

export const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('brindaRani-token', token);
  } else {
    localStorage.removeItem('brindaRani-token');
  }
};

export const getToken = () => authToken;
export const resolveAssetUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_ORIGIN}${url}`;
  }
  return url;
};

// Generic fetch wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  return res.json();
};

// ========== AUTH API ==========
export const authAPI = {
  register: (data: {
    name: string; email: string; password: string;
    phone?: string; address?: string; city?: string; district?: string;
    state?: string; country?: string; pincode?: string;
  }) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  adminLogin: (email: string, password: string) =>
    apiFetch('/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => apiFetch('/auth/me'),

  updateProfile: (data: Record<string, string>) =>
    apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Email verification
  verifyEmail: (token: string) => apiFetch(`/auth/verify-email?token=${token}`),

  resendVerification: () =>
    apiFetch('/auth/resend-verification', { method: 'POST' }),

  // Google OAuth - returns URL to redirect to
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
};

// ========== PRODUCTS API ==========
export const productsAPI = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/products${query}`);
  },

  getById: (id: string) => apiFetch(`/products/${id}`),

  create: (data: Record<string, any>) =>
    apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>) =>
    apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch(`/products/${id}`, { method: 'DELETE' }),
};

// ========== CATEGORIES API ==========
export const categoriesAPI = {
  getAll: () => apiFetch('/categories'),

  create: (data: { name: string; image?: string; subcategories?: string[] }) =>
    apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>) =>
    apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch(`/categories/${id}`, { method: 'DELETE' }),
};

// ========== ORDERS API ==========
export const ordersAPI = {
  getAll: () => apiFetch('/orders'),

  create: (data: {
    items: { productId: string; productName: string; size: string; quantity: number; price: number }[];
    total: number; paymentMethod: string; address: string;
  }) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ========== PAYMENT API (Razorpay) ==========
export const paymentAPI = {
  createOrder: (amount: number) =>
    apiFetch('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderData: any;
  }) => apiFetch('/payment/verify', { method: 'POST', body: JSON.stringify(data) }),
};

// ========== USERS API (Admin) ==========
export const usersAPI = {
  getAll: () => apiFetch('/users'),

  toggleBlock: (id: string) =>
    apiFetch(`/users/${id}/toggle-block`, { method: 'PUT' }),
};

// ========== UPLOAD API ==========
export const uploadAPI = {
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return apiFetch('/upload', { method: 'POST', body: formData });
  },

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/upload/profile', { method: 'POST', body: formData });
  },
};
