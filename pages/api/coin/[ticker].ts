import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../src/lib/prisma';
import { redisHandler } from 'utils/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // await redisHandler.delete(`coin_${req.query.ticker}`);
  if (await redisHandler.get(`coin_${req.query.ticker}`)) {
    let coin:any = await redisHandler.get(`coin_${req.query.ticker}`);
    // coin.currentPrice.usd = ((await redisHandler.get(`price_${coin.id}`)) as any).price;
    if (await redisHandler.get(`price_${coin.id}`)) coin.currentPrice.usd = ((await redisHandler.get(`price_${coin.id}`)) as any).price;
    return res.status(200).json(coin);
  }
  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ message: 'Invalid ticker parameter' });
  }

  try {
    const coin = await prisma.token.findUnique({
      where: {
        ticker: ticker.toUpperCase(),
      },
      include: {
        networkAddresses: {
          include: {
            networkType: true,
          },
          where: {
            isActive: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
              },
            },
          },
        },
        history: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 30, // Last 30 data points
        },
      },
    });

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    const formattedCoin = {
      ...coin,
      categories: coin.categories.map(tc => tc.category),
      networks: coin.networkAddresses.map(na => ({
        network: na.networkType.network,
        name: na.networkType.name,
        address: na.address,
      })),
    } as any;
    formattedCoin.currentPrice.usd = ((await redisHandler.get(`price_${coin.id}`)) as any).price;
    await redisHandler.set(`coin_${req.query.ticker}`, formattedCoin, {expirationTime: 60*60});
    res.status(200).json(formattedCoin);
  } catch (error) {
    console.error('Error fetching coin:', error);
    res.status(500).json({ message: 'Error fetching coin' });
  } finally {
    await prisma.$disconnect();
  }
}
