import React, { useCallback, useState, useEffect } from 'react';
import * as S from './Related.styled';
import { useCurrency, CURRENCIES } from 'src/context/CurrencyContext';
import { useRouter } from 'next/router';
import { IconsWrapper } from './Related.styled';
import { CryptoIcon, FlagIcon } from 'components/MoreConversions/MoreConversions.styled';

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
  symbol?: string;
}

interface RelatedProps {
  tokens: TokenData[];
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
  setFromToken: (token: TokenData) => void;
  setToToken: (token: TokenData) => void;
  fiatCurrencies: any;
}

const Related: React.FC<RelatedProps> = ({ fromToken, toToken, id, tokens, setFromToken, setToToken, fiatCurrencies }) => {

  const router = useRouter();
  const [allTokens, setAllTokens] = useState<TokenData[]>(tokens ?? []);

  const popularFiatConversions = fiatCurrencies.map((currency: any) => {
    return {
      name: currency.name,
      symbol: currency.symbol,
      ticker: currency.ticker,
      price: currency.price,
      cmcId: currency.cmcId,
      priceChange: currency.priceChange,
      isCrypto: false,
      iconUrl: currency.iconUrl
    };
  });

  const cryptoConversions = allTokens
    .filter(token => token.ticker !== fromToken.ticker && token.ticker !== toToken.ticker)
    .map(token => ({
      name: token.name,
      ticker: token.ticker,
      price: token.price,
      symbol: token.ticker,
      cmcId: token.cmcId,
      priceChange: token.priceChange,
      isCrypto: true,
      iconUrl: token.iconUrl
    }));

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

  const ITEMS_PER_ROW = 8;
  const TOTAL_ROWS = 3; 
  const MIN_ITEMS = ITEMS_PER_ROW * TOTAL_ROWS;

  const ensureMinimumItems = (items: any[]) => {
    if (items.length === 0) return [];
    const repeats = Math.ceil(MIN_ITEMS / items.length);
    return Array(repeats).fill(items).flat().slice(0, MIN_ITEMS); // Ensure we have exactly MIN_ITEMS
  };

  const cryptoRows = [];
  const extendedCryptoConversions = ensureMinimumItems(cryptoConversions);
  
  // Create exactly 3 rows
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const startIndex = i * ITEMS_PER_ROW;
    const row = extendedCryptoConversions.slice(startIndex, startIndex + ITEMS_PER_ROW);
    // If the row is not complete, take items from the beginning to fill it
    while (row.length < ITEMS_PER_ROW) {
      row.push(extendedCryptoConversions[row.length % extendedCryptoConversions.length]);
    }
    cryptoRows.push(row);
  }

  const getTokenSlug = (token: TokenData | any) => {
    if (!token) return '';
    
    // Memoize slugs to avoid recalculation
    if ((token as any)._slug) return (token as any)._slug;
    
    let slug = '';
    if (token.code && token.currency) {
      slug = `${token.currency.toLowerCase().replace(/\s+/g, '-')}-${token.code.toLowerCase()}`;
    } else if (fiatCurrencies.includes(token.ticker)) {
      const fiatName = token.name || fiatCurrencies[token.ticker] || token.ticker;
      slug = `${fiatName.toLowerCase().replace(/\s+/g, '-')}-${token.ticker.toLowerCase()}`;
    } else {
      slug = `${token.name.toLowerCase().replace(/\s+/g, '-')}-${token.ticker.toLowerCase()}`;
    }
    
    // Cache the slug
    (token as any)._slug = slug;
    return slug;
  };

  const handleCardClick = useCallback((fromToken: TokenData, toToken: TokenData) => {
    event?.preventDefault();
    
    const fromSlug = getTokenSlug(fromToken);
    const toSlug = getTokenSlug(toToken);
    const newPath = `/${fromSlug}/${toSlug}`;

    if (router.asPath === newPath) return;

    // Update state after navigation to avoid blocking
    router.push(newPath, undefined, { 
      shallow: true,
      scroll: false 
    }).then(() => {
      setFromToken(fromToken);
      setToToken(toToken);
    });

  }, [router, setFromToken, setToToken]);

  // Prefetch popular conversion paths
  useEffect(() => {
    if (popularFiatConversions && fromToken) {
      popularFiatConversions.forEach((toToken: TokenData) => {
        const fromSlug = getTokenSlug(fromToken);
        const toSlug = getTokenSlug(toToken);
        router.prefetch(`/${fromSlug}/${toSlug}`);
      });
    }
  }, [popularFiatConversions, fromToken, router]);

  // Prefetch crypto conversion paths
  useEffect(() => {
    if (cryptoConversions && toToken) {
      cryptoConversions.slice(0, 8).forEach((crypto) => {
        const fromSlug = getTokenSlug(crypto);
        const toSlug = getTokenSlug(toToken);
        router.prefetch(`/${fromSlug}/${toSlug}`);
      });
    }
  }, [cryptoConversions, toToken, router]);

  return (
    <S.RelatedContainer id={id}>
      <S.SectionHeading>Browse related conversions</S.SectionHeading>

      <div>
        <S.SubHeading>Popular {fromToken.name} conversions</S.SubHeading>
        <S.SectionDescription>
          A selection of other popular currency conversions of {fromToken.name} to various fiat currencies.
        </S.SectionDescription>

        <S.CardGrid>
          <S.CardRow>
            <S.CardRowInner>
              {duplicateForScroll(popularFiatConversions).map((toToken, index) => {
                const price = (fromToken.isCrypto ? (fromToken.price * toToken.price) : (toToken.price / fromToken.price));
                const priceChange = formatPriceChange(fromToken.priceChange['24h']);

                return (
                  <S.CryptoCard href="#" key={`${toToken.ticker}-${index}`} onClick={() => handleCardClick(fromToken, toToken)}>
                    <IconsWrapper>
                      <CryptoIcon src={fromToken.iconUrl} alt={fromToken?.ticker} />
                      <FlagIcon src={toToken.iconUrl} alt={toToken.ticker} />
                    </IconsWrapper>
                    <S.CryptoCardContent>
                      <S.CryptoCardTicker>{fromToken.ticker}/{toToken.ticker}</S.CryptoCardTicker>
                      <S.CryptoCardPrice>{toToken.symbol}{price.toFixed(2)}</S.CryptoCardPrice>
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
                  const price = (toToken.isCrypto ? (toToken.price * crypto.price) : (crypto.price * toToken.price));
                  const priceChange = formatPriceChange(crypto.priceChange['24h']);

                  return (
                    <S.CryptoCard
                      href="#"
                      key={`${crypto.cmcId}-${index}`}
                      onClick={() => handleCardClick(crypto, toToken)}
                    >

                      <IconsWrapper>
                        <CryptoIcon src={crypto.iconUrl} alt={crypto.name} />
                        <CryptoIcon src={toToken.iconUrl} alt={toToken.name} />
                      </IconsWrapper>
                      <S.CryptoCardContent>
                        <S.CryptoCardTicker>{crypto.ticker}/{toToken.ticker}</S.CryptoCardTicker>
                        <S.CryptoCardPrice>{crypto.symbol}{price.toFixed(2)} {toToken.ticker}</S.CryptoCardPrice>
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
