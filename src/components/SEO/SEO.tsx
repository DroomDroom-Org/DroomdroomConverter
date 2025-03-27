import Head from 'next/head';
import { useRouter } from 'next/router';

const DOMAIN = process.env.NEXT_PUBLIC_URL || 'https://droomdroom.com';
const DEFAULT_OG_IMAGE = '/logo.png';

interface StructuredData {
  [key: string]: any;
}

interface SEOProps {
  title?: string;
  description?: string;
  siteName?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  keywords?: string;
  structuredData?: StructuredData;
  noindex?: boolean;
}

const SEO = ({
  title = 'DroomDroom - Your Real-Time Cryptocurrency Tracking Platform',
  description = 'Track real-time cryptocurrency prices, market cap, and trading volume. Get detailed analytics and insights for Bitcoin, Ethereum, and thousands of altcoins.',
  siteName = 'DroomDroom',
  canonical = DOMAIN,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterHandle = '@droomdroom',
  keywords = 'cryptocurrency, crypto tracking, bitcoin price, ethereum price, crypto market cap, blockchain, digital assets, crypto analytics',
  structuredData,
  noindex = false,
}: SEOProps) => {
  const router = useRouter();
  const canonicalUrl = `${process.env.NEXT_PUBLIC_URL || 'https://droomdroom.com'}${router.asPath}`;

  return (
    <Head>
      <title key="title">{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta key="og_type" property="og:type" content={ogType} />
      <meta key="og_title" property="og:title" content={title} />
      <meta key="og_description" property="og:description" content={description} />
      <meta key="og_locale" property="og:locale" content="en_US" />
      <meta key="og_site_name" property="og:site_name" content={siteName} />
      <meta key="og_url" property="og:url" content={canonicalUrl} />
      <meta key="og_image" property="og:image" content={ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`} />
      <meta key="og_image:alt" property="og:image:alt" content={`${title} | ${siteName}`} />
      <meta key="og_image:width" property="og:image:width" content="1200" />
      <meta key="og_image:height" property="og:image:height" content="630" />
      {/* WhatsApp specific tags */}
      <meta property="og:image:secure_url" content={ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`} />
      <meta property="og:image:type" content="image/png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />

      {/* Structured data for rich results */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

export default SEO;
