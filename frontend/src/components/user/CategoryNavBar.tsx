import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, Sparkles, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const CategoryNavBar = () => {
  const { categories, auth } = useStore();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCategoryId, setDrawerCategoryId] = useState<string | null>(null);
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const closeMegaMenu = () => setOpenCategoryId(null);
    window.addEventListener('scroll', closeMegaMenu, { passive: true });
    return () => window.removeEventListener('scroll', closeMegaMenu);
  }, []);

  const closeDrawer = () => { setDrawerOpen(false); setDrawerCategoryId(null); };

  return <nav className="sticky top-20 z-40 border-y border-border bg-card/95 text-foreground shadow-sm backdrop-blur md:top-24" aria-label="Product categories" onMouseLeave={() => setOpenCategoryId(null)}>
    <div className="container mx-auto flex h-11 items-stretch px-2 sm:px-4">
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetTrigger asChild><button type="button" className="flex shrink-0 items-center gap-2 border-x border-primary/10 bg-primary px-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"><Menu size={20}/>All</button></SheetTrigger>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-0 sm:max-w-sm">
          <SheetHeader className="bg-sidebar px-5 py-5 text-left text-sidebar-foreground"><SheetTitle className="flex items-center gap-3 text-lg text-sidebar-foreground"><UserCircle size={27}/>{auth.isAuthenticated ? `Hello, ${auth.user?.name?.split(' ')[0] || 'Devotee'}` : 'Hello, Sign in'}</SheetTitle></SheetHeader>
          <div className="divide-y">
            <section className="p-5"><h2 className="mb-2 font-sans text-lg font-bold">Trending</h2><Link to="/products?filter=trending" onClick={closeDrawer} className="block rounded-md py-2.5 text-sm hover:bg-muted hover:px-2">Best Sellers</Link><Link to="/products?filter=latest" onClick={closeDrawer} className="block rounded-md py-2.5 text-sm hover:bg-muted hover:px-2">New Releases</Link><Link to="/category/Vrindavan%20Specials" onClick={closeDrawer} className="block rounded-md py-2.5 text-sm hover:bg-muted hover:px-2">Vrindavan Specials</Link></section>
            <section className="p-5"><h2 className="mb-3 font-sans text-lg font-bold">Shop by Category</h2><div className="space-y-1">{sortedCategories.map((category) => { const expanded = drawerCategoryId === category.id; return <div key={category.id} className="overflow-hidden rounded-lg"><div className={`flex items-center hover:bg-muted ${expanded ? 'bg-muted' : ''}`}><Link to={`/category/${encodeURIComponent(category.name)}`} onClick={closeDrawer} className="flex flex-1 items-center gap-3 p-2.5">{category.image ? <img src={category.image} alt="" className="h-9 w-9 rounded-md object-cover"/> : <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10"><Sparkles size={16} className="text-primary"/></span>}<span className="text-sm font-semibold">{category.name}</span></Link>{category.subcategories.length > 0 && <button type="button" onClick={() => setDrawerCategoryId(expanded ? null : category.id)} className="p-4" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.name}`}><ChevronRight size={17} className={`transition-transform ${expanded ? 'rotate-90' : ''}`}/></button>}</div>{expanded && <div className="ml-12 border-l pl-3">{category.subcategories.map((subcategory) => <Link key={subcategory} to={`/category/${encodeURIComponent(category.name)}?subcategory=${encodeURIComponent(subcategory)}`} onClick={closeDrawer} className="block py-2 text-sm text-muted-foreground hover:text-primary">{subcategory}</Link>)}</div>}</div>; })}</div></section>
            <section className="p-5"><h2 className="mb-2 font-sans text-lg font-bold">Help & Account</h2><Link to={auth.isAuthenticated ? '/my-orders' : '/login'} onClick={closeDrawer} className="block py-2.5 text-sm">Your Orders</Link><Link to="/track-order" onClick={closeDrawer} className="block py-2.5 text-sm">Track an Order</Link><Link to={auth.isAuthenticated ? '/profile' : '/login'} onClick={closeDrawer} className="block py-2.5 text-sm">Your Account</Link><Link to="/contact" onClick={closeDrawer} className="block py-2.5 text-sm">Customer Service</Link></section>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto scrollbar-hide">
        {sortedCategories.map((category) => {
          const open = openCategoryId === category.id && category.subcategories.length > 0;
          return <div key={category.id} className="shrink-0" onMouseEnter={() => setOpenCategoryId(category.id)}>
            <Link to={`/category/${encodeURIComponent(category.name)}`} className={`flex h-full items-center whitespace-nowrap border-r border-border/60 px-3 text-[13px] font-semibold transition-colors hover:bg-primary/5 hover:text-primary lg:px-4 ${open ? 'bg-primary/5 text-primary' : 'text-foreground/80'}`}>{category.name}{category.subcategories.length > 0 && <ChevronDown size={12} className="ml-1.5"/>}</Link>
            {open && <div className="absolute left-0 right-0 top-full border-t border-border bg-card text-foreground shadow-xl"><div className="container mx-auto px-5 py-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-serif text-lg font-bold">Explore {category.name}</h3><Link to={`/category/${encodeURIComponent(category.name)}`} className="text-xs font-semibold text-primary hover:underline">View all</Link></div><div className="flex flex-wrap gap-2">{category.subcategories.map((subcategory) => <Link key={subcategory} to={`/category/${encodeURIComponent(category.name)}?subcategory=${encodeURIComponent(subcategory)}`} onClick={() => setOpenCategoryId(null)} className="rounded-full border bg-background px-4 py-2 text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary">{subcategory}</Link>)}</div></div></div>}
          </div>;
        })}
      </div>
      <Link to="/products?filter=latest" className="hidden shrink-0 items-center border-l border-border px-4 text-xs font-bold text-primary hover:bg-primary/5 lg:flex">Today&apos;s Sacred Picks</Link>
    </div>
  </nav>;
};

export default CategoryNavBar;
