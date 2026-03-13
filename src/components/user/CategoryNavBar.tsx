import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';

const CategoryNavBar = () => {
  const { categories } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const preferredCategoryOrder = [
    'Puja Items',
    'Idols & Murtis',
    'Vrindavan Specials',
    'Tulsi Products',
    'Spiritual Gifts',
    'Dress & Accessories',
    'Chandan & Kumkum',
    'Brass & Copper Items',
  ];

  const normalizeCategoryName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

  const categoryByNormalizedName = new Map(
    categories.map((category) => [normalizeCategoryName(category.name), category]),
  );

  const categoryIconNames: Record<string, string> = {
    [normalizeCategoryName('Puja Items')]: 'candle',
    [normalizeCategoryName('Idols & Murtis')]: 'temple-hindu',
    [normalizeCategoryName('Vrindavan Specials')]: 'flower',
    [normalizeCategoryName('Tulsi Products')]: 'leaf',
    [normalizeCategoryName('Spiritual Gifts')]: 'gift',
    [normalizeCategoryName('Dress & Accessories')]: 'tshirt-crew',
    [normalizeCategoryName('Chandan & Kumkum')]: 'water',
    [normalizeCategoryName('Brass & Copper Items')]: 'coin',
  };

  const getIconSrc = (categoryName: string, isActive: boolean) => {
    const iconName = categoryIconNames[normalizeCategoryName(categoryName)] ?? 'flower';
    const color = isActive ? 'ffffff' : '6b7280';
    return `https://api.mdisvg.com/v1/i/${iconName}?color=${color}&size=18`;
  };

  const visibleCategories = preferredCategoryOrder
    .map((name) => categoryByNormalizedName.get(normalizeCategoryName(name)))
    .filter((category): category is (typeof categories)[number] => Boolean(category));

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="relative">
      {/* Category Strip - Text Only */}
      <div className="bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {visibleCategories.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <Link
                  key={category.id}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <img
                      src={getIconSrc(category.name, isActive)}
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                      decoding="async"
                      className="h-[18px] w-[18px] shrink-0"
                    />
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavBar;
