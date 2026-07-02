import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const CategoryNavBar = () => {
  const { categories } = useStore();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setOpenCategoryId(null);
    window.addEventListener('scroll', closeMenu, { passive: true });
    return () => window.removeEventListener('scroll', closeMenu);
  }, []);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <nav
      className="relative z-30 border-y border-border bg-background/95 shadow-sm backdrop-blur"
      aria-label="Product categories"
      onMouseLeave={() => setOpenCategoryId(null)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-7 overflow-x-auto py-3 scrollbar-hide lg:justify-center">
          {sortedCategories.map((category) => {
            const isOpen = openCategoryId === category.id && category.subcategories.length > 0;
            return (
              <div
                key={category.id}
                className="shrink-0"
                onMouseEnter={() => setOpenCategoryId(category.id)}
              >
                <Link
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="block whitespace-nowrap py-1 text-base font-semibold text-foreground/80 transition-colors hover:text-primary md:text-lg"
                  aria-expanded={isOpen}
                >
                  {category.name}
                </Link>
                {isOpen && (
                  <div className="absolute left-0 right-0 top-full border-t border-border bg-background shadow-xl">
                    <div className="container mx-auto flex flex-wrap gap-x-8 gap-y-3 px-6 py-5">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          to={`/category/${encodeURIComponent(category.name)}?subcategory=${encodeURIComponent(subcategory)}`}
                          className="rounded-md px-3 py-2 text-base font-medium text-foreground/75 transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => setOpenCategoryId(null)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavBar;
