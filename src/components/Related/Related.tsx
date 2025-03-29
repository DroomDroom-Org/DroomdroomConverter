import React, { useState, useEffect } from 'react';
import * as S from './Related.styled';
import { useCurrency, CURRENCIES } from 'src/context/CurrencyContext';
import { useRouter } from 'next/router';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
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

interface RelatedProps {
  tokens: TokenData[];
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
}

const getCryptoIcon = (ticker: string) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
};

const Related: React.FC<RelatedProps> = ({ fromToken, toToken, id , tokens   }) => {
  const { rates } = useCurrency();
  const cryptoName = fromToken?.name || 'Bitcoin';
  const cryptoTicker = fromToken?.ticker || 'BTC';
  const cryptoPrice = fromToken?.price || 0;

  const popularFiatConversions = Object.entries(CURRENCIES).slice(0, 8).map(([code, currency]) => {
    return {
      currency: currency.name,
      symbol: currency.symbol,
      value: cryptoPrice * (rates[code as keyof typeof CURRENCIES] || 1)
    };
  });


  const router = useRouter();
  const [allTokens, setAllTokens] = useState<TokenData[]>(tokens ?? []);
  


  const cryptoConversions = allTokens
    .filter(token => token.ticker !== cryptoTicker)
    .map(token => ({
      name: token.name,
      ticker: token.ticker,
      value: token.price,
      symbol: token.ticker
    }));

  return (
    <S.RelatedContainer id={id}>
      <S.SectionHeading>Browse related conversions</S.SectionHeading>
      
      <div>
        <S.SubHeading>Popular {cryptoName} conversions</S.SubHeading>
        <S.SectionDescription>
          A selection of other popular currency conversions of {cryptoName} to various fiat currencies.
        </S.SectionDescription>
        
        <S.ConversionGrid>
          {popularFiatConversions.map((conversion, index) => (
            <S.ConversionCard href="#" key={index}>
              <S.CardHeader>
                <S.CryptoIcon>
                  {getCryptoIcon(cryptoTicker)}
                </S.CryptoIcon>
                <S.CardTitle>{cryptoName} to {conversion.currency}</S.CardTitle>
              </S.CardHeader>
              <S.CardValue>1 {cryptoTicker} equals {conversion.symbol}{conversion.value.toLocaleString()}</S.CardValue>
            </S.ConversionCard>
          ))}
        </S.ConversionGrid>
      </div>
      
      <div>
        <S.SubHeading>Convert other assets to USDT</S.SubHeading>
        <S.SectionDescription>
          A selection of relevant cryptocurrencies you might be interested in based on your interest in {cryptoName}.
        </S.SectionDescription>
        
        <S.ConversionGrid>
          {cryptoConversions.map((crypto, index) => (
            <S.ConversionCard href="#" key={index}>
              <S.CardHeader>
                <S.CryptoIcon>
                  {getCryptoIcon(crypto.ticker)}
                </S.CryptoIcon>
                <S.CardTitle>{crypto.name} to USDT</S.CardTitle>
              </S.CardHeader>
              <S.CardValue>1 {crypto.ticker} equals {crypto.value.toLocaleString()} USDT</S.CardValue>
            </S.ConversionCard>
          ))}
        </S.ConversionGrid>
      </div>
    </S.RelatedContainer>
  );
};

export default Related;
