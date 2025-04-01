import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';
import { getCoinPriceRedis } from './coin/price/[id]';

interface PriceData {
  price: number;
  price_change_24h: number;
  volume: number;
  volume_change_24h: number;
  market_cap: number;
}

interface SearchResult {
  id: string;
  name: string;
  ticker: string;
  cmcId: string;
  currentPrice?: {
    usd: number;
    lastUpdated: Date;
  };
  marketData?: {
    marketCap: number | null;
    volume24h: number | null;
  };
  priceChanges?: {
    day1: number | null;
    lastUpdated: Date;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase();

    const results = await prisma.token.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            ticker: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        ticker: true,
        cmcId: true
      },
      orderBy: [
        {
          marketData: {
            marketCap: 'desc'
          }
        }
      ],
      take: 20
    });

    // Fetch price data for each result
    const resultsWithPrice = await Promise.all(
      results.map(async (result) => {
        try {
          // Use cmcId to fetch price data
          if (result.cmcId) {
            const priceData:any = await getCoinPriceRedis(result.cmcId);
            
            // Format the data according to the Token schema
            return {
              ...result,
              currentPrice: {
                usd: priceData.price,
                lastUpdated: new Date()
              },
              marketData: {
                marketCap: priceData.market_cap,
                volume24h: priceData.volume
              },
              priceChanges: {
                day1: priceData.price_change_24h,
                lastUpdated: new Date()
              }
            };
          }
          return result;
        } catch (error) {
          console.error(`Error fetching price for ${result.name}:`, error);
          return result;
        }
      })
    );

    return res.status(200).json(resultsWithPrice);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
