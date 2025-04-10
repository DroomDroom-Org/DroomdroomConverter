import React, { useCallback, useEffect, useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import styled from 'styled-components';
import axios from 'axios';
import Image from 'next/image';
import { formatPrice, formatPercentageValue } from '../../utils/formatValues';
import { getApiUrl, getPageUrl } from 'utils/config';
import { useRouter } from 'next/router';
import { generateTokenUrl } from 'utils/url';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TokenData } from 'components/FiatCoinTable/FiatTable';



interface MarqueeToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  priceChange24h: number;
  imageUrl: string;
}

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.cardBackground};
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
`;

const MarqueeContent = styled.div`
  display: inline-flex;
  animation: scroll 120s linear infinite;
  gap: 32px;
  padding: 0 16px;

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  &:hover {
    animation-play-state: paused;
  }
`;

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.borderColor};
  }
`;

const TokenImage = styled(Image)`
  border-radius: 50%;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenName = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-weight: 500;
`;

const TokenPrice = styled.span`
  color: ${props => props.theme.colors.textColor};
  font-weight: 600;
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? props.theme.colors.upColor : props.theme.colors.downColor};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArrowIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
`;

const MarqueeScroll: React.FC = () => {
  const [tokens, setTokens] = useState<MarqueeToken[]>([]);
  const router = useRouter();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const { fiatCurrencies } = useCurrency();
    
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(getApiUrl('/marquee-tokens'));
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching marquee tokens:', error);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Duplicate tokens to create seamless scroll effect
  const scrollTokens = [...tokens, ...tokens];
   
  const getTokenSlug = (ticker: string) => {
    if (fiatCurrencies?.find((currency: any) => currency.ticker === ticker)) {
      const fiatName = fiatCurrencies?.find((currency: any) => currency.ticker === ticker)?.name || ticker;
      return `${fiatName.toLowerCase().replace(/\s+/g, '-')}-${ticker.toLowerCase()}`;
    } else {
        const token  = tokens?.find((token: any) => token.ticker === ticker);
        return `${token?.name.toLowerCase().replace(/\s+/g, '-')}-${ticker.toLowerCase()}`;
    }
  };

  const handleCardClick = useCallback((fromTokenTicker: string, toTokenTicker: string) => {    
    const fromSlug = getTokenSlug(fromTokenTicker);
    const toSlug = getTokenSlug(toTokenTicker);        
    router.push(`/${fromSlug}/${toSlug}`);    

  }, [router]);

  return (
    <MarqueeContainer>
      <MarqueeContent>
        {scrollTokens.map((token, index) => (
          <TokenItem 
            key={`${token.id}-${index}`}
            onClick={() => handleCardClick(token.ticker , "USDT")}
          >
            <img 
              src={token.imageUrl}
              width={24}
              height={24}
              alt={token.name}
            />
            <TokenInfo>
              <TokenName>{token.name}</TokenName>
              <TokenPrice>{formatCurrencyPrice(token.price)}</TokenPrice>
              <PriceChange isPositive={token.priceChange24h >= 0}>
                <ArrowIcon>
                  {token.priceChange24h >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                </ArrowIcon>
                {formatPercentageValue(token.priceChange24h)}%
              </PriceChange>
            </TokenInfo>
          </TokenItem>
        ))}
      </MarqueeContent>
    </MarqueeContainer>
  );
};

export default MarqueeScroll;
