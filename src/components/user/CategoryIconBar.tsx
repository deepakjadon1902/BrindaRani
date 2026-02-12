import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

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
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground
                         hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIconBar;
