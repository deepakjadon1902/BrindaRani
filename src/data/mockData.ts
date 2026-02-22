// BrindaRani - Types & Static Data
// Only types and categories remain here. Products, users, orders come from the backend API.

export interface ProductSize {
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  sizes: ProductSize[];
  images: string[];
  isTrending: boolean;
  isLatest: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export interface User {
  _id?: string;
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
  isBlocked: boolean;
  createdAt: string;
}

export interface Order {
  _id?: string;
  id: string;
  userId: string;
  userName: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: string;
  address: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
}

// Static categories (fallback if API is not available)
export const categories: Category[] = [
  { id: 'cat-1', name: 'Puja Items', image: '', subcategories: ['Diyas & Lamps', 'Incense & Dhoop', 'Puja Thalis', 'Bells & Conch'] },
  { id: 'cat-2', name: 'Idols & Murtis', image: '', subcategories: ['Krishna Idols', 'Radha Rani', 'Laddu Gopal', 'Ganesh Idols'] },
  { id: 'cat-3', name: 'Vrindavan Specials', image: '', subcategories: ['Tulsi Malas', 'Chandan Products', 'Holy Water', 'Prasad Items'] },
  { id: 'cat-4', name: 'Dress & Accessories', image: '', subcategories: ['Deity Dresses', 'Jewelry', 'Crowns & Mukuts', 'Flutes'] },
  { id: 'cat-5', name: 'Books & Media', image: '', subcategories: ['Bhagavad Gita', 'Devotional Books', 'Bhajan CDs', 'Calendars'] },
  { id: 'cat-6', name: 'Home Decor', image: '', subcategories: ['Wall Hangings', 'Photo Frames', 'Rangoli', 'Torans'] },
  { id: 'cat-7', name: 'Havan Samagri', image: '', subcategories: ['Havan Kund', 'Samagri Packs', 'Ghee & Oils', 'Sacred Wood'] },
  { id: 'cat-8', name: 'Rudraksha', image: '', subcategories: ['1 Mukhi', '5 Mukhi', 'Rudraksha Mala', 'Rudraksha Bracelets'] },
  { id: 'cat-9', name: 'Gemstones', image: '', subcategories: ['Ruby', 'Emerald', 'Yellow Sapphire', 'Pearl'] },
  { id: 'cat-10', name: 'Spiritual Gifts', image: '', subcategories: ['Gift Hampers', 'Festival Combos', 'Wedding Gifts', 'Return Gifts'] },
  { id: 'cat-11', name: 'Tulsi Products', image: '', subcategories: ['Tulsi Mala', 'Tulsi Kanthi', 'Tulsi Beads', 'Tulsi Plants'] },
  { id: 'cat-12', name: 'Chandan & Kumkum', image: '', subcategories: ['Chandan Tika', 'Kumkum Powder', 'Sindoor', 'Roli'] },
  { id: 'cat-13', name: 'Brass & Copper Items', image: '', subcategories: ['Brass Diyas', 'Copper Lota', 'Brass Bells', 'Panchpatra'] },
  { id: 'cat-14', name: 'Marble & Stone Idols', image: '', subcategories: ['Marble Ganesh', 'Stone Krishna', 'Marble Lakshmi', 'Marble Shiva'] },
  { id: 'cat-15', name: 'Silver Articles', image: '', subcategories: ['Silver Idols', 'Silver Coins', 'Silver Pooja Items', 'Silver Jewelry'] },
  { id: 'cat-16', name: 'Flowers & Garlands', image: '', subcategories: ['Artificial Garlands', 'Flower Strings', 'Rose Petals', 'Marigold Garlands'] },
  { id: 'cat-17', name: 'Deity Ornaments', image: '', subcategories: ['Crowns & Mukuts', 'Necklaces', 'Earrings', 'Bangles'] },
  { id: 'cat-18', name: 'Dhoop & Agarbatti', image: '', subcategories: ['Dhoop Sticks', 'Agarbatti Packs', 'Dhoop Cones', 'Sambrani'] },
  { id: 'cat-19', name: 'Yantra & Kavach', image: '', subcategories: ['Shree Yantra', 'Navgraha Yantra', 'Kavach Lockets', 'Protection Yantras'] },
  { id: 'cat-20', name: 'Festival Specials', image: '', subcategories: ['Diwali Combos', 'Navratri Specials', 'Janmashtami Items', 'Holi Colors'] },
];

// Empty arrays - data comes from backend
export const products: Product[] = [];
export const users: User[] = [];
export const orders: Order[] = [];

// Promotional Banners (static, no backend needed)
export const banners = [
  {
    id: 'banner-1',
    title: 'Maha Shivratri Special',
    subtitle: 'Up to 30% off on all Puja Items',
    image: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06117b?w=1200&q=80',
    link: '/category/Puja Items'
  },
  {
    id: 'banner-2',
    title: 'Handcrafted from Vrindavan',
    subtitle: 'Authentic artisan products with love',
    image: 'https://images.unsplash.com/photo-1567591370504-80142b28f1ec?w=1200&q=80',
    link: '/category/Idols & Murtis'
  },
  {
    id: 'banner-3',
    title: 'Limited Edition Collection',
    subtitle: 'Exclusive deity dresses and accessories',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80',
    link: '/category/Dress & Accessories'
  }
];

// Admin credentials (for demo fallback only)
export const adminCredentials = {
  email: 'deepakjadon1907@gmail.com',
  password: 'deepakjadon1907@'
};
