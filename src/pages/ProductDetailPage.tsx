import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/user/ProductCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToWishlist, wishlist } = useStore();
  
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some(item => item.productId === product.id);
  const totalPrice = (selectedSize?.price || 0) * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      size: selectedSize.size,
      price: selectedSize.price,
      quantity,
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} (${selectedSize.size}) x ${quantity}`,
    });
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      toast.info('Already in wishlist');
      return;
    }
    
    addToWishlist({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: selectedSize?.price || product.sizes[0].price,
    });
    
    toast.success('Added to wishlist!');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight size={16} />
          <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-primary">
            {product.category}
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isTrending && <span className="badge-trending">Trending</span>}
              {product.isLatest && <span className="badge-new">New Arrival</span>}
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) 
                      ? 'fill-primary text-primary' 
                      : 'text-muted-foreground'
                    }
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary">
                ₹{totalPrice.toLocaleString()}
              </span>
              {quantity > 1 && (
                <span className="text-muted-foreground ml-2">
                  (₹{selectedSize?.price.toLocaleString()} × {quantity})
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    disabled={size.stock === 0}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize?.size === size.size
                        ? 'border-primary bg-primary/10 text-primary'
                        : size.stock === 0
                        ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <span className="block font-medium">{size.size}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{size.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedSize?.stock || 10, quantity + 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedSize?.stock} items available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 btn-sacred py-6"
                disabled={!selectedSize || selectedSize.stock === 0}
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className={`px-6 py-6 ${isInWishlist ? 'text-secondary border-secondary' : ''}`}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck size={24} className="mx-auto mb-2 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto mb-2 text-primary" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="text-center">
                <RotateCcw size={24} className="mx-auto mb-2 text-primary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
