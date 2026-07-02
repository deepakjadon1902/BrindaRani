import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const isInWishlist = wishlist.some(item => item.productId === product.id);
  const lowestPrice = Math.min(...product.sizes.map(s => s.price));
  const highestPrice = Math.max(...product.sizes.map(s => s.price));
  const images = useMemo(
    () => (product.images && product.images.length > 0 ? product.images : ['/placeholder.svg']),
    [product.images]
  );

  useEffect(() => {
    if (!isHovering || images.length <= 1) {
      setActiveImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstSize = product.sizes[0];
    addToCart({
      productId: product.id,
      name: product.name,
      image: images[0],
      size: firstSize.size,
      price: firstSize.price,
      quantity: 1,
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} (${firstSize.size})`,
    });
  };

    const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstSize = product.sizes[0];
    const payload = {
      productId: product.id,
      name: product.name,
      image: images[0],
      size: firstSize.size,
      price: firstSize.price,
      quantity: 1,
    };
    try {
      sessionStorage.setItem('Brindarani-buy-now', JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
    navigate('/checkout?buyNow=1');
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      toast.info('Already in wishlist');
      return;
    }
    
    addToWishlist({
      productId: product.id,
      name: product.name,
      image: images[0],
      price: lowestPrice,
    });
    
    toast.success('Added to wishlist!');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group min-w-0"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="card-product">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={images[activeImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.src.endsWith('/placeholder.svg')) return;
              img.src = '/placeholder.svg';
            }}
          />

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
              {images.slice(0, 5).map((src, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  onMouseEnter={(e) => {
                    e.preventDefault();
                    setActiveImageIndex(index);
                  }}
                  onClick={(e) => e.preventDefault()}
                  className={`h-6 w-6 overflow-hidden rounded-full border ${
                    index === activeImageIndex ? 'border-white' : 'border-white/40'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.endsWith('/placeholder.svg')) return;
                      img.src = '/placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Badges intentionally hidden on product cards (keeps UI clean) */}

          {/* Quick Actions */}
          <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToWishlist}
              aria-label={isInWishlist ? 'Already in wishlist' : `Add ${product.name} to wishlist`}
              className={`p-1.5 rounded-full bg-white/95 shadow-md transition-colors ${
                isInWishlist ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              <Heart size={15} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

        </div>

        {/* Content */}
        <div className="p-2 md:p-3">
          <p className="hidden sm:block text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide mb-1 truncate">
            {product.category}
          </p>
          <h3 className="text-xs md:text-sm font-semibold text-foreground line-clamp-2 min-h-8 md:min-h-10 mb-1.5 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-1.5 min-w-0">
            <Star size={12} className="shrink-0 fill-primary text-primary" />
            <span className="text-[11px] md:text-xs font-medium">{product.rating}</span>
            <span className="hidden md:inline truncate text-[10px] text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm md:text-base font-bold text-primary truncate">
              ₹{lowestPrice.toLocaleString()}
            </span>
            {lowestPrice !== highestPrice && (
              <span className="hidden lg:inline text-xs text-muted-foreground">
                - ₹{highestPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="hidden md:inline-flex w-full h-8 px-1 text-xs"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="secondary"
              size="sm"
              className="w-full h-8 px-1 text-[10px] md:text-xs"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;



