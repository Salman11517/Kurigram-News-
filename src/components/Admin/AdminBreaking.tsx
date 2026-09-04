import React, { useState } from 'react';
import { BreakingNewsItem, SiteSettings } from '../../types';
import { api } from '../../services/api';
import { Flame, Plus, Trash2, CheckCircle2, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';

interface AdminBreakingProps {
  breakingItems: BreakingNewsItem[];
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminBreaking: React.FC<AdminBreakingProps> = ({
  breakingItems,
  settings,
  onRefresh
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggleSystem = async () => {
    try {
      const updated = !settings.breakingNewsEnabled;
      await api.updateSettings({ breakingNewsEnabled: updated });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSaving(true);
    try {
      await api.createBreakingNews({
        title: newTitle.trim(),
        url: newUrl.trim() || undefined,
        active: true
      });
      setNewTitle('');
      setNewUrl('');
      setMessage('ব্রেকিং নিউজ সফলভাবে যুক্ত হয়েছে!');
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.deleteBreakingNews(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-600" />
              ব্রেকিং নিউজ ব্যবস্থাপনা সিস্টেম
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              ওয়েবসাইটের শীর্ষে চলমান লাল টিকার বারে সরাসরি জরুরি সংবাদ সম্প্রচার করুন
            </p>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3 bg-neutral-100 p-2.5 rounded-xl border border-neutral-200">
            <span className="text-xs font-bold text-neutral-800">
              ব্রেকিং টিকার প্রদর্শন:
            </span>
            <button
              onClick={handleToggleSystem}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                settings.breakingNewsEnabled
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-300 text-neutral-700'
              }`}
            >
              {settings.breakingNewsEnabled ? (
                <>
                  <ToggleRight className="w-4 h-4" />
                  <span>সক্রিয় (ON)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  <span>নিষ্ক্রিয় (OFF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Quick Add Form */}
        <form onSubmit={handleAddItem} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-8 space-y-3">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            নতুন জরুরি সংবাদ সম্প্রচার করুন
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="ব্রেকিং সংবাদের শিরোনাম লিখুন (e.g. কুড়িগ্রামে ধরলার পানি বিপৎসীমার ওপরে, রেড অ্যালার্ট জারি)..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="md:col-span-4 flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Active Breaking Items */}
        <div>
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
            বর্তমানে চলমান ব্রেকিং নিউজ তালিকা:
          </h3>
          <div className="space-y-2.5">
            {breakingItems.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">
                বর্তমানে কোনো ব্রেকিং নিউজ নেই। উপরের ফর্ম দিয়ে নতুন যুক্ত করুন।
              </p>
            ) : (
              breakingItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-neutral-200 rounded-xl hover:border-red-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold font-bangla-serif text-neutral-900 truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
