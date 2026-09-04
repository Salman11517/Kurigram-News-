import React, { useState, useEffect } from 'react';
import { Article, Category, Author, MediaItem } from '../../types';
import { AdminRichEditor } from './AdminRichEditor';
import { api } from '../../services/api';
import { 
  Save, 
  Send, 
  Image as ImageIcon, 
  Flame, 
  Star, 
  TrendingUp, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Layers,
  User as UserIcon,
  Video
} from 'lucide-react';

interface AdminArticleEditorProps {
  articleToEdit?: Article | null;
  categories: Category[];
  authors: Author[];
  mediaList: MediaItem[];
  onSaved: (article: Article) => void;
  onCancel: () => void;
}

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({
  articleToEdit,
  categories,
  authors,
  mediaList,
  onSaved,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || '');
      setSubtitle(articleToEdit.subtitle || '');
      setContent(articleToEdit.content || '');
      setSummary(articleToEdit.summary || '');
      setFeaturedImage(articleToEdit.featuredImage || '');
      setImageCaption(articleToEdit.imageCaption || '');
      setCategoryId(articleToEdit.categoryId || (categories[0]?.id || ''));
      setAuthorId(articleToEdit.authorId || (authors[0]?.id || ''));
      setTags(articleToEdit.tags || []);
      setTagInput((articleToEdit.tags || []).join(', '));
      setStatus(articleToEdit.status || 'published');
      setIsBreaking(Boolean(articleToEdit.isBreaking));
      setIsFeatured(Boolean(articleToEdit.isFeatured));
      setIsTrending(Boolean(articleToEdit.isTrending));
      setVideoUrl(articleToEdit.videoUrl || '');
      setSeoTitle(articleToEdit.seoTitle || '');
      setMetaDescription(articleToEdit.metaDescription || '');
      setKeywordsInput((articleToEdit.keywords || []).join(', '));
    } else {
      // Defaults for new article
      setTitle('');
      setSubtitle('');
      setContent('');
      setSummary('');
      setFeaturedImage('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80');
      setImageCaption('');
      setCategoryId(categories[0]?.id || '');
      setAuthorId(authors[0]?.id || '');
      setTags(['কুড়িগ্রাম', 'সংবাদ']);
      setTagInput('কুড়িগ্রাম, সংবাদ');
      setStatus('published');
      setIsBreaking(false);
      setIsFeatured(false);
      setIsTrending(false);
      setVideoUrl('');
      setSeoTitle('');
      setMetaDescription('');
      setKeywordsInput('');
    }
  }, [articleToEdit, categories, authors]);

  const handleTagsBlur = () => {
    const parsed = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setTags(parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('সংবাদের শিরোনাম দেওয়া বাধ্যতামূলক।');
      return;
    }
    if (!content.trim()) {
      setError('সংবাদের বিস্তারিত বিষয়বস্তু লিখুন।');
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId) || categories[0];
    const selectedAuthor = authors.find(a => a.id === authorId) || authors[0];

    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const payload: Partial<Article> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      content: content.trim(),
      summary: summary.trim() || title.trim(),
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim(),
      categoryId: selectedCategory?.id || 'cat-1',
      categorySlug: selectedCategory?.slug || 'kurigram',
      categoryName: selectedCategory?.name || 'কুড়িগ্রাম জেলা',
      authorId: selectedAuthor?.id || 'auth-1',
      authorName: selectedAuthor?.name || 'স্টাফ রিপোর্টার',
      authorAvatar: selectedAuthor?.photo,
      authorDesignation: selectedAuthor?.designation,
      tags: tags.length > 0 ? tags : ['কুড়িগ্রাম'],
      status,
      isBreaking,
      isFeatured,
      isTrending,
      videoUrl: videoUrl.trim(),
      seoTitle: seoTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || summary.trim() || title.trim(),
      keywords: keywords.length > 0 ? keywords : tags
    };

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let savedArticle: Article;
      if (articleToEdit?.id) {
        savedArticle = await api.updateArticle(articleToEdit.id, payload);
        setSuccess('সংবাদটি সফলভাবে আপডেট করা হয়েছে!');
      } else {
        savedArticle = await api.createArticle(payload);
        setSuccess('সংবাদটি সফলভাবে প্রকাশিত হয়েছে!');
      }
      setTimeout(() => {
        onSaved(savedArticle);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'সংবাদ প্রকাশে ত্রুটি ঘটেছে।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 md:p-8">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-bangla-serif text-neutral-900">
              {articleToEdit ? 'সংবাদ সম্পাদনা' : 'দ্রুত সংবাদ প্রকাশক (Quick News Publisher)'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              শিরোনাম, বিষয়বস্তু এবং ছবি যুক্ত করে তাৎক্ষণিক প্রকাশ করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs md:text-sm font-bold rounded-lg shadow-md transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'PUBLISH NEWS (সংবাদ প্রকাশ করুন)'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main 2-column layout: Inputs (8 cols) + Meta sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Main inputs (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                সংবাদের মূল শিরোনাম (Headline) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="এখানে আকর্ষণীয় প্রধান শিরোনাম লিখুন..."
                className="w-full px-4 py-3 text-base md:text-lg font-bold font-bangla-serif border border-neutral-300 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-neutral-900"
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                উপ-শিরোনাম / সাব-হেডলাইন (Subheadline)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="সংবাদের সংক্ষেপিত দ্বিতীয় শিরোনাম..."
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                সংবাদ সারাংশ / ভূমিকা (Summary / Lead Excerpt)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="হোমপেজ ও সোশ্যাল মিডিয়া প্রিভিউতে প্রদর্শিত সংক্ষিপ্ত সারাংশ..."
                className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-red-600 leading-relaxed"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                সংবাদের বিস্তারিত বিবরণ (Article Content - Rich Editor) <span className="text-red-500">*</span>
              </label>
              <AdminRichEditor
                value={content}
                onChange={setContent}
                placeholder="এখানে বিস্তারিত সংবাদ পেস্ট করুন বা লিখুন..."
              />
            </div>

            {/* Video embed URL (Optional) */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-red-600" />
                ভিডিও সংবাদের জন্য এম্বেড লিংক (ঐচ্ছিক - YouTube Embed Link)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/embed/XXXXX"
                className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            {/* SEO Settings Accordion */}
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 space-y-3">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                সার্চ ইঞ্জিন অপটিমাইজেশন (SEO Settings)
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  এসইও মেটা টাইটেল (SEO Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'কুড়িগ্রাম নিউজ...'}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  মেটা ডেসক্রিপশন (Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="গুগল সার্চ ও ফেসবুকে প্রদর্শনের জন্য মেটা ডেসক্রিপশন..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  কি-ওয়ার্ডস (Keywords - কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="কুড়িগ্রাম, ব্রেকিং নিউজ, বাংলাদেশ, অর্থনীতি"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Meta Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publishing Status & Flags */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-200 pb-2">
                প্রকাশনা স্ট্যাটাস ও ফ্ল্যাগ
              </h3>

              {/* Status Radio */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">স্ট্যাটাস:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      status === 'published'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    প্রকাশিত
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      status === 'draft'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    খসড়া
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('scheduled')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      status === 'scheduled'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    শিডিউল
                  </button>
                </div>
              </div>

              {/* Checkboxes: Breaking, Featured, Trending */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer hover:bg-red-50/50 transition">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>ব্রেকিং নিউজ (টিকার বারে দেখাবে)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer hover:bg-amber-50/50 transition">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>ফিচার্ড সংবাদ (প্রধান স্থানে দেখাবে)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-neutral-200 cursor-pointer hover:bg-purple-50/50 transition">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span>ট্রেন্ডিং সংবাদ (সর্বাধিক পঠিত তালিকায়)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Category selection */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-neutral-500" />
                ক্যাটাগরি নির্বাচন <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author selection */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-neutral-500" />
                লেখক / রিপোর্টার <span className="text-red-500">*</span>
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600 font-medium"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-neutral-500" />
                  ফিচার্ড ছবি (Featured Image) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="text-[11px] font-bold text-red-600 hover:underline"
                >
                  মিডিয়া থেকে নিন
                </button>
              </div>

              {/* Image Preview */}
              {featuredImage && (
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-neutral-300 bg-neutral-200">
                  <img
                    src={featuredImage}
                    alt="প্রিভিউ"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              )}

              {/* Media Picker dropdown */}
              {showMediaPicker && (
                <div className="p-2 bg-white rounded-lg border border-neutral-300 max-h-48 overflow-y-auto space-y-1.5">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">মিডিয়া লাইব্রেরি ছবি:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {mediaList.map((m) => (
                      <img
                        key={m.id}
                        src={m.url}
                        alt={m.name}
                        onClick={() => {
                          setFeaturedImage(m.url);
                          setImageCaption(m.caption || '');
                          setShowMediaPicker(false);
                        }}
                        className="w-full h-14 object-cover rounded cursor-pointer hover:ring-2 hover:ring-red-600 transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              <input
                type="text"
                required
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none"
              />

              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  ছবির ক্যাপশন (Caption)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="ছবির উৎস বা ঘটনার সংক্ষিপ্ত ক্যাপশন..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                ট্যাগসমূহ (Tags - কমা দিয়ে লিখুন)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onBlur={handleTagsBlur}
                placeholder="কুড়িগ্রাম, উন্নয়ন, অর্থনীতি..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-200 text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Big Button */}
        <div className="pt-6 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'PUBLISH NEWS (সংবাদ প্রকাশ করুন)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
