import React from 'react';
import { Article, Category } from '../../types';
import { toBengaliNumber } from '../../utils/bengaliDate';
import { BarChart3, TrendingUp, Eye, Share2, Award, PieChart } from 'lucide-react';

interface AdminAnalyticsProps {
  articles: Article[];
  categories: Category[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ articles, categories }) => {
  const sortedByViews = [...articles].sort((a, b) => b.views - a.views);
  const topArticles = sortedByViews.slice(0, 7);

  // Views per category
  const categoryStats = categories.map(cat => {
    const catArticles = articles.filter(a => a.categoryId === cat.id || a.categorySlug === cat.slug);
    const totalViews = catArticles.reduce((acc, a) => acc + (a.views || 0), 0);
    const count = catArticles.length;
    return {
      name: cat.name,
      views: totalViews,
      count
    };
  }).sort((a, b) => b.views - a.views);

  const totalAllViews = articles.reduce((acc, a) => acc + (a.views || 0), 0) || 1;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
        <div className="border-b border-neutral-200 pb-5 mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            রিপোর্ট ও পাঠক অ্যানালিটিক্স (Reader Analytics)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            পাঠকদের আগ্রহ, সর্বাধিক পঠিত বিষয় ও ক্যাটাগরিভিত্তিক ট্রাফিকের পরিসংখ্যান
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Most Read Articles (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
            <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              সর্বাধিক পঠিত শীর্ষ সংবাদ (Top Viewed Stories)
            </h3>
            <div className="space-y-3">
              {topArticles.map((art, idx) => {
                const percentage = Math.round((art.views / totalAllViews) * 100);
                return (
                  <div key={art.id} className="bg-white p-3.5 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="font-bangla-serif text-neutral-900 line-clamp-1 flex-1 pr-2">
                        {toBengaliNumber(idx + 1)}. {art.title}
                      </span>
                      <span className="text-neutral-700 font-bold shrink-0">
                        {toBengaliNumber(art.views)} ভিউ ({toBengaliNumber(percentage)}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(8, percentage * 2))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Performance (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-50 p-5 rounded-xl border border-neutral-200">
            <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              ক্যাটাগরি অনুযায়ী পাঠকপ্রিয়তা
            </h3>
            <div className="space-y-3">
              {categoryStats.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-bangla-serif text-neutral-800">{cat.name}</h4>
                    <span className="text-[10px] text-neutral-400">
                      {toBengaliNumber(cat.count)} টি প্রতিবেদন
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-700 block">
                      {toBengaliNumber(cat.views)} ভিউ
                    </span>
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
