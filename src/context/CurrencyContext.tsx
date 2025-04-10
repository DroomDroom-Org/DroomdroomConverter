import React, { createContext, useState, useContext, useEffect } from 'react';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' , flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' , flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' , flag: '🇬🇧' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' , flag: '🇯🇵' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' , flag: '🇦🇺' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' , flag: '🇨🇦' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' , flag: '🇨🇭' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' , flag: '🇨🇳' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' , flag: '🇮🇳' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' , flag: '🇦🇪' },
};


export type CurrencyCode = keyof typeof CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (price: number) => string;
  getCurrencySymbol: () => string;
  cryptoAmount: string;
  setCryptoAmount: (amount: string) => void;
  currencyAmount: string;
  setCurrencyAmount: (amount: string) => void;
  fiatCurrencies: any;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  rates: Object.keys(CURRENCIES).reduce((acc, curr) => {
    acc[curr as CurrencyCode] = 1;
    return acc;
  }, {} as Record<CurrencyCode, number>),
  convertPrice: (price) => price,
  formatPrice: (price) => `$${price.toFixed(2)}`,
  getCurrencySymbol: () => '$',
  cryptoAmount: '',
  setCryptoAmount: () => {},
  currencyAmount: '',
  setCurrencyAmount: () => {},
  fiatCurrencies: [],
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150.59,
    AUD: 1.52,
    CAD: 1.35,
    CHF: 0.88,
    CNY: 7.19,
    INR: 83.09,
    AED: 3.67,
  });

  const  currencyList = [{
    id: '1',
    ticker: 'USD',
    name: 'US Dollar',
    cmcId: 4217,
    price: 1,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/us.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
    isCrypto:false,
    symbol: '$',
  },
  {
    id: '2',
    ticker: 'EUR',
    name: 'Euro',
    cmcId: 4217,
    price: 0.92,
    symbol: '€',
    isCrypto:false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/eu.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    ticker: 'GBP',
    name: 'British Pound',
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/gb.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    cmcId: 4217,
    price: 0.79,
    symbol: '£',
    isCrypto: false,
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    ticker: 'JPY',
    name: 'Japanese Yen',
    cmcId: 4217,
    price: 150.59,
    symbol: '¥',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/jp.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    ticker: 'AUD',
    name: 'Australian Dollar',
    cmcId: 4217,
    price: 1.52,
    symbol: 'A$',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/au.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    ticker: 'CAD',
    name: 'Canadian Dollar',
    cmcId: 4217,
    price: 1.35,
    symbol: 'C$',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/ca.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    ticker: 'CHF',
    name: 'Swiss Franc',
    cmcId: 4217,
    price: 0.88,  
    symbol: 'Fr',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/ch.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {   
    id: '7',
    ticker: 'CNY',
    name: 'Chinese Yuan',
    cmcId: 4217, 
    price: 7.19,
    symbol: '¥',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/cn.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '9',
    ticker: 'INR',
    name: 'Indian Rupee',
    cmcId: 4217,
    price: 83.09,
    symbol: '₹',  
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/in.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '8',
    ticker: 'AED',
    name: 'UAE Dirham',
    cmcId: 4217,
    price: 3.67,
    symbol: 'د.إ',
    isCrypto: false,
    status: 'stable',
    iconUrl: 'https://flagcdn.com/w80/ae.png',
    priceChange: {
      '1h': 0,
      '24h': 0,
      '7d': 0,
    },
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    lastUpdated: new Date().toISOString(),
  },
  ]

  const [fiatCurrencies, setFiatCurrencies] = useState<any>(currencyList);

  const [cryptoAmount, setCryptoAmount] = useState('');
	const [currencyAmount, setCurrencyAmount] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.rates) {
          const newRates = Object.keys(CURRENCIES).reduce((acc, curr) => {
            if (data.rates[curr]) {
              acc[curr as CurrencyCode] = data.rates[curr];
            }
            return acc;
          }, { ...rates });

          const newFiatCurrencies = currencyList.map((curr: { ticker: string; price: number , cmcId: number, symbol: string, name: string }) => ({
            ...curr,
            price: newRates[curr.ticker as CurrencyCode]
          }));
          
          setRates(newRates);
          setFiatCurrencies(newFiatCurrencies);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchRates();
    const intervalId = setInterval(fetchRates, 3600000); // every hour
    return () => clearInterval(intervalId);
  }, []);

  const convertPrice = (priceInUSD: number): number => {  
    return priceInUSD * rates[currency];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    if (currency === 'JPY' || currency === 'INR') {
      return `${CURRENCIES[currency].symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    return `${CURRENCIES[currency].symbol}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getCurrencySymbol = (): string => {
    return CURRENCIES[currency].symbol;
  };


  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
        cryptoAmount,
        setCryptoAmount,
        currencyAmount,
        setCurrencyAmount,
        fiatCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
