import React from 'react';
import * as S from './MoreConversions.styled';
import Link from 'next/link';

interface ConversionOption {
  id: string;
  name: string;
  fromToken: string;
  toToken: string;
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
  return (
    <S.Container>
      <S.SectionTitle>Advanced asset conversions</S.SectionTitle>
      <S.SectionDescription>
        A selection of relevant cryptocurrencies you might be interested in based on your interest in Bitcoin.
      </S.SectionDescription>
      
      <S.ConversionGrid>
        {advancedOptions.map((option) => (
          <Link key={option.id} href={`/convert/${option.fromToken.toLowerCase()}-to-${option.toToken.toLowerCase()}`} passHref legacyBehavior>
            <S.ConversionCard>
              <S.CryptoIcon src={option.iconUrl || `/icons/${option.fromToken.toLowerCase()}.svg`} alt={option.fromToken} />
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
          <Link key={option.id} href={`/convert/${option.fromToken.toLowerCase()}-to-${option.toToken.toLowerCase()}`} passHref legacyBehavior>
            <S.ConversionCard>
              <S.CryptoIcon src={option.iconUrl || `/icons/${option.fromToken.toLowerCase()}.svg`} alt={option.fromToken} />
              <S.ConversionText>{option.fromToken} to {option.toToken}</S.ConversionText>
            </S.ConversionCard>
          </Link>
        ))}
      </S.ConversionGrid>
    </S.Container>
  );
};

export default MoreConversions;
