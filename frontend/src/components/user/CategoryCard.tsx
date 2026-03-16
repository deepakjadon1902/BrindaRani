import { Link } from 'react-router-dom';
import { Category } from '@/data/mockData';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      to={`/category/${encodeURIComponent(category.name)}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] card-product"
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-2 
                     group-hover:translate-y-0 transition-transform">
          {category.name}
        </h3>
        <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {category.subcategories.length} subcategories
        </p>
        
        {/* Hover Effect Line */}
        <div className="h-0.5 bg-primary w-0 group-hover:w-16 transition-all duration-300 mt-3" />
      </div>
    </Link>
  );
};

export default CategoryCard;
