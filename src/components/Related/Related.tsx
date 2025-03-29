import React from 'react';
import * as S from './Related.styled';

interface TokenData {
  id?: string;
  ticker?: string;
  name?: string;
  price?: number;
}

interface RelatedProps {
  fromToken: TokenData | null;
  toToken: TokenData | null;
  id?: string;
}

// Mock data for popular fiat conversions
const popularFiatConversions = [
  { currency: 'United States Dollar', symbol: 'USD', value: 86987.81 },
  { currency: 'Canadian Dollar', symbol: 'CA$', value: 124712.90 },
  { currency: 'British Pound', symbol: '£', value: 67142.13 },
  { currency: 'Japanese Yen', symbol: '¥', value: 13022000.00 },
  { currency: 'Indian Rupee', symbol: '₹', value: 7451564.71 },
  { currency: 'Real', symbol: 'R$', value: 500019.01 },
  { currency: 'Euro', symbol: '€', value: 80577.96 },
  { currency: 'Nigerian Naira', symbol: 'NGN', value: 133810100 }
];

// Mock data for crypto conversions to USDT
const cryptoConversions = [
  { name: 'Ethereum', ticker: 'ETH', value: 2000.67, symbol: 'ETH' },
  { name: 'Tether', ticker: 'USDT', value: 1.00, symbol: 'USDT' },
  { name: 'Cronos', ticker: 'CRO', value: 0.0984, symbol: 'CRO' },
  { name: 'SHIBA INU', ticker: 'SHIB', value: 0.000014, symbol: 'SHIB' },
  { name: 'Dogecoin', ticker: 'DOGE', value: 0.19, symbol: 'DOGE' },
  { name: 'Bitcoin Cash', ticker: 'BCH', value: 322.01, symbol: 'BCH' },
  { name: 'iExec RLC', ticker: 'RLC', value: 1.38, symbol: 'RLC' },
  { name: 'Cardano', ticker: 'ADA', value: 0.73, symbol: 'ADA' }
];

// Crypto icons mapping
const getCryptoIcon = (ticker: string) => {
  // This would ideally be replaced with actual SVG icons or images
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
};

const Related: React.FC<RelatedProps> = ({ fromToken, toToken, id }) => {
  const cryptoName = fromToken?.name || 'Bitcoin';
  const cryptoTicker = fromToken?.ticker || 'BTC';

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
