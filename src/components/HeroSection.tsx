import React from 'react';
import { Article } from '../types';
import { getTimeAgoBengali } from '../utils/bengaliDate';
import { Clock, Eye } from 'lucide-react';

interface HeroSectionProps {
  leadArticle?: Article;
  subArticles?: Article[];
  topArticles?: Article[];
  onArticleClick: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadArticle,
  subArticles,
  topArticles,
  onArticleClick
}) => {
  const sideArticles = subArticles || topArticles || [];
  if (!leadArticle) return null;

  // Accent colors for editorial cards as defined in the theme
  const accentBorders = [
    { border: 'border-l-4 border-blue-600', text: 'text-blue-600' },
    { border: 'border-l-4 border-emerald-600', text: 'text-emerald-600' },
    { border: 'border-l-4 border-amber-500', text: 'text-amber-600' },
    { border: 'border-l-4 border-red-600', text: 'text-red-600' },
  ];

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Story (7 cols on lg) - Editorial Vignette Banner */}
        <div className="lg:col-span-7 flex flex-col">
          <div 
            onClick={() => onArticleClick(leadArticle)}
            className="group cursor-pointer bg-white p-2 rounded-lg shadow-sm border border-gray-200/80 hover:border-gray-300 transition-all duration-300 flex-1 flex flex-col"
          >
            {/* Lead Media Container with Vignette Gradient Overlay */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded overflow-hidden bg-gray-200">
              <img 
                src={leadArticle.featuredImage} 
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-5 sm:p-7">
                <span className="bg-red-600 text-white text-[10px] uppercase px-2.5 py-1 w-fit mb-2.5 font-bold tracking-wider rounded-xs shadow-sm">
                  {leadArticle.categoryName || 'শীর্ষ সংবাদ'}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2 hover:text-red-200 transition font-bangla-serif">
                  {leadArticle.title}
                </h2>
                {leadArticle.summary && (
                  <p className="text-gray-200 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {leadArticle.summary}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-300 mt-3 pt-2 border-t border-white/20">
                  <span className="font-semibold text-white">{leadArticle.authorName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {getTimeAgoBengali(leadArticle.publishedAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {leadArticle.views}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stories (5 cols on lg) - Distinct Editorial Accent Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
            <h3 className="text-base font-bold font-bangla-serif text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
              গুরুত্বপূর্ণ খবর
            </h3>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Top Stories
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 flex-1">
            {sideArticles.slice(0, 3).map((art, idx) => {
              const accent = accentBorders[idx % accentBorders.length];
              return (
                <div 
                  key={art.id}
                  onClick={() => onArticleClick(art)}
                  className={`group cursor-pointer bg-white p-3.5 rounded-lg shadow-sm border border-gray-200/80 ${accent.border} hover:shadow-md transition flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${accent.text}`}>
                        {art.categoryName}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgoBengali(art.publishedAt)}
                      </span>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-[15px] leading-snug text-gray-900 font-bangla-serif group-hover:text-red-600 transition line-clamp-2">
                          {art.title}
                        </h4>
                        {art.summary && (
                          <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-normal">
                            {art.summary}
                          </p>
                        )}
                      </div>

                      {art.featuredImage && (
                        <div className="w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden rounded bg-gray-100">
                          <img 
                            src={art.featuredImage} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

