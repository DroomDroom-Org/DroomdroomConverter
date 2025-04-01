import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';
import getConfig from 'next/config';
import { generateTokenUrl } from '../../src/utils/url';
import { CURRENCIES } from '../../src/context/CurrencyContext';

const { publicRuntimeConfig } = getConfig();
const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com'; // Use environment variable or fallback

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all tokens, ordered by rank
    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        name: true,
        ticker: true,
        rank: true,
        updatedAt: true,
      },
      orderBy: {
        rank: 'asc'
      },
      take: 2000 // Limit to top 2000 tokens by rank
    });

    // Get fiat currencies from our context
    const fiatCurrencies = Object.keys(CURRENCIES);
    
    // Define special tokens
    const btc = tokens.find(t => t.ticker.toUpperCase() === 'BTC');
    const eth = tokens.find(t => t.ticker.toUpperCase() === 'ETH');
    const usdt = tokens.find(t => t.ticker.toUpperCase() === 'USDT');
    
    if (!btc || !eth || !usdt) {
      throw new Error('Could not find one of the required base tokens (BTC, ETH, USDT)');
    }

    // Create URL entries
    let urlEntries: string[] = [];
    
    // Add static pages
    urlEntries.push(`
      <url>
        <loc>${escapeXml(`${SITE_URL}/`)}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${escapeXml(`${SITE_URL}/search`)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${escapeXml(`${SITE_URL}/converter`)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
    `);
    
    // 1. BTC to all fiat currencies
    const btcSlug = generateTokenUrl(btc.name, btc.ticker);
    for (const fiatCode of fiatCurrencies) {
      urlEntries.push(`
        <url>
          <loc>${escapeXml(`${SITE_URL}/converter/${btcSlug}/${fiatCode.toLowerCase()}`)}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `);
    }
    
    // 2. ETH to all fiat currencies
    const ethSlug = generateTokenUrl(eth.name, eth.ticker);
    for (const fiatCode of fiatCurrencies) {
      urlEntries.push(`
        <url>
          <loc>${escapeXml(`${SITE_URL}/converter/${ethSlug}/${fiatCode.toLowerCase()}`)}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `);
    }
    
    // 3. All coins to USDT
    const usdtSlug = generateTokenUrl(usdt.name, usdt.ticker);
    for (const token of tokens) {
      if (token.ticker.toUpperCase() !== 'USDT') { // Skip USDT itself
        const tokenSlug = generateTokenUrl(token.name, token.ticker);
        urlEntries.push(`
          <url>
            <loc>${escapeXml(`${SITE_URL}/converter/${usdtSlug}/${tokenSlug}`)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `);
      }
    }
    
    // 4. BTC to all coins
    for (const token of tokens) {
      if (token.ticker.toUpperCase() !== 'BTC') { // Skip BTC itself
        const tokenSlug = generateTokenUrl(token.name, token.ticker);
        urlEntries.push(`
          <url>
            <loc>${escapeXml(`${SITE_URL}/converter/${btcSlug}/${tokenSlug}`)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `);
      }
    }
    
    // 5. ETH to all coins
    for (const token of tokens) {
      if (token.ticker.toUpperCase() !== 'ETH') { // Skip ETH itself
        const tokenSlug = generateTokenUrl(token.name, token.ticker);
        urlEntries.push(`
          <url>
            <loc>${escapeXml(`${SITE_URL}/converter/${ethSlug}/${tokenSlug}`)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `);
      }
    }
    
    // 6. Top 2000 coins to each fiat currency
    for (const token of tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      for (const fiatCode of fiatCurrencies) {
        urlEntries.push(`
          <url>
            <loc>${escapeXml(`${SITE_URL}/converter/${tokenSlug}/${fiatCode.toLowerCase()}`)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>
        `);
      }
    }
    
    // 7. Individual token pages
    for (const token of tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      urlEntries.push(`
        <url>
          <loc>${escapeXml(`${SITE_URL}/${tokenSlug}`)}</loc>
          <lastmod>${token.updatedAt.toISOString()}</lastmod>
          <changefreq>hourly</changefreq>
          <priority>0.9</priority>
        </url>
      `);
    }

    // Create XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlEntries.join('')}
    </urlset>`;

    // Set headers
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    // Send response
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}
