import { Fragment, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Package, Phone, Truck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Order } from '@/data/mockData';

const statuses: Order['status'][] = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const AdminOrders = () => {
  const { orders, updateOrderStatus, fetchOrders } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try { await updateOrderStatus(orderId, status); toast.success('Order updated and customer notified'); }
    catch { toast.error('Failed to update order'); }
  };

  return <div className="space-y-6">
    <div><h1 className="font-bold">Orders</h1><p className="mt-1 text-base text-white/62">Complete customer, payment, item and delivery records</p></div>
    <div className="admin-card overflow-x-auto">
      <table className="table-premium">
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Fulfilment</th><th>Placed</th><th /></tr></thead>
        <tbody>{orders.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No orders yet</td></tr> : orders.map((order) => <Fragment key={order.id}>
          <tr>
            <td><p className="font-semibold">#{order.orderCode || order.id.slice(-8)}</p><p className="text-xs text-muted-foreground">{order.id.slice(-8)}</p></td>
            <td><p className="font-semibold">{order.userName}</p><p className="text-xs text-muted-foreground">{order.customerEmail}</p></td>
            <td>{order.items.length} item{order.items.length === 1 ? '' : 's'}</td>
            <td className="font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
            <td><Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>{label(order.paymentStatus || 'pending')}</Badge></td>
            <td><Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{label(status)}</SelectItem>)}</SelectContent></Select></td>
            <td className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
            <td><Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label="View order details" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>{expanded === order.id ? <ChevronUp /> : <ChevronDown />}</Button></td>
          </tr>
          {expanded === order.id && <tr><td colSpan={8} className="bg-[#181717] p-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <section><h3 className="mb-3 font-semibold text-white">Customer details</h3><div className="space-y-2 text-sm text-white/78"><p className="flex gap-2"><Mail size={15}/>{order.customerEmail || 'Not supplied'}</p><p className="flex gap-2"><Phone size={15}/>{order.customerPhone || 'Not supplied'}</p><p className="flex gap-2"><MapPin size={15}/>{order.address}</p></div></section>
              <section><h3 className="mb-3 font-semibold text-white">Items</h3><div className="space-y-2">{order.items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex justify-between gap-3 text-sm text-white/78"><span>{item.productName} · {item.size} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span></div>)}</div></section>
              <section><h3 className="mb-3 font-semibold text-white">Delivery</h3><div className="space-y-2 text-sm text-white/78"><p className="flex gap-2"><Truck size={15}/>{order.courierPartner || 'Courier not assigned'}</p><p className="flex gap-2"><Package size={15}/>{order.trackingId || 'Tracking ID not assigned'}</p>{order.estimatedDelivery && <p>Expected: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>}</div></section>
            </div>
            {!!order.statusHistory?.length && <section className="mt-5 border-t border-[#90878E]/25 pt-4"><h3 className="mb-3 font-semibold text-white">Status timeline</h3><div className="flex flex-wrap gap-3">{order.statusHistory.map((entry, index) => <div key={index} className="rounded-lg border border-[#90878E]/25 bg-[#212020] px-3 py-2 text-xs text-white"><p className="font-semibold">{label(entry.status)}</p><p className="text-muted-foreground">{new Date(entry.timestamp).toLocaleString('en-IN')}</p>{entry.note && <p>{entry.note}</p>}</div>)}</div></section>}
          </td></tr>}
        </Fragment>)}</tbody>
      </table>
    </div>
  </div>;
};

export default AdminOrders;
