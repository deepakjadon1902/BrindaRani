import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const CategoryIconBar = () => {
  const { categories } = useStore();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    categories.forEach((category) => {
      if (!category.image) return;
      const img = new Image();
      img.src = category.image;
    });
  }, [categories]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  return (
    <section className="py-8 md:py-12 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-1 block">
            Explore
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Shop by Category
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground
                         hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              {category.image ? (
                <span className="relative w-7 h-7 rounded-full border border-border group-hover:border-primary-foreground/40 overflow-hidden bg-muted/60">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onLoad={() => handleImageLoad(category.id)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      loadedImages[category.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary/10" />
                </span>
              ) : (
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground">
                  {category.name.charAt(0)}
                </span>
              )}
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIconBar;
