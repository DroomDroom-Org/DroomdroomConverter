import { GetServerSideProps } from 'next';
import axios from 'axios';
import { getApiUrl } from 'utils/config';
import Converter from 'pages/converter';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { from, to } = context.params as { from: string; to: string };
    
    const response = await axios.get(getApiUrl(`/coins`), {
      params: {
        page: 1,
        pageSize: 50,
      },
    });

   
 
    const tokens = response.data.tokens.map((token: any) => ({
      id: token.id || '',
      ticker: token.ticker || '',
      name: token.name || '',
      price: token.price || 0,
      cmcId: token.cmcId || '',
      rank: token.rank || 0,
      iconUrl: token.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png` : '',
      status: token.status || 'stable',
      priceChange: token.priceChange || { '1h': 0, '24h': 0, '7d': 0 },
      marketCap: token.marketCap || '0',
      volume24h: token.volume24h || '0',
      circulatingSupply: token.circulatingSupply || null,
      lastUpdated: token.lastUpdated || new Date().toISOString()
    }));

    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    const fromToken = tokens.find((t: any) => t.ticker.toUpperCase() === fromUpper);
    const toToken = tokens.find((t: any) => t.ticker.toUpperCase() === toUpper);

    if (!fromToken || !toToken) {
      return {
        redirect: {
          destination: '/converter/btc/usdt',
          permanent: false,
        },
      };
    }

    return {
      props: {
        tokens,
        initialFrom: fromToken.ticker,
        initialTo: toToken.ticker,
      },
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      redirect: {
        destination: '/converter/btc/usdt',
        permanent: false,
      },
    };
  }
};

export default Converter; 