import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import HeroSection from '@/components/user/HeroSection';
import CategoryIconBar from '@/components/user/CategoryIconBar';
import ProductCard from '@/components/user/ProductCard';
import CustomDesignSection from '@/components/user/CustomDesignSection';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { products } = useStore();

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const latestProducts = products.filter(p => p.isLatest).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Icon Bar - Below Hero */}
      <CategoryIconBar />

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-sacred">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                🪔 Handcrafted with Divine Love
              </h3>
              <p className="text-white/80">
                Each product is blessed and crafted by skilled artisans from Vrindavan
              </p>
            </div>
            <Button asChild className="bg-white text-secondary hover:bg-white/90">
              <Link to="/category/Vrindavan%20Specials">
                Explore Vrindavan Specials
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
                Popular Now
              </span>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <Link 
              to="/products?filter=trending" 
              className="hidden md:flex items-center gap-2 text-primary hover:underline"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="btn-outline-sacred">
              <Link to="/products?filter=trending">
                View All Trending <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm text-accent font-medium uppercase tracking-wider mb-2 block">
                Just Arrived
              </span>
              <h2 className="section-title">Latest Products</h2>
            </div>
            <Link 
              to="/products?filter=latest" 
              className="hidden md:flex items-center gap-2 text-primary hover:underline"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Design Section */}
      <CustomDesignSection />

      {/* Trust Badges */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="font-semibold mb-1">Authentic Products</h4>
              <p className="text-sm text-muted-foreground">100% Genuine Items</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-semibold mb-1">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Pan India Shipping</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">↩️</div>
              <h4 className="font-semibold mb-1">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">7 Days Return Policy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-semibold mb-1">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">100% Secure Checkout</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
