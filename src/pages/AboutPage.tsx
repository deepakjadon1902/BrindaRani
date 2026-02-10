import { Heart, Award, Users, MapPin, Sparkles, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-8xl">🙏</div>
          <div className="absolute bottom-10 right-10 text-8xl">🪷</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            About <span className="text-primary">BrindaRani</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A divine journey from the sacred land of Vrindavan, bringing authentic 
            spiritual products to devotees worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Bringing Vrindavan's Blessings to Your Doorstep
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BrindaRani is a spiritual e-commerce platform dedicated to bringing authentic, 
                satvik products from the holy land of Vrindavan to devotees worldwide. Our mission 
                is to provide high-quality puja items, deity accessories, and spiritual goods that 
                are sourced directly from skilled artisans.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every product in our collection is blessed with devotion and crafted with traditional 
                techniques passed down through generations. We work directly with artisan families 
                who have been creating sacred items for centuries.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our vision is to preserve and promote the rich spiritual heritage of Vrindavan 
                while making it accessible to everyone, regardless of where they are in the world.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&q=80" 
                  alt="Vrindavan Temple" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold font-serif">10+</p>
                <p className="text-sm opacity-90">Years of Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Devotion First', desc: 'Every product is selected and handled with deep devotion and respect for spiritual traditions.' },
              { icon: Award, title: '100% Authentic', desc: 'We guarantee authenticity. All items are sourced directly from trusted artisans in Vrindavan.' },
              { icon: Users, title: 'Artisan Support', desc: 'We empower local artisan families by providing fair trade and sustainable business practices.' },
              { icon: Sparkles, title: 'Premium Quality', desc: 'Only the finest materials and craftsmanship make it to our shelves. Quality is non-negotiable.' },
              { icon: MapPin, title: 'Rooted in Vrindavan', desc: 'Our roots are deep in the holy land. We live and breathe the culture we share with you.' },
              { icon: Star, title: 'Customer Love', desc: 'Over 10,000 happy devotees trust us. Their satisfaction and blessings drive everything we do.' },
            ].map((value, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
              From a Small Shop to a Global Platform
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-left">
              <p>
                BrindaRani began as a small shop near the Banke Bihari Temple in Vrindavan, 
                serving local devotees with puja items and deity accessories. Founded by a family 
                of devotees, the shop quickly became known for its authentic, high-quality products.
              </p>
              <p>
                As word spread, devotees from across India and abroad started reaching out, 
                wanting to buy the same blessed items they had found during their pilgrimages. 
                This inspired us to take BrindaRani online, making the divine treasures of 
                Vrindavan accessible to everyone.
              </p>
              <p>
                Today, BrindaRani serves over 10,000 devotees across India and internationally. 
                We continue to work with the same artisan families, ensuring every product 
                carries the authentic touch and blessings of Vrindavan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Happy Devotees' },
              { number: '500+', label: 'Products' },
              { number: '50+', label: 'Artisan Partners' },
              { number: '100+', label: 'Cities Served' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-serif font-bold mb-1">{stat.number}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
