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





  return (
    <S.Container id={id}>
      <S.SectionTitle>Advanced asset conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of relevant cryptocurrencies you might be interested in based on your interest in Bitcoin.
      </S.SectionDescription>
      
      <S.ConversionGrid>
        {advancedOptions.map((option) => (
         <S.ConversionCard href="#"
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
      </S.ConversionGrid>

      <S.SectionTitle>More currency conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of conversions for different assets and currencies.
      </S.SectionDescription>
      
      <S.ConversionGrid>
        {currencyOptions.map((option) => (
           <S.ConversionCard href="#"
           onClick={() => {
            const toToken = allTokens.find(t => t.ticker === option.fromTicker);  
            const fromToken = allTokens.find(t => t.ticker === option.toTicker);
            if (toToken && fromToken) {
              setFromToken(fromToken);
              setToToken(toToken);
            }
            console.log(fromToken, toToken);
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
      </S.ConversionGrid>
    </S.Container>
  );
};

export default MoreConversions;
