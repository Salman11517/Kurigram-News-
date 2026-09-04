import React from 'react';
import { Article, Category, Advertisement } from '../types';
import { Sidebar } from './Sidebar';
import { AdBanner } from './AdBanner';
import { getTimeAgoBengali, toBengaliNumber } from '../utils/bengaliDate';
import { ChevronRight, Clock, User } from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  articles: Article[];
  trendingArticles: Article[];
  ads: Advertisement[];
  onArticleClick: (article: Article) => void;
  onHomeClick: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  articles,
  trendingArticles,
  ads,
  onArticleClick,
  onHomeClick
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-2 border-b border-gray-200">
        <button onClick={onHomeClick} className="hover:text-red-600 transition cursor-pointer">
          হোম
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-bold">
          {category.name}
        </span>
      </nav>

      {/* Category Title Header */}
      <div className="bg-white rounded-lg border border-gray-200/80 p-5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-red-600">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 font-bangla-serif">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="text-xs text-gray-500 mt-1.5">
              {category.description}
            </p>
          )}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1 rounded self-start sm:self-auto">
          মোট {toBengaliNumber(articles.length)} টি প্রতিবেদন
        </span>
      </div>

      {/* Main Grid: Articles (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
              <p className="text-base font-semibold">এই বিভাগে বর্তমানে কোনো প্রকাশিত সংবাদ নেই।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onArticleClick(art)}
                  className="group cursor-pointer bg-white rounded-lg border border-gray-200/80 hover:border-red-300 hover:shadow-md p-4 shadow-xs transition flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <div className="w-full sm:w-48 aspect-[16/10] overflow-hidden rounded bg-gray-100 shrink-0">
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold font-bangla-serif text-gray-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {art.summary || art.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {getTimeAgoBengali(art.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <User className="w-3 h-3 text-gray-400" />
                        {art.authorName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar
            trendingArticles={trendingArticles}
            ads={ads}
            onArticleClick={onArticleClick}
          />
        </div>
      </div>
    </div>
  );
};
