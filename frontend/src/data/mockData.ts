// Brindarani - Types & Static Data
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
  isVrindavanSpecial: boolean;
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
  orderCode?: string;
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
  paymentStatus?: 'pending' | 'paid' | 'failed';
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
  { id: 'cat-1', name: 'Puja Items', image: 'https://unsplash.com/photos/zNY2lVIRh7M/download?force=true', subcategories: ['Diyas & Lamps', 'Incense & Dhoop', 'Puja Thalis', 'Bells & Conch'] },
  { id: 'cat-2', name: 'Idols & Murtis', image: 'https://unsplash.com/photos/RKFs7ee6HCk/download?force=true', subcategories: ['Krishna Idols', 'Radha Rani', 'Laddu Gopal', 'Ganesh Idols'] },
  { id: 'cat-3', name: 'Vrindavan Specials', image: 'https://unsplash.com/photos/SrnXyLNRHmM/download?force=true', subcategories: ['Tulsi Malas', 'Chandan Products', 'Holy Water', 'Prasad Items'] },
  { id: 'cat-4', name: 'Dress & Accessories', image: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000', subcategories: ['Deity Dresses', 'Jewelry', 'Crowns & Mukuts', 'Flutes'] },
  { id: 'cat-5', name: 'Books & Media', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bhagavad_Gita%2C_a_19th_century_manuscript.jpg', subcategories: ['Bhagavad Gita', 'Devotional Books', 'Bhajan CDs', 'Calendars'] },
  { id: 'cat-6', name: 'Home Decor', image: 'https://unsplash.com/photos/C7bIKgrraJo/download?force=true', subcategories: ['Wall Hangings', 'Photo Frames', 'Rangoli', 'Torans'] },
  { id: 'cat-7', name: 'Havan Samagri', image: 'https://unsplash.com/photos/MeOiwmZwG_k/download?force=true', subcategories: ['Havan Kund', 'Samagri Packs', 'Ghee & Oils', 'Sacred Wood'] },
  { id: 'cat-8', name: 'Rudraksha', image: 'https://unsplash.com/photos/6Lnzxlii5yg/download?force=true', subcategories: ['1 Mukhi', '5 Mukhi', 'Rudraksha Mala', 'Rudraksha Bracelets'] },
  { id: 'cat-9', name: 'Gemstones', image: 'https://unsplash.com/photos/1vti7r5-iV8/download?force=true', subcategories: ['Ruby', 'Emerald', 'Yellow Sapphire', 'Pearl'] },
  { id: 'cat-10', name: 'Spiritual Gifts', image: 'https://images.unsplash.com/photo-1625552185153-7a8d8f3794a3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000', subcategories: ['Gift Hampers', 'Festival Combos', 'Wedding Gifts', 'Return Gifts'] },
  { id: 'cat-11', name: 'Tulsi Products', image: 'https://unsplash.com/photos/E3ENPBwxiDo/download?force=true', subcategories: ['Tulsi Mala', 'Tulsi Kanthi', 'Tulsi Beads', 'Tulsi Plants'] },
  { id: 'cat-12', name: 'Chandan & Kumkum', image: 'https://pixahive.com/wp-content/uploads/2020/09/Kumkum-and-Turmeric-powder-on-Display-63287-pixahive.jpg', subcategories: ['Chandan Tika', 'Kumkum Powder', 'Sindoor', 'Roli'] },
  { id: 'cat-13', name: 'Brass & Copper Items', image: 'https://unsplash.com/photos/3KsDyEguPJ0/download?force=true', subcategories: ['Brass Diyas', 'Copper Lota', 'Brass Bells', 'Panchpatra'] },
  { id: 'cat-14', name: 'Marble & Stone Idols', image: 'https://unsplash.com/photos/tl6q5RNguAE/download?force=true', subcategories: ['Marble Ganesh', 'Stone Krishna', 'Marble Lakshmi', 'Marble Shiva'] },
  { id: 'cat-15', name: 'Silver Articles', image: 'https://images.unsplash.com/photo-1579291465309-278e8665628d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000', subcategories: ['Silver Idols', 'Silver Coins', 'Silver Pooja Items', 'Silver Jewelry'] },
  { id: 'cat-16', name: 'Flowers & Garlands', image: 'https://unsplash.com/photos/hgZMVDinMns/download?force=true', subcategories: ['Artificial Garlands', 'Flower Strings', 'Rose Petals', 'Marigold Garlands'] },
  { id: 'cat-17', name: 'Deity Ornaments', image: 'https://unsplash.com/photos/foAZ9c93sRE/download?force=true', subcategories: ['Crowns & Mukuts', 'Necklaces', 'Earrings', 'Bangles'] },
  { id: 'cat-18', name: 'Dhoop & Agarbatti', image: 'https://unsplash.com/photos/a__Nrif3J9o/download?force=true', subcategories: ['Dhoop Sticks', 'Agarbatti Packs', 'Dhoop Cones', 'Sambrani'] },
  { id: 'cat-19', name: 'Yantra & Kavach', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Sri_Yantra_copper2.jpg', subcategories: ['Shree Yantra', 'Navgraha Yantra', 'Kavach Lockets', 'Protection Yantras'] },
  { id: 'cat-20', name: 'Festival Specials', image: 'https://unsplash.com/photos/Y19GN7DIRuc/download?force=true', subcategories: ['Diwali Combos', 'Navratri Specials', 'Janmashtami Items', 'Holi Colors'] },
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
    title: 'Vrindavan Poshak Special',
    subtitle: 'Laddu Gopal poshak sets, mukut and kundan shringar for daily darshan',
    image: 'https://images.unsplash.com/photo-1764426381341-cf404613362b?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Dress%20%26%20Accessories'
  },
  {
    id: 'banner-2',
    title: 'Vrindavan Dress Collection',
    subtitle: 'Seasonal dresses, vastra sets and accessories inspired by Braj traditions',
    image: 'https://images.unsplash.com/photo-1673289998495-ccca5ac4048d?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Vrindavan%20Specials'
  },
  {
    id: 'banner-3',
    title: 'Janmashtami Divine Collection',
    subtitle: 'Laddu Gopal dresses, crowns, flutes and festive decorations now live',
    image: 'https://images.unsplash.com/photo-1678192935077-8847f1f892ba?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Dress%20%26%20Accessories'
  },
  {
    id: 'banner-4',
    title: 'Navratri Bhakti Essentials',
    subtitle: 'Durga puja kits, chunri sets and devotional decor curated for nine nights',
    image: 'https://images.unsplash.com/photo-1758819395004-10d1b9d51d3b?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Puja%20Items'
  },
  {
    id: 'banner-5',
    title: 'Diwali Deepotsav Offers',
    subtitle: 'Brass diyas, rangoli packs and temple decor with festive discounts',
    image: 'https://images.unsplash.com/photo-1761328119419-154a21dcd64d?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Home%20Decor'
  },
  {
    id: 'banner-6',
    title: 'Ram Navami Special Picks',
    subtitle: 'Ram darbar idols, bhajan books and puja samagri for sacred celebrations',
    image: 'https://images.unsplash.com/photo-1759592370294-30f83cf6a609?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Idols%20%26%20Murtis'
  },
  {
    id: 'banner-7',
    title: 'Krishna Bhakti Week',
    subtitle: 'Tulsi malas, chandan tilak and Vrindavan specials in one collection',
    image: 'https://images.unsplash.com/photo-1742277296672-e39540d72f71?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Vrindavan%20Specials'
  },
  {
    id: 'banner-8',
    title: 'Ganesh Chaturthi Offers',
    subtitle: 'Eco-friendly Ganesh idols, modak bhog sets and festive mandir decor',
    image: 'https://images.unsplash.com/photo-1647703519167-86dbbb6e1ecb?auto=format&fit=crop&w=1600&q=80',
    link: '/category/Idols%20%26%20Murtis'
  },
];


