import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart, auth, addOrder } = useStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
    paymentMethod: 'upi',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || 
          !formData.address || !formData.city || !formData.pincode) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else {
      setIsProcessing(true);
      
      try {
        // Create order
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        paymentMethod: formData.paymentMethod.toUpperCase(),
        address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
      };

        await addOrder(orderData);
        clearCart();
        setIsProcessing(false);
        setOrderSuccess(true);
      } catch (error: any) {
        toast.error('Order failed', { description: error.message });
        setIsProcessing(false);
      }
    }
  };

  if (cart.length === 0 && !orderSuccess) {
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
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Truck size={16} />
            </div>
            <span className="hidden sm:inline font-medium">Shipping</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
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

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <span className="font-medium">UPI</span>
                        <span className="block text-sm text-muted-foreground">
                          Pay using Google Pay, PhonePe, or any UPI app
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <span className="font-medium">Credit/Debit Card</span>
                        <span className="block text-sm text-muted-foreground">
                          All major cards accepted
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <span className="block text-sm text-muted-foreground">
                          Pay when you receive your order
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 btn-sacred"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
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
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} × {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
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
