import React, { useState } from 'react';
import { Article, Category } from '../../types';
import { formatBengaliDateSimple, toBengaliNumber } from '../../utils/bengaliDate';
import { api } from '../../services/api';
import { 
  Search, 
  PlusCircle, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Flame, 
  Star, 
  TrendingUp, 
  Eye, 
  Share2,
  Filter,
  Check
} from 'lucide-react';

interface AdminArticlesProps {
  articles: Article[];
  categories: Category[];
  onAddNew: () => void;
  onEdit: (article: Article) => void;
  onView: (article: Article) => void;
  onArticlesChanged: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  categories,
  onAddNew,
  onEdit,
  onView,
  onArticlesChanged
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory && art.categorySlug !== selectedCategory) return false;
    if (selectedStatus && art.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q) ||
        art.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleFlag = async (article: Article, flag: 'isBreaking' | 'isFeatured' | 'isTrending') => {
    const updatedValue = !article[flag];
    try {
      await api.updateArticle(article.id, { [flag]: updatedValue });
      onArticlesChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই সংবাদটি স্থায়ীভাবে মুছে ফেলতে চান?')) return;
    setDeletingId(id);
    try {
      await api.deleteArticle(id);
      onArticlesChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900">
            সংবাদ তালিকা ও ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            মোট {toBengaliNumber(articles.length)} টি সংবাদ সংরক্ষিত রয়েছে
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন সংবাদ লিখুন</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="সংবাদের শিরোনাম বা লেখকের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="">সব ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="">সব স্ট্যাটাস</option>
            <option value="published">প্রকাশিত</option>
            <option value="draft">খসড়া</option>
            <option value="scheduled">শিডিউল</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-3">সংবাদ ও শিরোনাম</th>
              <th className="py-3 px-3">ক্যাটাগরি</th>
              <th className="py-3 px-3">রিপোর্টার</th>
              <th className="py-3 px-3 text-center">ভিউ ও শেয়ার</th>
              <th className="py-3 px-3 text-center">ফ্ল্যাগ সেটিংস</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-neutral-400">
                  কোনো সংবাদ পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredArticles.map((art) => (
                <tr key={art.id} className="hover:bg-neutral-50/70 transition">
                  {/* Title and image */}
                  <td className="py-3 px-3 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-14 h-11 object-cover rounded-md shrink-0 bg-neutral-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-900 font-bangla-serif line-clamp-1 hover:text-red-600 cursor-pointer"
                             onClick={() => onView(art)}>
                          {art.title}
                        </div>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          {formatBengaliDateSimple(art.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                      {art.categoryName}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="py-3 px-3 text-neutral-600 font-medium">
                    {art.authorName}
                  </td>

                  {/* Stats */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] text-neutral-600">
                      <span className="flex items-center gap-0.5" title="ভিউ">
                        <Eye className="w-3 h-3 text-neutral-400" />
                        {toBengaliNumber(art.views)}
                      </span>
                      <span className="flex items-center gap-0.5" title="শেয়ার">
                        <Share2 className="w-3 h-3 text-neutral-400" />
                        {toBengaliNumber(art.shares)}
                      </span>
                    </div>
                  </td>

                  {/* 1-Click Quick Flags */}
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleToggleFlag(art, 'isBreaking')}
                        className={`p-1 rounded transition ${
                          art.isBreaking 
                            ? 'bg-red-100 text-red-700 font-bold hover:bg-red-200' 
                            : 'bg-neutral-100 text-neutral-400 hover:text-red-600'
                        }`}
                        title="ব্রেকিং নিউজ অন/অফ"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleFlag(art, 'isFeatured')}
                        className={`p-1 rounded transition ${
                          art.isFeatured 
                            ? 'bg-amber-100 text-amber-700 font-bold hover:bg-amber-200' 
                            : 'bg-neutral-100 text-neutral-400 hover:text-amber-600'
                        }`}
                        title="ফিচার্ড নিউজ অন/অফ"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleFlag(art, 'isTrending')}
                        className={`p-1 rounded transition ${
                          art.isTrending 
                            ? 'bg-purple-100 text-purple-700 font-bold hover:bg-purple-200' 
                            : 'bg-neutral-100 text-neutral-400 hover:text-purple-600'
                        }`}
                        title="ট্রেন্ডিং নিউজ অন/অফ"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      art.status === 'published' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {art.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(art)}
                        className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 rounded transition"
                        title="পাবলিক পেজে দেখুন"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(art)}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={deletingId === art.id}
                        onClick={() => handleDelete(art.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-neutral-100 rounded transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
