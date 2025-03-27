import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getApiUrl } from 'utils/config';
import SEO from 'components/SEO/SEO';
import Navbar from 'components/Navbar/Navbar';
import Market from 'src/components/Market/Market';
import About from 'src/components/About';


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
  background: ${({ theme }) => theme.colors.bgColor};
  padding: 32px 0;
  margin: 24px auto;
  max-width: 900px;
  
  @media (max-width: 768px) {
    padding: 24px 0;
    margin: 16px auto;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CryptoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: -8px;
`;

const ConversionHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textColor};
  margin: 8px 0;
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const ExchangeRate = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin: 0;
`;

const ConversionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;

  &:first-child {
    margin-right: 12px;
  }

  @media (max-width: 768px) {
    width: 100%;
    &:first-child {
      margin-right: 0;
      margin-bottom: 12px;
    }
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
  background: ${({ theme }) => theme.colors.colorNeutral2};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    fill: ${({ theme }) => theme.colors.textColorSub};
  }
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.controlBackgroundColor};
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 16px;
  padding: 0 120px 0 24px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderColor};
  }
`;

const SelectWrapper = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  height: 48px;
  min-width: 100px;
  padding: 0 36px 0 16px;
  border: none;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.colorNeutral2};
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 16px;
  font-weight: 600;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

const SelectArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const BuyButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const BuyButton = styled.button`
  background: #4A49F5;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #3938D0;
  }
`;

const LastUpdated = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textColorSub};
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
`;

const TokenName = styled.span<{ ticker?: string }>`
  color: ${({ ticker, theme }) => {
    const tokenColors: Record<string, string> = {
      'BTC': '#F7931A',
      'ETH': '#627EEA',
      'USDT': '#26A17B',
      'USDC': '#2775CA',
      'BNB': '#F3BA2F',
      'XRP': '#23292F',
      'ADA': '#0033AD',
      'SOL': '#14F195',
      'DOGE': '#C3A634',
      'DOT': '#E6007A'
    };
    
    return ticker && tokenColors[ticker] ? tokenColors[ticker] : theme.colors.themeColor;
  }};
  font-weight: 600;
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

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const convertedAmount = (amount * fromToken.price) / toToken.price;
        setToAmount(convertedAmount.toFixed(toToken.ticker === 'USDT' ? 2 : 8));
      }
    }
  }, [fromToken, toToken, fromAmount]);


  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Also swap the amounts
    if (toAmount) {
      setFromAmount(toAmount);
    }
  };


  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find(t => t.ticker === e.target.value) || null;
    setFromToken(selectedToken);
  };

  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find(t => t.ticker === e.target.value) || null;
    setToToken(selectedToken);
  };


  const handleRefresh = () => {
    setLastUpdated(
      new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    );
  };

  const coins = [
    {
      id: 1,
      name: fromToken?.name,
      price: fromToken?.price,
      symbol: fromToken?.ticker,
      cmcId: fromToken?.cmcId,
      status: 'climbing',
      rateChange: {
        hourly: 0.1,
        daily: 0.5
      },
      marketCap: '1000000',
      volume: '1000000',
      supply: '1000000',
      supplyUnit: 'BTC',
      fromToken: fromToken,
      toToken: toToken
    },
    {
      id: 2,
      name: toToken?.name,
      price: toToken?.price,
      symbol: toToken?.ticker,
      cmcId: toToken?.cmcId,
      status: 'falling',
      rateChange: {
        hourly: 0.1,
        daily: 0.5
      },
      marketCap: '1000000',
      volume: '1000000',
      supply: '1000000',
      supplyUnit: 'BTC',
      fromToken: fromToken,
      toToken: toToken
    }
  ] 
   
  console.log(fromToken, toToken);

  return (
    <ConverterContainer>
      <SEO
        title="Convert Cryptocurrencies | DroomDroom"
        description="Convert between cryptocurrencies like Bitcoin (BTC) and stablecoins like Tether (USDT) with real-time exchange rates."
        keywords="cryptocurrency converter, crypto swap, bitcoin converter, BTC to USDT, crypto exchange rates"
        ogType="website"
      />
      <ConverterCard>
        <IconsWrapper>
          <CryptoIcon src={fromToken?.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${fromToken.cmcId}.png` : '/placeholder.png'} alt="BTC" />
          <CryptoIcon src={toToken?.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${toToken.cmcId}.png` : '/placeholder.png'} alt="USDT" />
        </IconsWrapper>
        
        <ConversionHeader>
          <Title>
            Convert and swap {fromToken?.name} <TokenName ticker={fromToken?.ticker}>{fromToken?.ticker}</TokenName> to {toToken?.name} <TokenName ticker={toToken?.ticker}>{toToken?.ticker}</TokenName>
          </Title>
          <ExchangeRate>
            {fromToken?.ticker}/{toToken?.ticker}: 1 {fromToken?.ticker} equals {(fromToken?.price && toToken?.price) 
              ? (fromToken.price / toToken.price).toFixed(2)
              : '0'} {toToken?.ticker}
          </ExchangeRate>
        </ConversionHeader>
        
        <ConversionForm>
          <InputRow>
            <InputWrapper>
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0"
                min="0"
              />
              <SelectWrapper>
                <Select value={fromToken?.ticker || ''} onChange={handleFromTokenChange}>
                  {tokens.map(token => (
                    <option key={token.id} value={token.ticker}>{token.ticker}</option>
                  ))}
                </Select>
                <SelectArrow>▼</SelectArrow>
              </SelectWrapper>
            </InputWrapper>
            
            <SwapIconWrapper>
              <SwapButton onClick={handleSwapTokens}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 13L12 18L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SwapButton>
            </SwapIconWrapper>
            
            <InputWrapper>
              <Input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0"
              />
              <SelectWrapper>
                <Select value={toToken?.ticker || ''} onChange={handleToTokenChange}>
                  {tokens.map(token => (
                    <option key={token.id} value={token.ticker}>{token.ticker}</option>
                  ))}
                </Select>
                <SelectArrow>▼</SelectArrow>
              </SelectWrapper>
            </InputWrapper>
          </InputRow>
        </ConversionForm>
        
        <BuyButtonWrapper>
          <BuyButton>Buy {fromToken?.ticker}</BuyButton>
        </BuyButtonWrapper>
        
        <LastUpdated>
          Last update: {lastUpdated}
          <RefreshButton onClick={handleRefresh}>
            Refresh ↻
          </RefreshButton>
        </LastUpdated>
      </ConverterCard>

      <Navbar />
    
      <Market fromToken={fromToken} toToken={toToken} />

      <About fromToken={fromToken} toToken={toToken} />

    </ConverterContainer>
  );
};



export default Converter;
