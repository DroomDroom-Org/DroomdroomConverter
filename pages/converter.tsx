import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getApiUrl } from 'utils/config';
import SEO from 'components/SEO/SEO';
import Navbar from 'components/Navbar/Navbar';
import Market from 'src/components/Market/Market';
import About from 'src/components/About';
import FAQ from 'src/components/FAQ';
import Related from 'src/components/Related';
import ConversionTables from 'src/components/ConversionTables';
import SimilarCrypto from 'src/components/SimilarCrypto/SimilarCrypto';
import SearchCoin from 'src/components/SearchCoin/SearchCoin';
import MoreConversions from 'src/components/MoreConversions/MoreConversions';
import { useCurrency, CURRENCIES } from 'src/context/CurrencyContext';
import { ChevronDown, ChevronUp, ArrowLeftRight, Loader } from 'lucide-react';
import { config } from 'src/utils/config';


interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: number;
  status: string;
  rateChange: {
    hourly: number;
    daily: number;
  };
  marketCap: string;
  volume: string;
  supply: string;
  supplyUnit: string;

}

interface ConverterProps {
  tokens: TokenData[];
}

const ConverterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
`;

const ConverterCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  padding: 0;
  margin: 80px auto;
  max-width: 1000px;
  border-radius: 0;
  border: none;
  box-shadow: none;
  
  @media (max-width: 768px) {
    padding: 0;
    margin: 80px auto;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-top: 5px;
`;

const CryptoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: -8px;
`;

const ConversionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 16px 0px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 300;
  color: ${props => props.theme.colors.textColor};
  margin: 0;
  line-height: 1.2;

  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ExchangeRate = styled.p`
  font-size: 15px;
  color: ${props => props.theme.colors.textColorSub};
  margin: 0;
  margin-bottom: 20px;
`;

const ConversionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 50px;
  background: ${props => props.theme.colors.colorNeutral1};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  padding: 0 120px 0 20px;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
    
  &[type=number] {
    -moz-appearance: textfield;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textColorSub};
  }
`;

const SelectButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 46px;
  min-width: 100px;
  padding: 8px 40px 8px 15px;
  border: none;
  border-radius: 50px;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorLightNeutral2};
  color: ${props => props.theme.colors.textColor};
  font-size: 16px;
  font-weight: 500;
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  }
  
  &:focus {
    outline: none;
  }
`;

const SwapIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SwapButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.name === "dark" ? props.theme.colors.colorLightNeutral1 : props.theme.colors.colorNeutral2};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textColor};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.colorLightNeutral1};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2px;
  }
`;

const BuyButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const BuyButton = styled.button`
  background: #4A49F5;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4A49F5;
  }
`;

const LastUpdated = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
  font-size: 14px;
  color: ${props => props.theme.colors.textColorSub};
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #4A49F5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4A49F5;
    text-decoration: underline;
  }
  
  &:disabled {
    color: ${props => props.theme.colors.textColorSub};
    cursor: not-allowed;
    text-decoration: none;
  }
  
  svg {
    animation: ${props => props.disabled ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TokenName = styled.span<{ ticker?: string }>`
  color: ${({ ticker, theme }) => {
    const tokenColors: Record<string, string> = {
      'BTC': '#F7931A',
      'USDT': '#26A17B'
    };
    return ticker && tokenColors[ticker] ? tokenColors[ticker] : theme.colors.textColor;
  }};
  font-weight: 300;
`;

const TokenText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SelectArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

const SearchWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  z-index: 100;
  width: 240px;
`;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get(getApiUrl(`/coins`), {
      params: {
        page: 1,
        pageSize: 50,
      },
    });
    const tokens = response.data.tokens.map((token: any) => ({
      id: token.id || '',
      ticker: token.ticker || '',
      name: token.name || '',
      price: token.price || 0,
      iconUrl: token.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png` : '',
      cmcId: token.cmcId || 0,
      status: token.status || 'stable',
      rateChange: token.rateChange || { hourly: 0, daily: 0 },
      marketCap: token.marketCap || '0',
      volume: token.volume || '0',
      supply: token.supply || '0',
      supplyUnit: token.supplyUnit || '',
    }));

    return {
      props: {
        tokens,
      },
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      props: {
        tokens: [],
      },
    };
  }
};

const getSymbol = (coin: any): string => {
  return typeof coin.ticker === 'string' ? coin.ticker : '';
};

const getToSymbol = (coin: any): string => {
  if (!coin.toToken) return '';
  return typeof coin.toToken === 'object' && coin.toToken.ticker
    ? coin.toToken.ticker
    : typeof coin.toToken === 'string'
      ? coin.toToken
      : '';
};

const Converter: React.FC<ConverterProps> = ({ tokens }) => {
  const [fromToken, setFromToken] = useState<TokenData | null>(
    tokens.find(t => t.ticker === 'BTC') || tokens[0]
  );
  const [toToken, setToToken] = useState<TokenData | null>(
    tokens.find(t => t.ticker === 'USDT') || tokens[1]
  );
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('');
  const [showFromSearch, setShowFromSearch] = useState<boolean>(false);
  const [showToSearch, setShowToSearch] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  );

  const fromButtonRef = useRef<HTMLButtonElement>(null);
  const toButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const convertedAmount = (amount * fromToken.price) / toToken.price;
        setToAmount(convertedAmount.toFixed(toToken.ticker === 'USDT' ? 2 : 8));
      }
    }
  }, [fromToken, toToken, fromAmount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (fromButtonRef.current && !fromButtonRef.current.contains(event.target as Node)) ||
        (toButtonRef.current && !toButtonRef.current.contains(event.target as Node))
      ) {
        setShowFromSearch(false);
        setShowToSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 const fetchCoinPrice = async (token: TokenData | null) => {
    if (!token || !token.cmcId) {
      return null;
    }
    
    try {
      const basePath = config.basePath || '';
      const url = `${basePath}/api/coin/price/${token.cmcId}`;      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching price for ${token.ticker}:`, error);
      return null;
    }
  };
  

  useEffect(() => {
    const handleDocumentClick = () => {
      if (showFromSearch || showToSearch) {
        setShowFromSearch(false);
        setShowToSearch(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showFromSearch, showToSearch]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    if (toAmount) {
      setFromAmount(toAmount);
    }
  };

  const toggleFromSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showToSearch) {
      setShowToSearch(false);
    }
    setTimeout(() => {
      setShowFromSearch(prev => !prev);
    }, 10);
  };

  const toggleToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showFromSearch) {
      setShowFromSearch(false);
    }
    setTimeout(() => {
      setShowToSearch(prev => !prev);
    }, 10);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      // Fetch both prices concurrently using cmcId
      const [fromPrice, toPrice] = await Promise.all([
        fetchCoinPrice(fromToken),
        fetchCoinPrice(toToken)
      ]);

      if (!fromPrice || !toPrice) {
        throw new Error('Failed to fetch price data');
      }

      const updatedFromToken = { 
        ...fromToken, 
        price: fromPrice.price,
        rateChange: {
          daily: fromPrice.price_change_24h,
          hourly: 0
        }
      };
      
      const updatedToToken = { 
        ...toToken, 
        price: toPrice.price,
        rateChange: {
          daily: toPrice.price_change_24h,
          hourly: 0 // If you don't have hourly data
        }
      };
      
      setFromToken(updatedFromToken as TokenData);
      setToToken(updatedToToken as TokenData);

      // Calculate new conversion if we have valid input
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const convertedAmount = (amount * updatedFromToken.price) / updatedToToken.price;
        setToAmount(convertedAmount.toFixed(updatedToToken.ticker === 'USDT' ? 2 : 8));
      }

      // Update timestamp
      const timestamp = new Date();
      setLastUpdated(timestamp.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }));

    } catch (error) {
      console.error('Error refreshing data:', error);
      setLastUpdated(new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' (failed)');
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateAdvancedOptions = () => {
    const from = tokens.find(t => t.ticker === fromToken?.ticker);
    const to = tokens.find(t => t.ticker === toToken?.ticker);

    const topCryptos = tokens
      .filter(t => !['USDT', 'USDC', 'DAI', 'BUSD'].includes(t.ticker))
      .sort((a, b) => parseFloat(b.marketCap) - parseFloat(a.marketCap))
      .slice(0, 10);

    const options = [];

    if (from) {
      topCryptos.forEach((crypto, index) => {
        options.push({
          id: `advanced-${index}`,
          name: `${crypto.name} to Tether`,
          fromToken: crypto.name,
          toToken: 'Tether',
          fromTicker: crypto.ticker,
          toTicker: 'USDT',
          iconUrl: crypto.iconUrl
        });
      });
    }

    if (to) {
      topCryptos.slice(0, 3).forEach((crypto, index) => {
        options.push({
          id: `advanced-usdc-${index}`,
          name: `${crypto.name} to USDC`,
          fromToken: crypto.name,
          toToken: 'USDC',
          fromTicker: crypto.ticker,
          toTicker: 'USDC',
          iconUrl: crypto.iconUrl
        });
      });
    }

    for (let i = 0; i < Math.min(4, topCryptos.length - 1); i++) {
      const fromCrypto = topCryptos[i];
      const toCrypto = topCryptos[i + 1];

      options.push({
        id: `advanced-cross-${i}`,
        name: `${fromCrypto.name} to ${toCrypto.name}`,
        fromToken: fromCrypto.name,
        toToken: toCrypto.name,
        fromTicker: fromCrypto.ticker,
        toTicker: toCrypto.ticker,
        iconUrl: fromCrypto.iconUrl
      });
    }

    return options.slice(0, 12);
  };

  const generateCurrencyOptions = () => {
    const fiatCurrencies = Object.values(CURRENCIES);

    const diverseCryptos = tokens
      .filter((t, index) => index % 10 === 0)
      .slice(0, 8);

    return diverseCryptos.map((crypto, index) => ({
      id: `currency-${index}`,
      name: `${crypto.name} to ${fiatCurrencies[index].name}`,
      fromToken: crypto.name,
      toToken: fiatCurrencies[index].name,
      fromTicker: crypto.ticker,
      toTicker: fiatCurrencies[index].code,
      iconUrl: crypto.iconUrl
    }));
  };

  const advancedOptions = generateAdvancedOptions();
  const currencyOptions = generateCurrencyOptions();

  const closeAllSearchModals = () => {
    setShowFromSearch(false);
    setShowToSearch(false);
  };


  return (
    <ConverterContainer>
      <SEO
        title="Convert Cryptocurrencies | DroomDroom"
        description="Convert between cryptocurrencies like Bitcoin (BTC) and stablecoins like Tether (USDT) with real-time exchange rates."
        keywords="cryptocurrency converter, crypto swap, bitcoin converter, BTC to USDT, crypto exchange rates"
        ogType="website"
      />
      <ConverterCard>
        <ConversionHeader>
          <TitleWrapper>
            <IconsWrapper>
              <CryptoIcon src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${fromToken?.cmcId}.png`} alt="BTC" />
              <CryptoIcon src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${toToken?.cmcId}.png`} alt="USDT" />
            </IconsWrapper>
            <Title>
              Convert and swap <TokenName ticker={fromToken?.ticker}>{fromToken?.name}</TokenName> to <TokenName ticker={toToken?.ticker}>{toToken?.name}</TokenName>
            </Title>
          </TitleWrapper>
          
          <ExchangeRate>
            {fromToken?.ticker}/{toToken?.ticker}: 1 {fromToken?.ticker} equals {(fromToken?.price && toToken?.price) 
              ? (fromToken.price / toToken.price).toFixed(2)
              : '0'} {toToken?.ticker}
          </ExchangeRate>
          
          <BuyButtonWrapper>
            <BuyButton>Buy {fromToken?.name}</BuyButton>
          </BuyButtonWrapper>
        </ConversionHeader>

        <ConversionForm>
          <InputRow onClick={(e) => e.stopPropagation()}>
            <InputWrapper>
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="1"
                min="0"
                onClick={(e) => e.stopPropagation()}
              />
              <SelectButton
                onClick={toggleFromSearch}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TokenText>{fromToken?.ticker}</TokenText>
                <SelectArrow>
                  {showFromSearch ? <ChevronUp /> : <ChevronDown />}
                </SelectArrow>
              </SelectButton>
              {showFromSearch && (
                <SearchWrapper>
                  <SearchCoin
                    coins={tokens}
                    onSelectToken={(token) => {
                      setFromToken(token as TokenData);
                      setShowFromSearch(false);
                    }}
                    isVisible={showFromSearch}
                    onClose={() => setShowFromSearch(false)}
                  />
                </SearchWrapper>
              )}
            </InputWrapper>

            <SwapIconWrapper>
              <SwapButton onClick={handleSwapTokens}>
                <ArrowLeftRight />
              </SwapButton>
            </SwapIconWrapper>

            <InputWrapper>
              <Input
                type="text"
                value={toAmount || "81821.48"}
                readOnly
                placeholder="0"
                onClick={(e) => e.stopPropagation()}
              />
              <SelectButton
                onClick={toggleToSearch}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TokenText>{toToken?.ticker}</TokenText>
                <SelectArrow>
                  {showToSearch ? <ChevronUp /> : <ChevronDown />}
                </SelectArrow>
              </SelectButton>
              {showToSearch && (
                <SearchWrapper>
                  <SearchCoin
                    coins={tokens}
                    onSelectToken={(token) => {
                      setToToken(token as TokenData);
                      setShowToSearch(false);
                    }}
                    isVisible={showToSearch}
                    onClose={() => setShowToSearch(false)}
                  />
                </SearchWrapper>
              )}
            </InputWrapper>
          </InputRow>
        </ConversionForm>

        <LastUpdated>
          Last update: {lastUpdated}
          <RefreshButton 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader size={14} />
                Refreshing...
              </>
            ) : 'Refresh'}
          </RefreshButton>
        </LastUpdated>
      </ConverterCard>
      <Navbar />

      <Market id="markets" fromToken={fromToken} toToken={toToken} />

      <About id="about" fromToken={fromToken} toToken={toToken} />

      <FAQ id="faq" fromToken={fromToken} toToken={toToken} />

      <Related id="related" fromToken={fromToken} toToken={toToken} />

      <div id="conversion-tables">
        <ConversionTables id="conversion-tables" fromToken={fromToken} toToken={toToken} />
      </div>

      <SimilarCrypto coin={fromToken} />

      <MoreConversions
        id="more"
        advancedOptions={advancedOptions}
        currencyOptions={currencyOptions}
      />

    </ConverterContainer>
  );
};

export default Converter;
