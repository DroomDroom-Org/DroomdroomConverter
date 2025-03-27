import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { getApiUrl, getPageUrl } from 'utils/config';

// Global styles to ensure the widget takes up the full space and has a transparent background
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: transparent;
  }
  
  #__next {
    height: 100%;
    width: 100%;
  }
`;

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${props => props.fullpage ? '100vw' : '100%'};
  max-width: ${props => props.fullpage ? 'none' : '100%'};
  background-color: ${props => props.bgColor || 'transparent'};
  border-radius: ${props => props.rounded ? '16px' : '0'};
  overflow: hidden;
  position: relative;
`;

// Logo component replaced with inline styles

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 2;
  background-color: ${props => props.bgColor || 'rgba(0, 0, 0, 0.6)'};
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative; /* Added position relative */
`;

const CoinIcon = styled.div`
  width: ${props => props.size || '36px'};
  height: ${props => props.size || '36px'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Price = styled.div`
  font-size: ${props => props.fontSize || '28px'};
  font-weight: 700;
  color: ${props => props.textColor || 'white'};
`;

const PriceChange = styled.div`
  font-size: ${props => props.fontSize || '14px'};
  font-weight: 500;
  color: ${props => 
    props.value > 0 
      ? props.positiveColor || '#00c853' 
      : props.negativeColor || '#ff5252'
  };
`;

interface CoinData {
  price: number;
  price_change_24h: number;
  volume: number;
  volume_change_24h: number;
  market_cap: number;
}

const CryptoWidget = () => {
  const router = useRouter();
  const { 
    id = '1', // Default to Bitcoin (id: 1)
    mode = 'transparent', // Mode can be 'transparent', 'white', or 'dark'
    bgColor, // Custom background color (overrides mode)
    textColor, // Custom text color
    positiveColor = '#00c853',
    negativeColor = '#ff5252',
    logoOpacity = '0.2',
    logoSize = '150px',
    iconSize = '36px',
    fontSize = '28px',
    changeFontSize = '14px',
    rounded = 'false',
    fullpage = 'false', // New parameter to control if widget takes full viewport width
    refreshInterval = '60000' // Default refresh interval: 1 minute
  } = router.query;
  
  // Determine background and text colors based on mode
  const getBackgroundColor = () => {
    if (bgColor) return bgColor as string; // Custom color takes precedence
    
    switch(mode) {
      case 'white':
        return '#ffffff';
      case 'dark':
        return '#1a1a1a';
      case 'transparent':
      default:
        return 'transparent';
    }
  };
  
  const getTextColor = () => {
    if (textColor) return textColor as string; // Custom color takes precedence
    
    switch(mode) {
      case 'white':
        return '#333333';
      case 'dark':
      case 'transparent':
      default:
        return '#ffffff';
    }
  };
  
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [coinInfo, setCoinInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price === 0) {
      return '$0.00';
    } else {
      // For very small numbers
      let priceStr = price.toString();
      if (priceStr.includes('e')) {
        let [mantissa, exponent] = priceStr.split('e');
        mantissa = mantissa.replace('.', '');
        const significantDigits = mantissa.slice(0, 4);
        exponent = (Math.abs(Number(exponent))-1).toString();
        return `$0.0${'0'.repeat(Number(exponent))}${significantDigits}`;
      } else {
        return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
      }
    }
  };
  
  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };
  
  useEffect(() => {
    let isMounted = true;
    let fetchTimeout: NodeJS.Timeout | null = null;
    
    const fetchData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        // Fetch price data - removed force=true to prevent rate limiting
        const priceResponse = await axios.get(getApiUrl(`/coin/price/${id}?force=true`));
        if (isMounted) setCoinData(priceResponse.data);
        
        // Fetch coin info
        const coinResponse = await axios.get(getApiUrl(`/coin/id/${id}`));
        if (isMounted) setCoinInfo(coinResponse.data);
        
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          setError('Failed to load data');
          setLoading(false);
        }
      }
      
      // Schedule next fetch only if component is still mounted
      if (isMounted) {
        fetchTimeout = setTimeout(fetchData, Number(refreshInterval));
      }
    };
    
    if (id) {
      // Initial fetch
      fetchData();
      
      return () => {
        isMounted = false;
        // Clear any pending timeout when unmounting
        if (fetchTimeout) clearTimeout(fetchTimeout);
      };
    }
  }, [id, refreshInterval]);
  
  return (
    <>
      <Head>
        <title>DroomDroom Crypto Widget</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <GlobalStyle />
      
      <WidgetContainer 
        bgColor={getBackgroundColor()} 
        rounded={rounded === 'true'} 
        fullpage={fullpage === 'true'}
      >
        {/* Vertical layout with logo above price widget */}
        <div style={{ 
          width: fullpage === 'true' ? '100vw' : '100%', 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Logo positioned at the top */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px' // Increased from 30px for better spacing with larger logo
          }}>
            <img 
              src={mode == "transparent" ? getPageUrl('/DroomDroom_White.svg') : mode === 'white' ? getPageUrl('/DroomDroom_Black.svg') : getPageUrl('/DroomDroom_White.svg')} 
              alt="DroomDroom Logo"
              style={{
                // opacity: Number(logoOpacity) || 0.2, // Respect user's logoOpacity parameter
                width: 'auto',
                height: 'auto',
                maxWidth: '200px', // Increased from 120px
                maxHeight: '100px', // Increased from 60px
                objectFit: 'contain'
              }}
            />
          </div>
          
          {/* Price widget below the logo */}
          <div>
            {loading ? (
              <PriceContainer bgColor={mode === 'white' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(0, 0, 0, 0.6)'}>
                <Price textColor={getTextColor()} fontSize={fontSize as string}>Loading...</Price>
              </PriceContainer>
            ) : error ? (
              <PriceContainer bgColor={mode === 'white' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(0, 0, 0, 0.6)'}>
                <Price textColor={getTextColor()} fontSize={fontSize as string}>{error}</Price>
              </PriceContainer>
            ) : coinData && coinInfo ? (
              <PriceContainer bgColor={mode === 'white' ? 'rgba(240, 240, 240, 0.8)' : 'rgba(0, 0, 0, 0.6)'}>
                <CoinIcon size={iconSize as string}>
                  <img 
                    src={coinInfo.image || `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`} 
                    alt={coinInfo.name || 'Bitcoin'} 
                  />
                </CoinIcon>
                <PriceInfo>
                  <Price textColor={getTextColor()} fontSize={fontSize as string}>
                    {formatPrice(coinData.price)}
                  </Price>
                  <PriceChange 
                    value={coinData.price_change_24h} 
                    positiveColor={positiveColor as string}
                    negativeColor={negativeColor as string}
                    fontSize={changeFontSize as string}
                  >
                    {formatChange(coinData.price_change_24h)}
                  </PriceChange>
                </PriceInfo>
              </PriceContainer>
            ) : null}
          </div>
        </div>
      </WidgetContainer>
    </>
  );
};

// Set displayName to identify this as a widget page
CryptoWidget.displayName = 'WidgetPage';

export default CryptoWidget;
