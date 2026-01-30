/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://zodii.in',
  generateRobotsTxt: false, // We created custom robots.txt
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Define priorities for different routes
  transform: async (config, path) => {
    // High priority pages
    if (path === '/' || path === '/horoscope' || path === '/panchang') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Blog posts
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Service pages
    if (path === '/kundli' || path === '/matching') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
  
  // Exclude private pages
  exclude: [
    '/admin',
    '/admin/*',
    '/dashboard',
    '/dashboard/*',
    '/api/*',
    '/user/*'
  ],
  
  // Additional paths to include
  additionalPaths: async (config) => [
    await config.transform(config, '/api/public/zodiac-signs'),
    await config.transform(config, '/api/public/planets'),
    await config.transform(config, '/api/public/nakshatras'),
  ],
}
