import { GetServerSideProps } from 'next';
import prisma from '../../../../src/lib/prisma';
import { generateTokenUrl } from '../../../../src/utils/url';
import { redisHandler } from '../../../../src/utils/redis';

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

// URLs per sitemap file
const URLS_PER_SITEMAP = 200;

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  try {
    const page = parseInt(params?.page as string, 10);
    
    if (isNaN(page) || page < 1) {
      return {
        notFound: true,
      };
    }
    
    const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
    const domain = `https://${new URL(SITE_URL).hostname}`;
    
    // Redis cache key for this specific page of the sitemap
    const SITEMAP_CACHE_KEY = `sitemap_btc_tokens_${page}_xml_cache`;
    
    // Try to get the sitemap from Redis cache first
    const cachedSitemap = await redisHandler.get<string>(SITEMAP_CACHE_KEY);
    
    if (cachedSitemap) {
      console.log(`Serving BTC tokens sitemap page ${page} from Redis cache`);
      
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
    
    console.log(`Generating fresh BTC tokens sitemap page ${page} and caching in Redis`);

    // Get BTC token
    const btc = await prisma.token.findFirst({
      where: {
        ticker: 'BTC'
      },
      select: {
        id: true,
        name: true,
        ticker: true
      }
    });

    if (!btc) {
      throw new Error('Could not find BTC token');
    }

    // Calculate pagination
    const skip = (page - 1) * URLS_PER_SITEMAP;
    
    // Get tokens for this page
    const tokens = await prisma.token.findMany({
      where: {
        inSitemap: true,
        ticker: {
          not: 'BTC' // Exclude BTC itself
        }
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        updatedAt: true
      },
      orderBy: {
        rank: 'asc'
      },
      skip,
      take: URLS_PER_SITEMAP
    });

    // If no tokens found for this page, return 404
    if (tokens.length === 0) {
      return {
        notFound: true,
      };
    }

    // Create URL entries
    const urlEntries: string[] = [];
    
    // BTC to tokens
    const btcSlug = generateTokenUrl(btc.name, btc.ticker);
    for (const token of tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      urlEntries.push(`
        <url>
          <loc>${escapeXml(`${domain}/converter/${btcSlug}/${tokenSlug}`)}</loc>
          <lastmod>${token.updatedAt.toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    }

    // Create XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlEntries.join('')}
    </urlset>`;

    // Cache the sitemap in Redis (24 hours)
    await redisHandler.set(SITEMAP_CACHE_KEY, sitemap, { expirationTime: 86400 });

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
    console.error(`Error generating BTC tokens sitemap page:`, error);
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const BtcTokensSitemap = () => null;
export default BtcTokensSitemap;
