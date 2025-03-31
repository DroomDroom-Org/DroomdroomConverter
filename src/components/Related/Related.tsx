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
 

  const popularFiatConversions = Object.entries(CURRENCIES).slice(0, 8).map(([code, currency]) => {
    return {
      currency: currency.name,
      symbol: currency.symbol,
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
      cmcId: token.cmcId
    }));

  return (
    <S.RelatedContainer id={id}>
      <S.SectionHeading>Browse related conversions</S.SectionHeading>
      
      <div>
        <S.SubHeading>Popular {fromToken.name} conversions</S.SubHeading>
        <S.SectionDescription>
          A selection of other popular currency conversions of {fromToken.name} to various fiat currencies.
        </S.SectionDescription>
        
        <S.ConversionGrid>
          {popularFiatConversions.map((conversion, index) => (
            <S.ConversionCard href="#" key={index}>
              <S.CardHeader>
                <S.CryptoIcon>
                  {getCryptoIcon(fromToken.cmcId)}
                </S.CryptoIcon>
                <S.CardTitle>{fromToken.name} to {conversion.currency}</S.CardTitle>
              </S.CardHeader>
              <S.CardValue>1 {fromToken.ticker} equals {conversion.symbol}{(fromToken.isCrypto ? (fromToken.price * conversion.value).toFixed(8) : (conversion.value/fromToken.price).toFixed(8))}</S.CardValue>
            </S.ConversionCard>
          ))}
        </S.ConversionGrid>
      </div>
      
      <div>
        <S.SubHeading>Convert other assets to {toToken.name}</S.SubHeading>
        <S.SectionDescription>
          A selection of relevant cryptocurrencies you might be interested in based on your interest in {fromToken.name}.
        </S.SectionDescription>
        
        <S.ConversionGrid>
          {cryptoConversions.map((crypto, index) => (
            <S.ConversionCard href="#" key={index} onClick={() => {
              const token = allTokens.find(token => token.cmcId === crypto.cmcId);
              if (token) {
                setFromToken(token);
                setToToken(toToken);
              }
            }}>
              <S.CardHeader>
                <S.IconsWrapper>
                  <S.CryptoIcon2
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.cmcId}.png`}
                    alt={crypto.name}
                  />
                  <S.CryptoIcon2
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${toToken.cmcId}.png`}
                    alt={toToken.name}
                  />
                </S.IconsWrapper>
                <S.CardTitle>{crypto.name} to {toToken.name}</S.CardTitle>
              </S.CardHeader>
              <S.CardValue>1 {crypto.ticker} equals {toToken.isCrypto ? (crypto.value / toToken.price)?.toFixed(8) : (crypto.value * toToken.price)?.toFixed(8)} {toToken.name}</S.CardValue>
            </S.ConversionCard>
          ))}
        </S.ConversionGrid>
      </div>
    </S.RelatedContainer>
  );
};

export default Related;
