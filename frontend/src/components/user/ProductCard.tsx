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
      className="group"
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
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
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
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full bg-white shadow-md transition-colors ${
                isInWishlist ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'
              }`}
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">
              ₹{lowestPrice.toLocaleString()}
            </span>
            {lowestPrice !== highestPrice && (
              <span className="text-sm text-muted-foreground">
                - ₹{highestPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="secondary"
              size="sm"
              className="w-full"
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



