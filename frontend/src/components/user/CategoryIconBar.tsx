import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const CategoryIconBar = () => {
  const { categories } = useStore();
  const [loadedImages, setLoadedImages] = React.useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = React.useState(false);
  const orderedCategories = React.useMemo(() => {
    return [
      ...categories,
    ];
  }, [categories]);

  const visibleCategories = React.useMemo(
    () => [...orderedCategories].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10),
    [orderedCategories],
  );

  React.useEffect(() => {
    visibleCategories.forEach((category) => {
      if (!category.image) return;
      const img = new Image();
      img.src = category.image;
    });
  }, [visibleCategories]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="py-8 md:py-12 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-6 transition-all duration-500 ease-out ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-1 block">
            Explore
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Shop by Category
          </h2>
        </div>
        <div
          className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center transition-all duration-500 ease-out ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ minHeight: '120px' }}
        >
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-200"
            >
              {category.image ? (
                <span className="relative w-12 h-12 rounded-full border border-border group-hover:border-primary/40 overflow-hidden bg-muted/60">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="eager"
                    decoding="async"
                    onLoad={() => handleImageLoad(category.id)}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!loadedImages[category.id]) handleImageLoad(category.id);
                      if (img.src.endsWith('/placeholder.svg')) return;
                      img.src = '/placeholder.svg';
                    }}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      loadedImages[category.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary/10" />
                </span>
              ) : (
                <span className="w-12 h-12 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center group-hover:bg-primary/15">
                  {category.name.charAt(0)}
                </span>
              )}
              <span className="text-center leading-tight">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIconBar;
