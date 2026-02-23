import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found');
      return;
    }

    authAPI.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed');
      });
  }, [searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4 text-center">
        {status === 'loading' && (
          <div>
            <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
            <h2 className="text-2xl font-serif font-bold mb-2">Verifying your email...</h2>
            <p className="text-muted-foreground">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle size={64} className="mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-serif font-bold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate('/login')} className="btn-sacred">
              Continue to Login
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle size={64} className="mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-serif font-bold mb-2">Verification Failed</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate('/login')} variant="outline">
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
