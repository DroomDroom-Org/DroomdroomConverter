import { GetStaticProps, GetStaticPaths } from 'next';
import axios from 'axios';
import { getApiUrl } from 'utils/config';
import Converter from 'pages/converter';
import prisma from '../../../src/lib/prisma';
import { generateTokenUrl } from '../../../src/utils/url';
import { CURRENCIES } from '../../../src/context/CurrencyContext';

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const tokens = await prisma.token.findMany({
      select: {
        id: true,
        name: true,
        ticker: true,
        rank: true,
      },
      orderBy: {
        rank: 'asc'
      },
      where: {
        rank: {
          lte: 2000 
        }
      }
    });

    const fiatCurrencies = Object.keys(CURRENCIES);
    
    const btc = tokens.find(t => t.ticker.toUpperCase() === 'BTC');
    const eth = tokens.find(t => t.ticker.toUpperCase() === 'ETH');
    const usdt = tokens.find(t => t.ticker.toUpperCase() === 'USDT');
    
    if (!btc || !eth || !usdt) {
      throw new Error('Could not find one of the required base tokens (BTC, ETH, USDT)');
    }

    const btcSlug = generateTokenUrl(btc.name, btc.ticker);
    const ethSlug = generateTokenUrl(eth.name, eth.ticker);
    const usdtSlug = generateTokenUrl(usdt.name, usdt.ticker);

    let paths: { params: { from: string, to: string } }[] = [];
    
    for (const fiatCode of fiatCurrencies) {
      paths.push({
        params: { from: btcSlug, to: fiatCode.toLowerCase() }
      });
    }
    
    for (const fiatCode of fiatCurrencies) {
      paths.push({
        params: { from: ethSlug, to: fiatCode.toLowerCase() }
      });
    }
    
    const top100Tokens = tokens.filter(t => t.rank && t.rank <= 100 && t.ticker.toUpperCase() !== 'USDT');
    for (const token of top100Tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      paths.push({
        params: { from: usdtSlug, to: tokenSlug }
      });
    }
    
    for (const token of top100Tokens.filter(t => t.ticker.toUpperCase() !== 'BTC')) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      paths.push({
        params: { from: btcSlug, to: tokenSlug }
      });
    }
    
    for (const token of top100Tokens.filter(t => t.ticker.toUpperCase() !== 'ETH')) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      paths.push({
        params: { from: ethSlug, to: tokenSlug }
      });
    }
    
    for (const token of top100Tokens) {
      const tokenSlug = generateTokenUrl(token.name, token.ticker);
      paths.push({
        params: { from: tokenSlug, to: 'usd' }
      });
    }

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
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
      lastUpdated: token.lastUpdated || new Date().toISOString(),
      isCrypto: !['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'].includes(token.ticker),
    }));

    const fromTicker = from.split('-').pop()?.toUpperCase() || '';
    const toTicker = to.split('-').pop()?.toUpperCase() || '';

    const fromToken = tokens.find((t: any) => t.ticker.toUpperCase() === fromTicker);
    const toToken = tokens.find((t: any) => t.ticker.toUpperCase() === toTicker);

    if (!fromToken || !toToken) {
      const btcToken = tokens.find((t: any) => t.ticker.toUpperCase() === 'BTC') || tokens[0];
      const usdtToken = tokens.find((t: any) => t.ticker.toUpperCase() === 'USDT') || tokens[1] || tokens[0];
      
      return {
        props: {
          tokens,
          initialFrom: btcToken.ticker,
          initialTo: usdtToken.ticker,
          notFound: true,
          requestedFrom: fromTicker,
          requestedTo: toTicker
        },
      };
    }

    return {
      props: {
        tokens,
        initialFrom: fromToken.ticker,
        initialTo: toToken.ticker,
        notFound: false
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      props: {
        tokens: [],
        initialFrom: 'BTC',
        initialTo: 'USDT',
        error: true
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
};

export default Converter; 