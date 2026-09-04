import React from 'react';
import { Article } from '../../types';
import { api } from '../../services/api';
import { toBengaliNumber } from '../../utils/bengaliDate';
import { TrendingUp, Star, Eye, Share2, Check } from 'lucide-react';

interface AdminTrendingProps {
  articles: Article[];
  onRefresh: () => void;
}

export const AdminTrending: React.FC<AdminTrendingProps> = ({
  articles,
  onRefresh
}) => {
  const handleToggle = async (id: string, field: 'isTrending' | 'isFeatured', currentVal: boolean) => {
    try {
      await api.updateArticle(id, { [field]: !currentVal });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const trendingList = articles.filter(a => a.isTrending);
  const featuredList = articles.filter(a => a.isFeatured);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            ট্রেন্ডিং ও ফিচার্ড নিউজ কন্ট্রোল
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            ওয়েবসাইটের হোমপেজ এবং সাইডবারে প্রদর্শিত সর্বাধিক পঠিত ও নির্বাচিত খবরের তালিকা নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Section */}
          <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                ট্রেন্ডিং তালিকা ({toBengaliNumber(trendingList.length)} টি সক্রিয়)
              </h3>
            </div>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {trendingList.map((art, idx) => (
                <div key={art.id} className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between gap-3">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold font-bangla-serif text-neutral-900 truncate">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {art.views} ভিউ • {art.categoryName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggle(art.id, 'isTrending', true)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
                  >
                    বাদ দিন
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                ফিচার্ড তালিকা ({toBengaliNumber(featuredList.length)} টি সক্রিয়)
              </h3>
            </div>
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {featuredList.map((art, idx) => (
                <div key={art.id} className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold font-bangla-serif text-neutral-900 truncate">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {art.categoryName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggle(art.id, 'isFeatured', true)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap"
                  >
                    বাদ দিন
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All articles selector */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 mb-3">
            সকল সংবাদ থেকে ট্রেন্ডিং অথবা ফিচার্ডে যুক্ত করুন:
          </h3>
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 text-xs">
              {articles.map((art) => (
                <div key={art.id} className="p-3 flex items-center justify-between hover:bg-neutral-50 gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-neutral-800 truncate font-bangla-serif">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {art.categoryName} • {art.views} ভিউ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(art.id, 'isTrending', !!art.isTrending)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                        art.isTrending
                          ? 'bg-purple-600 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    >
                      {art.isTrending ? '✓ ট্রেন্ডিং' : '+ ট্রেন্ডিং করুন'}
                    </button>
                    <button
                      onClick={() => handleToggle(art.id, 'isFeatured', !!art.isFeatured)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                        art.isFeatured
                          ? 'bg-amber-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-amber-100 hover:text-amber-700'
                      }`}
                    >
                      {art.isFeatured ? '✓ ফিচার্ড' : '+ ফিচার্ড করুন'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
