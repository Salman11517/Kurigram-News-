import React, { useState } from 'react';
import { User } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Layers, 
  Flame, 
  TrendingUp, 
  Star, 
  Image as ImageIcon, 
  Users2, 
  Megaphone, 
  Globe, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  user: User;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onViewSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  currentTab,
  onTabChange,
  onLogout,
  onViewSite,
  children
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'articles', label: 'সকল সংবাদ', icon: FileText },
    { id: 'add-article', label: 'সংবাদ প্রকাশ করুন', icon: PlusCircle, highlight: true },
    { id: 'categories', label: 'ক্যাটাগরি', icon: Layers },
    { id: 'breaking', label: 'ব্রেকিং নিউজ', icon: Flame },
    { id: 'trending', label: 'ট্রেন্ডিং নিউজ', icon: TrendingUp },
    { id: 'featured', label: 'ফিচার্ড নিউজ', icon: Star },
    { id: 'media', label: 'মিডিয়া লাইব্রেরি', icon: ImageIcon },
    { id: 'authors', label: 'রিপোর্টার / লেখক', icon: Users2 },
    { id: 'advertisements', label: 'বিজ্ঞাপন ব্যবস্থাপনা', icon: Megaphone },
    { id: 'seo', label: 'এসইও সেটিংস', icon: Globe },
    { id: 'settings', label: 'সাইট সেটিংস', icon: Settings },
    { id: 'users', label: 'ইউজার ও রোলস', icon: ShieldCheck },
    { id: 'analytics', label: 'অ্যানালিটিক্স', icon: BarChart3 },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">সুপার অ্যাডমিন</span>;
      case 'EDITOR':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">সম্পাদক</span>;
      default:
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">রিপোর্টার</span>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-neutral-900 text-white p-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-lg font-bangla-serif">
            কু
          </div>
          <span className="font-bold font-bangla-serif text-base">কুড়িগ্রাম নিউজ অ্যাডমিন</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewSite}
            className="p-1.5 bg-neutral-800 rounded text-neutral-300 hover:text-white"
            title="ওয়েবসাইট দেখুন"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 bg-neutral-800 rounded text-neutral-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-neutral-300 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col justify-between shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top brand */}
        <div>
          <div className="p-5 border-b border-neutral-800 hidden md:flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-red-600 text-white rounded-xl flex items-center justify-center font-bangla-serif text-xl font-black shadow-md">
                কু
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-bangla-serif leading-tight">
                  কুড়িগ্রাম নিউজ
                </h2>
                <span className="text-[10px] text-neutral-400 font-medium">অ্যাডমিন কন্ট্রোল প্যানেল</span>
              </div>
            </div>
            <button
              onClick={onViewSite}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition"
              title="ওয়েবসাইট দেখুন"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* User Info pill */}
          <div className="p-4 mx-3 my-3 bg-neutral-800/80 rounded-xl border border-neutral-700/60 flex items-center gap-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border border-neutral-600"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate font-bangla-serif">{user.name}</div>
              <div className="mt-0.5">{getRoleBadge(user.role)}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'bg-red-600 text-white shadow-sm'
                      : item.highlight
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : item.highlight ? 'text-red-400' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={onViewSite}
            className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইট দেখুন</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
