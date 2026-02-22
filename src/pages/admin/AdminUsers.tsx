import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminUsers = () => {
  const { users, toggleUserBlock, fetchUsers } = useStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id: string) => {
    try {
      await toggleUserBlock(id);
      toast.success('Updated');
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No users yet</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td><div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-medium">{user.name}</span>
                  </div></td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.city || '-'}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs ${user.isBlocked ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td><Button variant="outline" size="sm" onClick={() => handleToggleBlock(user.id)}>{user.isBlocked ? 'Unblock' : 'Block'}</Button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
