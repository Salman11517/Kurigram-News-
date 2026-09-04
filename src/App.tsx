import React, { useState, useEffect, useCallback } from 'react';
import { 
  Article, 
  Category, 
  BreakingNewsItem, 
  Advertisement, 
  SiteSettings, 
  User, 
  DashboardStats,
  Author,
  MediaItem
} from './types';
import { api } from './services/api';

// Public Components
import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { HeroSection } from './components/HeroSection';
import { LatestNews } from './components/LatestNews';
import { CategoryBlock } from './components/CategoryBlock';
import { Sidebar } from './components/Sidebar';
import { VideoSection } from './components/VideoSection';
import { PhotoSection } from './components/PhotoSection';
import { AdBanner } from './components/AdBanner';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoryView } from './components/CategoryView';
import { SearchModal } from './components/SearchModal';
import { StaticPage } from './components/StaticPage';
import { Footer } from './components/Footer';

// Admin Components
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminArticles } from './components/Admin/AdminArticles';
import { AdminArticleEditor } from './components/Admin/AdminArticleEditor';
import { AdminBreaking } from './components/Admin/AdminBreaking';
import { AdminTrending } from './components/Admin/AdminTrending';
import { AdminCategories } from './components/Admin/AdminCategories';
import { AdminAuthors } from './components/Admin/AdminAuthors';
import { AdminAds } from './components/Admin/AdminAds';
import { AdminMedia } from './components/Admin/AdminMedia';
import { AdminSettings } from './components/Admin/AdminSettings';
import { AdminUsers } from './components/Admin/AdminUsers';
import { AdminAnalytics } from './components/Admin/AdminAnalytics';

export default function App() {
  // Global State
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakingItems, setBreakingItems] = useState<BreakingNewsItem[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Navigation & View Routing State
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category' | 'static' | 'admin'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [staticPageType, setStaticPageType] = useState<'about' | 'privacy' | 'terms' | 'advertise' | 'contact'>('about');

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Admin State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

  // Fetch Public Data
  const loadData = useCallback(async () => {
    try {
      const [artRes, catRes, brkRes, adsRes, setRes, autRes, medRes] = await Promise.all([
        api.getArticles(),
        api.getCategories(),
        api.getBreakingNews(),
        api.getAds(),
        api.getSettings(),
        api.getAuthors(),
        api.getMedia()
      ]);

      setArticles(artRes);
      setCategories(catRes);
      setBreakingItems(brkRes);
      setAds(adsRes);
      setSettings(setRes);
      setAuthors(autRes);
      setMediaList(medRes);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Admin Stats and users
  const loadAdminData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.getStats(),
        api.getUsers()
      ]);
      setStats(statsRes);
      setUsersList(usersRes);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const user = api.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Check URL hash or path for direct routing (e.g., #admin)
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, [loadData]);

  useEffect(() => {
    if (currentView === 'admin' && currentUser) {
      loadAdminData();
    }
  }, [currentView, currentUser, loadAdminData]);

  // Handle SEO Title & Metadata dynamically
  useEffect(() => {
    if (!settings) return;

    if (currentView === 'article' && selectedArticle) {
      document.title = `${selectedArticle.title} | ${settings.siteName}`;
    } else if (currentView === 'category' && selectedCategory) {
      document.title = `${selectedCategory.name} - সংবাদ | ${settings.siteName}`;
    } else if (currentView === 'admin') {
      document.title = `অ্যাডমিন কন্ট্রোল প্যানেল | ${settings.siteName}`;
    } else {
      document.title = `${settings.siteName} - ${settings.siteSlogan}`;
    }
  }, [currentView, selectedArticle, selectedCategory, settings]);

  // Navigation handlers
  const handleArticleClick = async (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      await api.trackView(article.id);
      // update local view count
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: a.views + 1 } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug);
    if (cat) {
      setSelectedCategory(cat);
      setCurrentView('category');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaticNavigate = (route: string) => {
    if (route.startsWith('/category/')) {
      const slug = route.replace('/category/', '');
      handleCategoryClick(slug);
    } else if (route === '/about') {
      setStaticPageType('about');
      setCurrentView('static');
    } else if (route === '/privacy') {
      setStaticPageType('privacy');
      setCurrentView('static');
    } else if (route === '/terms') {
      setStaticPageType('terms');
      setCurrentView('static');
    } else if (route === '/advertise') {
      setStaticPageType('advertise');
      setCurrentView('static');
    } else if (route === '/contact') {
      setStaticPageType('contact');
      setCurrentView('static');
    } else {
      handleHomeClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = async (query: string, category?: string) => {
    setIsSearching(true);
    try {
      const results = await api.getArticles({
        search: query,
        category: category || undefined,
        limit: 25
      });
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Filtered public articles
  const publishedArticles = articles.filter(a => a.status === 'published');
  const trendingArticles = articles.filter(a => a.isTrending);
  const featuredArticles = articles.filter(a => a.isFeatured);
  const leadArticle = featuredArticles[0] || publishedArticles[0];
  const heroSubArticles = (featuredArticles.length > 1 ? featuredArticles.slice(1, 5) : publishedArticles.slice(1, 5));
  const videoArticles = publishedArticles.filter(a => Boolean(a.videoUrl));

  // Category specific subsets
  const getCategoryArticles = (catSlug: string) => 
    publishedArticles.filter(a => a.categorySlug === catSlug);

  // Loading Screen
  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center font-bangla-serif text-3xl font-black mb-4 shadow-xl animate-pulse">
          কু
        </div>
        <h2 className="text-xl font-bold font-bangla-serif">কুড়িগ্রাম নিউজ লোড হচ্ছে...</h2>
        <div className="w-48 h-1 bg-neutral-800 rounded-full mt-4 overflow-hidden">
          <div className="w-full h-full bg-red-600 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN PANEL ROUTE
  // ----------------------------------------------------
  if (currentView === 'admin') {
    if (!currentUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            loadAdminData();
          }}
          onBackToSite={handleHomeClick}
        />
      );
    }

    return (
      <AdminLayout
        user={currentUser}
        currentTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          if (tab === 'add-article') {
            setArticleToEdit(null);
          }
        }}
        onLogout={() => {
          api.logout();
          setCurrentUser(null);
          setCurrentView('home');
        }}
        onViewSite={handleHomeClick}
      >
        {adminTab === 'dashboard' && stats && (
          <AdminDashboard
            stats={stats}
            recentArticles={articles}
            onNavigateTab={(tab) => {
              setAdminTab(tab);
              if (tab === 'add-article') setArticleToEdit(null);
            }}
            onEditArticle={(art) => {
              setArticleToEdit(art);
              setAdminTab('add-article');
            }}
          />
        )}

        {adminTab === 'articles' && (
          <AdminArticles
            articles={articles}
            categories={categories}
            onAddNew={() => {
              setArticleToEdit(null);
              setAdminTab('add-article');
            }}
            onEdit={(art) => {
              setArticleToEdit(art);
              setAdminTab('add-article');
            }}
            onView={(art) => {
              setSelectedArticle(art);
              setCurrentView('article');
            }}
            onArticlesChanged={loadData}
          />
        )}

        {adminTab === 'add-article' && (
          <AdminArticleEditor
            articleToEdit={articleToEdit}
            categories={categories}
            authors={authors}
            mediaList={mediaList}
            onSaved={() => {
              loadData();
              setAdminTab('articles');
            }}
            onCancel={() => setAdminTab('articles')}
          />
        )}

        {adminTab === 'breaking' && (
          <AdminBreaking
            breakingItems={breakingItems}
            settings={settings}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'trending' && (
          <AdminTrending
            articles={articles}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'featured' && (
          <AdminTrending
            articles={articles}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'authors' && (
          <AdminAuthors
            authors={authors}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'advertisements' && (
          <AdminAds
            ads={ads}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'media' && (
          <AdminMedia
            mediaList={mediaList}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'seo' && (
          <AdminSettings
            settings={settings}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onRefresh={loadData}
          />
        )}

        {adminTab === 'users' && (
          <AdminUsers
            users={usersList}
            onRefresh={loadAdminData}
          />
        )}

        {adminTab === 'analytics' && (
          <AdminAnalytics
            articles={articles}
            categories={categories}
          />
        )}
      </AdminLayout>
    );
  }

  // ----------------------------------------------------
  // PUBLIC WEBSITE (Home / Article / Category / Static)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        settings={settings}
        categories={categories}
        onSearchClick={() => setSearchOpen(true)}
        onAdminClick={() => setCurrentView('admin')}
        onCategoryClick={handleCategoryClick}
        onHomeClick={handleHomeClick}
        ads={ads}
      />

      {/* Breaking News Ticker (Below Header) */}
      <BreakingNewsTicker
        items={breakingItems}
        enabled={settings.breakingNewsEnabled}
        onItemClick={(item) => {
          const match = articles.find(a => a.id === item.articleId || a.title === item.title);
          if (match) {
            handleArticleClick(match);
          }
        }}
      />

      {/* Ad: Below Breaking Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
        <AdBanner location="breaking_bottom" ads={ads} />
      </div>

      {/* Dynamic Main Body Content */}
      <main className="flex-grow">
        {/* ARTICLE DETAIL VIEW */}
        {currentView === 'article' && selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            relatedArticles={publishedArticles.filter(
              a => a.categoryId === selectedArticle.categoryId && a.id !== selectedArticle.id
            )}
            trendingArticles={trendingArticles}
            ads={ads}
            onArticleClick={handleArticleClick}
            onCategoryClick={handleCategoryClick}
            onTagClick={(tag) => {
              handleSearchSubmit(tag);
              setSearchOpen(true);
            }}
            onHomeClick={handleHomeClick}
          />
        )}

        {/* CATEGORY VIEW */}
        {currentView === 'category' && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            articles={getCategoryArticles(selectedCategory.slug)}
            trendingArticles={trendingArticles}
            ads={ads}
            onArticleClick={handleArticleClick}
            onHomeClick={handleHomeClick}
          />
        )}

        {/* STATIC PAGES VIEW */}
        {currentView === 'static' && (
          <StaticPage
            page={staticPageType}
            settings={settings}
            onBackHome={handleHomeClick}
          />
        )}

        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* Hero / Lead Story Section */}
            {leadArticle && (
              <HeroSection
                leadArticle={leadArticle}
                subArticles={heroSubArticles}
                onArticleClick={handleArticleClick}
              />
            )}

            {/* Homepage Lead Ad */}
            <AdBanner location="home_lead" ads={ads} />

            {/* Latest News Feed */}
            <LatestNews
              articles={publishedArticles}
              onArticleClick={handleArticleClick}
            />

            {/* Main Content 2-Column: Categories (8 cols) + Sidebar (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category News Blocks (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Kurigram District */}
                <CategoryBlock
                  title="কুড়িগ্রাম ও চরাঞ্চল"
                  categorySlug="kurigram"
                  articles={getCategoryArticles('kurigram')}
                  onArticleClick={handleArticleClick}
                  onViewCategory={handleCategoryClick}
                />

                {/* 2. Bangladesh */}
                <CategoryBlock
                  title="বাংলাদেশ ও জাতীয়"
                  categorySlug="bangladesh"
                  articles={getCategoryArticles('bangladesh')}
                  onArticleClick={handleArticleClick}
                  onViewCategory={handleCategoryClick}
                />

                {/* 3. Politics */}
                <CategoryBlock
                  title="রাজনীতি"
                  categorySlug="politics"
                  articles={getCategoryArticles('politics')}
                  onArticleClick={handleArticleClick}
                  onViewCategory={handleCategoryClick}
                />

                {/* Mid-content Ad */}
                <AdBanner location="article_mid" ads={ads} />

                {/* 4. Sports & International */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CategoryBlock
                      title="খেলাধুলা"
                      categorySlug="sports"
                      articles={getCategoryArticles('sports')}
                      onArticleClick={handleArticleClick}
                      onViewCategory={handleCategoryClick}
                    />
                  </div>
                  <div>
                    <CategoryBlock
                      title="আন্তর্জাতিক"
                      categorySlug="international"
                      articles={getCategoryArticles('international')}
                      onArticleClick={handleArticleClick}
                      onViewCategory={handleCategoryClick}
                    />
                  </div>
                </div>

                {/* 5. Business & Economy */}
                <CategoryBlock
                  title="অর্থনীতি ও ব্যবসা"
                  categorySlug="business"
                  articles={getCategoryArticles('business')}
                  onArticleClick={handleArticleClick}
                  onViewCategory={handleCategoryClick}
                />
              </div>

              {/* Sidebar (4 cols) */}
              <div className="lg:col-span-4">
                <Sidebar
                  trendingArticles={trendingArticles}
                  ads={ads}
                  onArticleClick={handleArticleClick}
                />
              </div>
            </div>

            {/* Video News Section */}
            <VideoSection
              videoArticles={videoArticles}
              onArticleClick={handleArticleClick}
            />

            {/* Photo News & Gallery */}
            <PhotoSection />
          </div>
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        categories={categories}
        onSearchSubmit={handleSearchSubmit}
        onArticleClick={handleArticleClick}
        searchResults={searchResults}
        isSearching={isSearching}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        categories={categories}
        ads={ads}
        onNavigate={handleStaticNavigate}
      />
    </div>
  );
}
