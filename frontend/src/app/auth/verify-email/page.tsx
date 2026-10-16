'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        setTimeout(() => router.push('/auth/login'), 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.message ?? 'Verification failed. The link may have expired.');
      });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {status === 'loading' && <Loader2 className="w-16 h-16 text-brand-blue animate-spin" />}
          {status === 'success' && <CheckCircle className="w-16 h-16 text-green-500" />}
          {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
        </div>

        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        <p className="text-gray-500 mb-6">{message}</p>

        {status === 'success' && (
          <p className="text-sm text-gray-400 mb-4">Redirecting to login in 3 seconds...</p>
        )}

        {status !== 'loading' && (
          <Link href="/auth/login">
            <Button className="bg-brand-blue hover:bg-brand-blue/90 w-full">
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
