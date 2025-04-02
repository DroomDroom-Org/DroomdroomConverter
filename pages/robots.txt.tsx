import { GetServerSideProps } from 'next';

// This disables the layout for this page
export const config = {
  unstable_runtimeJS: false,
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const SITE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.droomdroom.com';

  // Create robots.txt content
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  // Set headers
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  
  // Send response
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

// Return empty component as we're handling everything in getServerSideProps
const RobotsTxt = () => null;
export default RobotsTxt;
