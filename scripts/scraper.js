const axios = require('axios');
const path = require('path');
const fs = require('fs/promises');
const { addToken, upsertToken } = require('./db');
const Redis = require('redis');
require('dotenv').config();

// Import the fixDuplicateRanks function
const { fixDuplicateRanks } = require('./fix-duplicate-ranks');

const base_url = "https://pro-api.coinmarketcap.com/";
const pubic_api_x_request_id = "e4330df490d446e0a7aeff1a5ffc414c";
const api_key = process.env.CMC_API_KEY;
const DATA_DUMP_FILE = 'token_data_dump.json';
const SCRAPE_INTERVAL = 1000 * 60 * 60; // 1 hour in milliseconds
const REDIS_KEY = 'cmc_token_droom_markets_sync_dump';
const REDIS_EXPIRY = 60 * 60 * 12; // 12 hours in seconds

// Initialize Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
(async () => {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
})();

async function loadDataDump() {
  try {
    // Try to get data from Redis
    const data = await redisClient.get(REDIS_KEY);
    
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Loaded data dump from Redis');
      return {
        lastScrapeTime: new Date(parsedData.lastScrapeTime),
        tokens: parsedData.tokens || [],
        lastProcessedIndex: parsedData.lastProcessedIndex || 0
      };
    } else {
      console.log('No data found in Redis, creating new data dump');
      return { lastScrapeTime: new Date(0), tokens: [], lastProcessedIndex: 0 };
    }
  } catch (error) {
    console.error('Error loading data dump from Redis:', error);
    return { lastScrapeTime: new Date(0), tokens: [], lastProcessedIndex: 0 };
  }
}

async function saveDataDump(tokens, lastProcessedIndex) {
  try {
    const data = {
      lastScrapeTime: new Date(),
      tokens,
      lastProcessedIndex
    };
    
    // Save to Redis with expiration
    await redisClient.set(REDIS_KEY, JSON.stringify(data));
    await redisClient.expire(REDIS_KEY, REDIS_EXPIRY);
    
    console.log('Data dump saved to Redis successfully');
  } catch (error) {
    console.error('Error saving data dump to Redis:', error);
  }
}

async function getBaseTokensInfo(start = 1, limit = 100) {
    const url = `${base_url}v1/cryptocurrency/listings/latest`;
    const params = {
        start,
        limit,
        convert: 'USD'
    };
    const headers = {
        'X-CMC_PRO_API_KEY': api_key
    };

    try {
        const response = await axios.get(url, { params, headers });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tokens:', error.message);
        throw error;
        return [];
    }
}

async function getMarketPairsOfToken(slug){
    // https://pro-api.coinmarketcap.com/v2/cryptocurrency/market-pairs/latest 
    const url = `${base_url}v2/cryptocurrency/market-pairs/latest`;
    const params = {
        slug
    };
    const headers = {
        'X-CMC_PRO_API_KEY': api_key
    };

    try {
        const response = await axios.get(url, { params, headers });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching tokens:', error.message);
        throw error;
        return [];
    }
}

async function getMarketPairsOfTokensViaPublicAPI(slug){
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'x-request-id': pubic_api_x_request_id,
        'platform': 'web',
        'cache-control': 'no-cache',
        'Sec-GPC': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Referer': 'https://coinmarketcap.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
    const url = `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=${slug}&start=1&limit=10&category=spot&centerType=all&sort=cmc_rank_advanced&direction=desc&spotUntracked=true`;

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching tokens:', error.message);
        throw error;
        return [];
    }
}

async function scrapeAllTokens() {
  try {
    const dataDump = await loadDataDump();
    const currentTime = new Date();
    
    // Check if we need to fetch new data
    if (currentTime - dataDump.lastScrapeTime < SCRAPE_INTERVAL && dataDump.tokens.length > 0) {
      console.log('Using cached token data from last scrape');
      return {tokens: dataDump.tokens, dataDump: dataDump};
    }

    console.log('Starting data gathering process...');
    let allTokens = [];
    let start = 1;
    const limit = 100;
    const maxIndex = 5000;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
          },
          params: {
            start,
            limit,
            convert: 'USD',
          },
        }
      );

      const tokens = response.data.data;
      if (tokens.length === 0) {
        hasMore = false;
      } else {
        // Preserve the tags field from the API response
        tokens.forEach(token => {
          if (token.tags && token.tags.length > 0) {
            token.originalTags = token.tags;
          }
        });
        
        allTokens = allTokens.concat(tokens);
        console.log(`Fetched ${allTokens.length} tokens so far...`);
        start += tokens.length;
        // sleep for 1 second to avoid rate limits
        if (allTokens.length >= maxIndex) {
            hasMore = false;
        }
        await saveDataDump(allTokens, 0);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Found ${allTokens.length} tokens`);
    await saveDataDump(allTokens, 0);
    dataDump.lastProcessedIndex = 0;
    return {tokens: allTokens, dataDump: dataDump};
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
}

async function latest_quotes(token_ids) {
    const url = `${base_url}v2/cryptocurrency/quotes/latest`;
    const params = { id: token_ids.join(',') };
    const headers = {
        'X-CMC_PRO_API_KEY': api_key
    };

    try {
        const response = await axios.get(url, { params, headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
        return null;
    }
}

async function getTokenSocials(slug) {
    const url = `${base_url}v2/cryptocurrency/info`;
    const params = { slug };
    const headers = {
        'X-CMC_PRO_API_KEY': api_key
    };
    try {
        const response = await axios.get(url, { params, headers });
        const data = response.data.data;
        const formatted_data = {};
        
        for (const [key, tokenData] of Object.entries(data)) {
            const networkAddresses = [];
            if (tokenData.platform) {
                networkAddresses.push({
                    network: tokenData.platform.name,
                    address: tokenData.platform.token_address
                });
            }
            if (tokenData.contract_address) {
                tokenData.contract_address.forEach(contract => {
                    if (!networkAddresses.some(na => 
                        na.network === contract.platform.name && 
                        na.address === contract.contract_address
                    )) {
                        networkAddresses.push({
                            network: contract.platform.name,
                            address: contract.contract_address
                        });
                    }
                });
            }

            // Extract tags if available
            const tags = tokenData.tags || [];
            const tagNames = tags.map(tag => tag.name);

            let fdata = {
                description: tokenData.description,
                category: tokenData.category,
                networkAddresses,
                'tag-names': tagNames, // Add tag names here
                tags: tags, // Add full tag objects for more detailed info if needed
                socials: {
                    website: tokenData.urls?.website || [],
                    twitter: tokenData.urls?.twitter || [],
                    telegram: tokenData.urls?.telegram || [],
                    discord: tokenData.urls?.chat || [], 
                    github: tokenData.urls?.source_code || [], 
                    explorer: tokenData.urls?.explorer || [],
                    facebook: tokenData.urls?.facebook || [],
                    announcement: tokenData.urls?.announcement || [],
                    chat: [
                        ...(tokenData.urls?.chat || []),
                        ...(tokenData.urls?.message_board || []) 
                    ]
                }
            };
            formatted_data[tokenData.slug] = fdata;
        }
        return formatted_data;
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
        return null;
    }
}

async function convertCoinMarketCapDataToDBFormat(token) {
    // Extract categories from either tag-names, tags, or originalTags
    let categoryData = [];
    
    try {
        // Debug the token object to see what tag data we have
        console.log(`Tag data for ${token.symbol}:`, {
            hasTags: !!token.tags,
            hasTagNames: !!token['tag-names'],
            hasOriginalTags: !!token.originalTags,
            tagsLength: token.tags?.length,
            tagNamesLength: token['tag-names']?.length,
            originalTagsLength: token.originalTags?.length,
            tagsType: token.tags && token.tags.length > 0 ? typeof token.tags[0] : 'none'
        });
        
        // Process tags to extract category information
        if (token.tags && Array.isArray(token.tags) && token.tags.length > 0) {
            console.log(`Processing ${token.tags.length} tags for ${token.symbol}`);
            
            // Check if tags are strings or objects
            const firstTag = token.tags[0];
            const tagsAreObjects = typeof firstTag === 'object' && firstTag !== null;
            
            if (tagsAreObjects) {
                categoryData = token.tags
                    .filter(tag => tag && typeof tag === 'object' && tag.name)
                    .map(tag => ({
                        name: tag.name,
                        slug: tag.slug || (tag.name ? 
                            tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 
                            `tag-${Math.random().toString(36).substring(2, 10)}`),
                        description: null
                    }));
            } else {
                // Handle string tags
                categoryData = token.tags
                    .filter(tag => tag && typeof tag === 'string')
                    .map(tag => ({
                        name: tag,
                        slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        description: null
                    }));
            }
            
            console.log(`Processed ${categoryData.length} categories from tags`);
        }
        // If no tags, try tag-names
        else if (token['tag-names'] && Array.isArray(token['tag-names']) && token['tag-names'].length > 0) {
            console.log(`Processing ${token['tag-names'].length} tag-names for ${token.symbol}`);
            categoryData = token['tag-names']
                .filter(tag => tag !== undefined && tag !== null && typeof tag === 'string')
                .map(tag => ({
                    name: tag,
                    slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    description: null
                }));
            console.log(`Processed ${categoryData.length} categories from tag-names`);
        }
        // Finally try originalTags
        else if (token.originalTags && Array.isArray(token.originalTags) && token.originalTags.length > 0) {
            console.log(`Processing ${token.originalTags.length} original tags for ${token.symbol}`);
            
            // Check if originalTags are strings or objects
            const firstTag = token.originalTags[0];
            const tagsAreObjects = typeof firstTag === 'object' && firstTag !== null;
            
            if (tagsAreObjects) {
                categoryData = token.originalTags
                    .filter(tag => tag && typeof tag === 'object' && tag.name)
                    .map(tag => ({
                        name: tag.name,
                        slug: tag.slug || (tag.name ? 
                            tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 
                            `tag-${Math.random().toString(36).substring(2, 10)}`),
                        description: null
                    }));
            } else {
                // Handle string tags
                categoryData = token.originalTags
                    .filter(tag => tag && typeof tag === 'string')
                    .map(tag => ({
                        name: tag,
                        slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        description: null
                    }));
            }
            
            console.log(`Processed ${categoryData.length} categories from originalTags`);
        }
        
        if (categoryData.length === 0) {
            console.log(`No categories found for ${token.symbol}`);
            
            // Last resort: if we have tag data but couldn't process it, log the actual data
            if (token.tags) console.log('Raw tags data:', JSON.stringify(token.tags).substring(0, 500) + '...');
            if (token['tag-names']) console.log('Raw tag-names data:', JSON.stringify(token['tag-names']).substring(0, 500) + '...');
            
            // Try one more approach - if tags are strings, use them directly
            if (token.tags && Array.isArray(token.tags) && typeof token.tags[0] === 'string') {
                console.log('Attempting to process string tags directly');
                categoryData = token.tags
                    .filter(tag => tag && typeof tag === 'string')
                    .map(tag => ({
                        name: tag,
                        slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        description: null
                    }));
                console.log(`Processed ${categoryData.length} categories from direct string tags`);
            }
        }
    } catch (error) {
        console.error('Error processing categories:', error);
        // Continue with empty categories rather than failing
    }

    return {
        ticker: token.symbol,
        name: token.name,
        rank: token.cmc_rank,
        currentPrice: {
            usd: token.quote.USD.price,
            lastUpdated: new Date(token.quote.USD.last_updated)
        },
        marketData: {
            marketCap: token.quote.USD.market_cap,
            fdv: token.quote.USD.fully_diluted_market_cap,
            volume24h: token.quote.USD.volume_24h,
            totalSupply: token.total_supply,
            circulatingSupply: token.circulating_supply,
            maxSupply: token.max_supply
        },
        socials: token.socials || {
            website: [],
            twitter: [],
            telegram: [],
            discord: [],
            github: [],
            explorer: [],
            facebook: [],
            announcement: [],
            chat: []
        },
        description: token.description,
        tradingMarkets: token.marketPairs?.data?.marketPairs?.map(pair => ({
            exchange: pair.exchangeName,
            pair: pair.marketPair,
            volume24h: parseFloat(pair.volumeUsd)
        })) || [],
        graphUrls: {
            price: null,
            marketCap: null
        },
        cmcId: token.id.toString(),
        cmcSlug: token.slug,
        priceChanges: {
            hour1: token.quote.USD.percent_change_1h,
            day1: token.quote.USD.percent_change_24h,
            month1: token.quote.USD.percent_change_30d,
            year1: token.quote.USD.percent_change_90d,
            lastUpdated: new Date(token.quote.USD.last_updated)
        },
        // Instead of directly embedding categories, we'll pass the category data
        // to be used for creating/connecting categories in the database
        categoryData: categoryData
    };
}

async function main() {
  try {
    // const dataDump = await loadDataDump();
    const {tokens, dataDump} = await scrapeAllTokens();
    console.log(`Resuming from index ${dataDump.lastProcessedIndex}`);
    console.log('Total tokens:', tokens.length);
    
    const batchSize = 10;
    const totalBatches = Math.ceil((tokens.length - dataDump.lastProcessedIndex) / batchSize);
    
    for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
      const start = dataDump.lastProcessedIndex + (batchNum - 1) * batchSize;
      const end = Math.min(start + batchSize, tokens.length);
      const batch = tokens.slice(start, end);
      
      console.log(`Processing batch ${batchNum} of ${totalBatches}`);
      
      for (const token of batch) {
        try {
          console.log(`Processing token ${token.symbol}...`);
          
          console.log(`Fetching market pairs for ${token.symbol}...`);
          const marketPairs = await getMarketPairsOfTokensViaPublicAPI(token.slug);
          token.marketPairs = marketPairs;
          
          // Make a direct API call to get detailed token info including tags
          try {
            console.log(`Fetching detailed info for ${token.symbol}...`);
            const detailedInfo = await axios.get(
              `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info`,
              {
                headers: {
                  'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                },
                params: {
                  id: token.id
                },
              }
            );
            
            if (detailedInfo.data && detailedInfo.data.data && detailedInfo.data.data[token.id]) {
              const tokenInfo = detailedInfo.data.data[token.id];
              
              // Store description and socials
              token.description = tokenInfo.description;
              if (tokenInfo.urls) {
                token.socials = {
                  website: tokenInfo.urls.website || [],
                  twitter: tokenInfo.urls.twitter || [],
                  telegram: tokenInfo.urls.telegram || [],
                  discord: tokenInfo.urls.chat || [],
                  github: tokenInfo.urls.source_code || [],
                  explorer: tokenInfo.urls.explorer || [],
                  facebook: tokenInfo.urls.facebook || [],
                  announcement: tokenInfo.urls.announcement || [],
                  chat: [
                    ...(tokenInfo.urls.chat || []),
                    ...(tokenInfo.urls.message_board || [])
                  ]
                };
              }
              
              // Store network addresses
              const networkAddresses = [];
              if (tokenInfo.platform) {
                networkAddresses.push({
                  network: tokenInfo.platform.name,
                  address: tokenInfo.platform.token_address
                });
              }
              if (tokenInfo.contract_address) {
                tokenInfo.contract_address.forEach(contract => {
                  networkAddresses.push({
                    network: contract.platform.name,
                    address: contract.contract_address
                  });
                });
              }
              token.networkAddresses = networkAddresses;
              
              // Store tags information - handle both object and string formats
              if (tokenInfo.tags && tokenInfo.tags.length > 0) {
                console.log(`Found ${tokenInfo.tags.length} tags from detailed info for ${token.symbol}`);
                
                // Check if tags are strings or objects
                const firstTag = tokenInfo.tags[0];
                const tagsAreObjects = typeof firstTag === 'object' && firstTag !== null;
                
                if (tagsAreObjects) {
                  token.tags = tokenInfo.tags;
                  token['tag-names'] = tokenInfo.tags.map(tag => tag.name);
                } else {
                  // Convert string tags to objects
                  token.tags = tokenInfo.tags.map(tag => ({
                    name: tag,
                    slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    category: null
                  }));
                  token['tag-names'] = tokenInfo.tags;
                }
                
                // Log the first few tags to debug
                console.log(`Sample tags for ${token.symbol}:`, 
                  JSON.stringify(tokenInfo.tags.slice(0, 3)));
              }
            }
          } catch (error) {
            console.error(`Error fetching detailed info for ${token.symbol}:`, error.message);
          }

          console.log(`Converting and upserting ${token.symbol}...`);
          const formattedToken = await convertCoinMarketCapDataToDBFormat(token);
          console.log("Formatted Token:", formattedToken);
          // process.exit(0);
          await upsertToken(formattedToken);
          
          // Update last processed index after successful token processing
          await saveDataDump(tokens, start + batch.indexOf(token) + 1);
          // sleep for 1 second to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1100));
        } catch (error) {
          console.error(`Error processing token ${token.symbol}:`, error);
          continue;
        }
      }
    }

    // After all tokens are processed, fix any duplicate ranks
    // console.log('Token processing complete. Now fixing duplicate ranks...');
    // await fixDuplicateRanks();
    // console.log('Rank fixing process complete.');

  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    // Close Redis connection when done
    await redisClient.quit();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nGracefully shutting down...');
    await redisClient.quit();
    process.exit(0);
});

if (require.main === module) {
    main().catch(async (error) => {
      console.error(error);
      await redisClient.quit();
      process.exit(1);
    });
}
