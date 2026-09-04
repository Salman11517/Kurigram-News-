import React, { useState, useEffect } from 'react';
import { Article, Advertisement } from '../types';
import { AdBanner } from './AdBanner';
import { Sidebar } from './Sidebar';
import { formatBengaliDate, calculateReadingTime } from '../utils/bengaliDate';
import { api } from '../services/api';
import { 
  Clock, 
  Eye, 
  Share2, 
  Facebook, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Tag, 
  ChevronRight,
  MessageCircle
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
  trendingArticles: Article[];
  ads: Advertisement[];
  onArticleClick: (article: Article) => void;
  onCategoryClick: (slug: string) => void;
  onTagClick: (tag: string) => void;
  onHomeClick: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles,
  trendingArticles,
  ads,
  onArticleClick,
  onCategoryClick,
  onTagClick,
  onHomeClick
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg' | 'text-xl'>('text-lg');
  const [sharesCount, setSharesCount] = useState(article.shares || 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSharesCount(article.shares || 0);
  }, [article.id]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      api.trackShare(article.id, 'copy');
      setSharesCount(prev => prev + 1);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleFacebookShare = () => {
    api.trackShare(article.id, 'facebook');
    setSharesCount(prev => prev + 1);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    api.trackShare(article.id, 'whatsapp');
    setSharesCount(prev => prev + 1);
    const text = `${article.title} - ${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleMessengerShare = () => {
    api.trackShare(article.id, 'messenger');
    setSharesCount(prev => prev + 1);
    const url = `fb-messenger://share/?link=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-200">
        <button onClick={onHomeClick} className="hover:text-red-600 transition cursor-pointer">
          হোম
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <button 
          onClick={() => onCategoryClick(article.categorySlug)}
          className="hover:text-red-600 font-medium transition cursor-pointer"
        >
          {article.categoryName}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-700 font-semibold truncate max-w-xs md:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Article Top Advertisement */}
      <AdBanner location="article_top" ads={ads} className="mb-6" />

      {/* Main Grid: Article Body (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-lg border border-gray-200/80 p-6 md:p-8 shadow-xs">
          {/* Category Badge & Live stats */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={() => onCategoryClick(article.categorySlug)}
              className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              {article.categoryName}
            </button>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article.views} পঠিত
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                {sharesCount} শেয়ার
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 font-bangla-serif leading-tight">
            {article.title}
          </h1>

          {/* Subheadline if exists */}
          {article.subtitle && (
            <h2 className="text-base sm:text-lg text-gray-700 font-medium mt-3 leading-relaxed border-l-4 border-red-600 pl-3.5">
              {article.subtitle}
            </h2>
          )}

          {/* Author & Publish Time info */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 my-5 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <img 
                src={article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
                alt={article.authorName} 
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <span className="font-bold text-sm text-gray-900 block font-bangla-serif">
                  {article.authorName}
                </span>
                <span className="text-xs text-gray-500">
                  {article.authorDesignation || 'কুড়িগ্রাম জেলা প্রতিনিধি'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                প্রকাশ: {formatBengaliDate(article.publishedAt)}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                {calculateReadingTime(article.content)}
              </span>
            </div>
          </div>

          {/* Social Share & Font Size Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200/80">
            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-red-600" /> শেয়ার:
              </span>
              <button
                onClick={handleFacebookShare}
                className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
                title="ফেসবুক শেয়ার"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="p-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                title="হোয়াটসঅ্যাপ শেয়ার"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={handleMessengerShare}
                className="p-2 rounded bg-sky-600 text-white hover:bg-sky-700 transition cursor-pointer shadow-xs"
                title="মেসেঞ্জার শেয়ার"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded font-medium transition cursor-pointer ${
                  copied ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                title="লিংক কপি করুন"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি লিংক'}</span>
              </button>
            </div>

            {/* Reading preferences: Font Size & Print */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">হরফ:</span>
              <button
                onClick={() => setFontSizeClass('text-base')}
                className={`px-2 py-1 text-xs rounded border transition cursor-pointer ${
                  fontSizeClass === 'text-base' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                ছোট
              </button>
              <button
                onClick={() => setFontSizeClass('text-lg')}
                className={`px-2 py-1 text-xs rounded border transition cursor-pointer ${
                  fontSizeClass === 'text-lg' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                স্বাভাবিক
              </button>
              <button
                onClick={() => setFontSizeClass('text-xl')}
                className={`px-2 py-1 text-xs rounded border transition cursor-pointer ${
                  fontSizeClass === 'text-xl' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                বড়
              </button>
              <button
                onClick={handlePrint}
                className="p-1.5 ml-2 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition cursor-pointer"
                title="প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <figure className="mb-6 overflow-hidden rounded bg-gray-100 border border-gray-200">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
            {article.imageCaption && (
              <figcaption className="p-2.5 text-xs text-center text-gray-500 bg-gray-50 border-t border-gray-100 italic">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>

          {/* Article Full Content (Sanitized Rich Text) */}
          <div 
            className={`article-prose ${fontSizeClass}`}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Middle Advertisement */}
          <AdBanner location="article_mid" ads={ads} className="my-8" />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-gray-200">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-red-600" /> সম্পর্কিত বিষয়:
              </span>
              {article.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => onTagClick(tag)}
                  className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 px-3 py-1 rounded transition border border-gray-200 cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Author Profile Box */}
          <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img 
              src={article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
              alt={article.authorName} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div className="text-center sm:text-left">
              <span className="text-xs text-red-600 font-bold uppercase tracking-wider">লেখক পরিচিতি</span>
              <h3 className="text-base font-bold text-gray-900 font-bangla-serif mt-0.5">{article.authorName}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {article.authorDesignation || 'কুড়িগ্রাম নিউজ সাংবাদিক ফোরাম'}। দেশ ও জাতির কল্যাণে সত্যনিষ্ঠ তথ্যানুসন্ধানে নিবেদিতপ্রাণ।
              </p>
            </div>
          </div>

          {/* Article Bottom Advertisement */}
          <AdBanner location="article_bottom" ads={ads} className="mt-8" />

          {/* Related Articles in Same Category */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-6 border-t-2 border-red-600">
              <h3 className="text-xl font-bold font-bangla-serif text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
                সম্পর্কিত আরও খবর
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedArticles.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onArticleClick(item)}
                    className="group cursor-pointer bg-white rounded-lg p-3 border border-gray-200/80 hover:border-red-300 hover:shadow-xs transition"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded bg-gray-100 mb-2">
                      <img 
                        src={item.featuredImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="text-xs font-bold font-bangla-serif text-gray-800 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1.5 block">
                      {formatBengaliDate(item.publishedAt).split(',')[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4">
          <Sidebar 
            trendingArticles={trendingArticles} 
            ads={ads} 
            onArticleClick={onArticleClick} 
          />
        </div>
      </div>
    </article>
  );
};
