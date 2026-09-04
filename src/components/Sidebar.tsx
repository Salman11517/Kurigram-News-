import React, { useState } from 'react';
import { Article, Advertisement } from '../types';
import { AdBanner } from './AdBanner';
import { toBengaliNumber } from '../utils/bengaliDate';
import { TrendingUp, CloudSun, Calendar, Facebook, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  trendingArticles: Article[];
  ads: Advertisement[];
  onArticleClick: (article: Article) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  trendingArticles,
  ads,
  onArticleClick
}) => {
  // Prayer times for Kurigram/Rangpur zone
  const prayerTimes = [
    { name: 'ফজর', time: '৪:১৮' },
    { name: 'যোহর', time: '১২:০২' },
    { name: 'আসর', time: '৪:২৭' },
    { name: 'মাগরিব', time: '৬:১৩' },
    { name: 'ইশা', time: '৭:২৯' }
  ];

  return (
    <aside className="space-y-5">
      {/* 1. Signature "জনপ্রিয় সংবাদ" (Popular News) - Editorial Red Accent Widget */}
      <div className="bg-red-50/70 border border-red-100 p-4 rounded-lg shadow-xs">
        <h4 className="text-red-700 font-bold border-b border-red-200 pb-2 mb-3 text-sm flex items-center gap-2 font-bangla-serif">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          জনপ্রিয় সংবাদ
        </h4>

        <ul className="flex flex-col gap-3">
          {trendingArticles.slice(0, 5).map((art, idx) => {
            const formattedIndex = toBengaliNumber(idx < 9 ? `0${idx + 1}` : `${idx + 1}`);
            return (
              <li
                key={art.id}
                onClick={() => onArticleClick(art)}
                className="flex gap-3 items-start border-b border-red-100/80 pb-2.5 last:border-0 last:pb-0 group cursor-pointer"
              >
                <span className="text-2xl md:text-3xl font-black text-red-200 leading-none shrink-0 font-bangla-serif group-hover:text-red-500 transition select-none">
                  {formattedIndex}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug group-hover:text-red-600 cursor-pointer font-bangla-serif line-clamp-2 transition">
                    {art.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                    <span className="text-red-600 font-medium">{art.categoryName}</span>
                    <span>•</span>
                    <span>{art.views} বার পঠিত</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. Sidebar Ad or Editorial Advertisement Container */}
      <div>
        <AdBanner location="sidebar" ads={ads} />
        {ads.filter(a => a.location === 'sidebar' && a.active).length === 0 && (
          <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400 text-[10px] border border-dashed border-gray-300 rounded uppercase font-bold tracking-widest select-none">
            Advertisement
          </div>
        )}
      </div>

      {/* 3. Kurigram Weather Box - Editorial Clean */}
      <div className="bg-white border border-gray-200/80 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm text-gray-900 font-bangla-serif">কুড়িগ্রাম আবহাওয়া</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
            Today
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-gray-900">{toBengaliNumber(29)}°C</div>
            <p className="text-xs text-gray-500 mt-0.5">আংশিক মেঘলা ও শান্ত আবহাওয়া</p>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-0.5">
            <div>বাতাস: {toBengaliNumber(11)} কিমি/ঘণ্টা</div>
            <div>আর্দ্রতা: {toBengaliNumber(78)}%</div>
          </div>
        </div>
      </div>

      {/* 4. Namaz / Prayer Schedule */}
      <div className="bg-white border border-gray-200/80 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
          <h4 className="text-sm font-bold font-bangla-serif text-gray-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            নামাজের সময়সূচি (কুড়িগ্রাম)
          </h4>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">ওয়াক্ত</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {prayerTimes.map((p, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded border border-gray-100">
              <span className="text-[11px] font-semibold text-gray-700 block mb-0.5">{p.name}</span>
              <span className="text-[11px] text-emerald-700 font-bold block">{toBengaliNumber(p.time)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Facebook Community Connect Card */}
      <div className="bg-white border border-gray-200/80 rounded-lg p-4 shadow-xs text-center">
        <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Facebook className="w-4 h-4" />
        </div>
        <h4 className="font-bold text-sm text-gray-900 font-bangla-serif">কুড়িগ্রাম নিউজের সাথে থাকুন</h4>
        <p className="text-xs text-gray-500 mt-1 mb-3">
          সর্বশেষ ব্রেকিং নিউজ ও তাজা আপডেট সরাসরি পেতে আমাদের ফেসবুক পেজ অনুসরণ করুন
        </p>
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          ফেসবুক পেজে যুক্ত হোন
        </a>
      </div>
    </aside>
  );
};

