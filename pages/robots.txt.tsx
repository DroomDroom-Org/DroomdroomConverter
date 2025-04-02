import { GetServerSideProps } from 'next';
import { redisHandler } from '../src/utils/redis';

// This disables the layout for this page
export const config = {
  unstable_runtimeJS: false,
};

// Redis cache key for robots.txt
const ROBOTS_CACHE_KEY = 'robots_txt_cache';
// Cache expiration time in seconds (24 hours)
const CACHE_EXPIRATION = 86400;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Try to get robots.txt from Redis cache first
    const cachedRobots = await redisHandler.get<string>(ROBOTS_CACHE_KEY);
    
    if (cachedRobots) {
      console.log('Serving robots.txt from Redis cache');
      
      // Set headers
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
      
      // Send cached response
      res.write(cachedRobots);
      res.end();
      
      return {
        props: {},
      };
    }
    
    console.log('Generating fresh robots.txt and caching in Redis');
    
    const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';
    // get only the domain name so it would be for eg https://droomdroom.com only
    const domain = new URL(SITE_URL).hostname;

    // Create robots.txt content
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${domain}/converter/sitemap.xml
`;

    // Cache the robots.txt in Redis
    await redisHandler.set(ROBOTS_CACHE_KEY, robotsTxt, { expirationTime: CACHE_EXPIRATION });

    // Set headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    // Send response
    res.write(robotsTxt);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Set headers even in case of error
    res.setHeader('Content-Type', 'text/plain');
    
    // Send a basic response in case of error
    const basicRobotsTxt = 'User-agent: *\nAllow: /\n';
    res.write(basicRobotsTxt);
    res.end();
    
    return {
      props: {},
    };
  }
};

// Return empty component as we're handling everything in getServerSideProps
const RobotsTxt = () => null;
export default RobotsTxt;
