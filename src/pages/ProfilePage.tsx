import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Edit2, CreditCard, Calendar, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authAPI, resolveAssetUrl, uploadAPI } from '@/services/api';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const navigate = useNavigate();
  const { auth, logout, orders, fetchOrders } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    address: auth.user?.address || '',
    city: auth.user?.city || '',
    district: auth.user?.district || '',
    state: auth.user?.state || '',
    country: auth.user?.country || '',
    pincode: auth.user?.pincode || '',
    avatar: auth.user?.avatar || '',
  });

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
    authAPI.getMe().then(({ user }) => {
      useStore.setState((state) => ({
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user!,
            ...user,
            id: user._id || user.id,
            avatar: resolveAssetUrl(user.avatar || ''),
          },
        },
      }));
    }).catch(() => {});
  }, [auth.isAuthenticated, navigate, fetchOrders]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: auth.user?.name || '',
      email: auth.user?.email || '',
      phone: auth.user?.phone || '',
      address: auth.user?.address || '',
      city: auth.user?.city || '',
      district: auth.user?.district || '',
      state: auth.user?.state || '',
      country: auth.user?.country || '',
      pincode: auth.user?.pincode || '',
      avatar: auth.user?.avatar || '',
    }));
  }, [auth.user]);

  if (!auth.isAuthenticated) return null;

  const userOrders = orders.filter((o) => !auth.user?.id || o.userId === auth.user.id);
  const paymentHistory = userOrders.filter((o) => o.paymentMethod && o.paymentMethod !== '');

  const handleSave = async () => {
    try {
      const { user } = await authAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        avatar: formData.avatar,
      });
      useStore.setState((state) => ({
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user!,
            ...user,
            id: user._id || user.id,
            avatar: resolveAssetUrl(user.avatar || ''),
          },
        },
      }));
      toast.success('Profile updated');
      setIsEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update profile';
      toast.error('Failed to update profile', { description: message });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const { url } = await uploadAPI.uploadProfileImage(file);
      const resolved = resolveAssetUrl(url);
      setFormData((prev) => ({ ...prev, avatar: resolved }));
      useStore.setState((state) => ({
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user!,
            avatar: resolved,
          },
        },
      }));
      await authAPI.updateProfile({ avatar: resolved });
      toast.success('Profile picture updated');
    } catch {
      const fallback = await fileToDataUrl(file);
      setFormData((prev) => ({ ...prev, avatar: fallback }));
      useStore.setState((state) => ({
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user!,
            avatar: fallback,
          },
        },
      }));
      toast.success('Profile picture updated locally');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card-premium p-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt={auth.user?.name} className="w-24 h-24 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-4xl font-serif text-primary">{auth.user?.name?.charAt(0)}</span>
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer">
                    <Camera size={14} />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <h2 className="text-xl font-semibold">{auth.user?.name}</h2>
                <p className="text-muted-foreground">{auth.user?.email}</p>
                {isUploadingAvatar && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {auth.user?.email}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Phone size={14} /> {auth.user?.phone || 'Not added'}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Calendar size={14} /> Joined: {auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary">
                  <User size={18} />
                  <span>Profile Details</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 size={16} className="mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={formData.email} disabled className="mt-1" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>District</Label>
                  <Input value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>State</Label>
                  <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} disabled={!isEditing} className="mt-1" />
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="mt-6 btn-sacred">
                  Save Changes
                </Button>
              )}
            </div>

            <div className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                          order.status === 'shipped' ? 'bg-primary/20 text-primary' :
                          order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {order.items.map((item) => item.productName).join(', ')}
                      </div>
                      <p className="font-semibold">Rs {order.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </div>

            <div className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-6">Payment History</h2>
              {paymentHistory.length > 0 ? (
                <div className="space-y-3">
                  {paymentHistory.map((order) => (
                    <div key={`payment-${order.id}`} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-primary" size={18} />
                        <div>
                          <p className="font-medium">{order.paymentMethod}</p>
                          <p className="text-xs text-muted-foreground">Order: {order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs {order.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No payment records yet</p>
                </div>
              )}
            </div>

            <div className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-6">Account Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{auth.user?.name || '-'}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Email Verification</p>
                  <p className="font-medium">{auth.user?.isEmailVerified ? 'Verified' : 'Not Verified'}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Total Orders</p>
                  <p className="font-medium">{userOrders.length}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Saved Location</p>
                  <p className="font-medium flex items-center gap-2"><MapPin size={14} /> {auth.user?.city || 'N/A'}, {auth.user?.state || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
