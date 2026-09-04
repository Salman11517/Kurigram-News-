import React from 'react';
import { Advertisement, AdLocation } from '../types';

interface AdBannerProps {
  location: AdLocation;
  ads: Advertisement[];
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ location, ads, className = '' }) => {
  const ad = ads.find(a => a.location === location && a.active);
  if (!ad) return null;

  return (
    <div className={`w-full overflow-hidden my-4 text-center ${className}`}>
      <div className="inline-block text-[11px] text-neutral-400 font-medium uppercase tracking-wider mb-1">
        বিজ্ঞাপন
      </div>
      {ad.type === 'image' && ad.imageUrl && (
        <a 
          href={ad.targetUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block group overflow-hidden rounded-lg shadow-sm border border-neutral-200 transition hover:opacity-95"
        >
          <img 
            src={ad.imageUrl} 
            alt={ad.title} 
            className="w-full h-auto max-h-[140px] md:max-h-[180px] object-cover mx-auto group-hover:scale-[1.01] transition duration-300"
            loading="lazy"
          />
        </a>
      )}

      {ad.type === 'html' && ad.htmlCode && (
        <div 
          className="rounded-lg overflow-hidden border border-neutral-200" 
          dangerouslySetInnerHTML={{ __html: ad.htmlCode }} 
        />
      )}

      {ad.type === 'adsense' && (
        <div className="p-8 bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-500 text-sm flex items-center justify-center">
          <span>Google AdSense Slot ({location})</span>
        </div>
      )}
    </div>
  );
};
