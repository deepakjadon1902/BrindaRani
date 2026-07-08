import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AdminBackground from '@/components/admin/AdminBackground';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, appSettings } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, true);
      if (success) {
        toast.success('Welcome, Admin!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin credentials');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      const databaseUnavailable = message.toLowerCase().includes('database');
      toast.error(databaseUnavailable ? 'Service temporarily unavailable' : 'Login failed', {
        description: databaseUnavailable
          ? 'The server cannot reach the database. Please try again shortly.'
          : message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212020] p-4 relative overflow-hidden">
      <AdminBackground className="z-0" />
      <div className="absolute inset-0 bg-[#212020]/45 z-0" aria-hidden="true" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          {appSettings.logoUrl ? (
            <img
              src={appSettings.logoUrl}
              alt={`${appSettings.appName} logo`}
              className="h-12 w-12 rounded-full object-cover border border-[#90878E]/40 mx-auto mb-3"
            />
          ) : null}
          <h1 className="text-3xl font-serif font-bold text-white">
            {appSettings.appName || 'Brindarani'}
          </h1>
          <p className="text-[#90878E] mt-2">Admin Portal</p>
        </div>
        <div className="bg-white rounded-2xl p-8 text-[#212020] shadow-[0_24px_70px_-36px_rgba(255,255,255,0.45)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" placeholder="admin@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full btn-sacred" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

