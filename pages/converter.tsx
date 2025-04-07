import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getApiUrl } from 'utils/config';
import SEO from 'components/SEO/SEO';
import Navbar from 'components/Navbar/Navbar';
import Market from 'src/components/Market/Market';
import About from 'src/components/About/About';
import FAQ from 'src/components/FAQ';
import Related from 'src/components/Related';
import ConversionTables from 'src/components/ConversionTables';
import SimilarCrypto from 'src/components/SimilarCrypto/SimilarCrypto';
import SearchCoin from 'src/components/SearchCoin/SearchCoin';
import MoreConversions from 'src/components/MoreConversions/MoreConversions';
import { useCurrency, CURRENCIES } from 'src/context/CurrencyContext';
import { ChevronDown, ChevronUp, ArrowLeftRight, Loader, Share2 } from 'lucide-react';
import { config } from 'src/utils/config';
import { useRouter } from 'next/router';
import { formatDate } from 'date-fns';

export interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  isCrypto: boolean;
  priceChange:{
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;

}


interface ConverterProps {
  tokens: TokenData[];
  initialFrom: string;
  initialTo: string;
  notFound?: boolean;
  requestedFrom?: string;
  requestedTo?: string;
  error?: boolean;
}

const ConverterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
`;

const ConverterCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  padding: 0;
  margin: 80px auto;
  max-width: 1000px;
  border-radius: 0;
  border: none;
  box-shadow: none;
  
  @media (max-width: 768px) {
    padding: 0;
    margin: 80px auto;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-top: 5px;
`;

const CryptoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: -8px;
`;

const ConversionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 16px 0px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 300;
  color: ${props => props.theme.colors.textColor};
  margin: 0;
  line-height: 1.2;

  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ExchangeRate = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textColorSub};
  margin: 0;
  margin-bottom: 20px;
`;

const ConversionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 50px;
  background: ${props => props.theme.colors.colorNeutral1};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  padding: 0 120px 0 20px;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
    
  &[type=number] {
    -moz-appearance: textfield;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textColorSub};
  }
`;

const SelectButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 46px;
  min-width: 100px;
  padding: 8px 40px 8px 15px;
  border: none;
  border-radius: 50px;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorLightNeutral2};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  font-weight: 500;
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  }
  
  &:focus {
    outline: none;
  }
`;

const SwapIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SwapButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textColor};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.colorLightNeutral1};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2px;
  }
`;

const BuyButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const BuyButton = styled.button`
  background: #4A49F5;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4A49F5;
  }
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  color: #4A49F5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4A49F5;
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const LastUpdated = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${props => props.theme.colors.textColorSub};
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #4A49F5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4A49F5;
    text-decoration: underline;
  }
  
  &:disabled {
    color: ${props => props.theme.colors.textColorSub};
    cursor: not-allowed;
    text-decoration: none;
  }
  
  svg {
    animation: ${props => props.disabled ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TokenName = styled.span<{ ticker?: string }>`
  color: ${({ ticker, theme }) => {
    const tokenColors: Record<string, string> = {
      'BTC': '#F7931A',
      'USDT': '#26A17B'
    };
    return ticker && tokenColors[ticker] ? tokenColors[ticker] : theme.colors.textColor;
  }};
  font-weight: 300;
`;

const TokenText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SelectArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

const SearchWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  z-index: 100000;
  width: 360px;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { from, to } = context.query;
    const response = await axios.get(getApiUrl(`/coins`), {
      params: {
        page: 1,
        pageSize: 50,
      },
    });
    
    const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
    
    const tokens = response.data.tokens.map((token: any) => ({
      id: token.id || '',
      ticker: token.ticker || '',
      name: token.name || '',
      price: token.price || 0,
      rank: token.rank || 0,
      iconUrl: token.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png` : '',
      cmcId: token.cmcId || '0',
      status: token.status || 'stable',
      priceChange: token.priceChange || { '1h': 0, '24h': 0, '7d': 0 },
      marketCap: token.marketCap || '0',
      volume24h: token.volume24h || '0',
      circulatingSupply: token.circulatingSupply || '0',
      lastUpdated: token.lastUpdated || new Date().toISOString(),
      isCrypto: !fiatTickers.map(ticker => ticker.toLowerCase()).includes(token.ticker.toLowerCase()),
    }));

    return {
      props: {
        tokens,
        initialFrom: from || 'BTC',
        initialTo: to || 'USDT',
      },
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      props: {
        tokens: [],
        initialFrom: 'BTC',
        initialTo: 'USDT',
      },
    };
  }
};

const getSymbol = (coin: any): string => {
  return typeof coin.ticker === 'string' ? coin.ticker : '';
};

const getToSymbol = (coin: any): string => {
  if (!coin.toToken) return '';
  return typeof coin.toToken === 'object' && coin.toToken.ticker
    ? coin.toToken.ticker
    : typeof coin.toToken === 'string'
      ? coin.toToken
      : '';
};

const Converter: React.FC<ConverterProps> = ({ tokens, initialFrom, initialTo, notFound, requestedFrom, requestedTo, error }) => {
  const router = useRouter();
  const [fromToken, setFromToken] = useState<TokenData | null>(null);
  const [toToken, setToToken] = useState<TokenData | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('');
  const [showFromSearch, setShowFromSearch] = useState<boolean>(false);
  const [showToSearch, setShowToSearch] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const { fiatCurrencies } = useCurrency();

  const fromButtonRef = useRef<HTMLButtonElement>(null);
  const toButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const fromTokenFound = tokens.find(t => t.ticker === initialFrom);
      const toTokenFound = tokens.find(t => t.ticker === initialTo);
      
      if (fromTokenFound) {
        setFromToken(fromTokenFound);
      } else if (initialFrom) {
        const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
        const fiatCurrency = Object.values(CURRENCIES).find(
          (currency: any) => currency.code.toUpperCase() === initialFrom
        );
        
        setFromToken({
          id: `placeholder-${initialFrom}`,
          ticker: initialFrom,
          name: fiatCurrency ? fiatCurrency.name : initialFrom,
          price: 0,
          cmcId: '',
          rank: 0,
          iconUrl: '',
          status: 'stable',
          priceChange: { '1h': 0, '24h': 0, '7d': 0 },
          marketCap: '0',
          volume24h: '0',
          circulatingSupply: null,
          lastUpdated: new Date().toISOString(),
          isCrypto: !fiatTickers.includes(initialFrom),
        });
      } else {
        const btcToken = tokens.find(t => t.ticker === 'BTC') || tokens[0];
        setFromToken(btcToken);
      }
      
      if (toTokenFound) {
        setToToken(toTokenFound);
      } else if (initialTo) {
        const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
        const fiatCurrency = Object.values(CURRENCIES).find(
          (currency: any) => currency.code.toUpperCase() === initialTo
        );
        
        setToToken({
          id: `placeholder-${initialTo}`,
          ticker: initialTo,
          name: fiatCurrency ? fiatCurrency.name : initialTo,
          price: 0,
          cmcId: '',
          rank: 0,
          iconUrl: '',
          status: 'stable',
          priceChange: { '1h': 0, '24h': 0, '7d': 0 },
          marketCap: '0',
          volume24h: '0',
          circulatingSupply: null,
          lastUpdated: new Date().toISOString(),
          isCrypto: !fiatTickers.includes(initialTo),
        });
      } else {
        const usdtToken = tokens.find(t => t.ticker === 'USDT') || tokens[1] || tokens[0];
        setToToken(usdtToken);
      }
    }
  }, [tokens, initialFrom, initialTo, CURRENCIES]);

  const calculateConversionRate = useCallback((
    fromToken: TokenData,
    toToken: TokenData
  ) => {
      // Validate that both tokens have valid prices
    console.log(fromToken, toToken);
    if (
      !fromToken?.price ||
      !toToken?.price ||
      isNaN(fromToken.price) ||
      isNaN(toToken.price) ||
      fromToken.price <= 0 ||
      toToken.price <= 0
    ) {
      console.warn("Invalid price detected:", {
        fromToken: fromToken?.ticker,
        fromPrice: fromToken?.price,
        toToken: toToken?.ticker,
        toPrice: toToken?.price,
      });
      return 0;
    }

    if (!fromToken.isCrypto && toToken.isCrypto) {
      return 1 / (fromToken.price * toToken.price);
    } else if (fromToken.isCrypto && !toToken.isCrypto) {
      return fromToken.price * toToken.price;
    } else {
      // Both crypto or both fiat
      return fromToken.price / toToken.price;
    }
  }, []);

  const getDecimalPlaces = useCallback((token: TokenData) => {
    if (!token.isCrypto) return 2;
    if (token.ticker === 'USDT' || token.ticker === 'USDC' || token.ticker === 'DAI' || token.ticker === 'BUSD') return 2;
    return 8;
  }, []);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const rate = calculateConversionRate(fromToken, toToken);
        if (rate === 0) {
          if (toAmount !== "Price unavailable") {
            setToAmount("Price unavailable");
          }
        } else {
          const convertedAmount = amount * rate;
          const formattedAmount = convertedAmount.toFixed(getDecimalPlaces(toToken));
          if (toAmount !== formattedAmount) {
            setToAmount(formattedAmount);
          }
        }
      } else {
        if (toAmount !== "0") {
          setToAmount("0");
        }
      }
    }
  }, [fromToken, toToken, fromAmount, calculateConversionRate, getDecimalPlaces, toAmount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (fromButtonRef.current && !fromButtonRef.current.contains(event.target as Node)) ||
        (toButtonRef.current && !toButtonRef.current.contains(event.target as Node))
      ) {
        setShowFromSearch(false);
        setShowToSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCoinPrice = async (token: TokenData | null) => {
    if (!token || !token.cmcId) {
      console.warn("Invalid token or missing cmcId:", token);
      return null;
    }

    try {
      const basePath = config.basePath || '';
      const url = `${basePath}/api/coin/price/${token.cmcId}`;      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }

      const data = await response.json();

      // Validate the price data
      if (
        !data ||
        typeof data.price !== "number" ||
        isNaN(data.price) ||
        data.price <= 0
      ) {
        console.warn("Invalid price data received:", data);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching price for ${token.ticker}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const handleDocumentClick = () => {
      if (showFromSearch || showToSearch) {
        setShowFromSearch(false);
        setShowToSearch(false);
      }
    };

    // Only add the event listener if search modals are open
    if (showFromSearch || showToSearch) {
      document.addEventListener('click', handleDocumentClick);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [showFromSearch, showToSearch]);

  const handleSwapTokens = useCallback(() => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    if (toAmount) {
      setFromAmount(toAmount);
    }
  }, [fromToken, toToken, toAmount]);

  const toggleFromSearch = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showToSearch) {
      setShowToSearch(false);
    }
    // Only toggle if the state would actually change
    if (showFromSearch) {
      setShowFromSearch(false);
    } else {
      setTimeout(() => {
        setShowFromSearch(true);
      }, 10);
    }
  }, [showToSearch, showFromSearch]);

  const toggleToSearch = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showFromSearch) {
      setShowFromSearch(false);
    }
    // Only toggle if the state would actually change
    if (showToSearch) {
      setShowToSearch(false);
    } else {
      setTimeout(() => {
        setShowToSearch(true);
      }, 10);
    }
  }, [showFromSearch, showToSearch]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !fromToken || !toToken) return;
    setIsRefreshing(true);

    try {
      const [fromPrice, toPrice] = await Promise.all([
        fetchCoinPrice(fromToken),
        fetchCoinPrice(toToken),
      ]);

      if (!fromPrice?.price || !toPrice?.price) {
        console.warn("Failed to fetch valid price data");
        setIsRefreshing(false);
        return;
      }

      // Only update tokens if prices have changed
      const fromPriceChanged = fromPrice.price !== fromToken.price;
      const toPriceChanged = toPrice.price !== toToken.price;
      
      if (fromPriceChanged || toPriceChanged) {
        const updatedFromToken: TokenData = {
          ...fromToken,
          price: fromPrice.price,
          priceChange: {
            "1h": 0,
            "24h": fromPrice.price_change_24h || 0,
            "7d": 0,
          },
          lastUpdated: new Date().toISOString(),
        };

        const updatedToToken: TokenData = {
          ...toToken,
          price: toPrice.price,
          priceChange: {
            "1h": 0,
            "24h": toPrice.price_change_24h || 0,
            "7d": 0,
          },
          lastUpdated: new Date().toISOString(),
        };

        if (fromPriceChanged) {
          setFromToken(updatedFromToken);
        }
        
        if (toPriceChanged) {
          setToToken(updatedToToken);
        }

        // Only recalculate if prices changed
        const amount = parseFloat(fromAmount);
        if (!isNaN(amount)) {
          const rate = calculateConversionRate(
            fromPriceChanged ? updatedFromToken : fromToken, 
            toPriceChanged ? updatedToToken : toToken
          );
          
          if (rate === 0) {
            setToAmount("Price unavailable");
          } else {
            const convertedAmount = amount * rate;
            setToAmount(
              convertedAmount.toFixed(getDecimalPlaces(toPriceChanged ? updatedToToken : toToken))
            );
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, fromToken, toToken, fromAmount, calculateConversionRate, getDecimalPlaces]);

  const generateAdvancedOptions = useCallback(() => {
    const from = tokens.find((t) => t.ticker === fromToken?.ticker);
    const to = tokens.find((t) => t.ticker === toToken?.ticker);

    const topCryptos = tokens
      .filter((t) => !["USDT", "USDC", "DAI", "BUSD"].includes(t.ticker))
      .sort((a, b) => parseFloat(b.marketCap) - parseFloat(a.marketCap))
      .slice(0, 10);

    const options = [];

    if (from) {
      topCryptos.forEach((crypto, index) => {
        options.push({
          id: `advanced-${index}`,
          name: `${crypto.name} to Tether`,
          fromToken: crypto.name,
          toToken: 'Tether',
          fromTicker: crypto.ticker,
          toTicker: 'USDT',
          iconUrl: crypto.iconUrl,
        });
      });
    }

    if (to) {
      topCryptos.slice(0, 3).forEach((crypto, index) => {
        options.push({
          id: `advanced-usdc-${index}`,
          name: `${crypto.name} to USDC`,
          fromToken: crypto.name,
          toToken: "USDC",
          fromTicker: crypto.ticker,
          toTicker: "USDC",
          iconUrl: crypto.iconUrl,
        });
      });
    }

    for (let i = 0; i < Math.min(4, topCryptos.length - 1); i++) {
      const fromCrypto = topCryptos[i];
      const toCrypto = topCryptos[i + 1];

      options.push({
        id: `advanced-cross-${i}`,
        name: `${fromCrypto.name} to ${toCrypto.name}`,
        fromToken: fromCrypto.name,
        toToken: toCrypto.name,
        fromTicker: fromCrypto.ticker,
        toTicker: toCrypto.ticker,
        iconUrl: fromCrypto.iconUrl,
      });
    }

    return options.slice(0, 12);
  }, [tokens, fromToken, toToken]);

  const generateCurrencyOptions = useCallback(() => {
    const fiatCurrencies = Object.values(CURRENCIES);

    const diverseCryptos = tokens
      .filter((t, index) => index % 10 === 0)
      .slice(0, 8);

    return diverseCryptos.map((crypto, index) => ({
      id: `currency-${index}`,
      name: `${crypto.name} to ${fiatCurrencies[index].name}`,
      fromToken: crypto.name,
      toToken: fiatCurrencies[index].name,
      fromTicker: crypto.ticker,
      toTicker: fiatCurrencies[index].code,
      iconUrl: crypto.iconUrl,
    }));
  }, [tokens]);

  const advancedOptions = useMemo(() => generateAdvancedOptions(), [generateAdvancedOptions]);
  const currencyOptions = useMemo(() => generateCurrencyOptions(), [generateCurrencyOptions]);

  const closeAllSearchModals = useCallback(() => {
    setShowFromSearch(false);
    setShowToSearch(false);
  }, []);

  // Handle not found routes separately
  useEffect(() => {
    if (notFound && router && typeof window !== 'undefined' && requestedFrom && requestedTo) {
      // Instead of redirecting, try to fetch the tokens from the API
      const fetchTokens = async () => {
        try {
          const response = await axios.get(getApiUrl(`/coins`), {
            params: {
              page: 1,
              pageSize: 200,
            },
          });
          
          const fetchedTokens = response.data.tokens.map((token: any) => ({
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
          
          const fromToken = fetchedTokens.find((t: any) => t.ticker.toUpperCase() === requestedFrom);
          const toToken = fetchedTokens.find((t: any) => t.ticker.toUpperCase() === requestedTo);
          
          if (fromToken && toToken) {
            setFromToken(fromToken);
            setToToken(toToken);
          } else {
            // Create placeholder tokens if not found in API
            const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
            
            if (!fromToken) {
              // Check if it's a valid fiat currency
              const fiatCurrency = Object.values(CURRENCIES).find(
                (currency: any) => currency.code.toUpperCase() === requestedFrom
              );
              
              const placeholderFromToken = {
                id: `placeholder-${requestedFrom}`,
                ticker: requestedFrom,
                name: fiatCurrency ? fiatCurrency.name : requestedFrom,
                price: 0,
                cmcId: '',
                rank: 0,
                iconUrl: '',
                status: 'stable',
                priceChange: { '1h': 0, '24h': 0, '7d': 0 },
                marketCap: '0',
                volume24h: '0',
                circulatingSupply: null,
                lastUpdated: new Date().toISOString(),
                isCrypto: !fiatTickers.includes(requestedFrom),
              };
              setFromToken(placeholderFromToken);
            }
            
            if (!toToken) {
              // Check if it's a valid fiat currency
              const fiatCurrency = Object.values(CURRENCIES).find(
                (currency: any) => currency.code.toUpperCase() === requestedTo
              );
              
              const placeholderToToken = {
                id: `placeholder-${requestedTo}`,
                ticker: requestedTo,
                name: fiatCurrency ? fiatCurrency.name : requestedTo,
                price: 0,
                cmcId: '',
                rank: 0,
                iconUrl: '',
                status: 'stable',
                priceChange: { '1h': 0, '24h': 0, '7d': 0 },
                marketCap: '0',
                volume24h: '0',
                circulatingSupply: null,
                lastUpdated: new Date().toISOString(),
                isCrypto: !fiatTickers.includes(requestedTo),
              };
              setToToken(placeholderToToken);
            }
          }
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      };
      
      fetchTokens();
    }
  }, [notFound, router, requestedFrom, requestedTo]);

  // Update URL when tokens are loaded
  useEffect(() => {
    if (fromToken && toToken && router && typeof window !== 'undefined') {
      const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
      
      let fromSlug = '';
      let toSlug = '';
      
      if (fiatTickers.includes(fromToken.ticker)) {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      } else {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      }
      
      if (fiatTickers.includes(toToken.ticker)) {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      } else {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      }
      
      const newPath = `/${fromSlug}/${toSlug}`;
      
      if (router.asPath !== newPath && !router.asPath.includes('/bitcoin-btc/tether-usdt-usdt')) {
        router.push(
          newPath,
          undefined,
          { shallow: true }
        );
      }
    }
  }, [fromToken, toToken, router]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, []);
  
  const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
  const handleCoinClick = useCallback((coin: any, side: 'from' | 'to') => {
    console.log("handleCoinClick called with:", { coin, side });
    
    // Define fiat currency names mapping
    const fiatNames: Record<string, string> = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'JPY': 'Japanese Yen',
      'AUD': 'Australian Dollar',
      'CAD': 'Canadian Dollar',
      'CHF': 'Swiss Franc',
      'CNY': 'Chinese Yuan',
      'INR': 'Indian Rupee',
      'AED': 'UAE Dirham'
    };
    
    // Ensure the coin has all required properties
    const token = {
      id: coin.id || `token-${coin.ticker || coin.symbol || 'unknown'}`,
      ticker: coin.ticker || coin.symbol || '',
      // For fiat currencies, ensure we have the full name
      name: coin.name || (fiatNames[coin.ticker] || coin.ticker),
      isCrypto: !fiatTickers.map(ticker => ticker.toLowerCase()).includes((coin.ticker || coin.symbol || '').toLowerCase()),
      cmcId: coin?.cmcId ?? 0,
      iconUrl: coin?.iconUrl ?? `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.cmcId}.png`,
      price: coin?.currentPrice?.usd ?? coin?.price ?? 0,
      priceChange: {
        "1h": coin?.priceChange?.day1 ?? coin?.priceChange?.["1h"] ?? 0,
        "24h": coin?.priceChange?.day1 ?? coin?.priceChange?.["24h"] ?? 0,
        "7d": coin?.priceChange?.day1 ?? coin?.priceChange?.["7d"] ?? 0,
      },
      marketCap: coin?.marketData?.marketCap ?? coin?.marketCap ?? 0,
      volume24h: coin?.marketData?.volume24h ?? coin?.volume24h ?? 0,
      circulatingSupply: coin?.marketData?.circulatingSupply ?? coin?.circulatingSupply ?? 0,
      lastUpdated: coin?.cmcData?.lastUpdated ?? coin?.lastUpdated ?? new Date(),
    }
    
    console.log("Processed token:", token);
    
    // Helper function to get the proper slug for a token
    const getTokenSlug = (token: any) => {
      const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
      
      console.log("getTokenSlug called with token:", token);
      
      if (fiatTickers.includes(token.ticker)) {
        // For fiat currencies, use the format "currency-name-currency-code"
        const fiatName = token.name || fiatNames[token.ticker] || token.ticker;
        console.log("Fiat currency detected:", token.ticker, "Using name:", fiatName);
        return `${fiatName.toLowerCase().replace(/\s+/g, '-')}-${token.ticker.toLowerCase()}`;
      } else {
        return `${token.name.toLowerCase().replace(/\s+/g, '-')}-${token.ticker.toLowerCase()}`;
      }
    };
    
    if (side === 'from') {
      console.log("Setting fromToken to:", token);
      setFromToken(token as TokenData);
      
      // Update URL immediately when a token is selected
      if (toToken && router && typeof window !== 'undefined') {
        const fromSlug = getTokenSlug(token);
        const toSlug = getTokenSlug(toToken);
        
        const newPath = `/${fromSlug}/${toSlug}`;
        console.log("Generated new path for from token:", newPath);
        console.log("Current router path:", router.asPath);
        
        // Use Next.js router for client-side navigation (much faster)
        router.push(newPath, undefined, { shallow: true });
      } else {
        console.log("Could not update URL - missing toToken, router, or window");
      }
    } else {
      console.log("Setting toToken to:", token);
      setToToken(token as TokenData);
      
      // Update URL immediately when a token is selected
      if (fromToken && router && typeof window !== 'undefined') {
        const fromSlug = getTokenSlug(fromToken);
        const toSlug = getTokenSlug(token);
        
        const newPath = `/${fromSlug}/${toSlug}`;
        console.log("Generated new path for to token:", newPath);
        console.log("Current router path:", router.asPath);
        
        // Use Next.js router for client-side navigation (much faster)
        router.push(newPath, undefined, { shallow: true });
      } else {
        console.log("Could not update URL - missing fromToken, router, or window");
      }
    }
  }, [fromToken, toToken, router]);

  // Fetch prices for placeholder tokens
  useEffect(() => {
    const fetchPlaceholderPrices = async () => {
      if (!fromToken || !toToken) return;
      
      // Check if either token is a placeholder
      const isFromPlaceholder = fromToken.id && fromToken.id.startsWith('placeholder-');
      const isToPlaceholder = toToken.id && toToken.id.startsWith('placeholder-');
      
      if (!isFromPlaceholder && !isToPlaceholder) return;
      
      try {
        // For fiat currencies, we can use a fixed price
        const fiatTickers = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];
        
        if (isFromPlaceholder && fiatTickers.includes(fromToken.ticker)) {
          // For fiat currencies, set a fixed price
          setFromToken(prev => ({
            ...prev!,
            price: 1,
            lastUpdated: new Date().toISOString(),
          }));
        }
        
        if (isToPlaceholder && fiatTickers.includes(toToken.ticker)) {
          // For fiat currencies, set a fixed price
          setToToken(prev => ({
            ...prev!,
            price: 1,
            lastUpdated: new Date().toISOString(),
          }));
        }
        
        // For crypto tokens, try to fetch from an external API
        if (isFromPlaceholder && !fiatTickers.includes(fromToken.ticker)) {
          try {
            // Try to fetch from CoinGecko API
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromToken.ticker.toLowerCase()}&vs_currencies=usd`);
            const price = response.data[fromToken.ticker.toLowerCase()]?.usd;
            
            if (price) {
              setFromToken(prev => ({
                ...prev!,
                price,
                lastUpdated: new Date().toISOString(),
              }));
            }
          } catch (error) {
            console.error(`Error fetching price for ${fromToken.ticker}:`, error);
          }
        }
        
        if (isToPlaceholder && !fiatTickers.includes(toToken.ticker)) {
          try {
            // Try to fetch from CoinGecko API
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${toToken.ticker.toLowerCase()}&vs_currencies=usd`);
            const price = response.data[toToken.ticker.toLowerCase()]?.usd;
            
            if (price) {
              setToToken(prev => ({
                ...prev!,
                price,
                lastUpdated: new Date().toISOString(),
              }));
            }
          } catch (error) {
            console.error(`Error fetching price for ${toToken.ticker}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching placeholder prices:', error);
      }
    };
    
    fetchPlaceholderPrices();
  }, [fromToken, toToken]);

  console.log("FROM TOKEN", fromToken);
  console.log("TO TOKEN", toToken);

  return (
    <ConverterContainer>
      <SEO
        title="Convert Cryptocurrencies | DroomDroom"
        description="Convert between cryptocurrencies like Bitcoin (BTC) and stablecoins like Tether (USDT) with real-time exchange rates."
        keywords="cryptocurrency converter, crypto swap, bitcoin converter, BTC to USDT, crypto exchange rates"
        ogType="website"
      />
      <ConverterCard>
        <ConversionHeader>
          <TitleWrapper>
            <IconsWrapper>
              {fromToken?.isCrypto ? (
                <CryptoIcon src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${fromToken?.cmcId}.png`} alt={fromToken?.ticker} />
              ) : (
                <CryptoIcon src={`https://flagcdn.com/w80/${fromToken?.ticker.toLowerCase().slice(0, 2)}.png`} alt={fromToken?.ticker} />
              )}
              {toToken?.isCrypto ? (
                <CryptoIcon src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${toToken?.cmcId}.png`} alt={toToken?.ticker} />
              ) : (
                <CryptoIcon src={`https://flagcdn.com/w80/${toToken?.ticker.toLowerCase().slice(0, 2)}.png`} alt={toToken?.ticker} />
              )}
            </IconsWrapper>
            <Title>
              Convert and swap{" "}
              <TokenName ticker={fromToken?.ticker}>
                {fromToken?.name}
              </TokenName>{" "}
              to <TokenName ticker={toToken?.ticker}>{toToken?.name}</TokenName>
            </Title>
          </TitleWrapper>

          <ExchangeRate>
            {fromToken?.ticker}/{toToken?.ticker} {fromAmount}{" "}
            {fromToken?.ticker} equals {toAmount} {toToken?.ticker}
          </ExchangeRate>

          <BuyButtonWrapper>
            <BuyButton>Buy {fromToken?.name}</BuyButton>
          </BuyButtonWrapper>
        </ConversionHeader>

        <ConversionForm>
          <InputRow onClick={(e) => e.stopPropagation()}>
            <InputWrapper>
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="1"
                min="0"
                onClick={(e) => e.stopPropagation()}
              />
              <SelectButton
                onClick={toggleFromSearch}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TokenText>{fromToken?.ticker}</TokenText>
                <SelectArrow>
                  {showFromSearch ? <ChevronUp /> : <ChevronDown />}
                </SelectArrow>
              </SelectButton>
              {showFromSearch && (
                <SearchWrapper>
                  <SearchCoin
                    coins={tokens}
                    fiatCurrencies={fiatCurrencies}
                    onSelectToken={(token) => {
                      handleCoinClick(token, 'from');
                      setShowFromSearch(false);
                    }}
                    isVisible={showFromSearch}
                    onClose={() => setShowFromSearch(false)}
                  />
                </SearchWrapper>
              )}
            </InputWrapper>

            <SwapIconWrapper>
              <SwapButton onClick={handleSwapTokens}>
                <ArrowLeftRight />
              </SwapButton>
            </SwapIconWrapper>

            <InputWrapper>
              <Input
                type="text"
                value={toAmount || "81821.48"}
                readOnly
                placeholder="0"
                onClick={(e) => e.stopPropagation()}
              />
              <SelectButton
                onClick={toggleToSearch}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TokenText>{toToken?.ticker}</TokenText>
                <SelectArrow>
                  {showToSearch ? <ChevronUp /> : <ChevronDown />}
                </SelectArrow>
              </SelectButton>
              {showToSearch && (
                <SearchWrapper>
                  <SearchCoin
                    coins={tokens}
                    fiatCurrencies={fiatCurrencies}
                    onSelectToken={(token) => {
                      handleCoinClick(token, 'to');
                      setShowToSearch(false);
                    }}
                    isVisible={showToSearch}
                    onClose={() => setShowToSearch(false)}
                  />
                </SearchWrapper>
              )}
            </InputWrapper>
          </InputRow>
        </ConversionForm>

        <LastUpdated>
          Last update:{" "}
          {formatDate(
            fromToken?.lastUpdated || new Date(),
            "MMM d, yyyy h:mm a"
          )}
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader size={14} />
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </RefreshButton>
          <ShareButton onClick={handleShare}>
            <Share2 size={14} />
            {copied ? "Copied!" : "Share"}
          </ShareButton>
        </LastUpdated>
      </ConverterCard>

      {fromToken && toToken && (
        <Navbar fromToken={fromToken} toToken={toToken} />
      )}

      {fromToken && toToken && (
        <>
          <Market id="markets" fromToken={fromToken} toToken={toToken} tokens={tokens} fiatCurrencies={fiatCurrencies}/>
          <About id="about" fromToken={fromToken} toToken={toToken} />
          <FAQ id="faq" fromToken={fromToken} toToken={toToken} />
          <Related
            id="related"
            fromToken={fromToken}
            toToken={toToken}
            tokens={tokens}
            setFromToken={setFromToken}
            setToToken={setToToken}
          />
          <div id="conversion-tables">
            <ConversionTables
              id="conversion-tables"
              fromToken={fromToken}
              toToken={toToken}
              fromAmount={fromAmount}
              toAmount={toAmount}
            />
          </div>
        </>
      )}

      {fromToken && <SimilarCrypto coin={fromToken} />}

      <MoreConversions
        id="more"
        advancedOptions={advancedOptions}
        currencyOptions={currencyOptions}
        allTokens={[...tokens, ...fiatCurrencies]}
        setFromToken={setFromToken}
        setToToken={setToToken}
      />
    </ConverterContainer>
  );
};

export default Converter;