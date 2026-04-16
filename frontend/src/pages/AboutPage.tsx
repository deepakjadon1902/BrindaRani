import { Heart, Award, Users, MapPin, Sparkles, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            About <span className="text-primary">Brindarani</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A bridge from the sacred land of Vrindavan to your home, curated with devotion,
            tradition, and timeless grace.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
                Our Essence
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Bringing the Divine Near, With Modern Care
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Brindarani is more than just an eCommerce platform, it is a bridge that brings the
                divine essence of Vrindavan closer to your home. Rooted in the sacred land of
                Vrindavan, we are dedicated to offering authentic and soulful spiritual products
                that carry the true spirit of devotion.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                From beautifully crafted Krishna idols online to a wide collection of devotional
                items online, every product at Brindarani is carefully selected to enhance your
                spiritual journey. We specialize in Vrindavan pooja items online, ensuring that you
                receive genuine, high-quality items that reflect tradition and purity.
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
                <p className="text-3xl font-bold font-serif">Pure</p>
                <p className="text-sm opacity-90">Devotion</p>
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
              A Devotional Experience, Delivered
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-left">
              <p>
                Whether you are looking for everyday essentials or special festive preparations,
                our range of spiritual products India caters to all your devotional needs. We also
                offer thoughtfully curated and customized pooja kits, designed to make your rituals
                simple, meaningful, and complete.
              </p>
              <p>
                At Brindarani, we believe devotion should be accessible, personal, and heartfelt.
                That is why we are committed to delivering not just products, but a divine
                experience right to your doorstep.
              </p>
              <p>
                Every item reflects a balance of sacred tradition and refined presentation,
                so your worship space feels serene, beautiful, and deeply connected to
                Vrindavan's timeless spirit.
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

