import React, { useState } from 'react';
import { Article, Category } from '../types';
import { getTimeAgoBengali, toBengaliNumber } from '../utils/bengaliDate';
import { Search, X, Calendar, User, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSearchSubmit: (query: string, category?: string) => void;
  onArticleClick: (article: Article) => void;
  searchResults: Article[];
  isSearching: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSearchSubmit,
  onArticleClick,
  searchResults,
  isSearching
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearchSubmit(searchTerm.trim(), selectedCategory || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header Search Input */}
        <div className="p-4 md:p-6 bg-neutral-900 text-white flex items-center justify-between gap-3">
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
            <Search className="w-5 h-5 text-red-500 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="কী খুঁজতে চান? শিরোনাম, বিষয় বা সাংবাদিকের নাম লিখুন..."
              className="w-full bg-transparent text-white placeholder-neutral-400 text-base md:text-lg focus:outline-none font-medium"
              autoFocus
            />
          </form>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold">ক্যাটাগরি:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-neutral-300 rounded px-2.5 py-1 text-neutral-700 focus:outline-none focus:border-red-500"
            >
              <option value="">সব ক্যাটাগরি</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded transition"
          >
            অনুসন্ধান করুন
          </button>
        </div>

        {/* Results list */}
        <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="py-12 text-center text-neutral-500">
              <div className="inline-block w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm">অনুসন্ধান করা হচ্ছে...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="text-xs text-neutral-500 font-semibold mb-4">
                মোট {toBengaliNumber(searchResults.length)} টি ফলাফল পাওয়া গেছে:
              </div>
              <div className="space-y-4">
                {searchResults.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onArticleClick(art);
                      onClose();
                    }}
                    className="group cursor-pointer p-3.5 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/30 transition flex gap-4 items-center"
                  >
                    <div className="w-24 h-18 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-red-600 block mb-0.5">
                        {art.categoryName}
                      </span>
                      <h4 className="text-sm font-bold font-bangla-serif text-neutral-900 group-hover:text-red-600 transition line-clamp-2">
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {art.authorName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {getTimeAgoBengali(art.publishedAt)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-1 transition shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400">
              <Search className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
              <p className="text-sm font-medium">কোনো সংবাদ খুঁজতে উপরের বাক্সে শব্দ লিখুন</p>
              <p className="text-xs text-neutral-400 mt-1">যেমন: কুড়িগ্রাম, ধরলা নদী, তিস্তা, ক্রিকেট, শিক্ষা</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
