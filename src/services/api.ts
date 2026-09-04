import { Article, Category, Author, BreakingNews, Advertisement, MediaItem, SiteSettings, User, DashboardStats } from '../types';

const API_BASE = '/api';

export const api = {
  // Articles
  async getArticles(params?: {
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
    breaking?: boolean;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.trending !== undefined) query.set('trending', String(params.trending));
    if (params?.breaking !== undefined) query.set('breaking', String(params.breaking));
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));

    const res = await fetch(`${API_BASE}/articles?${query.toString()}`);
    if (!res.ok) throw new Error('সংবাদ লোড করতে ব্যর্থ হয়েছে');
    const data = await res.json();
    return Array.isArray(data) ? data : data.articles || [];
  },

  async getArticlesWithPagination(params?: {
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
    breaking?: boolean;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ articles: Article[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.trending !== undefined) query.set('trending', String(params.trending));
    if (params?.breaking !== undefined) query.set('breaking', String(params.breaking));
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));

    const res = await fetch(`${API_BASE}/articles?${query.toString()}`);
    if (!res.ok) throw new Error('সংবাদ লোড করতে ব্যর্থ হয়েছে');
    return res.json();
  },

  async getAllArticlesAdmin(): Promise<{ articles: Article[]; total: number }> {
    const res = await fetch(`${API_BASE}/articles/admin`);
    if (!res.ok) throw new Error('সংবাদ তালিকা লোড করতে ব্যর্থ হয়েছে');
    return res.json();
  },

  async getArticleBySlug(slug: string): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/slug/${slug}`);
    if (!res.ok) throw new Error('সংবাদটি পাওয়া যায়নি');
    return res.json();
  },

  async getArticleById(id: string): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}`);
    if (!res.ok) throw new Error('সংবাদ পাওয়া যায়নি');
    return res.json();
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('সংবাদ প্রকাশ করতে ব্যর্থ হয়েছে');
    return res.json();
  },

  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('সংবাদ আপডেট করতে ব্যর্থ হয়েছে');
    return res.json();
  },

  async deleteArticle(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('সংবাদ মুছতে ব্যর্থ হয়েছে');
    const data = await res.json();
    return data.success;
  },

  async trackView(id: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return data.views;
      }
    } catch {
      // ignore
    }
    return 0;
  },

  async trackShare(id: string, platform: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
      if (res.ok) {
        const data = await res.json();
        return data.shares;
      }
    } catch {
      // ignore
    }
    return 0;
  },

  // Breaking News
  async getBreakingNews(): Promise<BreakingNews[]> {
    const res = await fetch(`${API_BASE}/breaking`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAllBreakingAdmin(): Promise<BreakingNews[]> {
    const res = await fetch(`${API_BASE}/breaking/admin`);
    if (!res.ok) return [];
    return res.json();
  },

  async addBreaking(data: Partial<BreakingNews>): Promise<BreakingNews> {
    const res = await fetch(`${API_BASE}/breaking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createBreakingNews(data: Partial<BreakingNews>): Promise<BreakingNews> {
    return this.addBreaking(data);
  },

  async updateBreaking(id: string, data: Partial<BreakingNews>): Promise<BreakingNews> {
    const res = await fetch(`${API_BASE}/breaking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBreaking(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/breaking/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async deleteBreakingNews(id: string): Promise<boolean> {
    return this.deleteBreaking(id);
  },

  async reorderBreaking(orderedIds: string[]): Promise<BreakingNews[]> {
    const res = await fetch(`${API_BASE}/breaking/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds })
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return [];
    return res.json();
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Authors
  async getAuthors(): Promise<Author[]> {
    const res = await fetch(`${API_BASE}/authors`);
    if (!res.ok) return [];
    return res.json();
  },

  async createAuthor(data: Partial<Author>): Promise<Author> {
    const res = await fetch(`${API_BASE}/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAuthor(id: string, data: Partial<Author>): Promise<Author> {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAuthor(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/authors/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Advertisements
  async getAds(location?: string): Promise<Advertisement[]> {
    const url = location ? `${API_BASE}/ads?location=${location}` : `${API_BASE}/ads`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  async getAllAdsAdmin(): Promise<Advertisement[]> {
    const res = await fetch(`${API_BASE}/ads/admin`);
    if (!res.ok) return [];
    return res.json();
  },

  async createAd(data: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${API_BASE}/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAd(id: string, data: Partial<Advertisement>): Promise<Advertisement> {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAd(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/ads/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/media`);
    if (!res.ok) return [];
    return res.json();
  },

  async createMedia(data: Partial<MediaItem>): Promise<MediaItem> {
    const res = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMedia(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Auth & Users
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'লগইন ব্যর্থ হয়েছে');
    }
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('kurigram_user', JSON.stringify(data.user));
    }
    return data;
  },

  getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem('kurigram_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('kurigram_user');
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/users`);
    return res.json();
  },

  async createUser(data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteUser(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  }
};
