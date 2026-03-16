import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, auth } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!auth.isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some divine products to your cart
          </p>
          <Button asChild className="btn-sacred">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="card-premium p-4 flex gap-4"
              >
                <Link 
                  to={`/product/${item.productId}`}
                  className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${item.productId}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    Size: {item.size}
                  </p>
                  <p className="text-primary font-bold">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(
                        item.productId, 
                        item.size, 
                        Math.max(1, item.quantity - 1)
                      )}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(
                        item.productId, 
                        item.size, 
                        item.quantity + 1
                      )}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-accent' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders above ₹500
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full btn-sacred py-6"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Link 
                to="/products" 
                className="block text-center text-sm text-muted-foreground hover:text-primary mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
