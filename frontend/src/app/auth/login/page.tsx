'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-[#0d1f4a] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-blue-light rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Globe className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Continue your journey to global opportunities. Thousands of Zimbabwean students are discovering their path.
          </p>
          <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-brand-gold text-sm font-medium mb-1">Latest Match</p>
            <p className="text-white text-sm">Mastercard Foundation Scholarship — 94% fit for a student from Zimbabwe</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-brand-blue rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-brand-gold" />
            </div>
            <span className="font-display font-bold text-xl text-brand-blue">Mwana Global</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-brand-blue hover:underline font-medium">
                Create one free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-brand-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-semibold py-6 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm">
              Demo credentials: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">demo.student@mwanaglobal.com</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Student@123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
