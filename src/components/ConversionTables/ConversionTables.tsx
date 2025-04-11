import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  TablesContainer,
  SectionHeading,
  SectionDescription,
  PerformanceHeading,
  PerformanceTable,
  TableHead,
  TableBody,
  ConversionTables as TablesGrid,
  TableContainer,
  TableTitle,
  Table,
  PositiveChange,
  NegativeChange,
  TablesRow,
  TableColumn,
  TableHeading,
  CurrentTime,
  ComparisonHeading,
  ComparisonTable,
  ComparisonTableHead,
  ComparisonTableBody
} from './ConversionTables.styled';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  priceChange:{
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;
  isCrypto: boolean;
}

interface ConversionTablesProps {
  fromToken: TokenData | null;
  toToken: TokenData | null;
  id :string ;
  fromAmount: string;
  toAmount: string;
}

const ConversionTables: React.FC<ConversionTablesProps> = ({ id, fromToken, toToken, fromAmount, toAmount }) => {
  const [fromTokenPrice, setFromTokenPrice] = useState(0);
  const [toTokenPrice, setToTokenPrice] = useState(0);

  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  }, []);

  const calculateConversionRate = useCallback((fromToken: TokenData, toToken: TokenData) => {
    if (!fromToken.isCrypto && toToken.isCrypto) {
      return 1 / (fromToken.price * toToken.price);
    } else if (fromToken.isCrypto && !toToken.isCrypto) {
      return fromToken.price * toToken.price;
    } else {
      // Both crypto or both fiat
      return fromToken.price / toToken.price;
    }
  }, []);

  const getDecimalPlaces = useCallback((token: TokenData) => {
    if (!token.isCrypto) return 2;
    if (token.ticker === 'USDT' || token.ticker === 'USDC' || token.ticker === 'DAI' || token.ticker === 'BUSD') return 2;
    return 8;
  }, []);

  useEffect(() => {
    if (fromToken && toToken) {
      const rate = calculateConversionRate(fromToken, toToken);
      setFromTokenPrice(rate);
      setToTokenPrice(1 / rate);
    }
  }, [fromToken, toToken, calculateConversionRate]);

  // Define all hooks before conditional return
  const amounts = useMemo(() => [0.5, 1, 5, 10, 50, 100, 500, 1000], []);
  
  const formatDecimal = useCallback((value: number, token: TokenData) => {
    return value?.toLocaleString(undefined, { maximumFractionDigits: getDecimalPlaces(token) });
  }, [getDecimalPlaces]);

  const formatCryptoValue = useCallback((value: number, token: TokenData): string => {
    if (value === 0) return '0';
    return value.toFixed(getDecimalPlaces(token));
  }, [getDecimalPlaces]);

  const formatAmount = useCallback((amount: number, token: TokenData): string => {
    const formattedAmount = formatCryptoValue(amount, token);
    return formattedAmount;
  }, [formatCryptoValue]);

  // Early return after all hooks are defined
  if (!fromToken || !toToken) {
    return null;
  }
  
  const hourlyChange = fromToken.priceChange?.['1h'] || 0.57;
  const dailyChange = fromToken.priceChange?.['24h'] || 3.06;
  const weeklyChange = fromToken.priceChange?.['7d'] || 3.18;

  const price24HAgo = Number(toAmount) / (1 + (dailyChange / 100));
  const price1WAgo = Number(toAmount) / (1 + (weeklyChange / 100));
  const price1MAgo = Number(toAmount) / (1 + (weeklyChange * 4 / 100));
  
  const generateComparisonData = (historicalPrice: number, changePercent: number) => {
    return amounts.map(amount => {
      const currentValue = amount * Number(toAmount);
      const prevValue = amount * historicalPrice;
      const change = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
      
      return {
        amount,
        currentValue: currentValue.toLocaleString(undefined, { maximumFractionDigits: getDecimalPlaces(toToken) }),
        prevValue: prevValue.toLocaleString(undefined, { maximumFractionDigits: getDecimalPlaces(toToken) }),
        change
      };
    });
  };

  const comparisonData24h = generateComparisonData(price24HAgo, dailyChange);
  const comparisonData1m = generateComparisonData(price1MAgo, weeklyChange * 4);

  const formatDecimal = useCallback((value: number, token: TokenData) => {
    return value?.toLocaleString(undefined, { maximumFractionDigits: getDecimalPlaces(token) });
  }, [getDecimalPlaces]);

  const formatCryptoValue = useCallback((value: number, token: TokenData): string => {
    if (value === 0) return '0';
    return value.toFixed(getDecimalPlaces(token));
  }, [getDecimalPlaces]);

  const formatAmount = useCallback((amount: number, token: TokenData): string => {
    const formattedAmount = formatCryptoValue(amount, token);
    return `${formattedAmount} ${token.ticker}`;
  }, [formatCryptoValue]);

  return (
    <TablesContainer>
      <SectionHeading>{fromToken.ticker} to {toToken.ticker} conversion tables</SectionHeading>
      
      <SectionDescription>
        The exchange rate of {fromToken.name} is {hourlyChange > 0 ? 'increasing' : 'decreasing'}.
      </SectionDescription>
      
      <SectionDescription>
        The current value of 1 {fromToken.ticker} is {formatDecimal(fromTokenPrice, toToken)} {toToken.ticker}. 
        In other words, to buy 5 {fromToken.name}, it would cost you {formatDecimal(fromTokenPrice*5, toToken)} {toToken.ticker}. 
        Inversely, 1 {toToken.ticker} would allow you to trade for {formatCryptoValue(toTokenPrice, fromToken)} {fromToken.ticker} 
        while 50 {toToken.ticker} would convert to {formatCryptoValue(50*toTokenPrice, fromToken)} {fromToken.ticker}, not 
        including platform or gas fees.
      </SectionDescription>
      
      <SectionDescription>
        In the last 7 days, the exchange rate has {weeklyChange > 0 ? 'increased' : 'decreased'} by {Math.abs(weeklyChange)}%. 
        Meanwhile, in the last 24 hours, the rate has changed by {dailyChange}%, which means that the 
        highest exchange rate of 1 {fromToken.ticker} to {toToken.ticker} was {formatDecimal(fromTokenPrice * (1 + Math.abs(dailyChange)/200), toToken)} {toToken.ticker} 
        and the lowest 24 hour value was 1 {fromToken.ticker} for {formatDecimal(fromTokenPrice * (1 - Math.abs(dailyChange)/200), toToken)} {toToken.ticker}. 
        This time last month, the value of 1 {fromToken.ticker} was {formatDecimal(price1MAgo, toToken)} {toToken.ticker}, 
        which is a {weeklyChange * 4}% {weeklyChange * 4 > 0 ? 'increase' : 'decrease'} from where it is now. 
      </SectionDescription>

      <PerformanceHeading>{fromToken.ticker} to {toToken.ticker} performance history</PerformanceHeading>
      <PerformanceTable>
        <TableHead>
          <tr>
            <th>Price 24H ago</th>
            <th>Change 24H</th>
            <th>Price 1W ago</th>
            <th>Change 1W</th>
            <th>Price 1M ago</th>
            <th>Change 1M</th>
          </tr>
        </TableHead>
        <TableBody>
          <tr>
            <td>{formatCryptoValue(price24HAgo, toToken)} {toToken.ticker}</td>
            <td>
              {dailyChange > 0 ? 
                <PositiveChange>+{dailyChange.toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{dailyChange.toFixed(2)}%</NegativeChange>
              }
            </td>
            <td>{formatCryptoValue(price1WAgo, toToken)} {toToken.ticker}</td>
            <td>
              {weeklyChange > 0 ? 
                <PositiveChange>+{weeklyChange.toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{weeklyChange.toFixed(2)}%</NegativeChange>
              }
            </td>
            <td>{formatCryptoValue(price1MAgo, toToken)} {toToken.ticker}</td>
            <td>
              {weeklyChange * 4 > 0 ? 
                <PositiveChange>+{(weeklyChange * 4).toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{(weeklyChange * 4).toFixed(2)}%</NegativeChange>
              }
            </td>
          </tr>
        </TableBody>
      </PerformanceTable>

      <SectionDescription>
        Below are tables showing instant conversion of set amounts from {fromToken.name} to {toToken.name} and vice versa.
      </SectionDescription>
      
      <TablesRow>
        <TableColumn>
          <TableHeading>{fromToken.ticker} to {toToken.ticker}</TableHeading>
          <div role="region" aria-label={`${fromToken.ticker} to ${toToken.ticker} conversion table`} style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <caption style={{ 
                textAlign: 'right', 
                captionSide: 'top',
                color: 'var(--text-color-sub, rgba(255, 255, 255, 0.6))',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                paddingRight: '0.5rem'
              }}>
                Today at {currentTime}
              </caption>
              <TableHead>
                <tr>
                  <th>Amount ({fromToken.ticker})</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {amounts.map((amount) => (
                  <tr key={`from-${amount}`}>
                    <td>{amount} {fromToken.ticker}</td>
                    <td>{formatCryptoValue(amount * fromTokenPrice, toToken)} {toToken.ticker}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
        
        <TableColumn>
          <TableHeading>{toToken.ticker} to {fromToken.ticker}</TableHeading>
          <div role="region" aria-label={`${toToken.ticker} to ${fromToken.ticker} conversion table`} style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <caption style={{ 
                textAlign: 'right', 
                captionSide: 'top',
                color: 'var(--text-color-sub, rgba(255, 255, 255, 0.6))',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                paddingRight: '0.5rem'
              }}>
                Today at {currentTime}
              </caption>
              <TableHead>
                <tr>
                  <th>Amount ({toToken.ticker})</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {amounts.map((amount) => (
                  <tr key={`to-${amount}`}>
                    <td>{amount} {toToken.ticker}</td>
                    <td>{formatCryptoValue(amount * toTokenPrice, fromToken)} {fromToken.ticker}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
      </TablesRow>

      <ComparisonHeading>Today vs. 24 hours ago</ComparisonHeading>
      <div role="region" aria-label="24 hour comparison table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              <th>Amount</th>
              <th>Today at {currentTime}</th>
              <th>24 hours ago</th>
              <th>24H Change</th>
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {comparisonData24h.map((item) => (
              <tr key={`24h-${item.amount}`}>
                <td>{item.amount} {fromToken.ticker}</td>
                <td>{item.currentValue} {toToken.ticker}</td>
                <td>{item.prevValue} {toToken.ticker}</td>
                <td>
                  {dailyChange >= 0 ? (
                    <PositiveChange>+{dailyChange.toFixed(2)}%</PositiveChange>
                  ) : (
                    <NegativeChange>{dailyChange.toFixed(2)}%</NegativeChange>
                  )}
                </td>
              </tr>
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
     
      <ComparisonHeading>Today vs. 1 month ago</ComparisonHeading>
      <div role="region" aria-label="1 month comparison table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              <th>Amount</th>
              <th>Today at {currentTime}</th>
              <th>1 month ago</th>
              <th>1M Change</th>
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {comparisonData1m.map((item) => (
              <tr key={`1m-${item.amount}`}>
                <td>{item.amount} {fromToken.ticker}</td>
                <td>{item.currentValue} {toToken.ticker}</td>
                <td>{item.prevValue} {toToken.ticker}</td>
                <td>
                  {weeklyChange * 4 >= 0 ? (
                    <PositiveChange>+{(weeklyChange * 4).toFixed(2)}%</PositiveChange>
                  ) : (
                    <NegativeChange>{(weeklyChange * 4).toFixed(2)}%</NegativeChange>
                  )}
                </td>
              </tr>
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
    </TablesContainer>
  );
};

export default ConversionTables; 