'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Globe, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'PARENT', 'SCHOOL_COUNSELOR', 'SCOUT', 'UNIVERSITY_REP']),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(v => v, 'You must agree to the terms'),
});

type FormData = z.infer<typeof schema>;

const roles = [
  { value: 'STUDENT', label: 'Student', description: 'Build my profile & find opportunities' },
  { value: 'PARENT', label: 'Parent / Guardian', description: 'Support my child\'s journey' },
  { value: 'SCHOOL_COUNSELOR', label: 'School Counselor', description: 'Guide students at my school' },
  { value: 'SCOUT', label: 'Scout / Coach', description: 'Discover talented athletes' },
  { value: 'UNIVERSITY_REP', label: 'University Rep', description: 'Find top African students' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.register(data);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Click the link to activate your account.
          </p>
          <Link href="/auth/login">
            <Button className="bg-brand-blue hover:bg-brand-blue-light text-white">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-[#0d1f4a] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-brand-gold" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Mwana Global</span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Join 10,000+ African Students</h2>
          <p className="text-white/70 leading-relaxed">Discover scholarships, universities, sports recruitment, fellowships and more. Your global journey starts here.</p>
          <div className="mt-8 space-y-3">
            {['Free forever for students', 'AI-powered opportunity matching', 'Verified recommendations', 'Scout-ready sports profile'].map(item => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-gold" />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-brand-gold" />
            </div>
            <span className="font-display font-bold text-lg text-brand-blue">Mwana Global</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand-blue hover:underline font-medium">Sign in</Link>
            </p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <Label className="mb-3 block">I am a...</Label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value as FormData['role'])}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                    selectedRole === role.value
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    selectedRole === role.value ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'
                  )}>
                    {selectedRole === role.value && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{role.label}</p>
                    <p className="text-gray-500 text-xs">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Tendai" {...register('firstName')} className={errors.firstName ? 'border-red-500' : ''} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Moyo" {...register('lastName')} className={errors.lastName ? 'border-red-500' : ''} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" placeholder="+263 77 123 4567" {...register('phone')} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  {...register('password')}
                  className={cn(errors.password ? 'border-red-500' : '', 'pr-10')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register('agreeToTerms')}
                className="mt-0.5 h-4 w-4 text-brand-blue border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-blue hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-blue hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}

            <Button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-semibold py-6 rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating Account...</>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
