import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../src/lib/prisma';
import { redisHandler } from 'utils/redis';
import axios from 'axios';

export async function getCoinPrice(id:string){
    if (await redisHandler.get(`price_${id}_busy`)) {
        return redisHandler.get(`price_${id}`);
    }
    await redisHandler.set(`price_${id}_busy`, 'true');
    let response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
        } as any
    });
    let data =  {
        price: response.data.data[id.toString()].quote.USD.price,
        price_change_24h: response.data.data[id.toString()].quote.USD.percent_change_24h,
        volume: response.data.data[id.toString()].quote.USD.volume_24h,
        volume_change_24h: response.data.data[id.toString()].quote.USD.volume_change_24h,
        market_cap: response.data.data[id.toString()].quote.USD.market_cap
    }
    await redisHandler.set(`price_${id}`, data, {expirationTime: 10});
    await redisHandler.delete(`price_${id}_busy`);
    return data;
}


export async function getCoinPriceRedis(id:string,force:boolean = false){
  if (!force && await redisHandler.get(`price_${id}`)) {
    return await redisHandler.get(`price_${id}`);
  }
  const data = await getCoinPrice(id);
  await redisHandler.set(`price_${id}`, data, {expirationTime: 10});
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // check if force in query
  const force = req.query.force === 'true';
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid id parameter' });
  }

  try {
    const data = await getCoinPriceRedis(id,force);
    res.status(200).json(data);
    await redisHandler.delete(`price_${id}_busy`);
  } catch (error) {
    console.error('Error fetching coin:', error);
    res.status(500).json({ message: 'Error fetching coin' });
  } finally {
    await prisma.$disconnect();
  }
}
