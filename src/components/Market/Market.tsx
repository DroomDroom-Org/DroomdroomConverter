import React from 'react';
import * as S from './Market.styled';

interface CryptoMarketProps {
  fromToken: any;
  toToken: any;
}

const Market: React.FC<CryptoMarketProps> = ({
  fromToken,
  toToken
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) {
      return `CA$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `CA$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `CA$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `CA$${value.toFixed(2)}`;
    }
  };

  const formatSupply = (value: number, unit: string) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B ${unit}`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else {
      return `${value.toFixed(1)} ${unit}`;
    }
  };

  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
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

  const formatPrice = (price: any): string => {
    if (price === null || price === undefined) return '0';
    return typeof price === 'number' ? price.toFixed(2) : String(price);
  };

  const isValidCoin = (coin: any): boolean => {
    return coin && typeof coin === 'object';
  };

  if (!fromToken || !toToken) {
    return (
      <S.MarketContainer>
        <S.MarketHeading>Market latest</S.MarketHeading>
        <p>No market data available</p>
      </S.MarketContainer>
    );
  }

  return (
    <S.MarketContainer>
      <S.MarketHeading>Market latest</S.MarketHeading>

      <div key={fromToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {safeString(fromToken.name)} is <span style={{ color: fromToken.status === 'climbing' ? '#4ca777' : '#e15241' }}>{safeString(fromToken.status)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {getSymbol(fromToken)} to {getToSymbol(fromToken)} conversion rate is <strong>{formatPrice(fromToken.price)}</strong>.
            Inversely, this means that if you convert 1 {getToSymbol(fromToken)} you will get {formatPrice(fromToken.price)} {getSymbol(fromToken)}.
            <br />
            The conversion rate of {getSymbol(fromToken)}/{getToSymbol(fromToken)} has
            <span style={{ color: (fromToken.rateChange?.hourly || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.rateChange?.hourly || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(fromToken.rateChange?.hourly || 0)}%
            </span> in the last hour and
            <span style={{ color: (fromToken.rateChange?.daily || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.rateChange?.daily || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(fromToken.rateChange?.daily || 0)}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.volume) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(fromToken.supply) || 0, fromToken.supplyUnit || getSymbol(fromToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton>
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>


      <div key={toToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {safeString(toToken.name)} is <span style={{ color: toToken.status === 'climbing' ? '#4ca777' : '#e15241' }}>{safeString(toToken.status)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {getSymbol(toToken)} to {getToSymbol(toToken)} conversion rate is <strong>{formatPrice(toToken.price)}</strong>.
            Inversely, this means that if you convert 1 {getToSymbol(toToken)} you will get {formatPrice(toToken.price)} {getSymbol(toToken)}.
            <br />
            The conversion rate of {getSymbol(toToken)}/{getToSymbol(toToken)} has
            <span style={{ color: (toToken.rateChange?.hourly || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.rateChange?.hourly || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(toToken.rateChange?.hourly || 0)}%
            </span> in the last hour and
            <span style={{ color: (toToken.rateChange?.daily || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.rateChange?.daily || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(toToken.rateChange?.daily || 0)}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.volume) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(toToken.supply) || 0, toToken.supplyUnit || getSymbol(toToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton>
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>

    </S.MarketContainer>
  );
};

export default Market; 