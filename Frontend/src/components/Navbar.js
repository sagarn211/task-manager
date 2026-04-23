'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isMounted } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Prevent hydration mismatch by showing nothing until client hydration
  if (!isMounted) {
    return (
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-accent-500 rounded-lg shadow-lg shadow-primary-500/20" />
              <Link href="/" className="text-2xl font-display font-bold text-gradient tracking-tight">
                TaskFlow
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
                <span className="text-white dark:text-slate-900 font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                <Link href="/dashboard" className="nav-link nav-link-active">
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end leading-none">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">{user?.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{user?.name?.charAt(0)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-premium-secondary !py-1.5 !px-4 text-[10px] font-bold uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-muted hover:text-slate-900 dark:hover:text-white">
                  Log in
                </Link>
                <Link href="/register" className="btn-premium-primary !py-2 !px-5 text-[11px] uppercase tracking-widest">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
