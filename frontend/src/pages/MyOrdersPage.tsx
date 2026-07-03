import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, CreditCard, ExternalLink, MapPin, Package, Truck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '@/data/mockData';

const label = (value?: string) => (value || 'pending').replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const statusTone = (status: Order['status']) => status === 'delivered'
  ? 'bg-emerald-100 text-emerald-700'
  : status === 'cancelled' || status === 'returned'
    ? 'bg-red-100 text-red-700'
    : 'bg-amber-100 text-amber-800';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { auth, orders, fetchOrders } = useStore();

  useEffect(() => {
    if (!auth.isAuthenticated) { navigate('/login', { replace: true }); return; }
    void fetchOrders();
  }, [auth.isAuthenticated, fetchOrders, navigate]);

  if (!auth.isAuthenticated) return null;

  return <div className="bg-muted/20 py-10 md:py-14"><div className="container mx-auto px-4">
    <div className="mb-8"><p className="text-sm font-medium uppercase tracking-wider text-primary">Your purchases</p><h1 className="text-3xl font-serif font-bold md:text-4xl">My Orders</h1><p className="mt-2 text-muted-foreground">View every item, payment and delivery update in one place.</p></div>
    {orders.length === 0 ? <div className="card-premium py-16 text-center"><Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground"/><h2 className="text-xl font-semibold">No orders yet</h2><p className="mt-2 text-muted-foreground">Your confirmed and pending orders will appear here.</p><Button asChild className="mt-6"><Link to="/products">Start shopping</Link></Button></div> :
      <div className="space-y-6">{orders.map((order) => <article key={order.id} className="card-premium overflow-hidden">
        <header className="flex flex-col gap-4 border-b bg-muted/30 p-5 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold">Order #{order.orderCode || order.id.slice(-8)}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(order.status)}`}>{label(order.status)}</span></div><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays size={14}/>Placed {new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div className="text-left md:text-right"><p className="text-sm text-muted-foreground">Order total</p><p className="text-xl font-bold">₹{order.total.toLocaleString('en-IN')}</p></div></header>
        <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_1fr]">
          <section><h3 className="mb-3 font-semibold">Items</h3><div className="divide-y rounded-lg border">{order.items.map((item, index) => <div key={`${item.productId}-${item.size}-${index}`} className="flex justify-between gap-4 p-3 text-sm"><div><p className="font-medium">{item.productName}</p><p className="text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p></div><p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0"/><span>{order.address}</span></div></section>
          <section className="space-y-4"><div className="rounded-lg border p-4"><h3 className="mb-3 flex items-center gap-2 font-semibold"><CreditCard size={17}/>Payment</h3><div className="flex items-center justify-between text-sm"><span>{order.paymentMethod}</span><Badge variant={order.paymentStatus === 'paid' ? 'default' : order.paymentStatus === 'failed' ? 'destructive' : 'secondary'}>{label(order.paymentStatus)}</Badge></div></div><div className="rounded-lg border p-4"><h3 className="mb-3 flex items-center gap-2 font-semibold"><Truck size={17}/>Shipment</h3><div className="space-y-2 text-sm"><p>Courier: <strong>{order.courierPartner || 'Not assigned yet'}</strong></p><p>Tracking ID: <strong>{order.trackingId || 'Not available yet'}</strong></p>{order.estimatedDelivery && <p>Expected delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</strong></p>}{order.trackingUrl && <Button asChild variant="outline" size="sm" className="mt-2"><a href={order.trackingUrl} target="_blank" rel="noreferrer">Track with courier <ExternalLink className="ml-2 h-3.5 w-3.5"/></a></Button>}</div></div></section>
        </div>
        {!!order.statusHistory?.length && <footer className="border-t p-5"><h3 className="mb-4 font-semibold">Order updates</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{order.statusHistory.map((entry, index) => <div key={`${entry.timestamp}-${index}`} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary"/><div><p className="text-sm font-semibold">{label(entry.status)}</p><p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>{entry.note && <p className="text-xs">{entry.note}</p>}{entry.location && <p className="text-xs text-muted-foreground">{entry.location}</p>}</div></div>)}</div></footer>}
      </article>)}</div>}
  </div></div>;
};

export default MyOrdersPage;
