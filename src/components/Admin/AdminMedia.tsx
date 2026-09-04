import React, { useState } from 'react';
import { MediaItem } from '../../types';
import { api } from '../../services/api';
import { Image as ImageIcon, Plus, Trash2, Copy, Check, Search, ExternalLink } from 'lucide-react';

interface AdminMediaProps {
  mediaList: MediaItem[];
  onRefresh: () => void;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ mediaList, onRefresh }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !name.trim()) return;
    setIsSaving(true);
    try {
      await api.createMedia({
        name: name.trim(),
        url: url.trim(),
        caption: caption.trim() || undefined,
        size: '1.2 MB',
        type: 'image/jpeg'
      });
      setName('');
      setUrl('');
      setCaption('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (m: MediaItem) => {
    navigator.clipboard.writeText(m.url);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি এই মিডিয়া ফাইলটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteMedia(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMedia = mediaList.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.caption && m.caption.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-teal-600" />
            মিডিয়া লাইব্রেরি (Media Library)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            সংবাদের জন্য ব্যবহৃত ছবি, ব্যানার ও গ্রাফিক্স ফাইল পরিচালনা ও সংরক্ষণ করুন
          </p>
        </div>

        {/* Upload Box */}
        <form onSubmit={handleUpload} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-8 space-y-3">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            নতুন ছবি যুক্ত করুন (Add Media File)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ছবির নাম বা শিরোনাম..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="md:col-span-5">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ছবির সরাসরি লিংক (https://...)..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>মিডিয়া যুক্ত করুন</span>
              </button>
            </div>
          </div>
        </form>

        {/* Search */}
        <div className="mb-6 max-w-sm relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ছবি খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((m) => (
            <div key={m.id} className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-teal-400 transition flex flex-col justify-between">
              <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                <img
                  src={m.url}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopy(m)}
                    className="p-1.5 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
                    title="লিংক কপি করুন"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-semibold text-neutral-800 truncate" title={m.name}>
                  {m.name}
                </h4>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {m.size || '1.2 MB'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
