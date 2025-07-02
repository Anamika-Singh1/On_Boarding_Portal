import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [formType, setFormType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || (formType !== 'forgot' && !password)) {
      alert('Please fill in all fields');
      return;
    }

    if (formType === 'register' && password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        formType === 'login'
          ? 'login'
          : formType === 'register'
          ? 'register'
          : 'forgot';

      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          formType === 'forgot'
            ? { email }
            : {
                name: email.split('@')[0],
                email,
                password,
                role,
              }
        ),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.message || 'Something went wrong');

      if (formType === 'login') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else if (formType === 'register') {
        alert('Registration successful. Please log in.');
        setFormType('login');
      } else {
        alert('Password reset link sent.');
        setFormType('login');
      }
    } catch (err) {
      setLoading(false);
      alert('An error occurred.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          {formType === 'login' && 'Sign In'}
          {formType === 'register' && 'Sign Up'}
          {formType === 'forgot' && 'Forgot Password'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password */}
          {formType !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          {formType === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Role */}
          {formType !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-900 dark:bg-gray-700 dark:text-white"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Please wait...' : formType === 'login' ? 'Login' : formType === 'register' ? 'Register' : 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle Links */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {formType === 'login' && (
            <>
              Don’t have an account?{' '}
              <button onClick={() => setFormType('register')} className="text-blue-600 hover:underline">Sign Up</button><br />
              <button onClick={() => setFormType('forgot')} className="text-blue-500 hover:underline mt-2">Forgot password?</button>
            </>
          )}
          {formType === 'register' && (
            <>
              Already have an account?{' '}
              <button onClick={() => setFormType('login')} className="text-blue-600 hover:underline">Sign In</button>
            </>
          )}
          {formType === 'forgot' && (
            <>
              Remember your password?{' '}
              <button onClick={() => setFormType('login')} className="text-blue-600 hover:underline">Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
