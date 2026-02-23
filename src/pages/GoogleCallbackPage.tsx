import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { setToken } from '@/services/api';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { auth } = useStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed');
      navigate('/login');
      return;
    }

    if (token) {
      // Set the token and fetch user data
      setToken(token);
      authAPI.getMe()
        .then(({ user }) => {
          // Update store directly
          useStore.setState({
            auth: {
              isAuthenticated: true,
              user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                district: user.district || '',
                state: user.state || '',
                country: user.country || '',
                pincode: user.pincode || '',
                avatar: user.avatar || '',
              },
              isAdmin: user.isAdmin || false,
              token,
            },
          });
          toast.success('Welcome!', { description: `Signed in as ${user.name}` });
          navigate('/');
        })
        .catch(() => {
          toast.error('Failed to fetch user data');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
        <h2 className="text-xl font-semibold">Signing you in...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we complete Google authentication</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
