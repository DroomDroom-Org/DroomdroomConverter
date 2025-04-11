import { GetServerSideProps } from 'next';
import { redisHandler } from '../../src/utils/redis';

// Function to escape XML special characters
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

// This disables the layout for this page
export const config = {
  unstable_runtimeJS: false,
};

// Redis cache key for this sitemap
const SITEMAP_CACHE_KEY = 'sitemap_static_xml_cache';
// Cache expiration time in seconds (24 hours)
const CACHE_EXPIRATION = 86400;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
    const domain = `https://${new URL(SITE_URL).hostname}`;
    
    // Try to get the sitemap from Redis cache first
    const cachedSitemap = await redisHandler.get<string>(SITEMAP_CACHE_KEY);
    
    if (cachedSitemap) {
      console.log('Serving static sitemap from Redis cache');
      
      // Set headers
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
      
      // Send cached response
      res.write(cachedSitemap);
      res.end();
      
      return {
        props: {},
      };
    }
    
    console.log('Generating fresh static sitemap and caching in Redis');

    // Create URL entries for static pages
    const urlEntries = [
      `<url>
        <loc>${escapeXml(`${domain}/converter`)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>`
      // Add other static pages as needed
    ];

    // Create XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlEntries.join('')}
    </urlset>`;

    // Cache the sitemap in Redis
    await redisHandler.set(SITEMAP_CACHE_KEY, sitemap, { expirationTime: CACHE_EXPIRATION });

    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    // Send response
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const StaticSitemap = () => null;
export default StaticSitemap;
