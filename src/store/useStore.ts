import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  categories as fallbackCategories,
  Product, 
  Category, 
  User, 
  Order,
  CartItem, 
  WishlistItem 
} from '@/data/mockData';
import { 
  authAPI, productsAPI, categoriesAPI, ordersAPI, usersAPI,
  setToken, getToken 
} from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    avatar: string;
  } | null;
  isAdmin: boolean;
  token: string | null;
}

interface StoreState {
  // Auth
  auth: AuthState;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string, extra?: { phone?: string; address?: string; city?: string; district?: string; state?: string; country?: string; pincode?: string }) => Promise<boolean>;
  logout: () => void;

  // Products (from API)
  products: Product[];
  fetchProducts: (params?: Record<string, string>) => Promise<void>;
  addProduct: (product: Record<string, any>) => Promise<void>;
  updateProduct: (id: string, product: Record<string, any>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  isLoadingProducts: boolean;

  // Categories (from API with fallback)
  categories: Category[];
  fetchCategories: () => Promise<void>;

  // Users (Admin - from API)
  users: User[];
  fetchUsers: () => Promise<void>;
  toggleUserBlock: (id: string) => Promise<void>;

  // Orders (from API)
  orders: Order[];
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addOrder: (order: any) => Promise<void>;

  // Cart (local)
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist (local)
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (productId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Admin Settings (local)
  adminSettings: {
    whatsappNumber: string;
    storeName: string;
  };
  updateAdminSettings: (settings: Partial<{ whatsappNumber: string; storeName: string }>) => void;
}

// Helper to normalize MongoDB _id to id
const normalizeId = (item: any) => ({
  ...item,
  id: item._id || item.id,
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth State
      auth: {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        token: null,
      },

      login: async (email: string, password: string, isAdmin = false) => {
        try {
          const apiCall = isAdmin ? authAPI.adminLogin : authAPI.login;
          const { user, token } = await apiCall(email, password);
          
          setToken(token);
          set({
            auth: {
              isAuthenticated: true,
              user: normalizeId(user),
              isAdmin: user.isAdmin || false,
              token,
            },
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      register: async (name: string, email: string, password: string, extra?) => {
        try {
          const { user, token } = await authAPI.register({
            name, email, password, ...extra,
          });
          
          setToken(token);
          set({
            auth: {
              isAuthenticated: true,
              user: normalizeId(user),
              isAdmin: false,
              token,
            },
          });
          return true;
        } catch (error) {
          console.error('Register error:', error);
          return false;
        }
      },

      logout: () => {
        setToken(null);
        set({
          auth: {
            isAuthenticated: false,
            user: null,
            isAdmin: false,
            token: null,
          },
        });
      },

      // Products
      products: [],
      isLoadingProducts: false,

      fetchProducts: async (params?) => {
        set({ isLoadingProducts: true });
        try {
          const data = await productsAPI.getAll(params);
          set({ products: data.map(normalizeId) });
        } catch (error) {
          console.error('Fetch products error:', error);
        } finally {
          set({ isLoadingProducts: false });
        }
      },

      addProduct: async (product) => {
        try {
          const created = await productsAPI.create(product);
          set(state => ({ products: [...state.products, normalizeId(created)] }));
        } catch (error) {
          console.error('Add product error:', error);
          throw error;
        }
      },

      updateProduct: async (id, productUpdate) => {
        try {
          const updated = await productsAPI.update(id, productUpdate);
          set(state => ({
            products: state.products.map(p => p.id === id ? normalizeId(updated) : p),
          }));
        } catch (error) {
          console.error('Update product error:', error);
          throw error;
        }
      },

      deleteProduct: async (id) => {
        try {
          await productsAPI.delete(id);
          set(state => ({
            products: state.products.filter(p => p.id !== id),
          }));
        } catch (error) {
          console.error('Delete product error:', error);
          throw error;
        }
      },

      // Categories
      categories: fallbackCategories,

      fetchCategories: async () => {
        try {
          const data = await categoriesAPI.getAll();
          if (data.length > 0) {
            set({ categories: data.map(normalizeId) });
          }
        } catch (error) {
          console.error('Fetch categories error (using fallback):', error);
        }
      },

      // Users
      users: [],

      fetchUsers: async () => {
        try {
          const data = await usersAPI.getAll();
          set({ users: data.map(normalizeId) });
        } catch (error) {
          console.error('Fetch users error:', error);
        }
      },

      toggleUserBlock: async (id) => {
        try {
          const updated = await usersAPI.toggleBlock(id);
          set(state => ({
            users: state.users.map(u => u.id === id ? normalizeId(updated) : u),
          }));
        } catch (error) {
          console.error('Toggle block error:', error);
          throw error;
        }
      },

      // Orders
      orders: [],

      fetchOrders: async () => {
        try {
          const data = await ordersAPI.getAll();
          set({ orders: data.map(normalizeId) });
        } catch (error) {
          console.error('Fetch orders error:', error);
        }
      },

      updateOrderStatus: async (id, status) => {
        try {
          const updated = await ordersAPI.updateStatus(id, status);
          set(state => ({
            orders: state.orders.map(o => o.id === id ? normalizeId(updated) : o),
          }));
        } catch (error) {
          console.error('Update order status error:', error);
          throw error;
        }
      },

      addOrder: async (orderData) => {
        try {
          const order = await ordersAPI.create(orderData);
          set(state => ({ orders: [normalizeId(order), ...state.orders] }));
        } catch (error) {
          console.error('Add order error:', error);
          throw error;
        }
      },

      // Cart (local only)
      cart: [],

      addToCart: (item) => {
        set(state => {
          const existingItem = state.cart.find(
            i => i.productId === item.productId && i.size === item.size
          );
          if (existingItem) {
            return {
              cart: state.cart.map(i =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        });
      },

      removeFromCart: (productId, size) => {
        set(state => ({
          cart: state.cart.filter(i => !(i.productId === productId && i.size === size)),
        }));
      },

      updateCartQuantity: (productId, size, quantity) => {
        set(state => ({
          cart: state.cart.map(i =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      // Wishlist (local only)
      wishlist: [],

      addToWishlist: (item) => {
        set(state => {
          if (state.wishlist.find(i => i.productId === item.productId)) return state;
          return { wishlist: [...state.wishlist, item] };
        });
      },

      removeFromWishlist: (productId) => {
        set(state => ({
          wishlist: state.wishlist.filter(i => i.productId !== productId),
        }));
      },

      moveToCart: (productId) => {
        const state = get();
        const item = state.wishlist.find(i => i.productId === productId);
        const product = state.products.find(p => p.id === productId);
        if (item && product) {
          const firstSize = product.sizes[0];
          get().addToCart({
            productId: item.productId,
            name: item.name,
            image: item.image,
            size: firstSize.size,
            price: firstSize.price,
            quantity: 1,
          });
          get().removeFromWishlist(productId);
        }
      },

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Admin Settings
      adminSettings: {
        whatsappNumber: '+91 98765 43210',
        storeName: 'BrindaRani',
      },

      updateAdminSettings: (settings) => {
        set(state => ({
          adminSettings: { ...state.adminSettings, ...settings },
        }));
      },
    }),
    {
      name: 'brindaRani-storage',
      partialize: (state) => ({
        auth: state.auth,
        cart: state.cart,
        wishlist: state.wishlist,
        adminSettings: state.adminSettings,
      }),
    }
  )
);
