/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://qahe-english.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/api/*', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/']
      }
    ]
  },
  transform: async (config, path) => {
    // Custom priority and change frequency
    const customRoutes = {
      '/': { changefreq: 'daily', priority: 1.0 },
      '/writing': { changefreq: 'weekly', priority: 0.8 },
      '/writing/task-1-academic': { changefreq: 'weekly', priority: 0.7 },
      '/writing/task-1-general': { changefreq: 'weekly', priority: 0.7 },
      '/writing/task-2': { changefreq: 'weekly', priority: 0.7 },
      '/audio-worklet-demo': { changefreq: 'monthly', priority: 0.5 }
    };

    const route = customRoutes[path];
    
    return {
      loc: path,
      changefreq: route?.changefreq || 'weekly',
      priority: route?.priority || 0.7,
      lastmod: new Date().toISOString(),
    };
  }
};