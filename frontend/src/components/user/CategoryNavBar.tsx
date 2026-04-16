import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const CategoryNavBar = () => {
  const { categories } = useStore();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const visibleCategories = showAll ? sortedCategories : sortedCategories.slice(0, 10);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="relative">
      {/* Category Strip - Icons */}
      <div className="bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3">
            {visibleCategories.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <Link
                  key={category.id}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex flex-col items-center gap-2 px-2 py-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <span
                    className={`h-10 w-10 shrink-0 rounded-full border ${
                      isActive ? 'border-primary/40 bg-primary/10' : 'border-border bg-background'
                    } flex items-center justify-center overflow-hidden`}
                  >
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={`${category.name} icon`}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {category.name.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-center leading-tight">
                    {category.name}
                  </span>
                </Link>
              );
            })}
            {categories.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="ml-1 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap border border-border text-muted-foreground
                           hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                {showAll ? 'Show Less' : 'View All Categories'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavBar;
