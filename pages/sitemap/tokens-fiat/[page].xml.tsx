import { GetServerSideProps } from 'next';
import prisma from '../../../src/lib/prisma';
import { generateTokenUrl } from '../../../src/utils/url';
import { CURRENCIES } from '../../../src/context/CurrencyContext';
import { redisHandler } from '../../../src/utils/redis';

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
    const SITEMAP_CACHE_KEY = `sitemap_tokens_fiat_${page}_xml_cache`;
    
    // Try to get the sitemap from Redis cache first
    const cachedSitemap = await redisHandler.get<string>(SITEMAP_CACHE_KEY);
    
    if (cachedSitemap) {
      console.log(`Serving tokens-fiat sitemap page ${page} from Redis cache`);
      
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
    
    console.log(`Generating fresh tokens-fiat sitemap page ${page} and caching in Redis`);

    // Get fiat currencies
    const fiatCurrencies = Object.keys(CURRENCIES);
    
    // Calculate pagination - this is more complex as we need to paginate across tokens and fiats
    const tokensPerPage = Math.ceil(URLS_PER_SITEMAP / fiatCurrencies.length);
    const skip = (page - 1) * tokensPerPage;
    
    // Get tokens for this page
    const tokens = await prisma.token.findMany({
      where: {
        inSitemap: true
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
      take: tokensPerPage
    });

    // If no tokens found for this page, return 404
    if (tokens.length === 0) {
      return {
        notFound: true,
      };
    }

    // Create URL entries
    const urlEntries: string[] = [];
    
    // Each token to each fiat currency
    for (const token of tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      
      for (const fiatCode of fiatCurrencies) {
        urlEntries.push(`
          <url>
            <loc>${escapeXml(`${domain}/converter/${tokenSlug}/${fiatCode.toLowerCase()}`)}</loc>
            <lastmod>${token.updatedAt.toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>
        `);
      }
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
    console.error(`Error generating tokens-fiat sitemap page:`, error);
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const TokensFiatSitemap = () => null;
export default TokensFiatSitemap;
