import React, { useEffect, useState, useRef } from 'react';
import { useCurrency } from '../src/context/CurrencyContext';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import SEO from 'components/SEO/SEO';
import CoinTabs from 'components/CoinSections/CoinTabs';
import Tokenomics from 'components/CoinSections/Tokenomics';
import FomoCalculator from 'components/CoinSections/FomoCalculator';
import { DescriptionCard } from 'components/CoinSections/DescriptionCard';

import { Container } from 'styled/elements/Container';
import { capitalize } from 'lodash';
import prisma from '../src/lib/prisma';
import Link from 'next/link';
import { parseTokenSlug } from 'utils/url';
import { getApiUrl, getPageUrl } from 'utils/config';
import PriceDisplay from 'components/PriceDisplay/PriceDisplay';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import SearchBar from 'components/SearchBar/SearchBar';
import dynamic from 'next/dynamic';
import CoinLeftSidebar from 'components/pages/coin/CoinLeftSidebar/CoinLeftSidebar';
import CoinRightSidebar from 'components/pages/coin/CoinRightSidebar/CoinRightSidebar';
import CoinMainContent from 'components/CoinMainContent/CoinMainContent';
import { redisHandler } from 'utils/redis';
import MobileCoin from 'components/MobileCoin/MobileCoin';
import { generateCoinAboutText } from '../src/utils/coinUtils';



interface ExchangeData {
  exchange: string;
  pair: string;
  volume24h: number;
  logoUrl?: string;
  slug?: string;
}

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  rank?: number;
  currentPrice: {
    usd: number;
    lastUpdated: Date;
  };
  marketData: {
    marketCap?: number;
    fdv?: number;
    volume24h?: number;
    volumeChange24h?: number;
    totalSupply?: number;
    circulatingSupply?: number;
    maxSupply?: number;
  };
  networkAddresses: {
    networkType: {
      name: string;
      network: string;
    };
    address: string;
  }[];
  categories: {
    category: {
      name: string;
      description: string;
    };
  }[];
  socials: {
    website: string[];
    twitter: string[];
    telegram: string[];
    discord: string[];
    github: string[];
    explorer: string[];
  };
  description?: string;
  cmcId?: string;
  cmcSlug?: string;
  priceChanges: {
    hour1?: number;
    day1?: number;
    month1?: number;
    year1?: number;
    lastUpdated: Date;
  };
  history: {
    timestamp: Date;
    price: number;
    marketCap?: number;
    volume?: number;
  }[];
  tradingMarkets?: ExchangeData[];
}

interface CoinProps {
  coin: TokenData;
  topTokens: TokenData[];
  exchangeData?: ExchangeData[];
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch top tokens first
  let inCache: any = await redisHandler.get(`droomdroom_coin_${params?.slug}`);
  if (inCache) {
    return JSON.parse(inCache);
  }
  const topTokens = await prisma.token.findMany({
    where: {
      rank: {
        not: null,
        lte: 5
      }
    },
    orderBy: {
      rank: 'asc'
    },
    include: {
      currentPrice: true
    },
    take: 5
  });
  if (!params?.slug) {
    return { notFound: true };
  }

  const slugString = params.slug.toString();
  const parsed = parseTokenSlug(slugString);

  if (!parsed) {
    return { notFound: true };
  }

  const { name, ticker } = parsed;
  // First try exact match
  const coin = await prisma.token.findFirst({
    where: {
      AND: [
        {
          ticker: {
            equals: ticker,
            mode: 'insensitive'
          }
        },
        {
          name: {
            equals: name,
            mode: 'insensitive'
          }
        }
      ]
    },
    include: {
      currentPrice: true,
      marketData: true,
      networkAddresses: {
        include: {
          networkType: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      socials: true,
      priceChanges: true,
      tradingMarkets: true,
      history: {
        orderBy: {
          timestamp: 'desc'
        },
        take: 1000
      }
    }
  });

  if (!coin) {
    // Create a more flexible search by:
    // 1. First trying with the ticker match
    // 2. Then checking if the name contains all the words in any order
    const nameWords = name
      .toLowerCase()
      .replace(/[()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);

    const flexibleCoin = await prisma.token.findFirst({
      where: {
        AND: [
          {
            ticker: {
              equals: ticker,
              mode: 'insensitive'
            }
          },
          {
            OR: nameWords.map(word => ({
              name: {
                contains: word,
                mode: 'insensitive'
              }
            }))
          }
        ]
      },
      include: {
        currentPrice: true,
        marketData: true,
        networkAddresses: {
          include: {
            networkType: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        socials: true,
        priceChanges: true,
        tradingMarkets: true,
        history: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1000
        }
      }
    });

    if (!flexibleCoin) {
      return { notFound: true };
    }

    // Fetch latest price data from CMC if we have a CMC ID
    if (flexibleCoin.cmcId) {
      try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${flexibleCoin.cmcId}`, {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || ''
          }
        });
        const data = await response.json();

        if (data.data && data.data[flexibleCoin.cmcId]) {
          const cmcData = data.data[flexibleCoin.cmcId].quote.USD;

          // Cache the price data
          const priceData = {
            price: cmcData.price,
            price_change_24h: cmcData.percent_change_24h,
            volume: cmcData.volume_24h,
            volume_change_24h: cmcData.volume_change_24h,
            market_cap: cmcData.market_cap
          };

          await redisHandler.set(`price_${flexibleCoin.id}`, priceData, { expirationTime: 60 }); // Cache for 1 minute

          // Update the coin data with latest price
          (flexibleCoin as any).currentPrice.usd = cmcData.price;
          (flexibleCoin as any).priceChanges.day1 = cmcData.percent_change_24h;
          (flexibleCoin as any).marketData.volume24h = cmcData.volume_24h;
          (flexibleCoin as any).marketData.volumeChange24h = cmcData.volume_change_24h;
          (flexibleCoin as any).marketData.marketCap = cmcData.market_cap;
        }
      } catch (error) {
        console.error('Error fetching price from CMC:', error);
        // Try to get from cache if API call fails
        let price: any = await redisHandler.get(`price_${flexibleCoin.id}`);
        if (price) (flexibleCoin as any).currentPrice.usd = price?.price;
      }
    } else {
      // Try to get from cache if no CMC ID
      let price: any = await redisHandler.get(`price_${flexibleCoin.id}`);
      if (price) (flexibleCoin as any).currentPrice.usd = price?.price;
    }

    // Ensure we have the CMC ID for chart data
    if (!flexibleCoin.cmcId && flexibleCoin.cmcSlug) {
      try {
        // Try to fetch CMC ID from slug if available
        const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=${flexibleCoin.cmcSlug}`, {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || ''
          }
        });
        const data = await response.json();
        if (data.data && Object.keys(data.data).length > 0) {
          const id = Object.keys(data.data)[0];
          (flexibleCoin as any).cmcId = id;
        }
      } catch (error) {
        console.error('Error fetching CMC ID from slug:', error);
      }
    }

    // Fetch exchange data for trading markets
    let exchangeData = [];
    if (flexibleCoin.tradingMarkets && flexibleCoin.tradingMarkets.length > 0) {
      try {
        const exchangeNames = [...new Set(flexibleCoin.tradingMarkets.map(market => market.exchange))];
        const exchangeDataPromises = exchangeNames.map(async (exchangeName) => {
          const exchange = await prisma.exchange.findUnique({
            where: {
              name: exchangeName
            },
            select: {
              name: true,
              logo: true,
              rank: true,
              spotVolumeUsd: true,
              slug: true
            }
          });
          return exchange;
        });

        const exchanges = await Promise.all(exchangeDataPromises);

        // Map exchange data to trading markets
        exchangeData = flexibleCoin.tradingMarkets.map(market => {
          const exchangeInfo = exchanges.find(e => e?.name === market.exchange);
          return {
            ...market,
            logoUrl: exchangeInfo?.logo || null,
            slug: exchangeInfo?.slug || null
          };
        });

        // Update the trading markets with exchange data
        flexibleCoin.tradingMarkets = exchangeData;
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      }
    }
    let serverData = {
      props: {
        coin: JSON.parse(JSON.stringify(flexibleCoin)),
        topTokens: JSON.parse(JSON.stringify(topTokens)),
      }
    }
    redisHandler.set(`droomdroom_coin_${params?.slug}`, JSON.stringify(serverData), { expirationTime: 60 * 60 })
    return {
      ...serverData
    };
  }

  // For exact match coin, also fetch latest price data
  if (coin.cmcId) {
    try {
      const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coin.cmcId}`, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || ''
        }
      });
      const data = await response.json();

      if (data.data && data.data[coin.cmcId]) {
        const cmcData = data.data[coin.cmcId].quote.USD;

        // Cache the price data
        const priceData = {
          price: cmcData.price,
          price_change_24h: cmcData.percent_change_24h,
          volume: cmcData.volume_24h,
          volume_change_24h: cmcData.volume_change_24h,
          market_cap: cmcData.market_cap
        };

        await redisHandler.set(`price_${coin.id}`, priceData, { expirationTime: 60 }); // Cache for 1 minute

        // Update the coin data with latest price
        (coin as any).currentPrice.usd = cmcData.price;
        (coin as any).priceChanges.day1 = cmcData.percent_change_24h;
        (coin as any).marketData.volume24h = cmcData.volume_24h;
        (coin as any).marketData.volumeChange24h = cmcData.volume_change_24h;
        (coin as any).marketData.marketCap = cmcData.market_cap;
      }
    } catch (error) {
      console.error('Error fetching price from CMC:', error);
      // Try to get from cache if API call fails
      let price: any = await redisHandler.get(`price_${coin.id}`);
      if (price) (coin as any).currentPrice.usd = price?.price;
    }
  } else {
    // Try to get from cache if no CMC ID
    let price: any = await redisHandler.get(`price_${coin.id}`);
    if (price) (coin as any).currentPrice.usd = price?.price;
  }

  // Fetch exchange data for trading markets
  let exchangeData = [];
  if (coin.tradingMarkets && coin.tradingMarkets.length > 0) {
    try {
      const exchangeNames = [...new Set(coin.tradingMarkets.map(market => market.exchange))];
      const exchangeDataPromises = exchangeNames.map(async (exchangeName) => {
        const exchange = await prisma.exchange.findUnique({
          where: {
            name: exchangeName
          },
          select: {
            name: true,
            logo: true,
            rank: true,
            spotVolumeUsd: true,
            slug: true
          }
        });
        return exchange;
      });

      const exchanges = await Promise.all(exchangeDataPromises);

      // Map exchange data to trading markets
      exchangeData = coin.tradingMarkets.map(market => {
        const exchangeInfo = exchanges.find(e => e?.name === market.exchange);
        return {
          ...market,
          logoUrl: exchangeInfo?.logo || null,
          slug: exchangeInfo?.slug || null
        };
      });

      // Update the trading markets with exchange data
      coin.tradingMarkets = exchangeData;
    } catch (error) {
      console.error('Error fetching exchange data:', error);
    }
  }

  let serverData = {
    props: {
      coin: JSON.parse(JSON.stringify(coin)),
      topTokens: JSON.parse(JSON.stringify(topTokens))
    }
  };
  redisHandler.set(`droomdroom_coin_${params?.slug}`, JSON.stringify(serverData), { expirationTime: 60 * 60 })
  return {
    ...serverData
  };
};

const Coin = ({ coin: initialCoin, topTokens }: CoinProps) => {
  const [coin, setCoin] = useState(initialCoin);
  const [activeSection, setActiveSection] = useState('chart');
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = useRef<{ [key: string]: HTMLElement }>({});
  const { convertPrice } = useCurrency();

  // Add useEffect for mobile detection
  useEffect(() => {
    // Check if window exists (client-side)
    if (typeof window !== 'undefined') {
      // Initial mobile check
      setIsMobile(window.innerWidth < 768);

      // Add resize listener for responsive updates
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const fetchPrice = async () => {
    try {
      const response = await fetch(`${getApiUrl(`/coin/price/${coin?.cmcId}`)}`);
      const data = await response.json();
      if (data.price) {
        setCoin(prevCoin => ({
          ...prevCoin,
          currentPrice: {
            ...prevCoin?.currentPrice,
            usd: data.price
          },
          priceChanges: {
            ...prevCoin?.priceChanges,
            day1: data.price_change_24h
          },
          marketData: {
            ...prevCoin?.marketData,
            volume24h: data.volume,
            volumeChange24h: data.volume_change_24h,
            marketCap: data.market_cap
          }
        }));

      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };
  // Update price data when currency changes
  useEffect(() => {
    // fetchPrice();
    while (!coin) {

    }
    fetchPrice();

    const intervalId = setInterval(fetchPrice, 5000);
    return () => clearInterval(intervalId);
  }, [coin, fetchPrice]);

  // Define all the sections for the page
  const sectionIds = {
    chart: 'chart',
    markets: 'markets',
    about: 'about',
    prediction: 'prediction',
    converter: 'converter',
    tokenomics: 'tokenomics',
    fomo: 'fomo',
    faq: 'faq'
  };

  // Update sections ref to include all sections
  useEffect(() => {
    sections.current = {
      chart: document.getElementById(sectionIds.chart) as HTMLElement,
      markets: document.getElementById(sectionIds.markets) as HTMLElement,
      about: document.getElementById(sectionIds.about) as HTMLElement,
      prediction: document.getElementById(sectionIds.prediction) as HTMLElement,
      converter: document.getElementById(sectionIds.converter) as HTMLElement,
      tokenomics: document.getElementById(sectionIds.tokenomics) as HTMLElement,
      fomo: document.getElementById(sectionIds.fomo) as HTMLElement,
      faq: document.getElementById(sectionIds.faq) as HTMLElement
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setIsSticky(containerRect.top <= 0);

        // Find the section currently in view
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        let currentSection = 'chart';

        Object.entries(sections.current).forEach(([id, element]) => {
          if (element) {
            const { top, bottom } = element.getBoundingClientRect();
            const elementTop = top + window.scrollY;
            const elementBottom = bottom + window.scrollY;

            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              currentSection = id;
            }
          }
        });

        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds.about, sectionIds.chart, sectionIds.converter, sectionIds.faq, sectionIds.fomo, sectionIds.markets, sectionIds.prediction, sectionIds.tokenomics]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveSection(hash);
        const section = document.getElementById(hash);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setActiveSection('chart');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSectionHover = (sectionId: string) => {
    if (sections.current[sectionId]) {
      setActiveSection(sectionId);
    }
  };
  const chartData = coin?.history?.map(point => [
    new Date(point.timestamp).getTime(),
    point.price,
  ])?.reverse() || [];

  const ogImageUrl = coin.cmcId 
    ? `${process.env.NEXT_PUBLIC_URL}/api/og-image/${coin.id}`
    : `${process.env.NEXT_PUBLIC_URL}/og-fallback.png`;

  // For structured data, we can still use the dynamic version
  const structuredDataImageUrl = `${process.env.NEXT_PUBLIC_URL}/api/og-image/${coin.id}`;

  console.log("OG IMAGE URL: ", ogImageUrl);


  if (!coin?.name || !coin?.ticker) {
    return (
      <CoinMainWrapper>
        <Container>
          <h1>No data available for this coin</h1>
        </Container>
      </CoinMainWrapper>
    );
  }

  return (
    <div>
      <SEO
        title={`${capitalize(coin.name)} (${coin.ticker}) price right now, ${coin.ticker} to USD real-time price`}
        description={`
          The current price of ${coin.name} is ${coin.currentPrice?.usd} with a 24-hour trading volume of ${coin.marketData?.volume24h}. We update our ${coin.ticker} to USD price in real-time.`}
        ogImage={ogImageUrl}
        ogType="article"
        // Add structured data for rich results
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": `${coin.name} (${coin.ticker})`,
          "description": coin.description || generateCoinAboutText(coin, true),
          "url": getPageUrl(`/${coin.name.toLowerCase()}-${coin.ticker.toLowerCase()}`),
          "image": structuredDataImageUrl,
          "category": coin.categories?.map(c => c.category.name).join(", ") || "Cryptocurrency",
          "offers": {
            "@type": "Offer",
            "price": coin.currentPrice?.usd || 0,
            "priceCurrency": "USD"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": getPageUrl(`/${coin.name.toLowerCase()}-${coin.ticker.toLowerCase()}`)
          }
        }}
      />
      {!isMobile ? <CoinPageContainerWrapper ref={containerRef}>
        <>
          <CoinLeftSidebar
            coin={{ ...coin, cmdId: coin.cmcId }}
            isStick={isSticky}
          />

          <CoinMainContent
            coin={coin}
            topTokens={topTokens}
            sectionIds={sectionIds}
            isNavSticky={isSticky}
          />

          <CoinRightSidebar
            coin={{ ...coin, cmdId: coin.cmcId }}
            isStick={isSticky}
          />
        </>

      </CoinPageContainerWrapper> : <MobileCoin coin={coin} topTokens={topTokens} />}
    </div>
  );
};

export default Coin;



const ComponentLoader = () => (
  <LoaderWrapper>
    <LoaderContent>
      <LoaderShimmer />
    </LoaderContent>
  </LoaderWrapper>
);



const CoinPageContainerWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  max-width: 1920px;
  margin: 0 auto;

  > *:first-child, > *:last-child { // Sidebars
    position: sticky;
    top: 0px;
    height: calc(100vh - 48px);
    overflow-y: auto;
    align-self: flex-start;
    z-index: 100;
  }

  > *:nth-child(2) { // Main content
    flex: 1;
    min-width: 0;
    position: relative;
  }

  @media (max-width: 1280px) {
    padding: 16px;
    gap: 16px;
    flex-direction: column;
    
    > *:first-child,
    > *:last-child {
      display: block;
      position: relative;
      top: 0;
      height: auto;
      width: 100%;
    }

    > *:first-child { // Left sidebar on mobile
      order: 1;
      margin-bottom: 16px;
    }

    > *:nth-child(2) { // Main content on mobile
      order: 2;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 16px 0;
      padding-bottom: 16px;
    }

    > *:last-child { // Right sidebar on mobile
      order: 3;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;

    > *:nth-child(2) {
      margin: 12px 0;
    }
  }
`;

const LoaderWrapper = styled.div`
  width: 100%;
  min-height: 200px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const LoaderContent = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.backgroundHover};
  position: absolute;
  top: 0;
  left: 0;
`;

const LoaderShimmer = styled.div`
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    ${props => props.theme.colors.cardBackground} 50%,
    transparent 100%
  );
  animation: shimmer 1s infinite;
  position: absolute;
  top: 0;
  left: 0;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
`;

const CoinMainWrapper = styled.div`
  padding: 16px 0;
  background: ${props => props.theme.colors.background};
  width: 100%;
  overflow-x: hidden;


`;