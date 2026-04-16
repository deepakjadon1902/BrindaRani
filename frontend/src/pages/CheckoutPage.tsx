import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Check, Shield, QrCode } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { CartItem } from '@/data/mockData';
import { ordersAPI, paymentAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart, auth, appSettings } = useStore();
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('buyNow') !== '1') {
      setBuyNowItem(null);
      return;
    }
    try {
      const raw = sessionStorage.getItem('Brindarani-buy-now');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.productId) {
        setBuyNowItem(parsed);
      }
    } catch {
      // Ignore storage errors
    }
  }, [location.search]);

  const orderItems = useMemo(() => (buyNowItem ? [buyNowItem] : cart), [buyNowItem, cart]);

  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    address: auth.user?.address || '',
    city: auth.user?.city || '',
    district: auth.user?.district || '',
    state: auth.user?.state || '',
    country: auth.user?.country || 'India',
    pincode: auth.user?.pincode || '',
    paymentMethod: 'razorpay',
  });

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping =
    subtotal >= (appSettings.freeShippingThreshold || 0)
      ? 0
      : (appSettings.shippingFee || 0);
  const total = subtotal + shipping;

  const buildUpiLink = () => {
    if (!appSettings.upiId) return '';
    const params = new URLSearchParams({
      pa: appSettings.upiId,
      pn: appSettings.appName || 'Brindarani',
      am: total.toFixed(2),
      cu: 'INR',
    });
    return `upi://pay?${params.toString()}`;
  };

  const qrSrc = appSettings.upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(buildUpiLink())}`
    : '';

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData: any) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setIsProcessing(false);
      toast.error('Failed to load payment gateway');
      return;
    }

    try {
      const { orderId, amount, currency, key } = await paymentAPI.createOrder(total);

      const options = {
        key,
        amount,
        currency,
        name: appSettings.appName || 'Brindarani',
        description: `Order of ${orderItems.length} item${orderItems.length === 1 ? '' : 's'}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const result = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData,
            });

            if (result.success) {
              if (!buyNowItem) {
                clearCart();
              } else {
                try {
                  sessionStorage.removeItem('Brindarani-buy-now');
                } catch {
                  // Ignore storage errors
                }
              }
              setOrderResult(result.order);
              setOrderSuccess(true);
              toast.success('Payment successful! Order placed.');
            }
          } catch (err: any) {
            try {
              await ordersAPI.sendPaymentFailed({
                total,
                paymentMethod: 'RAZORPAY',
                reason: err?.message || 'Payment verification failed',
                items: orderData.items,
              });
            } catch {
              // Ignore email failure
            }
            toast.error('Payment verification failed', { description: err.message });
          }
          setIsProcessing(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#8B4513',
        },
        modal: {
          ondismiss: () => {
            try {
              void ordersAPI.sendPaymentFailed({
                total,
                paymentMethod: 'RAZORPAY',
                reason: 'Payment cancelled by user',
                items: orderData.items,
              });
            } catch {
              // Ignore email failure
            }
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setIsProcessing(false);
      toast.error('Failed to start payment', { description: err.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.pincode
      ) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: orderItems.map((item) => ({
        productId: item.productId,
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      paymentMethod: formData.paymentMethod.toUpperCase(),
      address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
    };

    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayPayment(orderData);
      return;
    }

    if (formData.paymentMethod === 'upi' && !appSettings.upiId) {
      toast.error('UPI payment is not configured yet');
      setIsProcessing(false);
      return;
    }

    try {
      const created = await ordersAPI.create(orderData);
      if (!buyNowItem) {
        clearCart();
      } else {
        try {
          sessionStorage.removeItem('Brindarani-buy-now');
        } catch {
          // Ignore storage errors
        }
      }
      setOrderResult(created);
      setOrderSuccess(true);
      toast.success('Order placed! We will confirm your payment shortly.');
    } catch (err: any) {
      toast.error('Failed to place order', { description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4">Order Placed!</h1>
          <p className="text-muted-foreground mb-3">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          {orderResult?.orderCode && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Your Order ID</p>
              <p className="text-2xl font-semibold tracking-widest">{orderResult.orderCode}</p>
              <Link
                to={`/track-order?code=${encodeURIComponent(orderResult.orderCode)}`}
                className="text-primary text-sm hover:underline"
              >
                Track this order
              </Link>
            </div>
          )}
          <Button onClick={() => navigate('/')} className="btn-sacred">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <Truck size={16} />
            </div>
            <span className="hidden sm:inline font-medium">Shipping</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <CreditCard size={16} />
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="card-premium p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Shipping Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Phone *</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address *</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>City *</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>District *</Label>
                      <Input
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>State *</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>Country *</Label>
                      <Input
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                    <div>
                      <Label>Pincode *</Label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="mt-1 input-sacred"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-sacred py-6">
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="card-premium p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                      className={`w-full text-left flex items-center gap-3 p-4 border rounded-lg transition-all ${
                        formData.paymentMethod === 'razorpay'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <Shield size={18} className="text-primary" />
                      <div className="flex-1">
                        <span className="font-medium block">Pay with Razorpay</span>
                        <span className="block text-sm text-muted-foreground">
                          UPI, Credit/Debit Cards, Net Banking, Wallets — All in one
                        </span>
                      </div>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === 'razorpay'
                            ? 'border-primary'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {formData.paymentMethod === 'razorpay' && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      className={`w-full text-left flex items-center gap-3 p-4 border rounded-lg transition-all ${
                        formData.paymentMethod === 'upi'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <QrCode size={18} className="text-primary" />
                      <div className="flex-1">
                        <span className="font-medium block">Scan & Pay (UPI QR)</span>
                        <span className="block text-sm text-muted-foreground">
                          Pay via UPI QR and place your order
                        </span>
                      </div>
                      <span
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          formData.paymentMethod === 'upi'
                            ? 'border-primary'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {formData.paymentMethod === 'upi' && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                    </button>

                    {formData.paymentMethod === 'upi' && appSettings.upiId && (
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <QrCode size={18} className="text-primary" />
                          <span className="font-medium">Scan & Pay via UPI</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <img
                            src={qrSrc}
                            alt="UPI QR"
                            className="h-40 w-40 rounded-lg border border-border"
                          />
                          <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                              <span className="font-medium text-foreground">UPI ID:</span> {appSettings.upiId}
                            </p>
                            <p>
                              <span className="font-medium text-foreground">Amount:</span> ₹ {total.toLocaleString()}
                            </p>
                            <p className="text-xs">QR updates automatically with the correct order amount.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 btn-sacred" disabled={isProcessing}>
                      {isProcessing
                        ? 'Processing...'
                        : formData.paymentMethod === 'upi'
                          ? 'Place Order'
                          : 'Pay Now'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-accent' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
