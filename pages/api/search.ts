import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';

interface SearchResult {
  id: string;
  name: string;
  ticker: string;
  cmcId: string;
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

    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
