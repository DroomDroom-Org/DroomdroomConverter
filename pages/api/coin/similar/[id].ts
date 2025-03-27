import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../src/lib/prisma';
import { redisHandler } from 'utils/redis';
import { Category, PriceChanges, Token, TokenToCategory } from '@prisma/client';
import { getApiUrl } from 'utils/config';


// Define types for our nested prisma results
type TokenWithCategories = Token & {
  categories: (TokenToCategory & {
    category: Category;
  })[];
  currentPrice?: { usd: number; lastUpdated: Date } | null;
  priceChanges?: PriceChanges | null;
};

interface EcosystemData {
  [key: string]: {
    name: string;
    slug: string;
    tokens: Array<{
      id: string;
      cmcId: string | null;
      name: string;
      ticker: string;
      rank: number | null;
      price: number;
      priceChange: {
        hour1: number;
        day1: number;
        week1: number;
      };
    }>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    // Check cache first
    const cacheKey = `similar_coins_${id}`;
    const cachedResult = await redisHandler.get(cacheKey);
    
    if (cachedResult) {
      return res.status(200).json(JSON.parse(cachedResult as string));
    }

    // Find the token by CMC ID
    const token = await prisma.token.findFirst({
      where: { cmcId: id },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    }) as TokenWithCategories | null;

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Extract the category IDs of the token
    const categoryIds = token.categories.map(tc => tc.categoryId);
    
    if (categoryIds.length === 0) {
      return res.status(200).json({ similar: [], ecosystem: {} });
    }

    // Find tokens that share categories with the target token
    const similarTokens = await prisma.token.findMany({
      where: {
        AND: [
          { 
            categories: {
              some: {
                categoryId: {
                  in: categoryIds
                }
              }
            }
          },
          { 
            id: {
              not: token.id
            }
          },
          {
            rank: {
              not: null
            }
          }
        ]
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        // Use any to bypass type checking for these properties
        ...(Object.assign({}, {
          currentPrice: true,
          priceChanges: true
        }) as any)
      },
      orderBy: {
        rank: 'asc'
      },
      take: 15
    }) as TokenWithCategories[];

    // Calculate similarity score (based on number of shared categories)
    const scoredResults = similarTokens.map(similarToken => {
      const similarCategoryIds = similarToken.categories.map(tc => tc.categoryId);
      const sharedCategories = categoryIds.filter(id => similarCategoryIds.includes(id));
      
      return {
        token: {
          id: similarToken.id,
          cmcId: similarToken.cmcId,
          name: similarToken.name,
          ticker: similarToken.ticker,
          rank: similarToken.rank,
          price: similarToken.currentPrice?.usd || 0,
          priceChange: {
            hour1: similarToken.priceChanges?.hour1 || 0,
            day1: similarToken.priceChanges?.day1 || 0,
            week1: similarToken.priceChanges?.month1 || 0
          },
          categories: similarToken.categories.map(tc => ({
            id: tc.category.id,
            name: tc.category.name,
            slug: tc.category.slug
          }))
        },
        similarityScore: sharedCategories.length,
        sharedCategoryCount: sharedCategories.length,
        totalCategoryCount: categoryIds.length,
        sharedCategories: sharedCategories.map(catId => {
          const category = token.categories.find(tc => tc.categoryId === catId)?.category;
          return {
            id: category?.id,
            name: category?.name,
            slug: category?.slug
          };
        })
      };
    });

    // Sort by similarity score (highest first) and take top 10
    const topResults = scoredResults
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);
      
    // Fetch chart data for each similar token
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const result = await Promise.all(
      topResults.map(async (item) => {
        try {
          // Only fetch chart data if we have a cmcId
          if (item.token.cmcId) {
            const chartResponse = await fetch(getApiUrl(`/coin/chart/${item.token.cmcId}`));
            
            if (chartResponse.ok) {
              const chartData = await chartResponse.json();
              // Add chart data to the result
              return {
                ...item,
                chartData: chartData
              };
            }
          }
          
          // Return original item if we couldn't fetch chart data
          return {
            ...item,
            chartData: null
          };
        } catch (error) {
          console.error(`Error fetching chart data for ${item.token.cmcId}:`, error);
          return {
            ...item,
            chartData: null
          };
        }
      })
    );

    // Identify ecosystem categories from the token's categories
    const ecosystemCategories = token.categories
      .filter(tc => 
        tc.category.slug.endsWith('-ecosystem') || 
        tc.category.slug.includes('ecosystem') ||
        tc.category.name.toLowerCase().includes('ecosystem')
      )
      .map(tc => ({
        id: tc.category.id,
        name: tc.category.name,
        slug: tc.category.slug
      }));

    // Generate ecosystem data if we have ecosystem categories
    let ecosystemData: EcosystemData = {};

    if (ecosystemCategories.length > 0) {
      // Get tokens for each ecosystem category
      await Promise.all(
        ecosystemCategories.map(async (category) => {
          // Extract the ecosystem name from the category slug
          let ecosystemKey = category.slug.replace('-ecosystem', '');
          // If the key still contains 'ecosystem', extract the prefix
          if (ecosystemKey.includes('ecosystem')) {
            const parts = ecosystemKey.split('-');
            ecosystemKey = parts.find(part => part !== 'ecosystem') || ecosystemKey;
          }

          // Find tokens in this ecosystem category
          const ecosystemTokens = await prisma.token.findMany({
            where: {
              categories: {
                some: {
                  categoryId: category.id
                }
              },
              rank: {
                not: null
              }
            },
            include: {
              // Use any to bypass type checking for these properties
              ...(Object.assign({}, {
                currentPrice: true,
                priceChanges: true
              }) as any)
            },
            orderBy: {
              rank: 'asc'
            },
            take: 20
          });

          // Format the tokens and fetch latest prices
          const formattedTokens = await Promise.all(
            ecosystemTokens.map(async t => {
              // Default price data from database
              let price = t.currentPrice?.usd || 0;
              let priceChanges = {
                hour1: t.priceChanges?.hour1 || 0,
                day1: t.priceChanges?.day1 || 0,
                week1: t.priceChanges?.month1 || 0
              };
              
              // Try to get the latest price data from the API
              if (t.cmcId) {
                try {
                  const priceResponse = await fetch(getApiUrl(`/coin/price/${t.cmcId}`));
                  if (priceResponse.ok) {
                    const latestPriceData = await priceResponse.json();
                    // Update with latest price if available
                    if (latestPriceData && typeof latestPriceData.price === 'number') {
                      price = latestPriceData.price;
                    }
                    // Update with latest price changes if available
                    if (latestPriceData && latestPriceData.price_change) {
                      priceChanges = {
                        hour1: latestPriceData.price_change.hour1 || priceChanges.hour1,
                        day1: latestPriceData.price_change.day1 || priceChanges.day1,
                        week1: latestPriceData.price_change.week1 || priceChanges.week1
                      };
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching latest price for ${t.name}:`, error);
                  // Continue with database price if API fails
                }
              }
              
              return {
                id: t.id,
                cmcId: t.cmcId,
                name: t.name,
                ticker: t.ticker,
                rank: t.rank,
                price: price,
                priceChange: priceChanges
              };
            })
          );

          // Add to ecosystem data
          ecosystemData[ecosystemKey] = {
            name: category.name,
            slug: category.slug,
            tokens: formattedTokens
          };
        })
      );
    }

    // Create the final response
    const finalResult = {
      similar: result,
      ecosystem: ecosystemData
    };

    // Cache the result for 1 hour
    await redisHandler.set(cacheKey, JSON.stringify(finalResult), { expirationTime: 3600 });

    return res.status(200).json(finalResult);
  } catch (error) {
    console.error('Error fetching similar coins:', error);
    return res.status(500).json({ error: 'Failed to fetch similar coins' });
  }
} 