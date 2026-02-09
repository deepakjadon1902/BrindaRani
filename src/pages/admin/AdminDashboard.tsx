import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { analyticsData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { products, orders, users } = useStore();

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary', growth: 5.2 },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-accent', growth: 12.5 },
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-secondary', growth: 8.1 },
    { label: 'Revenue', value: `₹${analyticsData.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', growth: 15.3 },
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
            <div className="flex items-center mt-4 text-sm">
              {stat.growth > 0 ? (
                <ArrowUpRight size={16} className="text-accent mr-1" />
              ) : (
                <ArrowDownRight size={16} className="text-destructive mr-1" />
              )}
              <span className={stat.growth > 0 ? 'text-accent' : 'text-destructive'}>
                {stat.growth}%
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="admin-card">
        <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.id}</td>
                  <td>{order.userName}</td>
                  <td>₹{order.total.toLocaleString()}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                      order.status === 'shipped' ? 'bg-primary/20 text-primary' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-muted'
                    }`}>{order.status}</span>
                  </td>
                  <td className="text-muted-foreground">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
