import React from 'react';
import { Article } from '../types';
import { getTimeAgoBengali } from '../utils/bengaliDate';
import { Clock, User } from 'lucide-react';

interface LatestNewsProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const LatestNews: React.FC<LatestNewsProps> = ({ articles, onArticleClick }) => {
  const latestList = articles.slice(0, 8);

  if (!latestList.length) return null;

  return (
    <section className="my-8">
      {/* Editorial Section Header */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
          <h2 className="text-xl md:text-2xl font-black font-bangla-serif text-gray-900">
            সর্বশেষ সংবাদ
          </h2>
        </div>
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
          Latest Updates
        </span>
      </div>

      {/* 4-column cards grid with clean editorial styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestList.map((art) => (
          <div
            key={art.id}
            onClick={() => onArticleClick(art)}
            className="group cursor-pointer bg-white rounded-lg border border-gray-200/80 hover:border-red-300 hover:shadow-md p-3 transition flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] rounded overflow-hidden bg-gray-100 mb-2.5">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs tracking-wider shadow-xs">
                  {art.categoryName}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-[15px] font-bold font-bangla-serif text-gray-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                {art.title}
              </h3>
            </div>

            {/* Meta bar */}
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1 text-gray-600 font-medium truncate max-w-[110px]">
                <User className="w-3 h-3 text-gray-400 shrink-0" />
                {art.authorName}
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-gray-400" />
                {getTimeAgoBengali(art.publishedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

