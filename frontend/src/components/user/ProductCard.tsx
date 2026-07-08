import { useMemo, useState } from 'react';
import { Heart, Star } from 'lucide-react';
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

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#eadbc8] bg-[#fff7eb] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f16900]/45 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="relative block aspect-[1.06/1] overflow-hidden border-b border-[#eadbc8] bg-[#fffaf3] p-2.5">
        <img src={images[activeImage]} alt={product.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.isTrending && <span className="rounded-full bg-[#5b1f2b] px-2 py-0.5 text-[9px] font-bold uppercase text-white">Best Seller</span>}
          {product.isLatest && <span className="rounded-full bg-[#f16900] px-2 py-0.5 text-[9px] font-bold uppercase text-white">New</span>}
        </div>
        <button type="button" onClick={addWish} className={`absolute right-2 top-2 rounded-full border border-[#eadbc8] bg-white/95 p-1.5 shadow-sm transition-colors hover:text-[#8b2638] ${inWishlist ? 'text-[#8b2638]' : 'text-[#6f6258]'}`} aria-label={inWishlist ? 'In wishlist' : `Add ${product.name} to wishlist`}>
          <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/90 px-2 py-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            {images.slice(0, 4).map((_, index) => (
              <button type="button" key={index} onMouseEnter={() => setActiveImage(index)} onClick={(e) => e.preventDefault()} aria-label={`Show product image ${index + 1}`} className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-4 bg-[#f16900]' : 'w-1.5 bg-[#d8cab7]'}`} />
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#8c7766]">{product.category}</p>
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={12} className={star <= Math.round(product.rating || 0) ? 'fill-[#e8a514] text-[#e8a514]' : 'fill-transparent text-[#d8cab7]'} />
            ))}
          </div>
          <span className="text-[10px] text-[#8c7766]">({product.reviews || 0})</span>
        </div>
        <div className="mt-2 flex min-h-[42px] items-start gap-2">
          <Link to={`/product/${product.id}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[13px] font-bold leading-[18px] text-[#4b2727] transition-colors group-hover:text-[#f16900]">{product.name}</h3>
          </Link>
          <span className="shrink-0 text-right text-lg font-extrabold leading-5 text-[#d79a00]">₹{lowestPrice.toLocaleString('en-IN')}</span>
        </div>
        {firstSize?.stock === 0 && <span className="mt-1 text-[10px] font-semibold text-destructive">Out of stock</span>}
        <div className="mt-auto grid grid-cols-1 gap-1.5 pt-3 sm:grid-cols-2 sm:gap-2">
          <Button onClick={addCart} disabled={!firstSize || firstSize.stock === 0} size="sm" className="h-8 w-full rounded-md bg-[#f16900] px-2 text-[10px] font-extrabold text-white hover:bg-[#dc5f00] sm:h-9 sm:text-[11px]">
            Add to Cart
          </Button>
          <Button onClick={buyNow} disabled={!firstSize || firstSize.stock === 0} size="sm" variant="outline" className="h-8 w-full rounded-md border-[#f16900] bg-white px-2 text-[10px] font-extrabold text-[#f16900] hover:bg-[#f16900] hover:text-white sm:h-9 sm:text-[11px]">
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
