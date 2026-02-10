import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  products as initialProducts, 
  categories as initialCategories,
  users as initialUsers,
  orders as initialOrders,
  Product, 
  Category, 
  User, 
  Order,
  CartItem, 
  WishlistItem 
} from '@/data/mockData';

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
}

interface StoreState {
  // Auth
  auth: AuthState;
  login: (email: string, password: string, isAdmin?: boolean) => boolean;
  register: (name: string, email: string, password: string, extra?: { phone?: string; address?: string; city?: string; district?: string; state?: string; country?: string; pincode?: string }) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Users (Admin)
  users: User[];
  toggleUserBlock: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addOrder: (order: Order) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (productId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Admin Settings
  adminSettings: {
    whatsappNumber: string;
    storeName: string;
  };
  updateAdminSettings: (settings: Partial<{ whatsappNumber: string; storeName: string }>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth State
      auth: {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
      },

      login: (email: string, password: string, isAdmin = false) => {
        if (isAdmin) {
          if (email === 'deepakjadon1907@gmail.com' && password === 'deepakjadon1907@') {
            set({
              auth: {
                isAuthenticated: true,
                user: {
                  id: 'admin-1',
                  name: 'Admin',
                  email: email,
                  phone: '+91 98765 43210',
                  address: 'Admin Office',
                  city: 'Vrindavan',
                  district: 'Mathura',
                  state: 'Uttar Pradesh',
                  country: 'India',
                  pincode: '281121',
                  avatar: '',
                },
                isAdmin: true,
              },
            });
            return true;
          }
          return false;
        }

        // Regular user login (demo - any email/password works)
        const existingUser = get().users.find(u => u.email === email);
        if (existingUser) {
          set({
            auth: {
              isAuthenticated: true,
              user: existingUser,
              isAdmin: false,
            },
          });
          return true;
        }
        return false;
      },

      register: (name: string, email: string, _password: string, extra?: { phone?: string; address?: string; city?: string; district?: string; state?: string; country?: string; pincode?: string }) => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          phone: extra?.phone || '',
          address: extra?.address || '',
          city: extra?.city || '',
          district: extra?.district || '',
          state: extra?.state || '',
          country: extra?.country || 'India',
          pincode: extra?.pincode || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          isBlocked: false,
          createdAt: new Date().toISOString().split('T')[0],
        };

        set(state => ({
          users: [...state.users, newUser],
          auth: {
            isAuthenticated: true,
            user: newUser,
            isAdmin: false,
          },
        }));
        return true;
      },

      logout: () => {
        set({
          auth: {
            isAuthenticated: false,
            user: null,
            isAdmin: false,
          },
        });
      },

      // Products
      products: initialProducts,

      addProduct: (product) => {
        set(state => ({
          products: [...state.products, product],
        }));
      },

      updateProduct: (id, productUpdate) => {
        set(state => ({
          products: state.products.map(p =>
            p.id === id ? { ...p, ...productUpdate } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id),
        }));
      },

      // Categories
      categories: initialCategories,

      addCategory: (category) => {
        set(state => ({
          categories: [...state.categories, category],
        }));
      },

      updateCategory: (id, categoryUpdate) => {
        set(state => ({
          categories: state.categories.map(c =>
            c.id === id ? { ...c, ...categoryUpdate } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(c => c.id !== id),
        }));
      },

      // Users
      users: initialUsers,

      toggleUserBlock: (id) => {
        set(state => ({
          users: state.users.map(u =>
            u.id === id ? { ...u, isBlocked: !u.isBlocked } : u
          ),
        }));
      },

      // Orders
      orders: initialOrders,

      updateOrderStatus: (id, status) => {
        set(state => ({
          orders: state.orders.map(o =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },

      addOrder: (order) => {
        set(state => ({
          orders: [order, ...state.orders],
        }));
      },

      // Cart
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
          cart: state.cart.filter(
            i => !(i.productId === productId && i.size === size)
          ),
        }));
      },

      updateCartQuantity: (productId, size, quantity) => {
        set(state => ({
          cart: state.cart.map(i =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Wishlist
      wishlist: [],

      addToWishlist: (item) => {
        set(state => {
          const exists = state.wishlist.find(i => i.productId === item.productId);
          if (exists) return state;
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
        products: state.products,
        categories: state.categories,
        orders: state.orders,
        users: state.users,
        adminSettings: state.adminSettings,
      }),
    }
  )
);
