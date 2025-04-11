import { GetServerSideProps } from 'next';
import { redisHandler } from '../src/utils/redis';

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

// Redis cache key for the sitemap index
const SITEMAP_INDEX_CACHE_KEY = 'sitemap_index_xml_cache';
// Cache expiration time in seconds (24 hours)
const CACHE_EXPIRATION = 86400;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com'; // Use environment variable or fallback
    const domain = `https://${new URL(SITE_URL).hostname}`;
    
    // Try to get the sitemap index from Redis cache first
    const cachedSitemapIndex = await redisHandler.get<string>(SITEMAP_INDEX_CACHE_KEY);
    
    if (cachedSitemapIndex) {
      console.log('Serving sitemap index from Redis cache');
      
      // Set headers
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
      
      // Send cached response
      res.write(cachedSitemapIndex);
      res.end();
      
      return {
        props: {},
      };
    }
    
    console.log('Generating fresh sitemap index and caching in Redis');

    // Current date for lastmod
    const currentDate = new Date().toISOString();

    // Create sitemap entries for the index
    const sitemapEntries = [
      // Static pages sitemap
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/static.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // BTC to fiat currencies sitemap
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/btc-fiat.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // ETH to fiat currencies sitemap
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/eth-fiat.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // USDT to tokens sitemap index
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/usdt-sitemap.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // BTC to tokens sitemap index
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/btc-sitemap.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // ETH to tokens sitemap index
      `<sitemap>
        <loc>${escapeXml(`${domain}/converter/sitemap/eth-sitemap.xml`)}</loc>
        <lastmod>${currentDate}</lastmod>
      </sitemap>`,
      
      // Tokens to fiat sitemap index
      // `<sitemap>
      //   <loc>${escapeXml(`${domain}/converter/sitemap/tokens-fiat-sitemap.xml`)}</loc>
      //   <lastmod>${currentDate}</lastmod>
      // </sitemap>`
    ];

    // Create XML sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.join('')}
    </sitemapindex>`;

    // Cache the sitemap index in Redis
    await redisHandler.set(SITEMAP_INDEX_CACHE_KEY, sitemapIndex, { expirationTime: CACHE_EXPIRATION });

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
    console.error('Error generating sitemap:', error);
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const Sitemap = () => null;
export default Sitemap;
