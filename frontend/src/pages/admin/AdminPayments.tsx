import { useEffect } from 'react';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/badge';

const AdminPayments = () => {
  const { orders, fetchOrders } = useStore();
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  const paid = orders.filter((order) => order.paymentStatus === 'paid').length;
  const failed = orders.filter((order) => order.paymentStatus === 'failed').length;
  const pending = orders.length - paid - failed;

  return <div className="space-y-6">
    <div>
      <h1 className="font-bold">Payment Status</h1>
      <p className="mt-1 text-base text-white/62">Read-only payment ledger verified by Razorpay signatures and webhooks</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="admin-card flex items-center gap-4 p-5"><CheckCircle2 className="h-7 w-7 text-white"/><div><p className="text-3xl font-bold text-white">{paid}</p><p className="text-base text-muted-foreground">Successful</p></div></div>
      <div className="admin-card flex items-center gap-4 p-5"><Clock3 className="h-7 w-7 text-white"/><div><p className="text-3xl font-bold text-white">{pending}</p><p className="text-base text-muted-foreground">Pending</p></div></div>
      <div className="admin-card flex items-center gap-4 p-5"><XCircle className="h-7 w-7 text-[#ff7d7d]"/><div><p className="text-3xl font-bold text-white">{failed}</p><p className="text-base text-muted-foreground">Failed</p></div></div>
    </div>
    <div className="admin-card overflow-x-auto">
      <table className="table-premium">
        <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Gateway order</th><th>Gateway payment</th><th>Status</th><th>Updated</th></tr></thead>
        <tbody>{orders.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No payment records</td></tr> : orders.map((order) => <tr key={order.id}><td className="font-semibold">#{order.orderCode || order.id.slice(-8)}</td><td>{order.userName}</td><td>₹{order.total.toLocaleString('en-IN')}</td><td>{order.paymentMethod}</td><td className="font-mono text-xs text-white/70">{order.razorpayOrderId || '-'}</td><td className="font-mono text-xs text-white/70">{order.razorpayPaymentId || '-'}</td><td><Badge variant={order.paymentStatus === 'paid' ? 'default' : order.paymentStatus === 'failed' ? 'destructive' : 'secondary'}>{order.paymentStatus || 'pending'}</Badge></td><td className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString('en-IN')}</td></tr>)}</tbody>
      </table>
    </div>
  </div>;
};
export default AdminPayments;
