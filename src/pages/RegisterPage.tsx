import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    pincode: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register(formData.name, formData.email, formData.password, {
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      });
      
      if (success) {
        setShowVerificationMessage(true);
        toast.success('Account created! Check your email to verify.', {
          description: 'A verification link has been sent to your email',
          duration: 6000,
        });
      }
    } catch (error: any) {
      toast.error('Registration failed', { description: error.message });
    }
    
    setIsLoading(false);
  };

  const handleGoogleRegister = () => {
    window.location.href = authAPI.getGoogleAuthUrl();
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4 text-center">
          <div className="card-premium p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please click the link to verify your account.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              The link expires in 24 hours. Check your spam folder if you don't see it.
            </p>
            <Button onClick={() => navigate('/')} className="btn-sacred">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold gradient-text">BrindaRani</h1>
          </Link>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="card-premium p-6 md:p-8">
          {/* Google Sign-Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 py-5 flex items-center justify-center gap-3 border-border hover:bg-muted"
            onClick={handleGoogleRegister}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" type="text" placeholder="Your full name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 input-sacred" />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1 input-sacred" />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 input-sacred" />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input id="address" type="text" placeholder="Street address, house number" value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 input-sacred" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" type="text" placeholder="City" value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-1 input-sacred" />
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Input id="district" type="text" placeholder="District" value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="mt-1 input-sacred" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <Input id="state" type="text" placeholder="State" value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="mt-1 input-sacred" />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" type="text" placeholder="Country" value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="mt-1 input-sacred" />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" type="text" placeholder="Pincode" value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className="mt-1 input-sacred" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-sacred pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password"
                value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 input-sacred" />
            </div>

            <Button type="submit" className="w-full btn-sacred py-6" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
