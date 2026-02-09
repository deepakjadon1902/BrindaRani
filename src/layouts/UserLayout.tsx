import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown
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
    categories 
  } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-serif font-bold gradient-text">
                BrindaRani
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                to="/" 
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium">
                  Categories <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link to={`/category/${encodeURIComponent(category.name)}`}>
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to="/products" 
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                All Products
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-md mx-8"
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
              <Link to="/wishlist" className="p-2 relative group">
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
              <Link to="/cart" className="p-2 relative group">
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
                    <button className="p-2">
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
                to="/" 
                className="py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="py-2 text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="py-2 text-foreground/80 hover:text-primary pl-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
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
