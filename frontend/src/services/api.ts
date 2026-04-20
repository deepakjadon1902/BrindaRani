// Brindarani API Service
// Configure API_BASE_URL to point to your backend server

// Production: use Render backend, Development: use localhost
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isProduction ? 'https://brindarani.onrender.com/api' : 'http://localhost:5000/api');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

// Token management
let authToken: string | null = localStorage.getItem('Brindarani-token');

export const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('Brindarani-token', token);
  } else {
    localStorage.removeItem('Brindarani-token');
  }
};

export const getToken = () => authToken;
export const resolveAssetUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:')) return trimmed;

  const normalizedSlashes = trimmed.replace(/\\/g, '/');

  // If the DB contains an absolute URL to a previous environment (e.g. localhost),
  // but the path is "/uploads/...", rewrite it to the current API origin.
  if (normalizedSlashes.startsWith('http://') || normalizedSlashes.startsWith('https://')) {
    try {
      const parsed = new URL(normalizedSlashes);
      const pathname = parsed.pathname || '';
      const uploadsIndex = pathname.indexOf('/uploads/');
      if (uploadsIndex !== -1) return `${API_ORIGIN}${pathname.slice(uploadsIndex)}`;
    } catch {
      // ignore
    }
    return normalizedSlashes;
  }

  // Normalize relative uploads paths to be served by the backend
  if (normalizedSlashes.startsWith('uploads/')) return `${API_ORIGIN}/${normalizedSlashes}`;
  if (normalizedSlashes.startsWith('/uploads/')) return `${API_ORIGIN}${normalizedSlashes}`;

  // For other absolute paths (e.g. frontend public assets), keep as-is
  if (normalizedSlashes.startsWith('/')) return normalizedSlashes;

  return normalizedSlashes;
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
    customerEmail?: string; customerPhone?: string;
  }) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  track: (code: string) => apiFetch(`/orders/track/${code}`),

  sendPaymentFailed: (data: {
    orderCode?: string;
    total?: number;
    paymentMethod?: string;
    reason?: string;
    items?: { productId: string; productName: string; size: string; quantity: number; price: number }[];
  }) => apiFetch('/orders/payment-failed', { method: 'POST', body: JSON.stringify(data) }),
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
  uploadImages: (files: File[], folder?: 'categories' | 'products' | 'profiles' | 'site' | 'misc') => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    return apiFetch(`/upload${query}`, { method: 'POST', body: formData });
  },

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/upload/profile', { method: 'POST', body: formData });
  },
};

// ========== SETTINGS API ==========
export const settingsAPI = {
  getPublic: () => apiFetch('/settings'),

  getAdmin: () => apiFetch('/settings/admin'),

  update: (data: Record<string, any>) =>
    apiFetch('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  updateAdminCredentials: (adminEmail: string, adminPassword: string) =>
    apiFetch('/settings/admin-credentials', {
      method: 'PUT',
      body: JSON.stringify({ adminEmail, adminPassword }),
    }),
};

