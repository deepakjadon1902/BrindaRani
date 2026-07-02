import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Palette,
  PackageSearch,
  Boxes
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CategoryNavBar from '@/components/user/CategoryNavBar';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/user/Footer';

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    auth, 
    logout, 
    cart, 
    wishlist, 
    searchQuery, 
    setSearchQuery,
    products,
    categories,
    fetchProducts,
    fetchCategories,
    isLoadingProducts,
    appSettings,
    fetchAppSettings
  } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    fetchAppSettings();
    if (categories.length === 0) {
      fetchCategories();
    }
    if (products.length === 0 && !isLoadingProducts) {
      fetchProducts();
    }
  }, [categories.length, products.length, isLoadingProducts, fetchCategories, fetchProducts, fetchAppSettings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="navbar-glass">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-3 lg:gap-6 h-20 md:h-24">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                className="md:hidden p-2 -ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" className="flex items-center" aria-label={`${appSettings.appName || 'Brindarani'} home`}>
                {appSettings.logoUrl ? (
                  <img
                    src={appSettings.logoUrl}
                    alt={`${appSettings.appName} logo`}
                    className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border border-border shadow-sm"
                  />
                ) : null}
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-xl"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search for divine products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-sacred"
                />
              </div>
            </form>

            <nav className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto">
              <Link to="/custom-design" className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary transition-colors font-medium whitespace-nowrap">
                <Palette size={18} aria-hidden="true" /> Custom Design
              </Link>
              <Link to="/products" className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary transition-colors font-medium whitespace-nowrap">
                <Boxes size={18} aria-hidden="true" /> All Products
              </Link>
              <Link to="/track-order" className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-primary transition-colors font-medium whitespace-nowrap">
                <PackageSearch size={18} aria-hidden="true" /> Track Orders
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Search Toggle */}
              <button
                className="lg:hidden p-2"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 relative group" aria-label={`Wishlist, ${wishlistCount} items`} title="Wishlist">
                <Heart 
                  size={22} 
                  className="text-foreground/80 group-hover:text-secondary transition-colors"
                />
                {wishlistCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="p-2 relative group" aria-label={`Shopping cart, ${cartCount} items`} title="Shopping cart">
                <ShoppingCart 
                  size={22} 
                  className="text-foreground/80 group-hover:text-primary transition-colors"
                />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* User Menu */}
              {auth.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2" aria-label="My account" title="My account">
                      <User size={22} className="text-foreground/80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="font-medium">{auth.user?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {auth.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="text-destructive"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex"
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <form 
              onSubmit={handleSearch}
              className="lg:hidden pb-4 animate-fade-in"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search for divine products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-sacred"
                  autoFocus
                />
              </div>
            </form>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link 
                to="/products" 
                className="py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                to="/custom-design" 
                className="py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Custom Design
              </Link>
              <Link
                to="/track-order"
                className="py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              {!auth.isAuthenticated && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link 
                    to="/login" 
                    className="py-2 text-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2 text-foreground/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Category Nav Bar */}
      <CategoryNavBar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;

