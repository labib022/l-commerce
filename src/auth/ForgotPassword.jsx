import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      localStorage.setItem('resetEmail', email);
      setTimeout(() => {
        navigate('/auth/verify-otp');
      }, 500);
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Home Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Home
      </Link>

      <div className="flex w-full max-w-6xl items-center gap-8">
        {/* Left Image - Hidden on mobile */}
        <div className="hidden w-5/12 lg:block">
          <img
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600"
            alt="Kitchen"
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Right Card */}
        <div className="w-full lg:w-7/12">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-2 text-3xl font-bold text-gray-800">Forgot Your Password</h2>
            <p className="mb-2 text-gray-600">Enter your email to reset your password.</p>
            <div className="mb-6 h-2 w-10 rounded-full bg-red-500"></div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-full bg-gray-100 px-4 py-3 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Sending...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-right">
                <Link to="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">
                  Go back to sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;