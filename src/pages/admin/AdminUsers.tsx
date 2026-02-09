import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminUsers = () => {
  const { users, toggleUserBlock } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><div className="flex items-center gap-3">
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-medium">{user.name}</span>
                </div></td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.city || '-'}</td>
                <td><span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                <td><Button variant="outline" size="sm" onClick={() => { toggleUserBlock(user.id); toast.success('Updated'); }}>{user.isBlocked ? 'Unblock' : 'Block'}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
