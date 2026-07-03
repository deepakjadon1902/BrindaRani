import { useMemo, useState } from 'react';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps { product: Product }

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const images = useMemo(() => product.images?.length ? product.images : ['/placeholder.svg'], [product.images]);
  const prices = product.sizes?.map((size) => size.price) || [];
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const firstSize = product.sizes?.[0];
  const inWishlist = wishlist.some((item) => item.productId === product.id);

  const cartPayload = firstSize && { productId: product.id, name: product.name, image: images[0], size: firstSize.size, price: firstSize.price, quantity: 1 };
  const addCart = (event: React.MouseEvent) => { event.preventDefault(); if (!cartPayload) return toast.error('This product is currently unavailable'); addToCart(cartPayload); toast.success('Added to cart'); };
  const buyNow = (event: React.MouseEvent) => { event.preventDefault(); if (!cartPayload) return toast.error('This product is currently unavailable'); sessionStorage.setItem('Brindarani-buy-now', JSON.stringify(cartPayload)); navigate('/checkout?buyNow=1'); };
  const addWish = (event: React.MouseEvent) => { event.preventDefault(); if (inWishlist) return toast.info('Already in wishlist'); addToWishlist({ productId: product.id, name: product.name, image: images[0], price: lowestPrice }); toast.success('Added to wishlist'); };

  return <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
    <Link to={`/product/${product.id}`} className="relative block aspect-[4/4.25] overflow-hidden bg-[#faf7f2] p-2">
      <img src={images[activeImage]} alt={product.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}/>
      <div className="absolute left-2 top-2 flex flex-col items-start gap-1">{product.isTrending && <span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold uppercase text-secondary-foreground">Best seller</span>}{product.isLatest && <span className="rounded-full bg-primary px-2 py-1 text-[9px] font-bold uppercase text-primary-foreground">New</span>}</div>
      <button type="button" onClick={addWish} className={`absolute right-2 top-2 rounded-full border bg-white/95 p-2 shadow-sm transition-colors hover:text-secondary ${inWishlist ? 'text-secondary' : 'text-muted-foreground'}`} aria-label={inWishlist ? 'In wishlist' : `Add ${product.name} to wishlist`}><Heart size={16} fill={inWishlist ? 'currentColor' : 'none'}/></button>
      {images.length > 1 && <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/90 px-2 py-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">{images.slice(0, 4).map((_, index) => <button type="button" key={index} onMouseEnter={() => setActiveImage(index)} onClick={(e) => e.preventDefault()} aria-label={`Show product image ${index + 1}`} className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`}/>)}</div>}
    </Link>
    <div className="flex flex-1 flex-col border-t bg-gradient-to-b from-card to-primary/[0.025] p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary/75">{product.category}</p>
      <Link to={`/product/${product.id}`}><h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground transition-colors group-hover:text-primary">{product.name}</h3></Link>
      <div className="mt-2 flex items-center gap-1"><div className="flex">{[1,2,3,4,5].map((star) => <Star key={star} size={12} className={star <= Math.round(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted'}/>)}</div><span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span></div>
      <div className="mt-2 flex items-end justify-between"><span className="text-lg font-extrabold text-primary">₹{lowestPrice.toLocaleString('en-IN')}</span>{firstSize?.stock === 0 && <span className="text-[10px] font-semibold text-destructive">Out of stock</span>}</div>
      <div className="mt-3 grid grid-cols-2 gap-2"><Button onClick={addCart} disabled={!firstSize || firstSize.stock === 0} size="sm" className="h-9 px-1 text-[11px] font-bold"><ShoppingCart size={14} className="mr-1"/>Add to Cart</Button><Button onClick={buyNow} disabled={!firstSize || firstSize.stock === 0} size="sm" variant="outline" className="h-9 border-primary px-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground"><Zap size={13} className="mr-1"/>Buy Now</Button></div>
    </div>
  </article>;
};

export default ProductCard;
