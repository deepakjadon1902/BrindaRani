import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  CreditCard,
  Settings as SettingsIcon,
  Users, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Truck,
  Images
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AdminBackground from '@/components/admin/AdminBackground';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
  { icon: Truck, label: 'Shipments', path: '/admin/shipments' },
  { icon: Images, label: 'Hero Slides', path: '/admin/hero-slides' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, logout, appSettings, fetchAppSettings } = useStore();

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[#212020] relative">
      <AdminBackground className="z-0" />
      <div className="absolute inset-0 bg-[#212020]/58 z-0" aria-hidden="true" />
      <div className="relative z-10 flex w-full">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#212020] z-[60] transition-all duration-300 shadow-[10px_0_34px_-28px_rgba(255,255,255,0.4)]",
          "lg:relative lg:translate-x-0",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#90878E]/30">
            {!collapsed && (
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                {appSettings.logoUrl ? (
                  <img
                    src={appSettings.logoUrl}
                    alt={`${appSettings.appName} logo`}
                    className="h-7 w-7 rounded-full object-cover border border-[#90878E]/40"
                  />
                ) : null}
                <span className="text-xl font-serif font-bold text-white">
                  {appSettings.appName || 'Brindarani'}
                </span>
                <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded border border-[#90878E]/30">
                  Admin
                </span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 hover:bg-[#90878E]/22 rounded-lg transition-colors"
            >
              <ChevronLeft 
                className={cn(
                  "text-white transition-transform",
                  collapsed && "rotate-180"
                )} 
                size={20} 
              />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        "hover:bg-[#90878E]/18",
                        isActive 
                          ? "bg-white text-[#212020]" 
                          : "text-white hover:text-white"
                      )}
                    >
                      <item.icon size={20} className={isActive ? "text-[#212020]" : "text-white"} />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-[#90878E]/30">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full",
                "text-white hover:text-white hover:bg-[#90878E]/18"
              )}
            >
              <LogOut size={20} className="text-white" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top Bar */}
        <header className="h-16 bg-white/95 border-b border-[#90878E]/25 flex items-center justify-between px-4 text-[#212020] shadow-[0_10px_30px_-26px_rgba(33,32,32,0.7)] lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#212020]"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{auth.user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{auth.user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#212020] flex items-center justify-center">
              <span className="text-white font-medium">
                {auth.user?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 text-white lg:p-6 overflow-y-auto scroll-smooth min-h-0 [&_h1]:text-3xl [&_h1]:text-white [&_h2]:text-xl [&_h2]:text-white">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  );
};

export default AdminLayout;

