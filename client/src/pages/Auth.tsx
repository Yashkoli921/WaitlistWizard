
import { useState } from 'react';
import { useLocation } from 'wouter';
import AuthForm from '@/components/auth/AuthForm';

export default function Auth() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (email: string, password: string) => {
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setLocation('/calculators');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          {mode === 'login' ? 'Sign in to your account' : 'Create new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <AuthForm mode={mode} onSubmit={handleSubmit} />
          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
