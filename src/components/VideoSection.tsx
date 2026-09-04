import React, { useState } from 'react';
import { Article } from '../types';
import { Play, X, Video } from 'lucide-react';

interface VideoSectionProps {
  videoArticles: Article[];
  onArticleClick: (article: Article) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoArticles, onArticleClick }) => {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  if (!videoArticles.length) return null;

  return (
    <section className="my-8 bg-gray-900 text-white rounded-lg p-6 shadow-sm border-t-2 border-red-600">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="text-xl md:text-2xl font-black font-bangla-serif text-white">ভিডিও সংবাদ</h3>
        </div>
        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">সরাসরি মাঠের প্রতিবেদন</span>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videoArticles.map((art) => (
          <div 
            key={art.id}
            onClick={() => {
              if (art.videoUrl) {
                setActiveVideoModal(art.videoUrl);
              } else {
                onArticleClick(art);
              }
            }}
            className="group cursor-pointer bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/60 hover:border-red-500/80 transition flex flex-col justify-between"
          >
            {/* Thumbnail with overlay play button */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <img 
                src={art.featuredImage} 
                alt={art.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition">
                <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-gray-200">
                ভিডিও
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="text-sm md:text-base font-bold font-bangla-serif text-gray-100 group-hover:text-red-400 transition leading-snug line-clamp-2">
                {art.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {art.summary || art.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/9] w-full">
              <iframe
                src={activeVideoModal}
                title="ভিডিও প্লেয়ার"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
