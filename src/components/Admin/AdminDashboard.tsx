import React from 'react';
import { DashboardStats, Article } from '../../types';
import { toBengaliNumber, formatBengaliDateSimple } from '../../utils/bengaliDate';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Flame, 
  Eye, 
  Share2, 
  Layers, 
  Users2, 
  Megaphone, 
  PlusCircle, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardProps {
  stats: DashboardStats;
  recentArticles: Article[];
  onNavigateTab: (tab: string) => void;
  onEditArticle: (article: Article) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentArticles,
  onNavigateTab,
  onEditArticle
}) => {
  const statCards = [
    { label: 'মোট সংবাদ', value: stats.totalArticles, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'প্রকাশিত সংবাদ', value: stats.publishedArticles, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'খসড়া সংবাদ', value: stats.draftArticles, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'সক্রিয় ব্রেকিং নিউজ', value: stats.breakingNewsCount, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'সর্বমোট ভিউ', value: stats.totalViews, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'আজকের ভিউ', value: stats.todayViews, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'মোট শেয়ার', value: stats.totalShares, icon: Share2, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'মোট ক্যাটাগরি', value: stats.totalCategories, icon: Layers, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'মোট সাংবাদিক', value: stats.totalAuthors, icon: Users2, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'বিজ্ঞাপন ক্যাম্পেইন', value: stats.totalAds, icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome banner */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">কন্ট্রোল প্যানেল</span>
          <h2 className="text-2xl md:text-3xl font-bold font-bangla-serif mt-1">
            কুড়িগ্রাম নিউজ ব্যবস্থাপনা ড্যাশবোর্ড
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            সর্বশেষ খবর তৈরি, ব্রেকিং নিউজ সক্রিয়করণ ও সাইট কনটেন্ট রিয়েল-টাইমে পরিচালনা করুন।
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('add-article')}
          className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন সংবাদ প্রকাশ করুন</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500">{card.label}</span>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-neutral-900 mt-2 font-bangla-serif">
                {toBengaliNumber(card.value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
            <h3 className="text-base font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              সম্প্রতি আপলোডকৃত সংবাদ
            </h3>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              সকল সংবাদ &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">শিরোনাম</th>
                  <th className="py-2.5 px-3">বিভাগ</th>
                  <th className="py-2.5 px-3">লেখক</th>
                  <th className="py-2.5 px-3">ভিউ</th>
                  <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentArticles.slice(0, 6).map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-800 line-clamp-1 max-w-xs font-bangla-serif">
                        {art.title}
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {formatBengaliDateSimple(art.publishedAt)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {art.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 font-medium">
                      {art.authorName}
                    </td>
                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {toBengaliNumber(art.views)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        art.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {art.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onEditArticle(art)}
                        className="text-red-600 hover:text-red-800 font-bold hover:underline"
                      >
                        এডিট
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Launchpad (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold font-bangla-serif text-neutral-900 border-b border-neutral-200 pb-2 mb-3">
              দ্রুত এক্সেস মেন্যু
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('breaking')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  ব্রেকিং নিউজ টিকার পরিচালনা
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('trending')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  ট্রেন্ডিং ও সর্বাধিক পঠিত
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('advertisements')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-orange-600" />
                  বিজ্ঞাপন স্লট ম্যানেজমেন্ট
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('media')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  মিডিয়া ফাইল ও ছবি আপলোড
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editorial Guidelines Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 font-bangla-serif">
              <CheckCircle className="w-4 h-4 text-amber-600" />
              সম্পাদকীয় নীতিমালা স্মরণিকা
            </h4>
            <p className="text-amber-800 leading-relaxed">
              সংবাদ প্রকাশের পূর্বে তথ্যসূত্র নিশ্চিত করুন। কপিরাইটযুক্ত ছবি ব্যবহারে সঠিক উৎস ও ক্যাপশন উল্লেখ করুন। ব্রেকিং নিউজের ক্ষেত্রে নির্ভুলতা সর্বোচ্চ অগ্রাধিকার।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
