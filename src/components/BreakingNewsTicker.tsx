import React, { useState, useEffect } from 'react';
import { BreakingNews } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BreakingNewsTickerProps {
  breakingList?: BreakingNews[];
  items?: BreakingNews[];
  enabled?: boolean;
  onSelectBreaking?: (link?: string, articleId?: string) => void;
  onItemClick?: (item: BreakingNews) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  breakingList,
  items,
  enabled = true,
  onSelectBreaking,
  onItemClick
}) => {
  const list = items || breakingList || [];
  const activeItems = list.filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [activeItems.length, isPaused]);

  if (!enabled || !activeItems.length) return null;

  const currentItem = activeItems[currentIndex] || activeItems[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const handleClick = () => {
    if (onItemClick) {
      onItemClick(currentItem);
    } else if (onSelectBreaking) {
      onSelectBreaking(currentItem.link, currentItem.articleId);
    }
  };

  return (
    <div className="w-full bg-red-600 text-white py-2 px-4 sm:px-6 flex items-center overflow-hidden shadow-xs select-none">
      {/* Editorial High-contrast White Badge with Italic/Uppercase text */}
      <span className="whitespace-nowrap font-bold text-xs sm:text-sm bg-white text-red-600 px-3 py-0.5 mr-3 sm:mr-4 shadow-xs italic uppercase tracking-wider rounded-xs shrink-0 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping"></span>
        ব্রেকিং নিউজ
      </span>

      {/* Dynamic News Headline */}
      <div 
        className="flex-1 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={handleClick}
      >
        <p className="text-xs sm:text-sm font-medium text-white truncate hover:underline transition">
          {currentItem.title}
        </p>
      </div>

      {/* Controls & Pagination Counter */}
      <div className="flex items-center gap-1 shrink-0 ml-3 text-white/90">
        <span className="text-[11px] font-medium hidden sm:inline mr-1.5 text-red-100">
          {currentIndex + 1} / {activeItems.length}
        </span>
        <button
          onClick={handlePrev}
          className="p-1 rounded bg-red-700 hover:bg-red-800 transition"
          title="পূর্ববর্তী"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleNext}
          className="p-1 rounded bg-red-700 hover:bg-red-800 transition"
          title="পরবর্তী"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

