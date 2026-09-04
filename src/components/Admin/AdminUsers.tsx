import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../../services/api';
import { ShieldCheck, UserPlus, Trash2, Edit, Check } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
  onRefresh: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onRefresh }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('REPORTER');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setIsSaving(true);
    try {
      await api.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role
      });
      setName('');
      setEmail('');
      setPassword('');
      setMessage('নতুন ইউজার সফলভাবে তৈরি হয়েছে!');
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'ত্রুটি ঘটেছে');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই ইউজার মুছে ফেলতে চান?')) return;
    try {
      await api.deleteUser(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            ইউজার ও এক্সেস রোলস (Users & Permissions)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            সুপার অ্যাডমিন, সম্পাদক এবং সাংবাদিকদের এক্সেস ও অনুমতি নিয়ন্ত্রণ করুন
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Add User */}
        <form onSubmit={handleCreateUser} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-8 space-y-3">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            নতুন অ্যাডমিন/এডিটর ইউজার তৈরি করুন
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="নাম"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">ইমেইল *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@kurigramnews.com"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">রোল (Role) *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              >
                <option value="SUPER_ADMIN">সুপার অ্যাডমিন (Full Access)</option>
                <option value="EDITOR">সম্পাদক (Editor)</option>
                <option value="REPORTER">রিপোর্টার (Reporter)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>ইউজার সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-3">ব্যবহারকারীর নাম</th>
                <th className="py-3 px-3">ইমেইল</th>
                <th className="py-3 px-3">নির্ধারিত রোল</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 transition">
                  <td className="py-3 px-3 font-bold font-bangla-serif text-neutral-900">
                    <div className="flex items-center gap-2">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 font-mono">
                    {u.email}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'SUPER_ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : u.role === 'EDITOR'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role === 'SUPER_ADMIN' ? 'সুপার অ্যাডমিন' : u.role === 'EDITOR' ? 'সম্পাদক' : 'রিপোর্টার'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition"
                        title="ইউজার মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
