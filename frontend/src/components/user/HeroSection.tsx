import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { heroSlidesAPI, resolveAssetUrl } from '@/services/api';

type HeroSlide = { id: string; image: string; title: string; subtitle: string; tag?: string; link: string; ctaLabel?: string };

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSlides = () => heroSlidesAPI.getPublic().then((data) => {
      if (Array.isArray(data) && data.length) {
        setSlides(data.map((slide) => ({ id: slide._id, image: resolveAssetUrl(slide.image), title: slide.title, subtitle: slide.description, tag: slide.tag, link: slide.ctaLink || '/products', ctaLabel: slide.ctaLabel || 'Shop Now' })));
        setCurrentSlide(0);
      } else setSlides([]);
    }).catch(() => setSlides([])).finally(() => setIsLoading(false));
    void loadSlides();
    window.addEventListener('focus', loadSlides);
    return () => window.removeEventListener('focus', loadSlides);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) return <section className="w-full aspect-[1920/532] min-h-[360px] max-h-[532px] animate-pulse bg-muted" aria-label="Loading hero slides" />;
  if (slides.length === 0) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full aspect-[1920/532] min-h-[360px] max-h-[532px] overflow-hidden bg-muted">
      {/* Slides */}
      {slides.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image with Zoom Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] ease-out"
            style={{
              backgroundImage: `url(${banner.image})`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/30" />

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div
              className={`max-w-xl transition-all duration-1000 ${
                index === currentSlide
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-fade-in">
                {banner.tag || 'Divine Collection'}
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
                    {banner.ctaLabel || 'Shop Now'}
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
      {slides.length > 1 && <button
        onClick={prevSlide}
        aria-label="Previous hero slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm
                 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronLeft className="text-foreground" size={24} />
      </button>}
      {slides.length > 1 && <button
        onClick={nextSlide}
        aria-label="Next hero slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm
                 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronRight className="text-foreground" size={24} />
      </button>}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to hero slide ${index + 1}`}
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
