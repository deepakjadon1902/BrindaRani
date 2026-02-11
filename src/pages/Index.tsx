import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, RotateCcw, Lock, Sparkles, Tag, Percent, Gift, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import HeroSection from '@/components/user/HeroSection';
import CategoryIconBar from '@/components/user/CategoryIconBar';
import ProductCard from '@/components/user/ProductCard';
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

      {/* Brand Story / Who We Are */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              🙏 Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Sacred Craftsmanship, Delivered to Your Doorstep
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              BrindaRani brings the divine essence of Vrindavan directly to your home. Every product is handcrafted by skilled artisans from the holy land, preserving centuries-old traditions of devotion and artistry.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you seek a beautifully adorned idol for your mandir, authentic tulsi malas for daily chanting, or premium puja essentials — we ensure every item carries the blessings and authenticity of Vrindavan.
            </p>
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Sacred Products</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Happy Devotees</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Authentic Items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners Grid - Flipkart/Meesho style */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Deal of the Day */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground p-6 md:p-8 md:row-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 rounded-full text-sm font-medium mb-4">
                <Clock size={14} /> Deal of the Day
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3">
                Up to 40% Off on Brass Idols
              </h3>
              <p className="text-secondary-foreground/80 mb-6">
                Premium handcrafted brass idols at unbeatable prices. Limited time offer for devotees.
              </p>
              <Button asChild className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
                <Link to="/category/Idols%20%26%20Murtis">
                  Shop Now <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/30 border-2 border-secondary flex items-center justify-center text-xs">
                      <Star size={12} />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-secondary-foreground/70">2.5K+ sold this week</span>
              </div>
            </div>

            {/* Festival Season */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/15 text-primary rounded-full text-sm font-medium mb-3">
                  <Sparkles size={14} /> Festival Specials
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                  Puja Essentials Combo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete puja kits curated for every occasion. Everything you need in one hamper.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="btn-outline-sacred mt-4 w-fit">
                <Link to="/category/Puja%20Items">Explore</Link>
              </Button>
            </div>

            {/* Free Shipping Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-6 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent rounded-full text-sm font-medium mb-3">
                  <Truck size={14} /> Free Shipping
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                  Free Delivery Pan India
                </h3>
                <p className="text-sm text-muted-foreground">
                  On orders above ₹999. Carefully packed with divine care, delivered to your doorstep.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground mt-4 w-fit">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>

            {/* New Arrivals */}
            <div className="rounded-2xl bg-gradient-to-r from-[hsl(var(--sacred-gold)/0.1)] to-[hsl(var(--lotus-pink)/0.1)] border border-border p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-foreground">New Arrivals Weekly</h4>
                <p className="text-sm text-muted-foreground">Fresh collections from Vrindavan artisans every week</p>
              </div>
            </div>

            {/* Offer Tag */}
            <div className="rounded-2xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-border p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Percent className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-foreground">Bulk Order Discounts</h4>
                <p className="text-sm text-muted-foreground">Special pricing for temples, ashrams & events</p>
              </div>
            </div>
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

      {/* Promotional Banner - Full Width */}
      <section className="py-12 bg-gradient-sacred">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-primary-foreground">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                🪔 Handcrafted with Divine Love
              </h3>
              <p className="text-primary-foreground/80">
                Each product is blessed and crafted by skilled artisans from Vrindavan
              </p>
            </div>
            <Button asChild className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90">
              <Link to="/category/Vrindavan%20Specials">
                Explore Vrindavan Specials
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

      {/* Why Choose BrindaRani */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
              Why Devotees Trust Us
            </span>
            <h2 className="section-title text-center mx-auto">Why Choose BrindaRani?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-premium p-6 text-center group hover:border-primary/30">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ShieldCheck className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-serif font-bold text-foreground mb-2">100% Authentic</h4>
              <p className="text-sm text-muted-foreground">
                Every product sourced directly from Vrindavan and verified for authenticity
              </p>
            </div>
            <div className="card-premium p-6 text-center group hover:border-primary/30">
              <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                <Truck className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <h4 className="font-serif font-bold text-foreground mb-2">Pan India Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Safe, insured shipping across India with careful packaging for delicate items
              </p>
            </div>
            <div className="card-premium p-6 text-center group hover:border-primary/30">
              <div className="w-14 h-14 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                <RotateCcw className="w-7 h-7 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h4 className="font-serif font-bold text-foreground mb-2">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">
                7-day hassle-free return policy. Your satisfaction is our devotion
              </p>
            </div>
            <div className="card-premium p-6 text-center group hover:border-primary/30">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Lock className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-serif font-bold text-foreground mb-2">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                100% secure checkout with UPI, cards, net banking & cash on delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-14 md:py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
              Devotee Reviews
            </span>
            <h2 className="section-title text-center mx-auto">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Priya Sharma',
                location: 'Vrindavan',
                text: 'The brass Krishna idol I ordered is absolutely divine. The craftsmanship is exceptional — you can feel the devotion in every detail.',
                rating: 5,
              },
              {
                name: 'Rahul Verma',
                location: 'Mumbai',
                text: 'I ordered a complete puja set and tulsi mala. Everything arrived beautifully packed and 100% authentic. Will order again!',
                rating: 5,
              },
              {
                name: 'Anjali Patel',
                location: 'Delhi',
                text: 'BrindaRani is my go-to for all spiritual needs. The quality is unmatched and customer service is wonderful. Highly recommended.',
                rating: 5,
              },
            ].map((review, i) => (
              <div key={i} className="card-premium p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{review.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
