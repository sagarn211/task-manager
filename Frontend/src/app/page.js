'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to TaskApp
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A powerful and intuitive task management application to organize your work and boost your productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Tasks</h3>
            <p className="text-gray-600">Easily create and manage your daily tasks</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor status and priority of your tasks</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">Your data is safe and secure with authentication</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 border-2 border-indigo-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
