import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import AppMetaUpdater from "@/components/AppMetaUpdater";
import ScrollToTop from "@/components/ScrollToTop";

// Layouts
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

const Index = lazy(() => import("./pages/Index"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CustomDesignPage = lazy(() => import("./pages/CustomDesignPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const GoogleCallbackPage = lazy(() => import("./pages/GoogleCallbackPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminShipments = lazy(() => import("./pages/admin/AdminShipments"));
const AdminHeroSlides = lazy(() => import("./pages/admin/AdminHeroSlides"));

const queryClient = new QueryClient();

// Protected Route for Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useStore();
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const PageLoader = () => (
  <div className="min-h-[50vh] bg-background" aria-label="Loading page" />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppMetaUpdater />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="category/:name" element={<CategoryPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="custom-design" element={<CustomDesignPage />} />
              <Route path="track-order" element={<TrackOrderPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route path="auth/google/callback" element={<GoogleCallbackPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="shipments" element={<AdminShipments />} />
              <Route path="hero-slides" element={<AdminHeroSlides />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
