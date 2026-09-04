import React from 'react';
import { Article } from '../types';
import { getTimeAgoBengali } from '../utils/bengaliDate';
import { ArrowRight, Clock } from 'lucide-react';

interface CategoryBlockProps {
  title: string;
  categorySlug: string;
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onViewCategory: (slug: string) => void;
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({
  title,
  categorySlug,
  articles,
  onArticleClick,
  onViewCategory
}) => {
  if (!articles.length) return null;

  const lead = articles[0];
  const others = articles.slice(1, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-5 shadow-xs mb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2.5 mb-4">
        <h3 className="text-xl font-black font-bangla-serif text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
          {title}
        </h3>
        <button
          onClick={() => onViewCategory(categorySlug)}
          className="text-xs uppercase tracking-wider font-bold text-gray-600 hover:text-red-600 flex items-center gap-1 transition group cursor-pointer"
        >
          <span>আরও দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Category Lead */}
        {lead && (
          <div 
            onClick={() => onArticleClick(lead)}
            className="md:col-span-6 group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative overflow-hidden aspect-[16/10] rounded bg-gray-100 mb-3">
                <img 
                  src={lead.featuredImage} 
                  alt={lead.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
              <h4 className="text-base sm:text-lg font-bold font-bangla-serif text-gray-900 group-hover:text-red-600 transition leading-snug">
                {lead.title}
              </h4>
              {lead.summary && (
                <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {lead.summary}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {getTimeAgoBengali(lead.publishedAt)}
              </span>
              <span>•</span>
              <span className="text-gray-600 font-medium">{lead.authorName}</span>
            </div>
          </div>
        )}

        {/* Category Side List */}
        <div className="md:col-span-6 flex flex-col justify-between divide-y divide-gray-100">
          {others.map((art) => (
            <div 
              key={art.id}
              onClick={() => onArticleClick(art)}
              className="py-2.5 first:pt-0 last:pb-0 group cursor-pointer flex gap-3 items-center"
            >
              <div className="w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-100">
                <img 
                  src={art.featuredImage} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs sm:text-sm font-semibold font-bangla-serif text-gray-800 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                  {art.title}
                </h5>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {getTimeAgoBengali(art.publishedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

