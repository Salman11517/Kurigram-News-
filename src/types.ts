export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'REPORTER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  articleCount?: number;
}

export interface Author {
  id: string;
  name: string;
  photo: string;
  bio: string;
  designation: string;
  email?: string;
  phone?: string;
  articleCount?: number;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage: string;
  imageCaption?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorDesignation?: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  views: number;
  shares: number;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  videoUrl?: string;
  publishedAt: string;
  updatedAt: string;
}

export interface BreakingNews {
  id: string;
  title: string;
  link?: string;
  url?: string;
  articleId?: string;
  active: boolean;
  priority?: number;
  createdAt: string;
}

export type BreakingNewsItem = BreakingNews;

export type AdType = 'image' | 'html' | 'adsense';

export type AdLocation = 
  | 'header'
  | 'header_top'
  | 'top_banner'
  | 'breaking_bottom'
  | 'breaking_under'
  | 'homepage_mid'
  | 'home_lead'
  | 'sidebar'
  | 'article_top'
  | 'article_mid'
  | 'article_bottom'
  | 'footer';

export interface Advertisement {
  id: string;
  title: string;
  location: AdLocation;
  type: AdType;
  imageUrl?: string;
  targetUrl?: string;
  linkUrl?: string;
  htmlCode?: string;
  code?: string;
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  caption?: string;
  size?: string;
  type?: string;
  mimeType?: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  logoUrl?: string;
  faviconUrl?: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  editorName: string;
  publisherName: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    whatsapp: string;
    twitter: string;
  };
  footerText: string;
  googleAnalyticsId?: string;
  googleAdsenseId?: string;
  adsensePublisherId?: string;
  defaultSeoTitle: string;
  defaultMetaDesc: string;
  breakingNewsEnabled?: boolean;
  breakingTickerEnabled: boolean;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  breakingNewsCount: number;
  totalViews: number;
  totalShares: number;
  totalCategories: number;
  totalAuthors: number;
  totalAds: number;
  todayViews: number;
}
