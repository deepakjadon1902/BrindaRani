import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Order } from '@/data/mockData';

const AdminPayments = () => {
  const { orders, fetchOrders, updateOrderStatus } = useStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Payment status updated');
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const pendingPayments = orders.filter((order) => order.status === 'pending' || order.status === 'paid');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">Verify and update payment/order status</p>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Current Status</th>
              <th>Update</th>
              <th>Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">No payment records found</td>
              </tr>
            ) : (
              pendingPayments.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.id?.slice(-8)}</td>
                  <td>{order.userName}</td>
                  <td>Rs {order.total.toLocaleString()}</td>
                  <td>{order.paymentMethod || 'N/A'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(order.id, 'paid')}
                      disabled={order.status === 'paid'}
                    >
                      Mark as Paid
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
