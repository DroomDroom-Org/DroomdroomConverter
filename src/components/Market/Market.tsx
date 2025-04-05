import React from 'react';
import * as S from './Market.styled';
import FiatTable from 'components/FiatCoinTable/FiatTable';


interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  priceChange: {
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


interface CryptoMarketProps {
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
  tokens?: TokenData[];
  fiatCurrencies?: any[];
}

const Market: React.FC<CryptoMarketProps> = ({
  fromToken,
  toToken,
  id,
  tokens,
  fiatCurrencies
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const calculateConversionRate = (fromToken: TokenData, toToken: TokenData) => {
    if (!fromToken.isCrypto && toToken.isCrypto) {
      return 1 / (fromToken.price * toToken.price);
    } else if (fromToken.isCrypto && !toToken.isCrypto) {
      return fromToken.price * toToken.price;
    } else {
      // Both crypto or both fiat
      return fromToken.price / toToken.price;
    }
  };

  const getDecimalPlaces = (token: TokenData) => {
    if (!token.isCrypto) return 2;
    if (token.ticker === 'USDT' || token.ticker === 'USDC' || token.ticker === 'DAI' || token.ticker === 'BUSD') return 2;
    return 8;
  };

  const formatPrice = (price: number, token: TokenData): string => {
    if (price === null || price === undefined) return '0';
    if (price < 0.00001) {
      return price.toExponential(4);
    }
    return price.toFixed(getDecimalPlaces(token));
  };

  const fromToRate = calculateConversionRate(fromToken, toToken);
  const toFromRate = calculateConversionRate(toToken, fromToken);

  const formatSupply = (value: number, unit: string) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B ${unit}`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else {
      return `${value.toFixed(1)} ${unit}`;
    }
  };

  const getSymbol = (coin: any): string => {
    return typeof coin.symbol === 'string' ? coin.symbol : '';
  };

  const getToSymbol = (coin: any): string => {
    if (!coin.toToken) return '';
    return typeof coin.toToken === 'object' && coin.toToken.symbol
      ? coin.toToken.symbol
      : typeof coin.toToken === 'string'
        ? coin.toToken
        : '';
  };

  const isValidCoin = (coin: any): boolean => {
    return coin && typeof coin === 'object';
  };

  if (!fromToken || !toToken) {
    return (
      <S.MarketContainer id={id}>
        <S.MarketHeading>Market latest</S.MarketHeading>
        <p>No market data available</p>
      </S.MarketContainer>
    );
  }

  const getTokenStatus = (token: TokenData) => {
    return token?.priceChange && token?.priceChange['7d'] > 0 ? 'climbing' : 'falling';
  };

  return (
    <S.MarketContainer id={id}>
    {(fromToken?.isCrypto || toToken?.isCrypto) && <S.MarketHeading>Market latest</S.MarketHeading>}

      {fromToken.isCrypto && <div key={fromToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {fromToken.name} is <span style={{ color: getTokenStatus(fromToken) === 'climbing' ? '#4ca777' : '#e15241' }}>{getTokenStatus(fromToken)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {fromToken.ticker} to {toToken.ticker} conversion rate is <strong>{formatPrice(fromToRate, toToken)}</strong>.
            Inversely, this means that if you convert 1 {fromToken.ticker} you will get {formatPrice(fromToRate, toToken)} {toToken.ticker}.
            <br />
            The conversion rate of {fromToken.ticker}/{toToken.ticker} has
            <span style={{ color: (fromToken.priceChange?.['1h'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.priceChange?.['1h'] || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(fromToken.priceChange?.['1h'] || 0).toFixed(2)}%
            </span> in the last hour and
            <span style={{ color: (fromToken.priceChange?.['24h'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.priceChange?.['24h'] || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(fromToken.priceChange?.['24h'] || 0).toFixed(2)}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.volume24h) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(fromToken.circulatingSupply) || 0, getSymbol(fromToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton>
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>
      }

      {toToken.isCrypto && <div key={toToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {toToken.name} is <span style={{ color: getTokenStatus(toToken) === 'climbing' ? '#4ca777' : '#e15241' }}>{getTokenStatus(toToken)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {toToken.ticker} to {fromToken.ticker} conversion rate is <strong>{formatPrice(toFromRate, fromToken)}</strong>.
            The current {toToken.ticker} to {fromToken.ticker} conversion rate is <strong>{formatPrice(toFromRate, getDecimalPlaces(fromToken.ticker ))}</strong>.
            Inversely, this means that if you convert 1 {toToken.ticker} you will get {formatPrice(toFromRate, getDecimalPlaces(fromToken.ticker))} {fromToken.ticker}.
            <br />
            The conversion rate of {toToken.ticker}/{fromToken.ticker} has
            <span style={{ color: (toToken.priceChange?.['1h'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.priceChange?.['1h'] || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(toToken.priceChange?.['1h'] || 0).toFixed(2)}%
            </span> in the last hour and
            <span style={{ color: (toToken.priceChange?.['24h'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.priceChange?.['24h'] || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(toToken.priceChange?.['24h'] || 0).toFixed(getDecimalPlaces(toToken.ticker))}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.volume24h) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(toToken.circulatingSupply) || 0, getSymbol(toToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton>
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>}

       
       <S.FiatTableContainer>
        <FiatTable heading={"Popular crypto to fiat markets"} tokens={tokens} fiatCurrencies={fiatCurrencies} />
       </S.FiatTableContainer>



    </S.MarketContainer>
  );
};

export default Market; 