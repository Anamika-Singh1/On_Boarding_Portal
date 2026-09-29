// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Input, Button } from '@/components/ui';

const ResetPassword = ({ apiBaseUrl }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [loading, setLoading] = useState(false);

  const baseUrl = apiBaseUrl ?? (import.meta.env.VITE_API_URL || '');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
        return;
      }

      setMessage({ type: 'success', text: 'Password reset successful. Redirecting to login...' });
      setTimeout(() => navigate('/'), 2000);
    } catch {
      setLoading(false);
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Reset your password</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a new password for your account.</p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>

        {message && (
          <div
            role="status"
            className={`mt-4 flex items-start gap-2 rounded-lg p-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
