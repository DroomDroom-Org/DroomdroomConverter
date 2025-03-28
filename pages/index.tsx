import axios from 'axios';
import SectionHeader from 'components/SectionHeader/SectionHeader';
import Pagination from 'components/Pagination/Pagination';
import HomeTable from 'components/pages/home/HomeTable/HomeTable';
import SEO from 'components/SEO/SEO';
import MarqueeScroll from 'components/MarqueeScroll/MarqueeScroll';
import TrendingCard from 'components/TrendingCard/TrendingCard';
import AdCard from 'components/AdCard/AdCard';
import SmallCard from 'components/SmallCard/SmallCard';


import styled from 'styled-components';
export interface TokenData {
  id: string;
  ticker: string;
  name: string;
  rank: number;
  price: number;
  priceChange: {
    '1h': number | null;
    '24h': number | null;
    '7d': number | null;
  };
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastUpdated: string;
  cmcId: number;
  lastSevenData?: {
    price: number;
    timestamp: string;
  }[];
}

interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

interface Info {
  topGainers: TokenData[];
  topLosers: TokenData[];
  marketCap: {value: number; change: number};
  dominance: {
    btc: number;
    eth: number;
  };
  fear_and_greed: {
    value: number;
    classification: string;
  };
  // cmc100 removed as requested
}
interface HomeProps {
  tokens: TokenData[];
  pagination: PaginationData;
  info: Info;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const page = Number(query.page) || 1;
    const pageSize = 20;

    const response_promise = axios.get(getApiUrl(`/coins`), {
      params: {
        page,
        pageSize,
      },
    });
    
    const info_promise = axios.get(getApiUrl(`/info`));
    
    const top_movers_promise = axios.get(getApiUrl(`/top-movers`));

    const [response, info, topMovers] = await Promise.all([
      response_promise, 
      info_promise, 
      top_movers_promise
    ]);

    return {
      props: {
        tokens: response.data.tokens,
        pagination: response.data.pagination,
        info: {
          ...info.data,
          topGainers: topMovers.data.topGainers,
          topLosers: topMovers.data.topLosers
        }
      },
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      props: {
        tokens: [],
        info: {},
        pagination: {
          currentPage: 1,
          pageSize: 20,
          totalPages: 0,
          totalCount: 0,
          hasMore: false,
        },
      },
    };
  }
};

import { GetServerSideProps } from 'next';
import { getApiUrl, getPageUrl } from 'utils/config';
import { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
export const getServerSidePropsRedirect: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: getPageUrl(""),
      permanent: true,
    },
  };
};

const StyledTrendingContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Home = ({ tokens, pagination, info }: HomeProps) => {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>(tokens.slice(0, 5) || []);
  const [smallCardInfo, setSmallCardInfo] = useState<Info>(info);
  const [tokensWithChartData, setTokensWithChartData] = useState<TokenData[]>([]);
  // state to set if the chart data is being fetched
  const [hasFetchedChartData, setHasFetchedChartData] = useState<boolean>(false);

  const fetchandSetActualChartData = async (tokens: TokenData[]) => {
    const tokensWithChartData = [];
    setHasFetchedChartData(true);
    for (let i = 0; i < tokens.length; i += 3) {
      const batch = tokens.slice(i, i + 3);
      const batchResults = await Promise.all(batch.map(async (token) => {
        const id = token.cmcId;
        const lastSevenData = await axios.get(getApiUrl(`/coin/chart/${id}?timeRange=7d`));
        return {
          ...token,
          lastSevenData: lastSevenData.data
        };
      }));
      tokensWithChartData.push(...batchResults);
    }
    setTokensWithChartData(tokensWithChartData);
    if (typeof window !== 'undefined') {
      (window as any).tokensWithChartData = tokensWithChartData;
    }
  };

  useEffect(() => {
    if (!hasFetchedChartData) {
      fetchandSetActualChartData(tokens);
    }
  }, [tokensWithChartData, hasFetchedChartData, tokens, fetchandSetActualChartData]);

  useEffect(() => {
    // Update trending tokens with top gainers when available
    if (info.topGainers && info.topGainers.length > 0) {
      setTrendingTokens(info.topGainers);
    } else {
      setTrendingTokens(tokens.slice(0, 5) || []);
    }
    
    setSmallCardInfo(info);
    setTokensWithChartData(tokens.map(token => {
      const lastSevenData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        
        const randomVariation = token.price * (0.1 * (Math.random() - 0.5));
        return {
          price: token.price + randomVariation,
          timestamp: date.toISOString()
        };
      });
  
      return {
        ...token,
        lastSevenData
      };
    }));
    // fetchandSetActualChartData(tokensWithChartData);
    // now fetch actual chart data for the tokens with chart data
    // const tokensWithChartData1 = Promise.all(tokensWithChartData.map(async (token) => {
    //   const id = token.cmcId;
    //   const lastSevenData = await axios.get(getApiUrl(`/coin/)chart/${id}`);
    //   return {
    //     ...token,
    //     lastSevenData: lastSevenData.data
    //   };
    // }));
    // tokensWithChartData1.then(data => {
    //   setTokensWithChartData(data);
    // });
  }, [tokens, info]);
   
  

  

  return (
    <div style={{
      width: '100%',
    }}>
      <SEO
        title="DroomDroom: Cryptocurrency Prices, Charts & Market Data"
        description="Top cryptocurrency prices and charts, listed by market capitalization. Free access to current and historic data for Bitcoin and thousands of altcoins."
        keywords="cryptocurrency prices, crypto market cap, bitcoin price, ethereum price, altcoin prices, crypto tracking, blockchain, digital assets, crypto analytics"
        ogType="website"
      />
      <MarqueeScroll />
      <SectionHeader
        title="Today's Cryptocurrency Prices by Market Cap"
        description=""
        showSearch={true}
      />

      <StyledTrendingContainer>
        <TrendingCard 
          tokens={info.topGainers || trendingTokens} 
          status="positive" 
          title="Top Gainers" 
        />
        <TrendingCard 
          tokens={info.topLosers || trendingTokens} 
          status="negative" 
          title="Top Losers" 
        />
        <SmallCard info={smallCardInfo} />
        <AdCard 
          source={`${getPageUrl('/static/ad/eth-ad.gif')}`} 
          text={"Ad"} 
          darkSource={`${getPageUrl('/static/ad/eth-ad-dark.gif')}`} 
        />
      </StyledTrendingContainer>

      <HomeTable initialTokens={tokensWithChartData} />
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
    </div>
  );
};

export default Home;
