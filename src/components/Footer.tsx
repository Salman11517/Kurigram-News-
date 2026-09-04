import React from 'react';
import { SiteSettings, Category, Advertisement } from '../types';
import { AdBanner } from './AdBanner';
import { 
  Facebook, 
  Youtube, 
  Twitter,
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Megaphone
} from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  categories: Category[];
  ads?: Advertisement[];
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  ads = [],
  onNavigate
}) => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 pt-10 pb-6 border-t-2 border-red-600 mt-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Footer Ad banner if present */}
        {ads.length > 0 && (
          <AdBanner location="footer" ads={ads} className="mb-8" />
        )}

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-gray-800">
          {/* Column 1: Brand & About (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="cursor-pointer select-none group"
            >
              <h3 className="text-3xl font-black text-red-600 font-bangla-serif tracking-tight leading-none group-hover:opacity-90 transition">
                {settings.siteName}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 mt-1.5 font-semibold">
                {settings.siteSlogan || 'সত্যের সন্ধানে অবিরাম'}
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {settings.description || 'কুড়িগ্রাম ও উত্তরাঞ্চলের প্রান্তিক জনপদসহ সারা দেশের সর্বশেষ সত্য ও বস্তুনিষ্ঠ সংবাদ সবার আগে পৌঁছে দিতে আমরা প্রতিজ্ঞাবদ্ধ।'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={settings.socialLinks?.facebook || 'https://facebook.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks?.twitter || 'https://twitter.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks?.youtube || 'https://youtube.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={settings.socialLinks?.whatsapp || 'https://whatsapp.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 hover:bg-red-600 hover:border-red-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                title="WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white font-bangla-serif mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-xs"></span>
              বিভাগসমূহ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate(`/category/${cat.slug}`)}
                  className="text-left hover:text-red-400 py-1 transition truncate cursor-pointer"
                >
                  • {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Contact & Editorial (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white font-bangla-serif mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-xs"></span>
              যোগাযোগ ও সম্পাদকীয়
            </h4>
            <div className="text-xs text-gray-300 space-y-2">
              <p>
                <span className="text-gray-500 block">ভারপ্রাপ্ত সম্পাদক:</span>
                <strong className="text-white font-medium">{settings.editorName || 'সম্পাদক ও প্রকাশক'}</strong>
              </p>
              <p>
                <span className="text-gray-500 block">প্রকাশক:</span>
                <strong className="text-white font-medium">{settings.publisherName || 'কুড়িগ্রাম মিডিয়া পাবলিকেশন্স'}</strong>
              </p>
              <div className="flex items-start gap-2 pt-1 text-gray-400">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address || 'কুড়িগ্রাম সদর, কুড়িগ্রাম, রংপুর বিভাগ'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.phone || '+৮৮০১৭০০০০০০০০'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{settings.email || 'editor@kurigramnews.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar - Matching Design Aesthetic */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-wider text-gray-400">
          <p className="text-center sm:text-left">
            {settings.footerText || '© ২০২৬ কুড়িগ্রাম নিউজ। সর্বস্বত্ব সংরক্ষিত।'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <button 
              onClick={() => onNavigate('/about')}
              className="hover:text-white transition cursor-pointer"
            >
              আমাদের সম্পর্কে
            </button>
            <span className="text-gray-700">•</span>
            <button 
              onClick={() => onNavigate('/privacy')}
              className="hover:text-white transition cursor-pointer"
            >
              গোপনীয়তা নীতি
            </button>
            <span className="text-gray-700">•</span>
            <button 
              onClick={() => onNavigate('/terms')}
              className="hover:text-white transition cursor-pointer"
            >
              ব্যবহারের শর্তাবলী
            </button>
            <span className="text-gray-700">•</span>
            <button 
              onClick={() => onNavigate('/advertise')}
              className="hover:text-white transition text-red-400 flex items-center gap-1 cursor-pointer font-bold"
            >
              <Megaphone className="w-3.5 h-3.5" />
              বিজ্ঞাপন দিন
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

