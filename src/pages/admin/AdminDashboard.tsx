import { useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

const AdminDashboard = () => {
  const { products, orders, users, fetchProducts, fetchOrders, fetchUsers } = useStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-accent' },
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-secondary' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</td></tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id?.slice(-8)}</td>
                    <td>{order.userName}</td>
                    <td>₹{order.total.toLocaleString()}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                        order.status === 'shipped' ? 'bg-primary/20 text-primary' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-muted'
                      }`}>{order.status}</span>
                    </td>
                    <td className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
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
