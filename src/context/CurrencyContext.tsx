import React, { createContext, useState, useContext, useEffect } from 'react';

// Define supported currencies and their symbols
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
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

  const [cryptoAmount, setCryptoAmount] = useState('');
	const [currencyAmount, setCurrencyAmount] = useState('');

  useEffect(() => {
    // Fetch the latest exchange rates
    const fetchRates = async () => {
      try {
        // Using the free ExchangeRate API
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.rates) {
          // Create a new rates object with only our supported currencies
          const newRates = Object.keys(CURRENCIES).reduce((acc, curr) => {
            // If the API has this currency, use it, otherwise keep our fallback rate
            if (data.rates[curr]) {
              acc[curr as CurrencyCode] = data.rates[curr];
            }
            return acc;
          }, { ...rates });
          
          setRates(newRates);
          console.log('Updated currency rates:', newRates);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchRates();
    // Refresh rates every hour
    const intervalId = setInterval(fetchRates, 3600000); // every hour
    return () => clearInterval(intervalId);
  }, []);

  const convertPrice = (priceInUSD: number): number => {  
    return priceInUSD * rates[currency];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Format based on currency
    if (currency === 'JPY' || currency === 'INR') {
        // No decimal places for JPY and INR
      return `${CURRENCIES[currency].symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    // For most currencies, show 2 decimal places
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
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
