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
      <div>
        <h1 className="font-bold">Users</h1>
        <p className="mt-1 text-base text-white/62">Registered customer accounts and access controls</p>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users yet</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td><div className="flex items-center gap-3">
                    <img src={user.avatar || '/placeholder.svg'} alt="" className="h-10 w-10 rounded-full border border-white/10 bg-white object-cover" />
                    <span className="font-semibold">{user.name}</span>
                  </div></td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.city || '-'}</td>
                  <td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.isBlocked ? 'bg-[#ff7d7d]/20 text-[#ff7d7d]' : 'bg-white text-[#212020]'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td><Button variant="outline" size="sm" className="bg-white text-black hover:bg-white/90 hover:text-black" onClick={() => handleToggleBlock(user.id)}>{user.isBlocked ? 'Unblock' : 'Block'}</Button></td>
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
