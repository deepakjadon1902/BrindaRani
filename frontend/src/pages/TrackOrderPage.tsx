import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, MapPin, CreditCard } from 'lucide-react';
import { ordersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);

  const handleTrack = async (code?: string) => {
    const targetCode = (code || orderCode).trim();
    if (!targetCode) {
      toast.error('Please enter your 6-digit order ID');
      return;
    }
    setIsLoading(true);
    try {
      const data = await ordersAPI.track(targetCode);
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      toast.error('Order not found', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setOrderCode(code);
      void handleTrack(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
              Track Your Order
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Order Tracking</h1>
            <p className="text-muted-foreground mt-3">
              Enter your 6-digit order ID to see the latest status and payment details.
            </p>
          </div>

          <div className="card-premium p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter Order ID (e.g. 123456)"
                className="input-sacred flex-1"
              />
              <Button
                onClick={() => handleTrack()}
                className="btn-sacred"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Track Order'}
              </Button>
            </div>
          </div>

          {order && (
            <div className="card-premium p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-2xl font-semibold tracking-widest">{order.orderCode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PackageSearch className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <p className="font-semibold capitalize">{order.status}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="text-primary" size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                    <p className="text-sm capitalize text-muted-foreground">{order.paymentStatus}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary" size={18} />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">₹{Number(order.total || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item: any) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size} * {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
