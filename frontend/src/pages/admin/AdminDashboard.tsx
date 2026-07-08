import { useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';

const AdminDashboard = () => {
  const { products, orders, users, fetchProducts, fetchOrders, fetchUsers } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
    { label: 'Total Users', value: users.length, icon: Users },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold">Dashboard Overview</h1>
        <p className="mt-1 text-base text-white/62">Live store performance and recent order activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-white">
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <h2 className="mb-4 font-semibold">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="font-semibold">#{order.id?.slice(-8)}</td>
                    <td>{order.userName}</td>
                    <td>₹{order.total.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#212020]">{order.status}</span>
                    </td>
                    <td className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
