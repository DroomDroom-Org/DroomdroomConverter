import React from 'react';
import * as S from './MoreConversions.styled';
import Link from 'next/link';
import { FaDove } from 'react-icons/fa';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  isCrypto: boolean;
  priceChange: {
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;
}

interface ConversionOption {
  id: string;
  name: string;
  fromToken: string;
  toToken: string;
  fromTicker: string;
  toTicker: string;
  iconUrl?: string;
}

interface MoreConversionsProps {
  advancedOptions: ConversionOption[];
  currencyOptions: ConversionOption[];
  id?: string;
  allTokens: TokenData[];
  setFromToken: (token: TokenData) => void;
  setToToken: (token: TokenData) => void;
}

const MoreConversions: React.FC<MoreConversionsProps> = ({ 
  advancedOptions,
  currencyOptions,
  id,
  allTokens,
  setFromToken,
  setToToken
}) => {
  const splitIntoRows = (items: any[], itemsPerRow: number) => {
    const result = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      result.push(items.slice(i, i + itemsPerRow));
    }
    return result;
  };

  const duplicateForScroll = (items: any[]) => {
    return [...items, ...items, ...items];
  };

  const advancedOptionsRows = splitIntoRows(advancedOptions, 8);
  const currencyOptionsRows = splitIntoRows(currencyOptions, 8);

  return (
    <S.Container id={id}>
      <S.SectionTitle>Advanced asset conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of relevant cryptocurrencies you might be interested in based on your interest in Bitcoin.
      </S.SectionDescription>
      
      <S.MarqueeContainer>
        {advancedOptionsRows.map((row, rowIndex) => (
          <S.MarqueeRow key={`adv-row-${rowIndex}`}>
            <S.MarqueeContent isReverse={rowIndex % 2 === 1}>
              {duplicateForScroll(row).map((option, index) => (
                <S.ConversionCard 
                  key={`adv-${option.id}-${index}`}
                  href="#"
                  onClick={() => {
                    const toToken = allTokens.find(t => t.ticker === option.fromTicker);  
                    const fromToken = allTokens.find(t => t.ticker === option.toTicker);
                    if (toToken && fromToken) {
                      setFromToken(fromToken);
                      setToToken(toToken);
                    }
                  }}
                >
                  <S.CryptoIcon 
                    src={option.iconUrl || `/icons/placeholder.svg`} 
                    alt={option.fromToken}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/icons/placeholder.svg';
                    }}
                  />
                  <S.ConversionText>{option.fromToken} to {option.toToken}</S.ConversionText>
                </S.ConversionCard>
              ))}
            </S.MarqueeContent>
          </S.MarqueeRow>
        ))}
      </S.MarqueeContainer>

      <S.SectionTitle>More currency conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of conversions for different assets and currencies.
      </S.SectionDescription>
      
      <S.MarqueeContainer>
        {currencyOptionsRows.map((row, rowIndex) => (
          <S.MarqueeRow key={`curr-row-${rowIndex}`}>
            <S.MarqueeContent isReverse={rowIndex % 2 === 1}>
              {duplicateForScroll(row).map((option, index) => (
                <S.ConversionCard 
                  key={`curr-${option.id}-${index}`}
                  href="#"
                  onClick={() => {
                    const toToken = allTokens.find(t => t.ticker === option.fromTicker);  
                    const fromToken = allTokens.find(t => t.ticker === option.toTicker);
                    if (toToken && fromToken) {
                      setFromToken(fromToken);
                      setToToken(toToken);
                    }
                  }}
                >
                  <S.CryptoIcon 
                    src={option.iconUrl || `/icons/placeholder.svg`} 
                    alt={option.fromToken}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/icons/placeholder.svg';
                    }}
                  />
                  <S.ConversionText>{option.fromToken} to {option.toToken}</S.ConversionText>
                </S.ConversionCard>
              ))}
            </S.MarqueeContent>
          </S.MarqueeRow>
        ))}
      </S.MarqueeContainer>
    </S.Container>
  );
};

export default MoreConversions;
