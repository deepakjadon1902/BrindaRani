import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/user/ProductCard';
import { Button } from '@/components/ui/button';

const CategoryNavBar = () => {
  const { categories, products } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory).slice(0, 8)
    : [];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className="relative">
      {/* Category Strip - Text Only */}
      <div className="bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Products Panel */}
      {activeCategory && (
        <div className="absolute top-full left-0 right-0 z-40 bg-background border-b border-border shadow-xl animate-fade-in">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground">
                {activeCategory}
              </h3>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm" className="btn-outline-sacred">
                  <Link to={`/category/${encodeURIComponent(activeCategory)}`}>
                    View All <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Button>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
                  <div key={product.id} onClick={() => setActiveCategory(null)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                No products found in this category yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryNavBar;
