import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/user/ProductCard';

const CategoryPage = () => {
  const { name } = useParams();
  const { products, categories, fetchProducts, fetchCategories } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const decodedName = decodeURIComponent(name || '');
  const category = categories.find(c => c.name === decodedName);
  const categoryProducts = products.filter(p => p.category === decodedName);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Category not found</h2>
          <Link to="/products" className="text-primary hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight size={16} />
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {category.name}
              </h1>
              <p className="text-white/80 max-w-md">
                Explore our divine collection of {category.name.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
          <div className="flex flex-wrap gap-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub}
                to={`/products?search=${encodeURIComponent(sub)}`}
                className="px-4 py-2 rounded-full border border-border bg-card 
                         hover:border-primary hover:text-primary transition-colors"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">
              All {category.name} ({categoryProducts.length})
            </h2>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground">
                Products in this category will appear here soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
