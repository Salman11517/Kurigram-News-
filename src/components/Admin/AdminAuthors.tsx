import React, { useState } from 'react';
import { Author } from '../../types';
import { api } from '../../services/api';
import { Users2, Plus, Edit, Trash2, Check, Mail, Phone } from 'lucide-react';

interface AdminAuthorsProps {
  authors: Author[];
  onRefresh: () => void;
}

export const AdminAuthors: React.FC<AdminAuthorsProps> = ({
  authors,
  onRefresh
}) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [bio, setBio] = useState('');
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const payload: Partial<Author> = {
        name: name.trim(),
        designation: designation.trim() || 'জেলা প্রতিনিধি',
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        photo: photo.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: bio.trim()
      };

      if (editingAuthor) {
        await api.updateAuthor(editingAuthor.id, payload);
        setMessage('রিপোর্টার তথ্য সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await api.createAuthor(payload);
        setMessage('নতুন রিপোর্টার সফলভাবে অন্তর্ভুক্ত করা হয়েছে!');
      }
      handleCancelEdit();
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (a: Author) => {
    setEditingAuthor(a);
    setName(a.name);
    setDesignation(a.designation);
    setEmail(a.email || '');
    setPhone(a.phone || '');
    setPhoto(a.photo);
    setBio(a.bio || '');
  };

  const handleCancelEdit = () => {
    setEditingAuthor(null);
    setName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setPhoto('');
    setBio('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই রিপোর্টারের প্রোফাইল মুছে ফেলতে চান?')) return;
    try {
      await api.deleteAuthor(id);
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
            <Users2 className="w-6 h-6 text-red-600" />
            রিপোর্টার ও লেখক ব্যবস্থাপনা (Journalists Directory)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            কুড়িগ্রাম নিউজ প্রতিনিধি, ব্যুরো প্রধান ও লেখকদের প্রোফাইল পরিচালনা করুন
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-8 space-y-4">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            {editingAuthor ? 'রিপোর্টার প্রোফাইল সম্পাদনা' : 'নতুন রিপোর্টার যুক্ত করুন'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: এস এম মিজানুর রহমান"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">পদবী ও এলাকা</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="যেমন: বিশেষ প্রতিনিধি / চিলমারী সংবাদদাতা"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">ছবির লিংক (URL)</label>
              <input
                type="text"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="journalist@kurigramnews.com"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">মোবাইল ফোন</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="০১৭১X-XXXXXX"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">সংক্ষিপ্ত বায়ো</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="সাংবাদিকতার অভিজ্ঞতা বা বিশেষত্ব..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingAuthor && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-lg transition"
              >
                বাতিল
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{editingAuthor ? 'আপডেট করুন' : 'সংযুক্ত করুন'}</span>
            </button>
          </div>
        </form>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map((a) => (
            <div key={a.id} className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-red-300 transition flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm font-bangla-serif text-neutral-900">{a.name}</h4>
                  <p className="text-xs text-red-600 font-medium">{a.designation}</p>
                  {a.email && (
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>{a.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(a)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition"
                  title="সম্পাদনা"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded transition"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
