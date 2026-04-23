'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, getValidationErrors } from '@/utils/validations';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
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

    const validation = registerSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (!validation.success) {
      const errors = getValidationErrors(validation.error);
      setError(Object.values(errors)[0]);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Create your account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Join thousands of teams managing work effectively
          </p>
        </div>

        <div className="card-premium !p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-4">
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold text-center uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="John Doe"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Password
                  </label>
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
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                    Confirm
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-premium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-premium"
                >
                  <option value="user">Individual</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium-primary w-full py-3.5 text-sm mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Get Started'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
