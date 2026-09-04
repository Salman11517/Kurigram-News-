import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { Settings, Globe, Check, AlertCircle, ExternalLink, Save } from 'lucide-react';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: val
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(formData);
      setMessage('সাইট ও এসইও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-red-600" />
              সাইট ও এসইও কনফিগারেশন (Site Settings & SEO)
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              পোর্টালের নাম, স্লোগান, যোগাযোগের তথ্য, সামাজিক মাধ্যম ও এসইও মেটাডাটা নিয়ন্ত্রণ করুন
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <span>sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <span>robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Brand Settings */}
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              ১. ব্র্যান্ড ও সাধারণ তথ্য
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ওয়েবসাইটের নাম (Site Name)</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">স্লোগান (Slogan)</label>
                <input
                  type="text"
                  value={formData.siteSlogan}
                  onChange={(e) => handleChange('siteSlogan', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">পোর্টাল বিবরণ (Meta Description)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </div>

          {/* Editorial & Contact */}
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              ২. সম্পাদকীয় ও যোগাযোগের ঠিকানা
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ভারপ্রাপ্ত সম্পাদক</label>
                <input
                  type="text"
                  value={formData.editorName}
                  onChange={(e) => handleChange('editorName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">প্রকাশক</label>
                <input
                  type="text"
                  value={formData.publisherName}
                  onChange={(e) => handleChange('publisherName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ইমেইল</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">কার্যালয়ের ঠিকানা</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Integrations */}
          <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-4">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              ৩. সোশ্যাল মিডিয়া ও থার্ড-পার্টি কোড
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ফেসবুক পেজ ইউআরএল</label>
                <input
                  type="text"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">ইউটিউব চ্যানেল ইউআরএল</label>
                <input
                  type="text"
                  value={formData.socialLinks?.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">গুগল অ্যানালিটিক্স আইডি (GA-4)</label>
                <input
                  type="text"
                  value={formData.googleAnalyticsId || ''}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">গুগল অ্যাডসেন্স ক্লায়েন্ট আইডি</label>
                <input
                  type="text"
                  value={formData.googleAdsenseId || ''}
                  onChange={(e) => handleChange('googleAdsenseId', e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
