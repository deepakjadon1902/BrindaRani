import { Link } from 'react-router-dom';
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
  
  const isInWishlist = wishlist.some(item => item.productId === product.id);
  const lowestPrice = Math.min(...product.sizes.map(s => s.price));
  const highestPrice = Math.max(...product.sizes.map(s => s.price));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstSize = product.sizes[0];
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      size: firstSize.size,
      price: firstSize.price,
      quantity: 1,
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} (${firstSize.size})`,
    });
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
      image: product.images[0],
      price: lowestPrice,
    });
    
    toast.success('Added to wishlist!');
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="card-product">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isTrending && (
              <span className="badge-trending">Trending</span>
            )}
            {product.isLatest && (
              <span className="badge-new">New</span>
            )}
          </div>

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

          {/* Add to Cart Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              onClick={handleAddToCart}
              className="w-full btn-gold"
              size="sm"
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </Button>
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
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
