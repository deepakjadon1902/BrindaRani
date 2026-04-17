import { useMemo, useState, useEffect } from 'react';
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
  const { products, addToCart, addToWishlist, wishlist, fetchProducts } = useStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);
  
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] || null);
    setQuantity(1);
    setActiveImage(0);
  }, [product?.id]);

  const images = useMemo(
    () => (product?.images && product.images.length > 0 ? product.images : ['/placeholder.svg']),
    [product?.images]
  );
  const unitPrice = selectedSize?.price ?? product?.sizes?.[0]?.price ?? 0;

  const originalPrice = useMemo(() => {
    if (!product) return null;
    const raw = (product as any)?.originalPrice ?? (product as any)?.mrp ?? (product as any)?.compareAtPrice;
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n)) return null;
    return n > unitPrice ? n : null;
  }, [product, unitPrice]);

  const savings = originalPrice ? Math.max(0, originalPrice - unitPrice) : 0;
  const savingsPercent = originalPrice ? Math.round((savings / originalPrice) * 100) : 0;

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

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addToCart({
      productId: product.id,
      name: product.name,
      image: images[0],
      size: selectedSize.size,
      price: selectedSize.price,
      quantity,
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} (${selectedSize.size}) x ${quantity}`,
    });
  };

    const handleBuyNow = () => {
    if (!selectedSize) return;

    const payload = {
      productId: product.id,
      name: product.name,
      image: images[0],
      size: selectedSize.size,
      price: selectedSize.price,
      quantity,
    };
    try {
      sessionStorage.setItem('Brindarani-buy-now', JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
    navigate('/checkout?buyNow=1');
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      toast.info('Already in wishlist');
      return;
    }
    
    addToWishlist({
      productId: product.id,
      name: product.name,
      image: images[0],
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
            <div className="flex gap-4">
              {images.length > 1 && (
                <div className="hidden sm:flex flex-col gap-3 w-16 md:w-20 shrink-0">
                  {images.slice(0, 8).map((image, index) => (
                    <button
                      key={`${product.id}-thumb-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border transition-colors ${
                        index === activeImage ? 'border-primary' : 'border-border hover:border-primary/50'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
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

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted flex-1">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.endsWith('/placeholder.svg')) return;
                    img.src = '/placeholder.svg';
                  }}
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isTrending && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold">
                      Best Seller
                    </span>
                  )}
                  {product.isVrindavanSpecial && (
                    <span className="badge-vrindavan">Vrindavan Special</span>
                  )}
                </div>

                {originalPrice && savings > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-semibold">
                      {savingsPercent > 0 ? `${savingsPercent}% OFF` : 'SALE'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="sm:hidden flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${product.id}-thumb-mobile-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border transition-colors shrink-0 ${
                      index === activeImage ? 'border-primary' : 'border-border'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
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
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="mb-6 flex items-center flex-wrap gap-x-4 gap-y-2">
              <span className="text-3xl font-bold text-primary">
                {'\u20B9'}{unitPrice.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-muted-foreground line-through">
                  {'\u20B9'}{originalPrice.toLocaleString()}
                </span>
              )}
              {savings > 0 && (
                <span className="inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 px-2.5 py-1 text-sm font-semibold">
                  Save {'\u20B9'}{savings.toLocaleString()}
                </span>
              )}
              {quantity > 1 && (
                <span className="text-muted-foreground ml-2">
                  ({'\u20B9'}{unitPrice.toLocaleString()} {'\u00D7'} {quantity})
                </span>
              )}
            </div>

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
                      {'\u20B9'}{size.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border border-border rounded-xl bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors rounded-l-xl"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedSize?.stock || 10, quantity + 1))}
                    className="p-3 hover:bg-muted transition-colors rounded-r-xl"
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
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 py-6 min-w-[180px] rounded-2xl shadow-[var(--shadow-soft)] bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-400 hover:to-amber-600"
                disabled={!selectedSize || selectedSize.stock === 0}
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 py-6 min-w-[180px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!selectedSize || selectedSize.stock === 0}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className={`px-6 py-6 rounded-2xl ${isInWishlist ? 'text-secondary border-secondary' : ''}`}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck size={22} className="mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Delivery</div>
                <div className="text-xs text-muted-foreground">Arrives in 3{'\u2013'}7 days</div>
              </div>
              <div className="text-center">
                <Shield size={22} className="mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Authentic</div>
                <div className="text-xs text-muted-foreground">Temple verified</div>
              </div>
              <div className="text-center">
                <RotateCcw size={22} className="mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">7 day policy</div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-3">Product details</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
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

