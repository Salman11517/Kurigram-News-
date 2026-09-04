import React, { useState } from 'react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { Layers, Plus, Edit, Trash2, Check, AlertCircle } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onRefresh
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const generatedSlug = slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-');
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: generatedSlug,
          description: description.trim()
        });
        setMessage('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await api.createCategory({
          name: name.trim(),
          slug: generatedSlug,
          description: description.trim(),
          order: categories.length + 1
        });
        setMessage('নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে!');
      }
      setName('');
      setSlug('');
      setDescription('');
      setEditingCategory(null);
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই ক্যাটাগরি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteCategory(id);
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
            <Layers className="w-6 h-6 text-red-600" />
            ক্যাটাগরি ব্যবস্থাপনা (Categories Manager)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            ওয়েবসাইটের সকল সংবাদ ক্যাটাগরি তৈরি, সম্পাদনা ও সাজান
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Add/Edit Form */}
        <form onSubmit={handleSave} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-8 space-y-4">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            {editingCategory ? 'ক্যাটাগরি সম্পাদনা করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                ক্যাটাগরির নাম (বাংলা) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. অর্থনীতি, সাহিত্য"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                স্লাগ (English Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. economy, literature"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                বিবরণ (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ক্যাটাগরির সংক্ষিপ্ত বিবরণ..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingCategory && (
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
              <span>{editingCategory ? 'আপডেট করুন' : 'ক্যাটাগরি যুক্ত করুন'}</span>
            </button>
          </div>
        </form>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-3">নাম</th>
                <th className="py-3 px-3">স্লাগ</th>
                <th className="py-3 px-3">বিবরণ</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50 transition">
                  <td className="py-3 px-3 font-bold font-bangla-serif text-neutral-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-500">
                    /{c.slug}
                  </td>
                  <td className="py-3 px-3 text-neutral-600 max-w-xs truncate">
                    {c.description || '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(c)}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded transition"
                        title="সম্পাদনা"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded transition"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
