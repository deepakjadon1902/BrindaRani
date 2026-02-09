import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-muted">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image with Zoom Effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            style={{
              backgroundImage: `url(${banner.image})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/30" />
          
          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className={`max-w-xl transition-all duration-1000 ${
              index === currentSlide 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full 
                           text-sm font-medium mb-4 animate-fade-in">
                ✨ Divine Collection
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
                {banner.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {banner.subtitle}
              </p>
              <div className="flex gap-4">
                <Button asChild className="btn-sacred px-8 py-6 text-lg">
                  <Link to={banner.link}>
                    Shop Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-outline-sacred px-8 py-6 text-lg">
                  <Link to="/products">
                    Explore All
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm
                 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronLeft className="text-foreground" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm
                 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronRight className="text-foreground" size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-foreground/30 hover:bg-foreground/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
