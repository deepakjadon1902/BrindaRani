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
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
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
const makeFestivalHeroImage = (
  title: string,
  accent: string,
  bgA: string,
  bgB: string,
  motif: string
) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${bgA}'/>
        <stop offset='100%' stop-color='${bgB}'/>
      </linearGradient>
      <radialGradient id='glow' cx='75%' cy='20%' r='50%'>
        <stop offset='0%' stop-color='${accent}' stop-opacity='0.55'/>
        <stop offset='100%' stop-color='${accent}' stop-opacity='0'/>
      </radialGradient>
    </defs>
    <rect width='1600' height='900' fill='url(#g)'/>
    <rect width='1600' height='900' fill='url(#glow)'/>
    <circle cx='1260' cy='180' r='190' fill='${accent}' fill-opacity='0.2'/>
    <circle cx='180' cy='760' r='240' fill='${accent}' fill-opacity='0.16'/>
    <path d='M0 640 C 340 560, 580 760, 960 650 C 1250 560, 1460 600, 1600 540 L1600 900 L0 900 Z' fill='white' fill-opacity='0.08'/>
    <text x='120' y='240' fill='white' font-size='62' font-family='Georgia, serif' font-weight='700'>${title}</text>
    <text x='1220' y='760' text-anchor='end' fill='white' font-size='128' font-family='Georgia, serif' font-weight='700' fill-opacity='0.42'>${motif}</text>
  </svg>
  `)}`;

export const banners = [
  {
    id: 'banner-1',
    title: 'Maha Shivratri Special',
    subtitle: 'Sacred puja sets, rudraksha malas and diya collections up to 30% off',
    image: makeFestivalHeroImage('Maha Shivratri', '#f6c85f', '#1f2937', '#5b21b6', 'Trident'),
    link: '/category/Puja%20Items'
  },
  {
    id: 'banner-2',
    title: 'Holi Festival Specials',
    subtitle: 'Herbal gulal, puja thalis and festive gifting hampers for your celebration',
    image: makeFestivalHeroImage('Holi Festival', '#f97316', '#7c2d12', '#be185d', 'Colors'),
    link: '/category/Festival%20Specials'
  },
  {
    id: 'banner-3',
    title: 'Janmashtami Divine Collection',
    subtitle: 'Laddu Gopal dresses, crowns, flutes and festive decorations now live',
    image: makeFestivalHeroImage('Janmashtami', '#facc15', '#1e3a8a', '#312e81', 'Flute'),
    link: '/category/Dress%20%26%20Accessories'
  },
  {
    id: 'banner-4',
    title: 'Navratri Bhakti Essentials',
    subtitle: 'Durga puja kits, chunri sets and devotional decor curated for nine nights',
    image: makeFestivalHeroImage('Navratri', '#fb7185', '#4c0519', '#9f1239', 'Garba'),
    link: '/category/Puja%20Items'
  },
  {
    id: 'banner-5',
    title: 'Diwali Deepotsav Offers',
    subtitle: 'Brass diyas, rangoli packs and temple decor with festive discounts',
    image: makeFestivalHeroImage('Diwali', '#f59e0b', '#78350f', '#b45309', 'Diyas'),
    link: '/category/Home%20Decor'
  },
  {
    id: 'banner-6',
    title: 'Ram Navami Special Picks',
    subtitle: 'Ram darbar idols, bhajan books and puja samagri for sacred celebrations',
    image: makeFestivalHeroImage('Ram Navami', '#f97316', '#7f1d1d', '#b91c1c', 'Bow'),
    link: '/category/Idols%20%26%20Murtis'
  },
  {
    id: 'banner-7',
    title: 'Krishna Bhakti Week',
    subtitle: 'Tulsi malas, chandan tilak and Vrindavan specials in one collection',
    image: makeFestivalHeroImage('Krishna Bhakti', '#60a5fa', '#0f172a', '#312e81', 'Peacock'),
    link: '/category/Vrindavan%20Specials'
  },
  {
    id: 'banner-8',
    title: 'Ganesh Chaturthi Offers',
    subtitle: 'Eco-friendly Ganesh idols, modak bhog sets and festive mandir decor',
    image: makeFestivalHeroImage('Ganesh Chaturthi', '#f97316', '#7c2d12', '#b91c1c', 'Ganesha'),
    link: '/category/Idols%20%26%20Murtis'
  },
];

// Admin credentials (for demo fallback only)
export const adminCredentials = {
  email: 'deepakjadon1902@gmail.com',
  password: 'deepakjadon1902@'
};
