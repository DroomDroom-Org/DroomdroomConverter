import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';
import { redisHandler } from 'utils/redis';
import axios from 'axios';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 500;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await redisHandler.delete(`coins_${req.query.page || 1}_${req.query.pageSize || MAX_PAGE_SIZE}`);
  let coins_cache = await redisHandler.get(`coins_${req.query.page || 1}_${req.query.pageSize || MAX_PAGE_SIZE}`);

  if (coins_cache) {
    return res.status(200).json(coins_cache);
  }

  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = Math.min(
      parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const totalCount = await prisma.token.count({
      where: {
        rank: { not: null } // Only count tokens with rank
      }
    });

    // Fetch tokens with pagination
    const tokens = await prisma.token.findMany({
      skip,
      take: pageSize,
      orderBy: {
        rank: 'asc',
      },
      select: {
        id: true,
        ticker: true,
        name: true,
        rank: true,
        currentPrice: true,
        marketData: true,
        priceChanges: true,
        cmcId: true,
      },
      where: {
        rank: { not: null } // Only fetch tokens with rank
      },
    });
    
    // Get all cmcIds to fetch latest prices in a single API call
    const cmcIds = tokens.filter(token => token.cmcId).map(token => token.cmcId).join(',');
    // Only make API call if we have valid cmcIds
    let latestPriceData = {};
    if (cmcIds) {
      try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${cmcIds}`, {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string
          }
        });
        
        if (response.data && response.data.data) {
          latestPriceData = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching latest prices from CMC:', error);
        // Continue with database data if API call fails
      }
    }

    // Format response data
    const formattedTokens = tokens.map(token => {
      // Use latest price data if available, otherwise use database data
      const latestData = token.cmcId && latestPriceData[token.cmcId] ? 
        latestPriceData[token.cmcId].quote.USD : null;
      
      return {
        id: token.id,
        ticker: token.ticker,
        name: token.name,
        rank: token.rank,
        cmcId: token.cmcId,
        price: latestData ? latestData.price : token.currentPrice.usd,
        priceChange: {
          '1h': latestData ? latestData.percent_change_1h : token.priceChanges.hour1,
          '24h': latestData ? latestData.percent_change_24h : token.priceChanges.day1,
          '7d': latestData ? latestData.percent_change_7d : token.priceChanges.month1,
        },
        marketCap: latestData ? latestData.market_cap : token.marketData.marketCap,
        volume24h: latestData ? latestData.volume_24h : token.marketData.volume24h,
        circulatingSupply: token.marketData.circulatingSupply,
        lastUpdated: latestData ? latestData.last_updated : token.currentPrice.lastUpdated,
      };
    });
    
    let data = {
      tokens: formattedTokens,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
        hasMore: skip + pageSize < totalCount,
      }
    }
    // Cache response
    await redisHandler.set(`coins_${page}_${pageSize}`, data, {expirationTime:30*60}); // Cache for 30 minutes
    
    // Return paginated response
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ message: 'Error fetching tokens' });
  } finally {
    await prisma.$disconnect();
  }
}
