// BrindaRani Mock Data - Spiritual E-Commerce Platform

export interface ProductSize {
  size: string;
  price: number;
  stock: number;
}

export interface Product {
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
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export interface User {
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

// Categories Data
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Puja Items',
    image: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06117b?w=400&q=80',
    subcategories: ['Diyas & Lamps', 'Incense & Dhoop', 'Puja Thalis', 'Bells & Conch']
  },
  {
    id: 'cat-2',
    name: 'Idols & Murtis',
    image: 'https://images.unsplash.com/photo-1567591370504-80142b28f1ec?w=400&q=80',
    subcategories: ['Krishna Idols', 'Radha Rani', 'Laddu Gopal', 'Ganesh Idols']
  },
  {
    id: 'cat-3',
    name: 'Vrindavan Specials',
    image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&q=80',
    subcategories: ['Tulsi Malas', 'Chandan Products', 'Holy Water', 'Prasad Items']
  },
  {
    id: 'cat-4',
    name: 'Dress & Accessories',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
    subcategories: ['Deity Dresses', 'Jewelry', 'Crowns & Mukuts', 'Flutes']
  },
  {
    id: 'cat-5',
    name: 'Books & Media',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    subcategories: ['Bhagavad Gita', 'Devotional Books', 'Bhajan CDs', 'Calendars']
  },
  {
    id: 'cat-6',
    name: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    subcategories: ['Wall Hangings', 'Photo Frames', 'Rangoli', 'Torans']
  },
  {
    id: 'cat-7',
    name: 'Havan Samagri',
    image: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06117b?w=400&q=80',
    subcategories: ['Havan Kund', 'Samagri Packs', 'Ghee & Oils', 'Sacred Wood']
  },
  {
    id: 'cat-8',
    name: 'Rudraksha',
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&q=80',
    subcategories: ['1 Mukhi', '5 Mukhi', 'Rudraksha Mala', 'Rudraksha Bracelets']
  },
  {
    id: 'cat-9',
    name: 'Gemstones',
    image: 'https://images.unsplash.com/photo-1551122089-4e3e72477432?w=400&q=80',
    subcategories: ['Ruby', 'Emerald', 'Yellow Sapphire', 'Pearl']
  },
  {
    id: 'cat-10',
    name: 'Spiritual Gifts',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80',
    subcategories: ['Gift Hampers', 'Festival Combos', 'Wedding Gifts', 'Return Gifts']
  }
];

// Products Data
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Brass Krishna Idol - Premium',
    description: 'Beautifully handcrafted brass idol of Lord Krishna playing the divine flute. Made by skilled artisans from Vrindavan with intricate detailing.',
    category: 'Idols & Murtis',
    subcategory: 'Krishna Idols',
    sizes: [
      { size: '4 inch', price: 1299, stock: 25 },
      { size: '6 inch', price: 2499, stock: 18 },
      { size: '8 inch', price: 3999, stock: 12 },
      { size: '12 inch', price: 6999, stock: 5 }
    ],
    images: ['https://images.unsplash.com/photo-1567591370504-80142b28f1ec?w=600&q=80'],
    isTrending: true,
    isLatest: false,
    rating: 4.8,
    reviews: 156,
    createdAt: '2024-01-15'
  },
  {
    id: 'prod-2',
    name: 'Original Tulsi Mala - 108 Beads',
    description: 'Authentic Tulsi mala sourced directly from Vrindavan. Perfect for chanting and daily worship. Each bead is carefully selected and polished.',
    category: 'Vrindavan Specials',
    subcategory: 'Tulsi Malas',
    sizes: [
      { size: 'Small Beads', price: 299, stock: 100 },
      { size: 'Medium Beads', price: 499, stock: 75 },
      { size: 'Large Beads', price: 799, stock: 50 }
    ],
    images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80'],
    isTrending: true,
    isLatest: true,
    rating: 4.9,
    reviews: 312,
    createdAt: '2024-02-01'
  },
  {
    id: 'prod-3',
    name: 'Pure Chandan Tika Powder',
    description: 'Premium sandalwood powder from Mysore. Ideal for daily tilak and special puja occasions. 100% pure and natural.',
    category: 'Vrindavan Specials',
    subcategory: 'Chandan Products',
    sizes: [
      { size: '50g', price: 199, stock: 200 },
      { size: '100g', price: 349, stock: 150 },
      { size: '250g', price: 799, stock: 80 }
    ],
    images: ['https://images.unsplash.com/photo-1609766856923-7e0a0c06117b?w=600&q=80'],
    isTrending: false,
    isLatest: true,
    rating: 4.7,
    reviews: 89,
    createdAt: '2024-02-05'
  },
  {
    id: 'prod-4',
    name: 'Radha Krishna Marble Murti Set',
    description: 'Exquisite marble statue of Radha and Krishna in divine embrace. Hand-painted with vibrant colors and gold accents.',
    category: 'Idols & Murtis',
    subcategory: 'Radha Rani',
    sizes: [
      { size: '6 inch', price: 4999, stock: 15 },
      { size: '10 inch', price: 8999, stock: 10 },
      { size: '15 inch', price: 14999, stock: 5 }
    ],
    images: ['https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&q=80'],
    isTrending: true,
    isLatest: false,
    rating: 4.9,
    reviews: 78,
    createdAt: '2024-01-20'
  },
  {
    id: 'prod-5',
    name: 'Brass Puja Thali Set - Complete',
    description: 'Complete brass puja thali set including thali, diya, kumkum holder, and bell. Perfect for daily aarti.',
    category: 'Puja Items',
    subcategory: 'Puja Thalis',
    sizes: [
      { size: '8 inch', price: 899, stock: 40 },
      { size: '10 inch', price: 1299, stock: 30 },
      { size: '12 inch', price: 1799, stock: 20 }
    ],
    images: ['https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=600&q=80'],
    isTrending: false,
    isLatest: true,
    rating: 4.6,
    reviews: 124,
    createdAt: '2024-02-08'
  },
  {
    id: 'prod-6',
    name: 'Premium Agarbatti Set - Mixed Fragrances',
    description: 'Collection of divine fragrances including Rose, Sandalwood, Jasmine, and Loban. Long-lasting and pure.',
    category: 'Puja Items',
    subcategory: 'Incense & Dhoop',
    sizes: [
      { size: 'Pack of 12', price: 249, stock: 150 },
      { size: 'Pack of 24', price: 449, stock: 100 },
      { size: 'Gift Box (48)', price: 849, stock: 50 }
    ],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
    isTrending: true,
    isLatest: false,
    rating: 4.5,
    reviews: 267,
    createdAt: '2024-01-10'
  },
  {
    id: 'prod-7',
    name: 'Laddu Gopal Dress Set - Silk',
    description: 'Beautiful silk dress set for Laddu Gopal with matching jewelry and accessories. Available in multiple colors.',
    category: 'Dress & Accessories',
    subcategory: 'Deity Dresses',
    sizes: [
      { size: 'Size 0-2', price: 399, stock: 60 },
      { size: 'Size 3-4', price: 499, stock: 50 },
      { size: 'Size 5-6', price: 599, stock: 40 }
    ],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    isTrending: false,
    isLatest: true,
    rating: 4.8,
    reviews: 95,
    createdAt: '2024-02-03'
  },
  {
    id: 'prod-8',
    name: 'Bhagavad Gita - Illustrated Edition',
    description: 'Complete Bhagavad Gita with Hindi and English translation. Beautiful illustrations and commentary by renowned scholars.',
    category: 'Books & Media',
    subcategory: 'Bhagavad Gita',
    sizes: [
      { size: 'Paperback', price: 299, stock: 80 },
      { size: 'Hardcover', price: 599, stock: 45 },
      { size: 'Deluxe Edition', price: 1299, stock: 20 }
    ],
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80'],
    isTrending: true,
    isLatest: false,
    rating: 4.9,
    reviews: 423,
    createdAt: '2024-01-05'
  }
];

// Users Data
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    address: '123, Temple Street',
    city: 'Vrindavan',
    district: 'Mathura',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '281121',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    isBlocked: false,
    createdAt: '2024-01-01'
  },
  {
    id: 'user-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    phone: '+91 87654 32109',
    address: '456, Krishna Nagar',
    city: 'Mathura',
    district: 'Mathura',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '281001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    isBlocked: false,
    createdAt: '2024-01-15'
  },
  {
    id: 'user-3',
    name: 'Anjali Patel',
    email: 'anjali.patel@email.com',
    phone: '+91 76543 21098',
    address: '789, Radha Kunj',
    city: 'Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    pincode: '110001',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    isBlocked: false,
    createdAt: '2024-02-01'
  }
];

// Orders Data
export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    userName: 'Priya Sharma',
    items: [
      { productId: 'prod-1', productName: 'Brass Krishna Idol', size: '6 inch', quantity: 1, price: 2499 },
      { productId: 'prod-2', productName: 'Tulsi Mala', size: 'Medium Beads', quantity: 2, price: 499 }
    ],
    total: 3497,
    status: 'delivered',
    paymentMethod: 'UPI',
    address: '123, Temple Street, Vrindavan - 281121',
    createdAt: '2024-02-01'
  },
  {
    id: 'ORD-002',
    userId: 'user-2',
    userName: 'Rahul Verma',
    items: [
      { productId: 'prod-4', productName: 'Radha Krishna Marble Murti', size: '10 inch', quantity: 1, price: 8999 }
    ],
    total: 8999,
    status: 'shipped',
    paymentMethod: 'Card',
    address: '456, Krishna Nagar, Mathura - 281001',
    createdAt: '2024-02-05'
  },
  {
    id: 'ORD-003',
    userId: 'user-3',
    userName: 'Anjali Patel',
    items: [
      { productId: 'prod-6', productName: 'Premium Agarbatti Set', size: 'Pack of 24', quantity: 3, price: 449 },
      { productId: 'prod-3', productName: 'Chandan Tika Powder', size: '100g', quantity: 1, price: 349 }
    ],
    total: 1696,
    status: 'pending',
    paymentMethod: 'COD',
    address: '789, Radha Kunj, Delhi - 110001',
    createdAt: '2024-02-08'
  },
  {
    id: 'ORD-004',
    userId: 'user-1',
    userName: 'Priya Sharma',
    items: [
      { productId: 'prod-8', productName: 'Bhagavad Gita', size: 'Hardcover', quantity: 1, price: 599 }
    ],
    total: 599,
    status: 'paid',
    paymentMethod: 'UPI',
    address: '123, Temple Street, Vrindavan - 281121',
    createdAt: '2024-02-09'
  }
];

// Promotional Banners
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

// Admin credentials (for demo)
export const adminCredentials = {
  email: 'deepakjadon1907@gmail.com',
  password: 'deepakjadon1907@'
};

// Analytics Data
export const analyticsData = {
  totalRevenue: 245890,
  totalOrders: 156,
  totalUsers: 892,
  totalProducts: 48,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  userGrowth: 15.2,
  monthlyRevenue: [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 22300 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 25600 },
    { month: 'May', revenue: 28900 },
    { month: 'Jun', revenue: 31200 },
    { month: 'Jul', revenue: 29400 },
    { month: 'Aug', revenue: 35600 },
    { month: 'Sep', revenue: 38200 },
    { month: 'Oct', revenue: 42100 },
    { month: 'Nov', revenue: 48900 },
    { month: 'Dec', revenue: 52300 }
  ],
  categoryStats: [
    { category: 'Idols & Murtis', sales: 45200, percentage: 28 },
    { category: 'Puja Items', sales: 32100, percentage: 20 },
    { category: 'Vrindavan Specials', sales: 28900, percentage: 18 },
    { category: 'Dress & Accessories', sales: 24500, percentage: 15 },
    { category: 'Books & Media', sales: 18200, percentage: 11 },
    { category: 'Home Decor', sales: 12800, percentage: 8 }
  ],
  bestSellers: [
    { name: 'Brass Krishna Idol', sales: 156, revenue: 24500 },
    { name: 'Tulsi Mala', sales: 312, revenue: 18200 },
    { name: 'Bhagavad Gita', sales: 423, revenue: 15600 },
    { name: 'Radha Krishna Murti', sales: 78, revenue: 12800 },
    { name: 'Puja Thali Set', sales: 124, revenue: 9800 }
  ]
};
