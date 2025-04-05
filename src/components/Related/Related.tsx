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
  isCrypto: boolean;
}

interface RelatedProps {
  tokens: TokenData[];
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
  setFromToken: (token: TokenData) => void;
  setToToken: (token: TokenData) => void;
}

const getCryptoIcon = (cmcId: string) => {
  return (
    <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${cmcId}.png`} alt={cmcId} />
  );
};

const Related: React.FC<RelatedProps> = ({ fromToken, toToken, id , tokens, setFromToken, setToToken   }) => {
  const { rates } = useCurrency();
 
  const popularFiatConversions = Object.entries(CURRENCIES).map(([code, currency]) => {
    return {
      currency: currency.name,
      symbol: currency.symbol,
      code,
      value: rates[code as keyof typeof CURRENCIES] || 1
    };
  });

  const router = useRouter();
  const [allTokens, setAllTokens] = useState<TokenData[]>(tokens ?? []);
  
  const cryptoConversions = allTokens
    .filter(token => token.ticker !== fromToken.ticker && token.ticker !== toToken.ticker)
    .map(token => ({
      name: token.name,
      ticker: token.ticker,
      value: token.price,
      symbol: token.ticker,
      cmcId: token.cmcId,
      priceChange: token.priceChange
    }));

  const fiatRows = [];
  const rowSize = 8;
  for (let i = 0; i < popularFiatConversions.length; i += rowSize) {
    fiatRows.push(popularFiatConversions.slice(i, i + rowSize));
  }

  const cryptoRows = [];
  for (let i = 0; i < cryptoConversions.length; i += rowSize) {
    cryptoRows.push(cryptoConversions.slice(i, i + rowSize));
  }

  const formatPriceChange = (change: number) => {
    const isPositive = change >= 0;
    const formattedValue = Math.abs(change).toFixed(2);
    return {
      value: `${isPositive ? '+' : '-'}${formattedValue}%`,
      color: isPositive ? '#16c784' : '#ea3943'
    };
  };

  const duplicateForScroll = (items: any[]) => {
    return [...items, ...items, ...items];
  };

  return (
    <S.RelatedContainer id={id}>
      <S.SectionHeading>Browse related conversions</S.SectionHeading>
      
      <div>
        <S.SubHeading>Popular {fromToken.name} conversions</S.SubHeading>
        <S.SectionDescription>
          A selection of other popular currency conversions of {fromToken.name} to various fiat currencies.
        </S.SectionDescription>
        
        <S.CardGrid>
          {fiatRows.map((row, rowIndex) => (
            <S.CardRow key={`fiat-row-${rowIndex}`}>
              <S.CardRowInner isReverse={rowIndex % 2 === 1}>
                {duplicateForScroll(row).map((conversion, index) => {
                  const price = (fromToken.isCrypto ? (fromToken.price * conversion.value) : (conversion.value/fromToken.price));
                  const priceChange = formatPriceChange(fromToken.priceChange['24h']);
                  
                  return (
                    <S.CryptoCard href="#" key={`${conversion.code}-${index}`} onClick={() => {}}>
                      <S.LogoContainer>
                        {getCryptoIcon(fromToken.cmcId)}
                      </S.LogoContainer>
                      <S.CryptoCardContent>
                        <S.CryptoCardTicker>{fromToken.ticker}/{conversion.code}</S.CryptoCardTicker>
                        <S.CryptoCardPrice>{conversion.symbol}{price.toFixed(2)}</S.CryptoCardPrice>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500, 
                          color: priceChange.color 
                        }}>
                          {priceChange.value}
                        </div>
                      </S.CryptoCardContent>
                    </S.CryptoCard>
                  );
                })}
              </S.CardRowInner>
            </S.CardRow>
          ))}
        </S.CardGrid>
      </div>
      
      <div>
        <S.SubHeading>Convert other assets to {toToken.name}</S.SubHeading>
        <S.SectionDescription>
          A selection of relevant cryptocurrencies you might be interested in based on your interest in {fromToken.name}.
        </S.SectionDescription>
        
        <S.CardGrid>
          {cryptoRows.map((row, rowIndex) => (
            <S.CardRow key={`crypto-row-${rowIndex}`}>
              <S.CardRowInner isReverse={rowIndex % 2 === 1}>
                {duplicateForScroll(row).map((crypto, index) => {
                  const conversionValue = toToken.isCrypto 
                    ? (crypto.value / toToken.price)?.toFixed(2) 
                    : (crypto.value * toToken.price)?.toFixed(8);
                  const priceChange = formatPriceChange(crypto.priceChange?.['24h'] || 0);
                  
                  return (
                    <S.CryptoCard 
                      href="#" 
                      key={`${crypto.cmcId}-${index}`} 
                      onClick={() => {
                        const token = allTokens.find(token => token.cmcId === crypto.cmcId);
                        if (token) {
                          setFromToken(token);
                          setToToken(toToken);
                        }
                      }}
                    >
                      <S.LogoContainer>
                        <img
                          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.cmcId}.png`}
                          alt={crypto.name}
                        />
                      </S.LogoContainer>
                      <S.CryptoCardContent>
                        <S.CryptoCardTicker>{crypto.ticker}/{toToken.ticker}</S.CryptoCardTicker>
                        <S.CryptoCardPrice>{conversionValue} {toToken.ticker}</S.CryptoCardPrice>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 500, 
                          color: priceChange.color
                        }}>
                          {priceChange.value}
                        </div>
                      </S.CryptoCardContent>
                    </S.CryptoCard>
                  );
                })}
              </S.CardRowInner>
            </S.CardRow>
          ))}
        </S.CardGrid>
      </div>
    </S.RelatedContainer>
  );
};

export default Related;
