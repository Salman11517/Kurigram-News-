import React, { useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { Lock, Mail, ArrowLeft, ShieldAlert, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('saimshinha2@gmail.com');
  const [password, setPassword] = useState('Salman@123*-*');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="bg-red-600 p-6 text-white text-center">
          <div className="w-12 h-12 bg-white text-red-600 rounded-lg flex items-center justify-center font-bangla-serif text-2xl font-black mx-auto mb-2 shadow">
            কু
          </div>
          <h2 className="text-2xl font-black font-bangla-serif">কুড়িগ্রাম নিউজ অ্যাডমিন</h2>
          <p className="text-xs text-red-100 mt-1">নিউজ পাবলিশিং ও পোর্টাল ব্যবস্থাপনা কন্ট্রোল প্যানেল</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Active Admin Info Banner */}
          <div className="mb-5 p-3 bg-red-50 border border-red-200/80 rounded-lg flex items-center gap-2.5 text-xs text-gray-700">
            <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-bold text-gray-900 block">সুপার অ্যাডমিন অ্যাকাউন্ট কনফিগার করা হয়েছে</span>
              <span className="font-mono text-gray-600 text-[11px]">saimshinha2@gmail.com</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="saimshinha2@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition shadow-md cursor-pointer"
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              দ্রুত লগইন ফিল করুন (Quick Credentials):
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('saimshinha2@gmail.com', 'Salman@123*-*')}
                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-semibold text-center transition cursor-pointer"
              >
                সুপার অ্যাডমিন
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('editor@kurigramnews.com', 'editor123')}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium text-center transition cursor-pointer"
              >
                এডিটর
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('reporter@kurigramnews.com', 'reporter123')}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium text-center transition cursor-pointer"
              >
                রিপোর্টার
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center justify-center gap-1 mx-auto transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
