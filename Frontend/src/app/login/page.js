'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, getValidationErrors } from '@/utils/validations';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors = getValidationErrors(validation.error);
      setError(Object.values(errors)[0]);
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              TaskFlow
            </span>
          </Link>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Sign in to your account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Enter your credentials to access your workspace
          </p>
        </div>

        <div className="card-premium !p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-4">
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Password
                  </label>
                  <Link href="#" className="text-[11px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium-primary w-full py-3.5 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                New to TaskFlow?{' '}
                <Link href="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
