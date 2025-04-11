import { GetServerSideProps } from 'next';
import prisma from '../../src/lib/prisma';
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

// Redis cache key for this sitemap index
const SITEMAP_CACHE_KEY = 'sitemap_usdt_index_xml_cache';
// Cache expiration time in seconds (24 hours)
const CACHE_EXPIRATION = 86400;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
    const domain = `https://${new URL(SITE_URL).hostname}`;
    
    // Try to get the sitemap from Redis cache first
    const cachedSitemap = await redisHandler.get<string>(SITEMAP_CACHE_KEY);
    
    if (cachedSitemap) {
      console.log('Serving USDT tokens sitemap index from Redis cache');
      
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
    
    console.log('Generating fresh USDT tokens sitemap index and caching in Redis');

    // Count tokens with inSitemap flag
    const tokenCount = await prisma.token.count({
      where: {
        inSitemap: true,
        ticker: {
          not: 'USDT' // Exclude USDT itself
        }
      }
    });

    // Calculate number of sitemap files needed (200 URLs per file)
    const URLS_PER_SITEMAP = 200;
    const sitemapCount = Math.ceil(tokenCount / URLS_PER_SITEMAP);
    
    // Current date for lastmod
    const currentDate = new Date().toISOString();

    // Create sitemap entries for the index
    const sitemapEntries = [];
    
    for (let i = 1; i <= sitemapCount; i++) {
      sitemapEntries.push(`
        <sitemap>
          <loc>${escapeXml(`${domain}/sitemap/usdt/tokens/${i}.xml`)}</loc>
          <lastmod>${currentDate}</lastmod>
        </sitemap>
      `);
    }

    // Create XML sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.join('')}
    </sitemapindex>`;

    // Cache the sitemap index in Redis
    await redisHandler.set(SITEMAP_CACHE_KEY, sitemapIndex, { expirationTime: CACHE_EXPIRATION });

    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    // Send response
    res.write(sitemapIndex);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating USDT tokens sitemap index:', error);
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const UsdtSitemapIndex = () => null;
export default UsdtSitemapIndex;
