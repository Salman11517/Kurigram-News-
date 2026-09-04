import React, { useState } from 'react';
import { Advertisement, AdLocation, AdType } from '../../types';
import { api } from '../../services/api';
import { toBengaliNumber } from '../../utils/bengaliDate';
import { Megaphone, Plus, Edit, Trash2, Check, ToggleLeft, ToggleRight, Eye, MousePointer } from 'lucide-react';

interface AdminAdsProps {
  ads: Advertisement[];
  onRefresh: () => void;
}

export const AdminAds: React.FC<AdminAdsProps> = ({ ads, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState<AdLocation>('header_top');
  const [type, setType] = useState<AdType>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [code, setCode] = useState('');
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const locations: { id: AdLocation; label: string }[] = [
    { id: 'header_top', label: 'হেডার বিজ্ঞাপন (Header Top)' },
    { id: 'breaking_bottom', label: 'ব্রেকিং নিউজের নিচে (Breaking Area)' },
    { id: 'home_lead', label: 'হোমপেজ বিজ্ঞাপন (Homepage Main)' },
    { id: 'sidebar', label: 'সাইডবার বিজ্ঞাপন (Sidebar Slot)' },
    { id: 'article_top', label: 'আর্টিকেল উপরে (Article Top)' },
    { id: 'article_mid', label: 'আর্টিকেল মাঝে (Article Middle)' },
    { id: 'article_bottom', label: 'আর্টিকেল নিচে (Article Bottom)' },
    { id: 'footer', label: 'ফুটার বিজ্ঞাপন (Footer)' }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const payload: Partial<Advertisement> = {
        title: title.trim(),
        location,
        type,
        imageUrl: imageUrl.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        code: code.trim() || undefined,
        active: true
      };

      if (editingAd) {
        await api.updateAd(editingAd.id, payload);
        setMessage('বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await api.createAd(payload);
        setMessage('নতুন বিজ্ঞাপন স্লট সক্রিয় করা হয়েছে!');
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

  const handleStartEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setLocation(ad.location);
    setType(ad.type);
    setImageUrl(ad.imageUrl || '');
    setLinkUrl(ad.linkUrl || '');
    setCode(ad.code || '');
  };

  const handleCancelEdit = () => {
    setEditingAd(null);
    setTitle('');
    setImageUrl('');
    setLinkUrl('');
    setCode('');
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      await api.updateAd(ad.id, { active: !ad.active });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই বিজ্ঞাপনটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteAd(id);
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
            <Megaphone className="w-6 h-6 text-orange-600" />
            বিজ্ঞাপন ব্যবস্থাপনা (Advertisement Manager)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            হেডার, সাইডবার, হোমপেজ এবং আর্টিকেল পেজের বিভিন্ন পজিশনে ব্যানার ইমেজ বা গুগল অ্যাডসেন্স কোড বসান
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Ad Form */}
        <form onSubmit={handleSave} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-8 space-y-4">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            {editingAd ? 'বিজ্ঞাপন সম্পাদনা' : 'নতুন বিজ্ঞাপন স্লট যুক্ত করুন'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">বিজ্ঞাপনের নাম / ক্লায়েন্ট *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: গ্রামীণফোন স্পেশাল ব্যানার"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">বিজ্ঞাপনের অবস্থান (Placement)</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as AdLocation)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">বিজ্ঞাপনের ধরন (Type)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdType)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
              >
                <option value="image">ব্যানার ইমেজ (Image Banner)</option>
                <option value="adsense">গুগল অ্যাডসেন্স (Google AdSense)</option>
                <option value="html">কাস্টম এইচটিএমএল (Custom HTML)</option>
              </select>
            </div>
          </div>

          {type === 'image' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ছবির লিংক (Image URL) *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ক্লিক লিংক (Target URL)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">অ্যাড কোড (AdSense / HTML Script)</label>
              <textarea
                rows={3}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<script async src=...></script>"
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingAd && (
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
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{editingAd ? 'আপডেট করুন' : 'বিজ্ঞাপন সক্রিয় করুন'}</span>
            </button>
          </div>
        </form>

        {/* Ads List */}
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {ad.imageUrl && (
                  <img src={ad.imageUrl} alt={ad.title} className="w-20 h-10 object-cover rounded border border-neutral-200" />
                )}
                <div>
                  <h4 className="font-bold text-sm text-neutral-900 font-bangla-serif">{ad.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                      {locations.find(l => l.id === ad.location)?.label || ad.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Eye className="w-3 h-3 text-neutral-400" />
                      {toBengaliNumber(ad.impressions || 0)} ইমপ্রেশন
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MousePointer className="w-3 h-3 text-neutral-400" />
                      {toBengaliNumber(ad.clicks || 0)} ক্লিক
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(ad)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {ad.active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-neutral-400" />}
                  <span>{ad.active ? 'সক্রিয়' : 'বন্ধ'}</span>
                </button>

                <button
                  onClick={() => handleStartEdit(ad)}
                  className="p-1.5 text-neutral-400 hover:text-orange-600 rounded transition"
                  title="সম্পাদনা"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
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
