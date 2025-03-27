import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getApiUrl, getCmcImageUrl } from 'utils/config';
import { redisHandler } from 'utils/redis';

interface MarqueeToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  priceChange24h: number;
  imageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarqueeToken[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  // await redisHandler.delete('marquee_tokens');
  if (await redisHandler.get('marquee_tokens')) {
    return res.status(200).json(await redisHandler.get('marquee_tokens') as MarqueeToken[]);
  }

  try {
    const response = await axios.get(getApiUrl(`/coins`), {
      params: {
        page: 1,
        pageSize: 20,
      },
    });

    const marqueeTokens: MarqueeToken[] = response.data.tokens.map((token: any) => ({
      id: token.id,
      name: token.name,
      ticker: token.ticker,
      price: token.price,
      priceChange24h: token.priceChange['24h'],
      imageUrl: getCmcImageUrl(token.cmcId),
    }));

    await redisHandler.set('marquee_tokens', marqueeTokens, {
      expirationTime: 60
    })
    res.status(200).json(marqueeTokens);
  } catch (error) {
    console.error('Error fetching marquee tokens:', error);
    res.status(500).json([]);
  }
}
