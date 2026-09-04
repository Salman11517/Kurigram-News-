import React, { useState, useEffect } from 'react';
import { formatBengaliDate, toBengaliNumber } from '../utils/bengaliDate';
import { SiteSettings, Category, Advertisement } from '../types';
import { AdBanner } from './AdBanner';
import { 
  Search, 
  Menu, 
  X, 
  CloudSun, 
  Facebook, 
  Youtube, 
  Twitter,
  Send, 
  LogIn, 
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  settings: SiteSettings;
  categories: Category[];
  currentRoute?: string;
  onNavigate?: (route: string) => void;
  ads?: Advertisement[];
  onOpenSearch?: () => void;
  onSearchClick?: () => void;
  onAdminClick?: () => void;
  onCategoryClick?: (slug: string) => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  categories,
  currentRoute = '/',
  onNavigate,
  ads = [],
  onOpenSearch,
  onSearchClick,
  onAdminClick,
  onCategoryClick,
  onHomeClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const triggerSearch = () => {
    if (onSearchClick) {
      onSearchClick();
    } else if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const handleGoHome = () => {
    if (onHomeClick) {
      onHomeClick();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  const handleSelectCategory = (slug: string) => {
    if (onCategoryClick) {
      onCategoryClick(slug);
    } else if (onNavigate) {
      onNavigate(`/category/${slug}`);
    }
    setMobileMenuOpen(false);
  };

  const handleAdmin = () => {
    if (onAdminClick) {
      onAdminClick();
    } else if (onNavigate) {
      onNavigate('/admin');
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setCurrentDateStr(formatBengaliDate());
    const interval = setInterval(() => {
      setCurrentDateStr(formatBengaliDate());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white text-gray-900 font-sans border-b border-gray-200">
      {/* 1. Top micro bar: Editorial Aesthetic */}
      <div className="bg-gray-900 text-white px-4 sm:px-6 py-2 flex flex-wrap justify-between items-center text-xs border-b border-gray-800">
        {/* Left: Bengali Date & Weather */}
        <div className="flex items-center gap-4 text-gray-300">
          <span className="font-medium text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
            {currentDateStr || 'শুক্রবার, ৪ সেপ্টেম্বর ২০২৬'}
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="flex items-center gap-1 text-gray-300 font-medium">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            কুড়িগ্রাম, {toBengaliNumber(29)}° সে.
          </span>
        </div>

        {/* Right: Editorial links */}
        <div className="flex items-center gap-4 uppercase tracking-widest font-semibold text-[11px] text-gray-300">
          <button
            onClick={() => onNavigate ? onNavigate('/epaper') : handleGoHome()}
            className="hover:text-red-400 transition hidden sm:flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-red-500" />
            <span>English Edition</span>
          </button>
          <span className="hidden sm:inline text-gray-600">/</span>
          <button
            onClick={() => onNavigate ? onNavigate('/epaper') : handleGoHome()}
            className="hover:text-red-400 transition cursor-pointer"
          >
            Archive
          </button>
          <span className="text-gray-600">/</span>
          <button
            onClick={handleAdmin}
            className="hover:text-red-400 text-red-500 font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <LogIn className="w-3 h-3" />
            <span>Login</span>
          </button>
        </div>
      </div>

      {/* 2. Masthead: 3-column Editorial layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-7">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left Column (w-1/3 on md): Social Icons & Edition */}
          <div className="w-full md:w-1/3 flex items-center justify-center md:justify-start gap-4 text-gray-500 text-lg">
            <a 
              href={settings.socialLinks?.facebook || 'https://facebook.com'} 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-300 transition"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href={settings.socialLinks?.twitter || 'https://twitter.com'} 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-300 transition"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href={settings.socialLinks?.youtube || 'https://youtube.com'} 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-300 transition"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href={settings.socialLinks?.whatsapp || 'https://whatsapp.com'} 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-300 transition"
              title="WhatsApp"
            >
              <Send className="w-4 h-4" />
            </a>
          </div>

          {/* Center Column: Signature Brand Typography (serif, red-600, elegant tagline) */}
          <div 
            onClick={handleGoHome}
            className="w-full md:w-1/3 text-center cursor-pointer select-none group"
          >
            <h1 
              className="text-4xl md:text-5xl font-black text-red-600 tracking-tight leading-none group-hover:opacity-90 transition font-bangla-serif"
            >
              {settings.siteName || 'কুড়িগ্রাম নিউজ'}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 mt-1.5 font-semibold">
              {settings.siteSlogan || 'সত্যের সন্ধানে অবিরাম'}
            </p>
          </div>

          {/* Right Column (w-1/3 on md): Underline Search box */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end items-center gap-2">
            <div 
              onClick={triggerSearch}
              className="relative w-full max-w-[220px] flex items-center border-b border-gray-300 hover:border-red-600 py-1 text-sm cursor-pointer transition"
            >
              <input 
                type="text" 
                placeholder="অনুসন্ধান..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') triggerSearch();
                }}
                className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent px-1 cursor-pointer"
                readOnly
              />
              <Search className="w-4 h-4 text-gray-400 hover:text-red-600 transition shrink-0 mr-1" />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-red-600 transition"
              title="মেন্যু"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Top Banner Ad if present */}
        {ads.length > 0 && (
          <div className="w-full mt-3 hidden md:block">
            <AdBanner location="top_banner" ads={ads} className="my-0" />
          </div>
        )}
      </div>

      {/* 3. Navigation Bar: Clean White with Red Active Indicators */}
      <nav className="bg-white border-y border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Desktop Categories */}
          <ul className="hidden lg:flex justify-center items-center gap-7 xl:gap-8 py-3 text-[14px] font-bold text-gray-800 uppercase tracking-wide">
            <li>
              <button
                onClick={handleGoHome}
                className={`transition cursor-pointer ${
                  currentRoute === '/' 
                    ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold' 
                    : 'hover:text-red-600'
                }`}
              >
                প্রচ্ছদ
              </button>
            </li>
            {categories.map((cat) => {
              const active = currentRoute === `/category/${cat.slug}`;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`transition cursor-pointer whitespace-nowrap ${
                      active 
                        ? 'text-red-600 border-b-2 border-red-600 pb-1 font-extrabold' 
                        : 'hover:text-red-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile Horizontal scrollable category bar */}
          <div className="lg:hidden flex items-center gap-3 py-2.5 overflow-x-auto scrollbar-none text-xs font-bold uppercase text-gray-700">
            <button
              onClick={handleGoHome}
              className={`whitespace-nowrap px-2 py-1 rounded-sm ${
                currentRoute === '/' 
                  ? 'text-red-600 bg-red-50 font-extrabold' 
                  : 'hover:text-red-600'
              }`}
            >
              প্রচ্ছদ
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`whitespace-nowrap px-2 py-1 rounded-sm ${
                  currentRoute === `/category/${cat.slug}`
                    ? 'text-red-600 bg-red-50 font-extrabold'
                    : 'hover:text-red-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Dropdown drawer if hamburger opened */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 shadow-lg animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                onClick={handleGoHome}
                className="text-left px-3 py-2 rounded font-semibold text-red-600 bg-red-50"
              >
                প্রচ্ছদ (Home)
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="text-left px-3 py-2 rounded text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{settings.siteName}</span>
              <button
                onClick={handleAdmin}
                className="text-red-600 font-bold hover:underline"
              >
                অ্যাডমিন লগইন &rarr;
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

