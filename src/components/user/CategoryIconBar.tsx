import { Link } from 'react-router-dom';
import { Flame, Crown, Sparkles, Shirt, BookOpen, Home } from 'lucide-react';
import { useStore } from '@/store/useStore';

const categoryIcons: Record<string, React.ElementType> = {
  'Puja Items': Flame,
  'Idols & Murtis': Crown,
  'Vrindavan Specials': Sparkles,
  'Dress & Accessories': Shirt,
  'Books & Media': BookOpen,
  'Home Decor': Home,
};

const CategoryIconBar = () => {
  const { categories } = useStore();

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
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Sparkles;
            return (
              <Link
                key={category.id}
                to={`/category/${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center
                              group-hover:bg-primary group-hover:shadow-lg transition-all duration-300">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors text-center max-w-[80px]">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryIconBar;
