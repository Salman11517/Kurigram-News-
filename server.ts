import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Articles API
  app.get('/api/articles', (req, res) => {
    try {
      const { category, tag, search, featured, trending, breaking, limit, offset, status } = req.query;
      const result = db.getArticles({
        categorySlug: category as string,
        tag: tag as string,
        search: search as string,
        isFeatured: featured !== undefined ? featured === 'true' : undefined,
        isTrending: trending !== undefined ? trending === 'true' : undefined,
        isBreaking: breaking !== undefined ? breaking === 'true' : undefined,
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/articles/admin', (req, res) => {
    try {
      const articles = db.getAllArticlesAdmin();
      res.json({ articles, total: articles.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/articles/slug/:slug', (req, res) => {
    try {
      const article = db.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: 'সংবাদটি পাওয়া যায়নি' });
      }
      // Increment view count
      db.incrementView(article.id);
      res.json({ ...article, views: article.views + 1 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/articles/:id', (req, res) => {
    try {
      const article = db.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: 'সংবাদটি পাওয়া যায়নি' });
      }
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/articles', (req, res) => {
    try {
      const article = db.createArticle(req.body);
      res.status(201).json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/articles/:id', (req, res) => {
    try {
      const updated = db.updateArticle(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'সংবাদটি পাওয়া যায়নি' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/articles/:id', (req, res) => {
    try {
      const success = db.deleteArticle(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/articles/:id/share', (req, res) => {
    try {
      const { platform = 'general' } = req.body;
      const count = db.incrementShare(req.params.id, platform);
      res.json({ shares: count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Breaking News API
  app.get('/api/breaking', (req, res) => {
    try {
      const items = db.getBreakingNews();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/breaking/admin', (req, res) => {
    try {
      const items = db.getAllBreakingNewsAdmin();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/breaking', (req, res) => {
    try {
      const item = db.addBreakingNews(req.body);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/breaking/:id', (req, res) => {
    try {
      const item = db.updateBreakingNews(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: 'ব্রেকিং নিউজ পাওয়া যায়নি' });
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/breaking/:id', (req, res) => {
    try {
      const success = db.deleteBreakingNews(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/breaking/reorder', (req, res) => {
    try {
      const { orderedIds } = req.body;
      const items = db.reorderBreakingNews(orderedIds || []);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Categories API
  app.get('/api/categories', (req, res) => {
    try {
      const categories = db.getCategories();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/categories', (req, res) => {
    try {
      const cat = db.createCategory(req.body);
      res.status(201).json(cat);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/categories/:id', (req, res) => {
    try {
      const cat = db.updateCategory(req.params.id, req.body);
      if (!cat) return res.status(404).json({ error: 'ক্যাটাগরি পাওয়া যায়নি' });
      res.json(cat);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', (req, res) => {
    try {
      const success = db.deleteCategory(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Authors API
  app.get('/api/authors', (req, res) => {
    try {
      const authors = db.getAuthors();
      res.json(authors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/authors', (req, res) => {
    try {
      const author = db.createAuthor(req.body);
      res.status(201).json(author);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/authors/:id', (req, res) => {
    try {
      const author = db.updateAuthor(req.params.id, req.body);
      if (!author) return res.status(404).json({ error: 'লেখক পাওয়া যায়নি' });
      res.json(author);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/authors/:id', (req, res) => {
    try {
      const success = db.deleteAuthor(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Advertisements API
  app.get('/api/ads', (req, res) => {
    try {
      const { location } = req.query;
      const ads = db.getAds(location as string);
      res.json(ads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/ads/admin', (req, res) => {
    try {
      const ads = db.getAllAdsAdmin();
      res.json(ads);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ads', (req, res) => {
    try {
      const ad = db.createAd(req.body);
      res.status(201).json(ad);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/ads/:id', (req, res) => {
    try {
      const ad = db.updateAd(req.params.id, req.body);
      if (!ad) return res.status(404).json({ error: 'বিজ্ঞাপন পাওয়া যায়নি' });
      res.json(ad);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/ads/:id', (req, res) => {
    try {
      const success = db.deleteAd(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Media API
  app.get('/api/media', (req, res) => {
    try {
      const media = db.getMedia();
      res.json(media);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/media', (req, res) => {
    try {
      const item = db.createMedia(req.body);
      res.status(201).json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/media/:id', (req, res) => {
    try {
      const success = db.deleteMedia(req.params.id);
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Settings API
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.getSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dashboard Stats API
  app.get('/api/stats', (req, res) => {
    try {
      const stats = db.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth & Users API
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.login(email, password);
      if (!user) {
        return res.status(401).json({ error: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' });
      }
      const { password: _, ...safeUser } = user;
      res.json({
        user: safeUser,
        token: `jwt-token-${user.id}-${Date.now()}`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/auth/users', (req, res) => {
    try {
      const users = db.getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/users', (req, res) => {
    try {
      const user = db.createUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/auth/users/:id', (req, res) => {
    try {
      const user = db.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: 'ব্যবহারকারী পাওয়া যায়নি' });
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/auth/users/:id', (req, res) => {
    try {
      const ok = db.deleteUser(req.params.id);
      if (!ok) return res.status(400).json({ error: 'প্রধান অ্যাডমিন মোছা যাবে না' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // XML Sitemap for SEO
  app.get('/sitemap.xml', (req, res) => {
    const articles = db.getArticles({ limit: 500 }).articles;
    const categories = db.getCategories();
    const domain = process.env.APP_URL || 'https://kurigramnews.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${domain}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`;

    categories.forEach(cat => {
      xml += `
  <url>
    <loc>${domain}/category/${cat.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    articles.forEach(art => {
      xml += `
  <url>
    <loc>${domain}/news/${art.categorySlug}/${art.slug}</loc>
    <lastmod>${new Date(art.updatedAt || art.publishedAt).toISOString()}</lastmod>
    <news:news>
      <news:publication>
        <news:name>কুড়িগ্রাম নিউজ</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${new Date(art.publishedAt).toISOString()}</news:publication_date>
      <news:title><![CDATA[${art.title}]]></news:title>
    </news:news>
  </url>`;
    });

    xml += `\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    const domain = process.env.APP_URL || 'https://kurigramnews.com';
    const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(content);
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kurigram News server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
