import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { redisHandler } from 'utils/redis';

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  market_cap: number;
  percent_change_24h: number;
}

// Function to determine appropriate interval based on time range
function getIntervalForTimeRange(timeRange: string): string {
  switch (timeRange) {
    case '1d':
      return '5m';  // 5-minute intervals for 1 day
    case '7d':
      return '1h';  // 1-hour intervals for 7 days
    case '1m':
      return '1d';  // 1-day intervals for 1 month
    case 'all':
    default:
      return '1d';  // 1-day intervals for all (3 months)
  }
}

// Function to calculate start timestamp based on time range
function getStartTimestamp(timeRange: string): number {
  const now = new Date();
  
  switch (timeRange) {
    case '1d':
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return Math.floor(oneDayAgo.getTime() / 1000);
    
    case '7d':
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return Math.floor(sevenDaysAgo.getTime() / 1000);
    
    case '1m':
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return Math.floor(oneMonthAgo.getTime() / 1000);
    
    case 'all':
    default:
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return Math.floor(threeMonthsAgo.getTime() / 1000);
  }
}

// Function to get chart data from CoinMarketCap with incremental updates
async function getChartData(id: string, timeRange: string = 'all', customInterval?: string) {
  // Determine the appropriate interval based on time range
  const interval = customInterval || getIntervalForTimeRange(timeRange);
  
  // Define cache keys with time range and interval included
  const cacheKey = `chart_${id}_${timeRange}_${interval}`;
  const lastUpdateKey = `${cacheKey}_last_update`;
  const lastTimestampKey = `${cacheKey}_last_timestamp`;
  
  // Check if we're already processing a request for this coin with these parameters
  if (await redisHandler.get(`${cacheKey}_busy`)) {
    // If busy, return the existing data
    const existingData = await redisHandler.get(cacheKey);
    if (existingData) {
      return existingData;
    }
  }
  
  // Set a busy flag to prevent multiple simultaneous requests
  await redisHandler.set(`${cacheKey}_busy`, 'true');
  
  try {
    // Get existing chart data from Redis
    const existingData: ChartDataPoint[] = await redisHandler.get(cacheKey) || [];
    
    // Get last update time
    const lastUpdate = await redisHandler.get(lastUpdateKey);
    const now = new Date();
    const nowTimestamp = Math.floor(now.getTime() / 1000);
    
    // Determine update frequency based on interval
    let updateFrequency = 24 * 60 * 60 * 1000; // Default: daily (24 hours)
    if (interval === '5m' || interval === '15m') {
      updateFrequency = 15 * 60 * 1000; // 15 minutes for short intervals
    } else if (interval === '1h' || interval === '4h') {
      updateFrequency = 60 * 60 * 1000; // 1 hour for hourly intervals
    }
    
    // Check if we need to update the data
    const shouldUpdate = !lastUpdate || 
                         (now.getTime() - parseInt(lastUpdate)) > updateFrequency ||
                         existingData.length === 0;
                         
    if (!shouldUpdate) {
      // If we don't need to update, return the existing data
      return existingData;
    }
    
    // Calculate the start timestamp based on the time range
    const timeStart = getStartTimestamp(timeRange);
    
    // Get data from CoinMarketCap
    const response = await axios.get('https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical', {
      params: {
        id: id,
        time_start: timeStart,
        time_end: nowTimestamp,
        interval: interval,
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
      }
    });

    // Process the response
    if (!response.data || !response.data.data) {
      console.error('Unexpected response format from CMC (missing data):', JSON.stringify(response.data));
      throw new Error('Invalid response format from CoinMarketCap: missing data');
    }
    
    if (!response.data.data[id]) {
      console.error(`Unexpected response format from CMC (missing id ${id}):`, JSON.stringify(response.data));
      throw new Error(`Invalid response format from CoinMarketCap: missing data for id ${id}`);
    }
    
    if (!response.data.data[id].quotes || !Array.isArray(response.data.data[id].quotes) || response.data.data[id].quotes.length === 0) {
      console.error('Unexpected response format from CMC (missing or empty quotes):', JSON.stringify(response.data.data[id]));
      throw new Error('Invalid response format from CoinMarketCap: missing quotes data');
    }

    // Process the new data
    const newDataPoints = response.data.data[id].quotes.map((quote: any) => {
      const usdData = quote.quote?.USD || {};
      
      return {
        timestamp: new Date(quote.timestamp).getTime(),
        price: usdData.price || 0,
        volume: usdData.volume_24h || 0,
        market_cap: usdData.market_cap || 0,
        percent_change_24h: usdData.percent_change_24h || 0
      };
    });
    
    // Store the new data in Redis
    await redisHandler.set(cacheKey, newDataPoints);
    
    // Update the last timestamp and update time
    if (newDataPoints.length > 0) {
      const latestTimestamp = Math.max(...newDataPoints.map(point => point.timestamp));
      await redisHandler.set(lastTimestampKey, latestTimestamp.toString());
    }
    
    await redisHandler.set(lastUpdateKey, now.getTime().toString());
    
    return newDataPoints;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error fetching chart data from CMC:", error.response?.data || error.message);
    } else {
      console.error("Non-Axios error fetching chart data:", error);
    }
    
    // Try to use existing data if available
    const existingData = await redisHandler.get(cacheKey);
    if (existingData && existingData.length > 0) {
      return existingData;
    }
    
    // If we can't get data from CMC and have no cache, try to use the coin's history as fallback
    try {
      const prisma = (await import('../../../../src/lib/prisma')).default;
      const coin = await prisma.token.findUnique({
        where: { cmcId: id },
        include: {
          history: {
            orderBy: {
              timestamp: 'desc'
            },
            take: timeRange === 'all' ? 90 : // 3 months for 'all'
                  timeRange === '1m' ? 30 :  // 1 month
                  timeRange === '7d' ? 7 :   // 7 days
                  1                          // 1 day
          }
        }
      });
      
      if (coin && coin.history && coin.history.length > 0) {
        const fallbackData = coin.history.map((point: any) => ({
          timestamp: new Date(point.timestamp).getTime(),
          price: point.price,
          volume: point.volume || 0,
          market_cap: point.marketCap || 0,
          percent_change_24h: point.priceChange24h || 0
        }));

        // Cache this fallback data
        await redisHandler.set(cacheKey, fallbackData);
        
        // Update the last timestamp
        if (fallbackData.length > 0) {
          const latestTimestamp = Math.max(...fallbackData.map(point => point.timestamp));
          await redisHandler.set(lastTimestampKey, latestTimestamp.toString());
        }
        
        return fallbackData;
      }
    } catch (fallbackError) {
      console.error('Error fetching fallback chart data:', fallbackError);
    }
    
    throw error;
  } finally {
    // Clear the busy flag
    await redisHandler.delete(`${cacheKey}_busy`);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid id parameter' });
  }

  try {
    // Get time range and interval parameters from query
    const timeRange = (req.query.timeRange as string) || 'all';
    const interval = req.query.interval as string;
    
    // Force refresh can be used to bypass the update check
    const forceRefresh = req.query.refresh === 'true';
    
    // If force refresh is requested, clear the last update timestamp
    if (forceRefresh) {
      const cacheKey = `chart_${id}_${timeRange}_${interval || getIntervalForTimeRange(timeRange)}`;
      await redisHandler.delete(`${cacheKey}_last_update`);
    }
    
    // Get chart data with specified time range and interval
    const chartData = await getChartData(id, timeRange, interval);
    
    // Set cache control headers
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.status(200).json(chartData);
  } catch (error) {
    console.error('Error in chart API handler:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
}
