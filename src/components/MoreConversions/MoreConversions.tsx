import React from 'react';
import * as S from './MoreConversions.styled';
import Link from 'next/link';

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
}

const MoreConversions: React.FC<MoreConversionsProps> = ({ 
  advancedOptions,
  currencyOptions 
}) => {
  const getConversionPath = (option: ConversionOption) => {
    return `/convert/${option.fromTicker.toLowerCase()}-to-${option.toTicker.toLowerCase()}`;
  };


  return (
    <S.Container>
      <S.SectionTitle>Advanced asset conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of relevant cryptocurrencies you might be interested in based on your interest in Bitcoin.
      </S.SectionDescription>
      
      <S.ConversionGrid>
        {advancedOptions.map((option) => (
          <Link key={option.id} href={getConversionPath(option)} passHref legacyBehavior>
            <S.ConversionCard>
              <S.CryptoIcon 
                src={option.iconUrl || `/icons/placeholder.svg`} 
                alt={option.fromToken}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/placeholder.svg';
                }}
              />
              <S.ConversionText>{option.fromToken} to {option.toToken}</S.ConversionText>
            </S.ConversionCard>
          </Link>
        ))}
      </S.ConversionGrid>

      <S.SectionTitle>More currency conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of conversions for different assets and currencies.
      </S.SectionDescription>
      
      <S.ConversionGrid>
        {currencyOptions.map((option) => (
          <Link key={option.id} href={getConversionPath(option)} passHref legacyBehavior>
            <S.ConversionCard>
              <S.CryptoIcon 
                src={option.iconUrl || `/icons/placeholder.svg`} 
                alt={option.fromToken}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/placeholder.svg';
                }}
              />
              <S.ConversionText>{option.fromToken} to {option.toToken}</S.ConversionText>
            </S.ConversionCard>
          </Link>
        ))}
      </S.ConversionGrid>
    </S.Container>
  );
};

export default MoreConversions;
