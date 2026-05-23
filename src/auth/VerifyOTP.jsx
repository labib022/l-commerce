import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = localStorage.getItem('resetEmail') || '';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpValue = otp.join('');
    if (otpValue.length === 5) {
      setTimeout(() => {
        navigate('/auth/reset-password');
      }, 500);
    }
    setLoading(false);
  };

  const handleResend = () => {
    setCountdown(30);
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
            src="https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=600"
            alt="Kitchen"
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Right Card */}
        <div className="w-full lg:w-7/12">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-2 text-3xl font-bold text-gray-800">OTP Verification</h2>
            <p className="mb-2 text-gray-600">We've sent a 5-digit code to:</p>
            <p className="mb-6 text-blue-600 font-medium">{email}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className={`h-12 w-12 rounded-xl border-2 text-center text-lg font-semibold outline-none transition-colors ${
                      index === 0 ? 'border-blue-500' : 'border-gray-300'
                    } focus:border-blue-500`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.some((d) => !d)}
                className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify'
                )}
              </button>

              {/* Resend Code */}
              <p className="text-center">
                {countdown > 0 ? (
                  <span className="text-gray-500">Resend Code ({countdown}s)</span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;